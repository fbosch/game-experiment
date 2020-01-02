import { changeCell, changeMovement, changePosition } from '../store/player/actions'
import { getPlayerCell, getPlayerFacing, getPlayerIsMoving, getPlayerMovement, getPlayerPosition, getPlayerSize } from '../store/player/selectors'
import { inRange, intersectionBy, isArray, isEqual, toInteger } from 'lodash'

import Entity from './entities/Entity'
import Map from './Map'
import PlayerSprite from './sprites/PlayerSprite'
import Rectangle from './Rectangle'
import Sprite from './sprites/Sprite'
import Tile from './tiles/Tile'
import store from '../store'

const pacing = 7

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
	interactionArea: Rectangle
	nearbyBlocks: Array<Tile> = []
	previousCell: any

	get x(): number { return getPlayerPosition(this.state).x }
	get y(): number {	return getPlayerPosition(this.state).y }
	get width(): number { return getPlayerSize(this.state).w }
	get height(): number { return getPlayerSize(this.state).h }
	get idle(): boolean { return getPlayerIsMoving(this.state) === false }
	get facing(): string { return getPlayerFacing(this.state) }
	get cell(): any { return getPlayerCell(this.state) }
	get nearbyEntities(): Array<Entity> {
		const blocks = [...this.nearbyBlocks, this.cell]
		return this.nearbyBlocks?.flatMap(block => block.entities).filter(Boolean)
	}

	constructor() {
		this.state = store.getState()
		this.sprite = new PlayerSprite()
		this.loaded = this.sprite.loaded
		this.rectangle = new Rectangle(this.x, this.y, this.width, this.height)
		this.interactionArea = new Rectangle(this.x, this.y, this.width, this.height)
		handlePlayerInput()
		window.addEventListener('keydown', this.interact)
	}

	interact = (event: KeyboardEvent) => {
		if (event.code === 'Space') {
			event.preventDefault()
			const nearEntity = this.nearbyEntities
				.find((entity: Entity) => entity.rectangle.overlaps(this.interactionArea) || entity.rectangle.overlaps(this.rectangle))
			if (nearEntity?.interact) {
				nearEntity.interact(this)
			}
		}
	}

	update(map:Map) {
		this.state = store.getState()
		const movement = getPlayerMovement(this.state)
		const isMoving = getPlayerIsMoving(this.state)
		const playerPosition = getPlayerPosition(this.state)
		const playerCell = getPlayerCell(this.state)

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

			if (this.cell && this.cell !== this.previousCell) {
				const [row, cell] = this.cell.split('.').map(toInteger)
				const playerBlock = map.blockMap[this.cell]?.value
				const rightBlock = map.blockMap[`${row}.${cell + 1}`]?.value
				const leftBlock = map.blockMap[`${row}.${cell - 1}`]?.value
				const topBlock = map.blockMap[`${row - 1}.${cell}`]?.value
				const bottomBlock = map.blockMap[`${row + 1}.${cell}`]?.value
				this.nearbyBlocks = [
					playerBlock, rightBlock, leftBlock, topBlock, bottomBlock
				].filter(Boolean)
				this.previousCell = this.cell
			}

			const nearbyRectangles = this.nearbyBlocks.map(block => block.rectangle)
			const nearbyBlocking = map.blockedCoordinates.filter((rectangle: Rectangle) => nearbyRectangles.some(nearbyRectangle => rectangle.overlaps(nearbyRectangle)))

			const blockedY = nearbyBlocking.find((rectangle: Rectangle) => {
				const playerWithinX = inRange(playerPosition.x, rectangle.left - this.width, rectangle.right)
				const playerWithinY = inRange(y, rectangle.top - this.height, rectangle.bottom)
				return playerWithinX && playerWithinY
			})

			const blockedX = nearbyBlocking.find((rectangle: Rectangle) => {
				const playerWithinX = inRange(x, rectangle.left - this.width, rectangle.right)
				const playerWithinY = inRange(playerPosition.y, rectangle.top - this.height, rectangle.bottom)
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

			const newPlayerCell = map.getCell({ x, y })
			if (newPlayerCell !== playerCell) {
				store.dispatch(changeCell(newPlayerCell))
			}
			store.dispatch(changePosition({ x, y }))
		}

		const moving = this.idle ? 'idle' : 'walk'
		this.sprite.update(`${moving}.${this.facing}`, this.idle ? 400 : 120)
		this.rectangle.set(x, y)

		const interactionBuffer = 20
		let interactionHeight = this.height * 2
		let interactionWidth = this.width * 2

		switch (this.facing) {
			case 'up': {
				interactionHeight = interactionHeight + interactionBuffer
				x = x - ((this.width / 2))
				y = y - ((this.height / 2) + interactionBuffer)
			} break
			case 'down': {
				interactionHeight = interactionHeight + interactionBuffer
				x = x - (this.width / 2)
				y = y - ((interactionHeight / 2) - interactionBuffer)
			} break
			case 'left': {
				interactionWidth = interactionWidth + interactionBuffer
				y = y - (this.height / 2)
				x = x - (interactionWidth / 2)
			} break
			case 'right': {
				interactionWidth = interactionWidth + interactionBuffer
				y = y - (this.height / 2)
				x = x - (interactionWidth / 2) + interactionBuffer
			} break
			default: break
		}

		y = toInteger(y)
		x = toInteger(x)

		this.interactionArea.set(x, y, interactionHeight, interactionWidth)
	}


	draw (context: CanvasRenderingContext2D, xView?:number, yView?:number) {
		this.sprite.draw(context, this.rectangle.left - xView, this.rectangle.top - yView, this.rectangle.width, this.rectangle.height)
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

