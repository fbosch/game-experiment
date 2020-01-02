import { getAdjacentOverlayEnabled, getHitboxOverlayEnabled, getHoveredCell } from '../store/ui/selectors'
import { hoverCell, selectCell } from '../store/ui/actions'

import Camera from './Camera'
import Map from './Map'
import Player from './Player'
import Rectangle from './Rectangle'
import { TILE_SIZE } from './settings'
import Visibility from 'visibilityjs'
import { getMatrix } from '../store/map/selectors'
import store from '../store'
import { throttle } from 'lodash'

// import { stopMoving } from '../store/player/actions'

const mapMatrix = [
	[0,2,2,2,2,2,2,2,0,0,0,1,0,0,2,0,0,0,2,0,0,0,0],
	[0,2,2,2,2,2,2,2,0,0,0,1,0,0,2,2,0,0,0,0,0,0,0],
	[0,0,0,0,0,2,2,2,0,2,0,1,0,0,0,2,2,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0,0],
	[0,0,0,0,0,2,0,0,2,2,0,1,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,2,0,0,3,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,3,0,1,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
]

export function initializeGame(canvas: HTMLCanvasElement) {
	let state = store.getState()
	const cursorCoordinates = { x: 0, y: 0 }
	const context = canvas.getContext('2d')
	context.imageSmoothingEnabled = false
	const canvasHeight = canvas.height
	const canvasWidth = canvas.width
	const map = new Map(mapMatrix)

	const vWidth = Math.min(map.width, canvasWidth)
	const vHeight = Math.min(map.height, canvasHeight)

	const player = new Player()
	const camera = new Camera(0, 0, vWidth, vHeight, map.width, map.height)

	const resources = [player.loaded, map.loaded]

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
			console.log(player)
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
		state = store.getState()
		const matrix = getMatrix(state)
		player.update(map)
		camera.update()
		map.update(matrix, player.rectangle)
	}

	function gameLoop() {
		if (Visibility.hidden() === false) {
			update()
			context.clearRect(0, 0, context.canvas.width, context.canvas.height)
			map.draw(context, camera.xView, camera.yView)
			player.draw(context, camera.xView, camera.yView)
			map?.topLayerBlocks?.forEach(block => {
				block.draw(context, new Rectangle(block.rectangle.left - camera.xView, block.rectangle.top - camera.yView, TILE_SIZE), null, true)
			})
			if (getAdjacentOverlayEnabled(state)) renderPlayerAdjacentBlockOverlay(context, player, camera)
			if (getHitboxOverlayEnabled(state)) renderHitboxOverlay(context, map, camera)
		}
		window.requestAnimationFrame(() => Promise.all(resources).then(gameLoop))
	}

	Promise.all(resources).then(gameLoop)
}


function renderPlayerAdjacentBlockOverlay(context:CanvasRenderingContext2D, player:Player, camera:Camera) {
	player.nearbyBlocks?.map(block => block.rectangle).forEach((rectangle: Rectangle) => {
		context.beginPath()
		context.rect(rectangle.left - camera.xView, rectangle.top - camera.yView, rectangle.height, rectangle.width)
		context.fillStyle = 'rgba(38, 235, 255, 0.2)'
		context.strokeStyle = '#26ebff'
		context.stroke()
		context.fill()
		context.restore()
	})
	context.beginPath()
	context.rect(player.interactionArea.left - camera.xView, player.interactionArea.top - camera.yView, player.interactionArea.height, player.interactionArea.width)
	context.fillStyle = 'rgba(0, 255, 20, 0.5	)'
	context.strokeStyle = '#00ff14'
	context.stroke()
	context.fill()
	context.restore()
}

function renderHitboxOverlay(context:CanvasRenderingContext2D, map:Map, camera:Camera) {
	map?.blockedCoordinates?.forEach((rectangle: Rectangle) => {
		context.beginPath()
		context.rect(rectangle.left - camera.xView, rectangle.top - camera.yView, rectangle.height, rectangle.width)
		context.fillStyle = 'rgba(255, 34, 255, 0.2)'
		context.strokeStyle = 'magenta'
		context.stroke()
		context.fill()
		context.restore()
	})
}