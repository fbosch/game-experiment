import { getHoveredCell, getSelectedCell } from '../../store/ui/selectors'

import BushSprite from '../sprites/BushSprite'
import Rectangle from '../Rectangle'
import Sprite from '../sprites/Sprite'
import { TILE_SIZE } from '../settings'
import { getCellState } from '../../store/map/selectors'
import { shadeColor } from '../utils'

export default class Tile {
	color: string
	topLayer: boolean = false
	walkable: boolean = false
	rectangle: Rectangle
	sprite: Sprite
	path: string
	cellState: any
	// entities: Array<any> = []
	private entityInstances: WeakMap<Object, any> = new WeakMap()

	constructor(path: string, rectangle: Rectangle, color?:string, walkable?:boolean, topLayer?:boolean) {
		this.color = color
		this.topLayer = topLayer ?? this.topLayer
		this.walkable = walkable ?? this.walkable
		this.rectangle = rectangle
		this.path = path
		this.parseEntities()
	}

	drawSprite(context:CanvasRenderingContext2D, rectangle:Rectangle) {
		const heightBuffer = TILE_SIZE < this.sprite?.height ? TILE_SIZE - this.sprite?.height : this.sprite?.height - TILE_SIZE
		const widthBuffer = TILE_SIZE < this.sprite?.width ? TILE_SIZE - this.sprite?.width : this.sprite?.width - TILE_SIZE
		this.sprite.draw(context, rectangle.left - (widthBuffer / 2), rectangle.top - (heightBuffer / 2) + this.sprite.offsetTop, rectangle.width, rectangle.height)
	}

	private parseEntities() {
		if (this.cellState?.entities) {
			this.cellState.entities.filter(entity => this.entityInstances.has(entity) === false)
			.forEach(entity => {
				const newBush = new BushSprite(this.rectangle.left, this.rectangle.top)
				this.entityInstances.set(entity, newBush)
			})
		}
		if (this.entities?.length) {
			this.entities.forEach(entity => entity.update())
		}
	}

	get entities() {
		return this.cellState?.entities?.filter(entity => this.entityInstances.has(entity))
			.map(entity => this.entityInstances.get(entity)) || []
	}

	get loaded() {
		return Promise.all(this.entities.map(entity => entity.loaded))
	}

	update() {
		this.parseEntities()
	}

	draw(context:CanvasRenderingContext2D, rectangle:Rectangle, state?:any, onlySprite?:boolean) {
		context.save()
		this.cellState = state ? getCellState(state)(this.path) : this.cellState
		context.fillStyle = this.color
		if (this.topLayer && onlySprite) {
			this.drawSprite(context, rectangle)
			return
		}
		if (getSelectedCell(state) === this.path) {
			context.fillStyle = shadeColor(context.fillStyle, -20)
		}
		if (getHoveredCell(state) === this.path) {
			context.fillStyle = shadeColor(context.fillStyle, 20)
		}
		context.beginPath()
		context.rect(rectangle.left, rectangle.top, rectangle.height, rectangle.width)
		context.fill()
		if (this.sprite && !this.topLayer) {
			this.drawSprite(context, rectangle)
		}
		context.restore()
	}

}