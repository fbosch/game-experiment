export default class Rectangle {
	left: number = 0
	top: number = 0
	width: number = 0
	height: number = 0
	right: number = 0
	bottom: number = 0

	constructor (left:number, top:number, width:number, height:number) {
		this.left = left
		this.top = top
		this.width = width || 0
		this.height = height || 0
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

	within(range:Rectangle) {
		return (range.left <= this.left &&
			range.right >= this.right &&
			range.top <= this.top &&
			range.bottom >= this.bottom);
	}

	overlaps(range:Rectangle) {
		return (this.left < range.right &&
			range.left < this.right &&
			this.top < range.bottom &&
			range.top < this.bottom);
	}

}