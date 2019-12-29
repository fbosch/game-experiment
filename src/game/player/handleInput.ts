import { changeMovement, changePosition } from '../../store/player/actions'
import { getPlayerIsMoving, getPlayerMovement, getPlayerPosition, getPlayerSize } from '../../store/player/selectors'
import { inRange, isArray, toInteger } from 'lodash'

import { TILE_SIZE } from '../settings'
import store from '../../store'

const movementKeybindings = {
	movingUp: ['w', 'ArrowUp'],
	movingDown: ['s', 'ArrowDown'],
	movingRight: ['d', 'ArrowRight'],
	movingLeft: ['a', 'ArrowLeft'],
}

export default function handleInput(mapWidth, mapHeight) {
	let movingPlayer

	const pacing = TILE_SIZE / 10
	const movementBindings = Object.keys(movementKeybindings)

	function movePlayer() {
		const state = store.getState()
		const movement = getPlayerMovement(state)
		if (movement.isMoving === false) {
			window.cancelAnimationFrame(movingPlayer)
			return
		}
		const playerSize = getPlayerSize(state)
		let { y, x } =  getPlayerPosition(state)
		if (movement.movingUp) {
			y -= pacing
		}
		if (movement.movingDown) {
			y += pacing
		}
		if (movement.movingRight) {
			x += pacing
		}
		if (movement.movingLeft) {
			x -= pacing
		}
		const playerHeightPad = TILE_SIZE - playerSize.h
		const playerWidthPad = TILE_SIZE - playerSize.w
		const width = mapWidth + playerWidthPad
		const height = mapHeight + playerHeightPad
		if (inRange(x, 0, width) === false) {
			x = x <= 0 ? 0 : width;
		}
		if (inRange(y, 0, height) === false) {
			y = y <= 0 ? 0 : height;
		}
		store.dispatch(changePosition({ y: toInteger(y), x: toInteger(x) }))
		movingPlayer = window.requestAnimationFrame(movePlayer)
	}

	movementBindings.forEach(binding => {
		const keybind = movementKeybindings[binding]
		window.addEventListener('keydown', event => {
			const { key } = event
			if (isArray(keybind) ? keybind.includes(key) : key === keybind) {
				const movement = getPlayerMovement(store.getState())
				store.dispatch(changeMovement({ [binding]: true, isMoving: true }))
				event.preventDefault()
			}
		})
		window.addEventListener('keyup', ({ key }) => {
			if (isArray(keybind) ? keybind.includes(key) : key === keybind) {
				const movement = getPlayerMovement(store.getState())
				if (movementBindings.filter(bind => bind !== binding).some(binding => movement[binding]) === false) {
					return store.dispatch(changeMovement({ [binding]: false, isMoving: false }))
				}
				store.dispatch(changeMovement({ [binding]: false }))
			}
		})
	})

	window.addEventListener('keydown', () => {
		window.cancelAnimationFrame(movingPlayer)
		const isMoving = getPlayerIsMoving(store.getState())
		if (isMoving) {
			movingPlayer = window.requestAnimationFrame(movePlayer)
		}
	})
	window.addEventListener('keyup', () => {
		const isMoving = getPlayerIsMoving(store.getState())
		if (isMoving === false) {
			window.cancelAnimationFrame(movingPlayer)
		}
	})
}

