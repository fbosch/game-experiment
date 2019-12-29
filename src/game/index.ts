import Camera from './Camera'
import Map from './Map'
import Player from './Player'

const mapMatrix = [
	[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0]
]


export function initializeGame(canvas: HTMLCanvasElement) {
	const ctx = canvas.getContext('2d')
	const canvasHeight = canvas.height
	const canvasWidth = canvas.width
	const map = new Map(mapMatrix)

	const vWidth = Math.min(map.width, canvasWidth)
	const vHeight = Math.min(map.height, canvasHeight)

	console.log(map)
	const player = new Player()
	const camera = new Camera(0, 0, vWidth, vHeight, map.width, map.height)

	camera.follow(player, vWidth / 2, vHeight / 2)

	function update() {
		player.update(map.width, map.height)
		camera.update()
	}

	function gameLoop() {
		update()
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
		map.draw(ctx, camera.xView, camera.yView)
		player.draw(ctx, camera.xView, camera.yView)
		window.requestAnimationFrame(gameLoop)
	}
	gameLoop()
}
