import Rectangle from './Rectangle'
import { TILE_SIZE } from "./settings"
import { getSelectedBlock } from '../store/ui/selectors'
import { inRange } from 'lodash'
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
	tiles: Array<any> = []
	// TODO: improve typings
	blockedCoordinates: Array<any> = []
	blocks: Array<any> = []

	get selectedBlock() {
		return getSelectedBlock(this.state)
	}

	constructor(matrix: Array<Array<any>>) {
		this.state = store.getState()
		this.height = (matrix.length) * TILE_SIZE
		this.width = (matrix[0].length) * TILE_SIZE
		this.parseMatrix(matrix)
		window.setInterval(() => {
			// test opening of gate
			const newMatrix = [...this.matrix]
			const current = newMatrix[11][11]
			newMatrix[11][11] = current === 1 ? 0 : 1
			this.update(newMatrix)
		}, 1000)

		console.log('blockedCoordinates', this.blockedCoordinates.length)
	}

	parseMatrix(matrix) {
		let blockedCoordinates = []
		let blocks = []
		matrix.forEach((row, rowIndex) => {
			const y = TILE_SIZE * rowIndex
			row.forEach((cell, cellIndex) => {
				const x = TILE_SIZE * cellIndex
				const block = { x: [x, x + TILE_SIZE], y: [y, y + TILE_SIZE] }
				if (cell === 1) {
					blockedCoordinates.push(block)
				}
				blocks.push(block)
			})
		})
		this.matrix = matrix
		this.blocks = blocks
		this.blockedCoordinates = blockedCoordinates
	}

	update(matrix?, player?: Rectangle) {
		this.state = store.getState()
		if (matrix && this.matrix !== matrix) {
			this.parseMatrix(matrix)
		}
		this.player = player || this.player
	}

	draw (context:CanvasRenderingContext2D, xView?:number, yView?:number) {
		this.tiles = []
		this.matrix.forEach((row, rowIndex) => {
			const y = TILE_SIZE * rowIndex
			context.strokeStyle = '#000'
			row.forEach((cell, cellIndex) => {
				const x = TILE_SIZE * cellIndex

				const tile = new Rectangle(x - xView, y - yView, TILE_SIZE, TILE_SIZE)
				let isSelected = false
				if (this.selectedBlock) {
					const tileInYRange = inRange(y, this.selectedBlock.y, (this.selectedBlock.y - TILE_SIZE))
					const tileInXRange = inRange(x, this.selectedBlock.x, (this.selectedBlock.x - TILE_SIZE))

					if (tileInXRange && tileInYRange) {
						isSelected = true
					}

				}
				this.tiles.push(tile)

				// if (selectedBlock) {
				// 	console.log(tile)
				// }
				context.save()
				if (this.player.within(tile)) {
					context.fillStyle = 'darkgreen'
					if (cell === 1) {
						context.fillStyle = 'blue'
					}
				} else if (tile.overlaps(this.player)) {
					context.fillStyle = 'pink'
				} else {
					context.fillStyle = colorMap[cell]
				}
				if (isSelected) {
					context.fillStyle = 'orange'
				}
				context.beginPath()
				context.rect(tile.left, tile.top, tile.height, tile.width)
				context.stroke()
				context.fill()
				context.restore()
			})
			context.restore()
		})
		const nearestTileY = this.player.top
		const nearestTileX = this.player.left
		// console.log(nearestTileY, nearestTileX)
	}

}