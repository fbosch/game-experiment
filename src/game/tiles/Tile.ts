import Rectangle from '../Rectangle'
import { shadeColor } from '../utils'

export default class Tile {
	color: string
	walkable: boolean = false

	constructor(color:string, walkable?:boolean) {
		this.color = color
		this.walkable = walkable || this.walkable
	}

	draw(context:CanvasRenderingContext2D, rectangle:Rectangle, state) {
		context.save()
		context.fillStyle = this.color
		if (state?.isSelected) {
			context.fillStyle = shadeColor(context.fillStyle, -20)
		}
		if (state?.isHovered) {
			context.fillStyle = shadeColor(context.fillStyle, 20)
		}
		context.beginPath()
		context.rect(rectangle.left, rectangle.top, rectangle.height, rectangle.width)
		context.fill()
		context.stroke()
		context.restore()
	}

}