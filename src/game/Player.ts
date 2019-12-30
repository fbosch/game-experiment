import { changeCell, changeMovement, changePosition } from '../store/player/actions'
import { getPlayerFacing, getPlayerIsMoving, getPlayerMovement, getPlayerPosition, getPlayerSize } from '../store/player/selectors'
import { inRange, isArray, toInteger } from 'lodash'

import Map from './Map'
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

	get x(): number { return getPlayerPosition(this.state).x }
	get y(): number {	return getPlayerPosition(this.state).y }
	get width(): number { return getPlayerSize(this.state).w }
	get height(): number { return getPlayerSize(this.state).h }
	get idle(): boolean { return getPlayerIsMoving(this.state) === false }
	get facing(): string { return getPlayerFacing(this.state) }

	constructor() {
		this.state = store.getState()
		this.sprite = new PlayerSprite()
		this.loaded = this.sprite.loaded
		this.rectangle = new Rectangle(this.x, this.y, this.width, this.height)
		handlePlayerInput()
	}

	update(map:Map) {
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

			const width = map.width - this.width
			const height = map.height - this.height

			if (inRange(x, 0, width) === false) {
				x = x <= 0 ? 0 : width;
			}
			if (inRange(y, 0, height) === false) {
				y = y <= 0 ? 0 : height;
			}

			const blockedY = map.blockedCoordinates.find(coordinates => {
				const playerWithinX = inRange(playerPosition.x, coordinates.x[0] - this.width, coordinates.x[1])
				const playerWithinY = inRange(y, coordinates.y[0] - this.height, coordinates.y[1])
				return playerWithinX && playerWithinY
			})

			const blockedX = map.blockedCoordinates.find(coordinates => {
				const playerWithinX = inRange(x, coordinates.x[0] - this.width, coordinates.x[1])
				const playerWithinY = inRange(playerPosition.y, coordinates.y[0] - this.height, coordinates.y[1])
				return playerWithinX && playerWithinY
			})

			if ((movement.movingRight || movement.movingLeft) && blockedX) {
				x = playerPosition.x
			}
			if ((movement.movingDown || movement.movingUp) && blockedY) {
				y = playerPosition.y
			}

			y = toInteger(y)
			x = toInteger(x)

			const playerCell = map.getCell({ x, y })
			store.dispatch(changeCell(playerCell))

			store.dispatch(changePosition({ x, y }))
		}

		const moving = this.idle ? 'idle' : 'walk'
		this.sprite.update(`${moving}.${this.facing}`, this.idle ? 550 : 100)
	}

	draw (context: CanvasRenderingContext2D, xView?:number, yView?:number) {
		this.rectangle.set(this.x - xView, this.y - yView)
		this.sprite.draw(context, this.rectangle.left, this.rectangle.top, this.rectangle.width, this.rectangle.height)
	}

}

function handlePlayerInput() {
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

