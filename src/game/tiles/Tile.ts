import Rectangle from '../Rectangle'
import Sprite from '../sprites/Sprite'
import { TILE_SIZE } from '../settings'
import { shadeColor } from '../utils'

export default class Tile {
	color: string
	topLayer: boolean = false
	walkable: boolean = false
	rectangle: Rectangle
	sprite: Sprite

	constructor(rectangle: Rectangle, color:string, walkable?:boolean, topLayer?:boolean) {
		this.color = color
		this.topLayer = topLayer
		this.walkable = walkable || this.walkable
		this.rectangle = rectangle
	}

	drawSprite(context:CanvasRenderingContext2D, rectangle:Rectangle) {
		const heightBuffer = TILE_SIZE < this.sprite?.height ? TILE_SIZE - this.sprite?.height : this.sprite?.height - TILE_SIZE
		const widthBuffer = TILE_SIZE < this.sprite?.width ? TILE_SIZE - this.sprite?.width : this.sprite?.width - TILE_SIZE
		this.sprite.draw(context, rectangle.left - (widthBuffer / 2), rectangle.top - (heightBuffer / 2) + this.sprite.offsetTop), rectangle.width, rectangle.height)
	}

	draw(context:CanvasRenderingContext2D, rectangle:Rectangle, state?:any, onlySprite?:boolean) {
		context.save()
		context.fillStyle = this.color
		const heightBuffer = TILE_SIZE < this.sprite?.height ? TILE_SIZE - this.sprite?.height : this.sprite?.height - TILE_SIZE
		const widthBuffer = TILE_SIZE < this.sprite?.width ? TILE_SIZE - this.sprite?.width : this.sprite?.width - TILE_SIZE
		if (this.topLayer && onlySprite) {
			this.drawSprite(context, rectangle)
			context.restore()
			return
		}
		if (state?.isSelected) {
			context.fillStyle = shadeColor(context.fillStyle, -20)
		}
		if (state?.isHovered) {
			context.fillStyle = shadeColor(context.fillStyle, 20)
		}
		context.beginPath()
		context.rect(rectangle.left, rectangle.top, rectangle.height, rectangle.width)
		context.fill()
		if (this.sprite && !this.topLayer) {

			const yView = rectangle.top + (heightBuffer / 2) - this.sprite.offsetTop - (this.sprite.height / 2)
			const xView = rectangle.left - (widthBuffer / 2)

			this.sprite.draw(context, xView, yView, rectangle.width, rectangle.height)
		}
		context.restore()
	}

}