import { changeMovement, changePosition } from '../../store/player/actions'
import { getPlayerMovement, getPlayerPosition, getPlayerSize } from '../../store/player/selectors'
import { inRange, isArray, toInteger } from 'lodash'

import { TILE_SIZE } from '../settings'
import store from '../../store'

const pacing = TILE_SIZE / 10

const movementKeybindings = {
	movingUp: ['w', 'ArrowUp'],
	movingDown: ['s', 'ArrowDown'],
	movingRight: ['d', 'ArrowRight'],
	movingLeft: ['a', 'ArrowLeft'],
}

export default class Player {
	state: any
	constructor() {
		handlePlayerInput()
	}

	update(mapWidth: number, mapHeight: number) {
		this.state = store.getState()
		const movement = getPlayerMovement(this.state)
		if (movement.isMoving === false) {
			return
		}
		let { y, x } = getPlayerPosition(this.state)
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
		const playerHeightPad = TILE_SIZE > this.height ? TILE_SIZE - this.height : this.height - TILE_SIZE
		const playerWidthPad = TILE_SIZE > this.width ? TILE_SIZE - this.width : this.width - TILE_SIZE
		const width = mapWidth - playerWidthPad
		const height = TILE_SIZE > this.height ? mapHeight + playerHeightPad : mapHeight - playerHeightPad
		if (inRange(x, 0, width) === false) {
			x = x <= 0 ? 0 : width;
		}
		if (inRange(y, 0, height) === false) {
			y = y <= 0 ? 0 : height;
		}
		console.log(y, x)
		store.dispatch(changePosition({ y: toInteger(y), x: toInteger(x) }))
	}

	draw (context: CanvasRenderingContext2D, xView?:number, yView?:number) {
		context.save()
		context.fillStyle = 'blue'
		context.fillRect(this.x - xView, this.y - yView, this.height, this.width)
		context.restore()
	}


	get x(): number {
		return getPlayerPosition(this.state).x
	}

	get y(): number {
		return getPlayerPosition(this.state).y
	}

	get width(): number {
		return getPlayerSize(this.state).w
	}

	get height(): number {
		return getPlayerSize(this.state).h
	}

	set x(value: number) {
		store.dispatch(changePosition({ x: value }))
	}

	set y(value: number) {
		store.dispatch(changePosition({ y: value }))
	}
}


export function handlePlayerInput() {
	const movementBindings = Object.keys(movementKeybindings)

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
}

