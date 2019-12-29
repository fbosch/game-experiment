import { changeMovement, changePosition } from '../store/player/actions'
import { getPlayerFacing, getPlayerIsMoving, getPlayerMovement, getPlayerPosition, getPlayerSize } from '../store/player/selectors'
import { inRange, isArray, toInteger } from 'lodash'

import PlayerSprite from './sprites/PlayerSprite'
import Sprite from './sprites/Sprite'
import { TILE_SIZE } from './settings'
import store from '../store'

const pacing = TILE_SIZE / 10

const movementKeybindings = {
	movingUp: ['w', 'ArrowUp'],
	movingDown: ['s', 'ArrowDown'],
	movingRight: ['d', 'ArrowRight'],
	movingLeft: ['a', 'ArrowLeft'],
}

export default class Player {
	state: any
	sprite: Sprite
	currentFrame: number = 1
	animatingSprite: number
	loaded: Promise<any>

	constructor() {
		this.sprite = new PlayerSprite()
		this.loaded = this.sprite.loaded
		handlePlayerInput()
	}

	update(mapWidth: number, mapHeight: number) {
		this.state = store.getState()
		const movement = getPlayerMovement(this.state)
		const isMoving = getPlayerIsMoving(this.state)
		let { y, x } = getPlayerPosition(this.state)

		if (isMoving) {
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
			const width = TILE_SIZE <= this.width ? mapWidth - this.width : (mapWidth - playerWidthPad)
			const height = TILE_SIZE <= this.height ? (mapHeight - this.height) : (mapHeight - playerHeightPad)

			if (inRange(x, 0, width) === false) {
				x = x <= 0 ? 0 : width;
			}
			if (inRange(y, 0, height) === false) {
				y = y <= 0 ? 0 : height;
			}

			y = toInteger(y)
			x = toInteger(x)

			store.dispatch(changePosition({ x, y }))
		}

		const moving = this.idle ? 'idle' : 'walk'
		this.sprite.update(`${moving}.${this.facing}`, this.idle ? 550 : 100)
	}

	draw (context: CanvasRenderingContext2D, xView?:number, yView?:number) {
		this.sprite.draw(context, this.x - xView, this.y - yView, this.width, this.height)
	}

	get x(): number { return getPlayerPosition(this.state).x }
	get y(): number {	return getPlayerPosition(this.state).y }
	get width(): number { return getPlayerSize(this.state).w }
	get height(): number { return getPlayerSize(this.state).h }
	get idle(): boolean { return getPlayerIsMoving(this.state) === false }
	get facing(): string { return getPlayerFacing(this.state) }
}


export function handlePlayerInput() {
	const movementBindings = Object.keys(movementKeybindings)
	movementBindings.forEach(binding => {
		const keybind = movementKeybindings[binding] as any
		window.addEventListener('keydown', event => {
			const { key } = event
			if (isArray(keybind) ? keybind.includes(key) : key === keybind) {
				const movement = getPlayerMovement(store.getState())
				if (movement[binding] !== true) {
					store.dispatch(changeMovement({ [binding]: true }))
				}
				event.preventDefault()
			}
		})
		window.addEventListener('keyup', ({ key }) => {
			if (isArray(keybind) ? keybind.includes(key) : key === keybind) {
				const movement = getPlayerMovement(store.getState())
				if (movement[binding] !== false) {
					store.dispatch(changeMovement({ [binding]: false }))
				}
			}
		})
	})
}

