import { getHoveredCell, getSelectedCell } from '../store/ui/selectors'
import { idMap, tiles } from './tiles'

import Rectangle from './Rectangle'
import { TILE_SIZE } from "./settings"
import { inRange } from 'lodash'
import { shadeColor } from './utils'
import store from '../store'

const colorMap = [
	'#72B01D',
	'#F6511D'
]

export default class Map {
	state: object
	matrix: Array<Array<any>> = []
	height: number = 0
	width: number = 0
	player: any
	blocks: Array<any> = []
	blockMap: Object = {}
	cells: WeakMap<Object, any> = new WeakMap()

	private get selectedCell() {
		return getSelectedCell(this.state)
	}

	private get hoveredCell() {
		return getHoveredCell(this.state)
	}

	public get blockedCoordinates() {
		return this.blocks.filter(block => {
			if (this.cells.has(block)) {
				const cell = this.cells.get(block)?.value
				return cell && cell.walkable === false
			}
			return false
		})
	}

	public getCell({ x, y }) {
		const cell = this.blocks.find(block => {
			const xInRange = inRange(x, block.x[0], block.x[1])
			const yInRange = inRange(y, block.y[0], block.y[1])
			return xInRange && yInRange
		})
		if (cell && this.cells.has(cell)) {
			return this.cells.get(cell)
		}
	}

	constructor(matrix: Array<Array<any>>) {
		this.state = store.getState()
		this.height = (matrix.length) * TILE_SIZE
		this.width = (matrix[0].length) * TILE_SIZE
		this.matrix = matrix || []
		this.parseMatrix(matrix)
		window.setInterval(() => {
			// test opening of gate
			const newMatrix = [...this.matrix]
			const current = newMatrix[11][11]
			newMatrix[11][11] = current === 1 ? 0 : 1
			this.update(newMatrix)
		}, 1000)
	}

	parseMatrix(matrix) {
		let blockedCoordinates = []
		let blocks = []
		this.cells = new WeakMap()
		matrix.forEach((row, rowIndex) => {
			const y = TILE_SIZE * rowIndex
			row.forEach((cell, cellIndex) => {
				const x = TILE_SIZE * cellIndex
				const block = { x: [x, x + TILE_SIZE], y: [y, y + TILE_SIZE] }
				let value
				if (tiles[idMap[cell]]) {
					const TileClass = tiles[idMap[cell]]
					const existingBlock = this.blockMap[`${rowIndex}.${cellIndex}`]
					value = {
						value: existingBlock && existingBlock.value instanceof TileClass ? existingBlock.value : new TileClass,
						path: `${rowIndex}.${cellIndex}`
					}
				} else {
					 value = {
						value: cell,
						path: `${rowIndex}.${cellIndex}`
					}
				}
				this.cells.set(block, value)
				this.blockMap[`${rowIndex}.${cellIndex}`] = value
				blocks.push(block)
			})
		})
		this.matrix = matrix
		this.blocks = blocks
		// this.blockedCoordinates = blockedCoordinates
	}

	update(matrix?, player?: Rectangle) {
		this.state = store.getState()
		if (matrix && this.matrix !== matrix) {
			this.parseMatrix(matrix)
		}
		this.player = player || this.player
	}

	draw (context:CanvasRenderingContext2D, xView?:number, yView?:number) {
		// context.strokeStyle = '#000'
		context.strokeStyle = 'rgba(20, 20, 20, 0.2)'
		context.clearRect(0, 0, this.width, this.height)
		this.matrix.forEach((row, rowIndex) => {
			const y = TILE_SIZE * rowIndex
			row.forEach((cell, cellIndex) => {
				const block = this.blockMap[`${rowIndex}.${cellIndex}`]?.value
				const x = TILE_SIZE * cellIndex
				const tile = new Rectangle(x - xView, y - yView, TILE_SIZE, TILE_SIZE)
				let isSelected = false
				let isHovered = false
				if (this.selectedCell && `${rowIndex}.${cellIndex}` === this.selectedCell.path) {
					isSelected = true
				}
				if (this.hoveredCell && `${rowIndex}.${cellIndex}` === this.hoveredCell.path) {
					isHovered = true
				}
				if (block) {
					context.fillStyle = block.color
					block.draw(context, tile, { isSelected, isHovered })
				}
			})
			context.restore()
		})
	}

}