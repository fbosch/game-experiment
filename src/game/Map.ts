import Rectangle from './Rectangle'
import { TILE_SIZE } from "./settings"

const colorMap = [
	'#72B01D',
	'#F6511D'
]

export default class Map {
	matrix: Array<Array<any>> = []
	height: number = 0
	width: number = 0
	player: any
	tiles: Array<any> = []
	blockedCoordinates: Array<any> = []

	constructor(matrix: Array<Array<any>>) {
		this.matrix = matrix
		this.height = (matrix.length) * TILE_SIZE
		this.width = (matrix[0].length) * TILE_SIZE
		let blockedCoordinates = []
		this.matrix.forEach((row, rowIndex) => {
			const y = TILE_SIZE * rowIndex
			row.forEach((cell, cellIndex) => {
				const x = TILE_SIZE * cellIndex
				if (cell === 1) {
					blockedCoordinates.push({ x: [x, x + TILE_SIZE], y: [y, y + TILE_SIZE] })
				}
			})
		})
		this.blockedCoordinates = blockedCoordinates
		window.setInterval(() => {
			// test opening of gate
			const newMatrix = [...this.matrix]
			const current = newMatrix[11][11]
			newMatrix[11][11] = current === 1 ? 0 : 1
			this.update(newMatrix)
		}, 1000)
		console.log('blockedCoordinates', blockedCoordinates.length)
	}

	update(matrix?, player?: Rectangle) {
		if (matrix && this.matrix !== matrix) {
			let blockedCoordinates = []
			this.matrix.forEach((row, rowIndex) => {
				const y = TILE_SIZE * rowIndex
				row.forEach((cell, cellIndex) => {
					const x = TILE_SIZE * cellIndex
					if (cell === 1) {
						blockedCoordinates.push({ x: [x, x + TILE_SIZE], y: [y, y + TILE_SIZE] })
					}
				})
			})
			this.blockedCoordinates = blockedCoordinates
		}
		this.matrix = matrix || this.matrix
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
				this.tiles.push(tile)
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