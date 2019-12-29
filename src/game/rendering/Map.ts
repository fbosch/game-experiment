import { TILE_SIZE } from "../settings"

const colorMap = [
	'green',
	'red'
]

export default class Map {
	matrix: Array<Array<any>> = []
	height: number = 0
	width: number = 0

	constructor(matrix: Array<Array<any>>) {
		this.matrix = matrix
		this.height = (matrix.length - 1) * TILE_SIZE
		this.width = (matrix[0].length - 1) * TILE_SIZE
	}

	draw (context:CanvasRenderingContext2D, xView?:number, yView?:number) {
		context.save()
		const canvasHeight = context.canvas.height
		const canvasWidth = context.canvas.width


		this.matrix.forEach((row, rowIndex) => {
			const y = TILE_SIZE * rowIndex
			row.forEach((cell, cellIndex) => {
				const x = TILE_SIZE * cellIndex
				context.beginPath()
				context.strokeStyle = '#000'
				context.rect(x - xView, y - yView, TILE_SIZE, TILE_SIZE)
				context.stroke()
				context.fillStyle = colorMap[cell]
				context.fill()
			})
		})
		context.restore()
	}

}