import { changeMovement, changePosition } from '../store/player/actions'
import { getPlayerFacing, getPlayerIsMoving, getPlayerMovement, getPlayerPosition, getPlayerSize } from '../store/player/selectors'
import { inRange, isArray, toInteger } from 'lodash'

import PlayerSprite from './sprites/PlayerSprite'
import Rectangle from './Rectangle'
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
	loaded: Promise<any>
	rectangle: Rectangle

	constructor() {
		this.state = store.getState()
		this.sprite = new PlayerSprite()
		this.loaded = this.sprite.loaded
		this.rectangle = new Rectangle(this.x, this.y, this.width, this.height)
		handlePlayerInput()
	}

	update(mapWidth: number, mapHeight: number, blockedCoordinates: Array<any>) {
		this.state = store.getState()
		const movement = getPlayerMovement(this.state)
		const isMoving = getPlayerIsMoving(this.state)
		const playerPosition = getPlayerPosition(this.state)
		let { y, x } = playerPosition

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
			const playerWidthPad = TILE_SIZE > this.width ? TILE_SIZE : this.width - TILE_SIZE
			const width = mapWidth - this.width
			const height = mapHeight - this.height

			if (inRange(x, 0, width) === false) {
				x = x <= 0 ? 0 : width;
			}
			if (inRange(y, 0, height) === false) {
				y = y <= 0 ? 0 : height;
			}

			y = toInteger(y)
			x = toInteger(x)

			const blocked = blockedCoordinates.find(coordinates => {
				const playerWithinX = inRange(x, coordinates.x[0] - this.width, coordinates.x[1])
				const playerWithinY = inRange(y, coordinates.y[0] - this.height, coordinates.y[1])
				return playerWithinX && playerWithinY
			})


			if (blocked) {
				const blockedFromRight = x > playerPosition.x
				const blockedFromleft = !blockedFromRight
				const blockedFromTop = y < playerPosition.y
				const blockedFromBottom = !blockedFromTop

				if (movement.movingRight && blockedFromRight || movement.movingLeft && blockedFromleft) {
						x = playerPosition.x
				}
				if (movement.movingDown && blockedFromBottom || movement.movingUp && blockedFromTop) {
					y = playerPosition.y
				}
			}

			store.dispatch(changePosition({ x, y }))
		}

		const moving = this.idle ? 'idle' : 'walk'
		this.sprite.update(`${moving}.${this.facing}`, this.idle ? 550 : 100)
	}

	draw (context: CanvasRenderingContext2D, xView?:number, yView?:number) {
		this.rectangle.set(this.x - xView, this.y - yView)
		this.sprite.draw(context, this.rectangle.left, this.rectangle.top, this.rectangle.width, this.rectangle.height)
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

