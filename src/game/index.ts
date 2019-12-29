import Camera from './rendering/Camera'
import Map from './rendering/Map'
import Player from './rendering/Player'
import handleInput from './player/handleInput'

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
	[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0]
]


export function initializeGame(canvas: HTMLCanvasElement) {
	const ctx = canvas.getContext('2d')
	const canvasHeight = ctx.canvas.height
	const canvasWidth = ctx.canvas.width
	const map = new Map(mapMatrix)

	const vWidth = Math.min(map.width, canvasWidth)
	const vHeight = Math.min(map.height, canvasHeight)

	console.log(map)

	handleInput(map.width, map.height)

	const player = new Player()
	const camera = new Camera(0, 0, vHeight, vWidth, map.height, map.width)

	camera.follow(player, vWidth / 2, vHeight / 2)

	function update() {
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
