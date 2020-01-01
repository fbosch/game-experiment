import { changeMatrix, updateCell } from '../store/map/actions'
import { getCellValue, getMatrix } from '../store/map/selectors'
import { getHoveredCell, getSelectedCell } from '../store/ui/selectors'
import { idMap, tiles } from './tiles'

import Rectangle from './Rectangle'
import Sprite from './sprites/Sprite'
import { TILE_SIZE } from "./settings"
import { inRange } from 'lodash'
import store from '../store'

const colorMap = [
	'#72B01D',
	'#F6511D'
]

export default class Map {
	state: object
	height: number = 0
	width: number = 0
	player: any
	blocks: Array<any> = []
	blockMap: Object = {}
	cells: WeakMap<Object, any> = new WeakMap()
	matrix: Array<any> = []
	topLayerBlocks: Array<any> = []

	public get loaded() {
		return Promise.all(this.tileInstances.map(tile => tile.loaded))
	}

	public get blockedSprites(): Array<any> {
		return this.blocks.filter(block => {
			if (this.cells.has(block)) {
				const cell = this.cells.get(block)?.value
				return cell?.sprite?.blocking
			}
			return false
		}).map(block => {
			const sprite = this.cells.get(block)?.value?.sprite
			return sprite
		})
	}

	public get blockedCoordinates() {
		const blockedCells = this.blocks.filter(block => {
			if (this.cells.has(block)) {
				const cell = this.cells.get(block)?.value
				return cell && cell.walkable === false
			}
			return false
		})

		const blockedSprites = this.blockedSprites.map(sprite => sprite.rectangle)

		const blockedEntities = this.entities.map(entity => entity.rectangle)

		return [...blockedCells, ...blockedSprites, ...blockedEntities]
	}

	getCellValueByPath(path: string) {
		return getCellValue(this.state)(path)
	}

	get tileInstances() {
		const values = Object.values(this.blockMap)
			.map(block => block.value)
		return values
	}

	get tilesWithState() {
		return this.tileInstances.filter(block => block.cellState?.entities?.length)
	}

	get entities() {
		return this.tileInstances.flatMap(tile => tile.entities)
	}

	public getCell({ x, y }) {
		const cell = this.blocks.find(block => {
			const xInRange = inRange(x, block.left, block.right)
			const yInRange = inRange(y, block.top, block.bottom)
			return xInRange && yInRange
		})
		if (cell && this.cells.has(cell)) {
			return this.cells.get(cell)
		}
	}

	constructor(matrix: Array<Array<number>>) {
		this.state = store.getState()
		this.height = (matrix.length) * TILE_SIZE
		this.width = (matrix[0].length) * TILE_SIZE
		this.parseMatrix(matrix)
		store.dispatch(changeMatrix(matrix))
		window.setInterval(() => {
			const existingValue = this.getCellValueByPath('11.11')
			store.dispatch(updateCell({ path: '11.11', value: existingValue === 0 ? 1 : 0 }))
		}, 1000)
	}

	parseMatrix(matrix:Array<Array<number>>) {
		let blocks = []
		this.cells = new WeakMap()
		this.topLayerBlocks = []
		matrix.forEach((row, rowIndex) => {
			const y = TILE_SIZE * rowIndex
			row.forEach((cell, cellIndex) => {
				const x = TILE_SIZE * cellIndex
				const rectangle = new Rectangle(x, y, TILE_SIZE, TILE_SIZE)
				let block
				if (tiles[idMap[cell]]) {
					const path = `${rowIndex}.${cellIndex}`
					const TileClass = tiles[idMap[cell]]
					const existingBlock = this.blockMap[path]
					block = {
						value: existingBlock && existingBlock?.value instanceof TileClass ? existingBlock?.value : new TileClass(path, rectangle),
						path: `${rowIndex}.${cellIndex}`
					}
				} else {
					block = {
						path: `${rowIndex}.${cellIndex}`
					}
				}
				this.cells.set(rectangle, block)
				this.blockMap[`${rowIndex}.${cellIndex}`] = block
				blocks.push(rectangle)
				if (block?.value?.topLayer) {
					this.topLayerBlocks.push(block.value)
				}
			})

		})
		this.matrix = matrix
		this.blocks = blocks
	}

	update(matrix?, player?: Rectangle) {
		this.state = store.getState()
		if (matrix && this.matrix !== matrix) {
			this.parseMatrix(matrix)
		}
		if (this.tilesWithState?.length) {
			this.tilesWithState.forEach(tile => tile.update())
		}
		this.player = player || this.player
	}

	draw (context:CanvasRenderingContext2D, xView?:number, yView?:number) {
		context.strokeStyle = 'rgba(20, 20, 20, 0.2)'
		context.clearRect(0, 0, this.width, this.height)
		context.save()
		this.matrix.forEach((row: Array<number>, rowIndex:number) => {
			const y = TILE_SIZE * rowIndex
			row.forEach((cell: number, cellIndex:number) => {
				const block = this.blockMap[`${rowIndex}.${cellIndex}`]?.value
				const x = TILE_SIZE * cellIndex
				const tile = new Rectangle(x - xView, y - yView, TILE_SIZE, TILE_SIZE)
				if (block) {
					context.fillStyle = block.color
					context.stroke()
					block.draw(context, tile, this.state)
				}
			})
			context.restore()
			// this.blockedSprites.forEach(blockingSprite => {
			// 	console.log(blockingSprite)
			// 	const tile = blockingSprite.rectangle
			// 	context.beginPath()
			// 	context.rect(tile.left - xView, tile.top - yView, tile.height, tile.width)
			// 	context.fillStyle = 'cyan'
			// 	context.fill()
			// 	context.restore()
			// })
		})
	}

}