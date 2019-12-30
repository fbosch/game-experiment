export default class Rectangle {
	left: number = 0
	top: number = 0
	width: number = 0
	height: number = 0
	right: number = 0
	bottom: number = 0

	constructor (left:number, top:number, width:number, height?:number) {
		this.left = left
		this.top = top
		this.width = width || 0
		this.height = height || this.width || 0
		this.right = this.left + width
		this.bottom = this.top + this.height
	}

	set(left: number, top: number, width?:number, height?:number) {
		this.left = left
		this.top = top
		this.width = width || this.width
		this.height = height || this.height
		this.right = (this.left + this.width)
		this.bottom = (this.top + this.height)
	}

	within(rectangle:Rectangle) {
		return (rectangle.left <= this.left &&
			rectangle.right >= this.right &&
			rectangle.top <= this.top &&
			rectangle.bottom >= this.bottom)
	}

	overlaps(rectangle:Rectangle) {
		return (this.left < rectangle.right &&
			rectangle.left < this.right &&
			this.top < rectangle.bottom &&
			rectangle.top < this.bottom)
	}

}