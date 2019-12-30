import { hoverCell, selectCell } from '../store/ui/actions'

import Camera from './Camera'
import Map from './Map'
import Player from './Player'
import { getHoveredCell } from '../store/ui/selectors'
import { getMatrix } from '../store/map/selectors'
import store from '../store'
import { throttle } from 'lodash'

// import { stopMoving } from '../store/player/actions'


const mapMatrix = [
	[0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	[0,1,0,1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
]

function getRelativeCoords(event) {
	return { x: event.offsetX || event.layerX, y: event.offsetY || event.layerY };
}

export function initializeGame(canvas: HTMLCanvasElement) {
	let state = store.getState()
	const cursorCoordinates = { x: 0, y: 0 }
	const ctx = canvas.getContext('2d')
	ctx.imageSmoothingEnabled = false
	const canvasHeight = canvas.height
	const canvasWidth = canvas.width
	const map = new Map(mapMatrix)

	const vWidth = Math.min(map.width, canvasWidth)
	const vHeight = Math.min(map.height, canvasHeight)

	const player = new Player()
	const camera = new Camera(0, 0, vWidth, vHeight, map.width, map.height)

	const resources = [player.loaded]

	camera.follow(player, vWidth / 2, vHeight / 2)
	canvas.focus()

	canvas.addEventListener('mousedown', event => {
		canvas.focus()
		let rect = canvas.getBoundingClientRect()
		let x = event.clientX - rect.left
		let y = event.clientY - rect.top
		const cell = map.getCell({ y: y + camera.yView, x: x + camera.xView })
		if (cell?.path) {
			store.dispatch(selectCell(cell))
		}
	})

	const throttledHover = throttle(event => {
		const hoveredCell = getHoveredCell(state)
		let rect = canvas.getBoundingClientRect()
		let x = event.clientX - rect.left
		let y = event.clientY - rect.top
		const cell = map.getCell({ y: y + camera.yView, x: x + camera.xView })
		if (cell?.path !== hoveredCell) {
			store.dispatch(hoverCell(cell))
		}
	}, 75)

	canvas.addEventListener('mouseenter', throttledHover)
	canvas.addEventListener('mousemove', throttledHover)
	canvas.addEventListener('mouseleave', throttledHover)

	function update() {
		if (document.activeElement !== canvas) return
		state = store.getState()
		const matrix = getMatrix(state)
		player.update(map)
		camera.update()
		map.update(matrix, player.rectangle)
	}

	function gameLoop() {
		update()
		if (document.activeElement === canvas) {
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
			map.draw(ctx, camera.xView, camera.yView)
			player.draw(ctx, camera.xView, camera.yView)
		}
		window.requestAnimationFrame(gameLoop)
	}

	Promise.all(resources).then(gameLoop)
}
