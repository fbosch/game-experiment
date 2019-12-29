import Rectangle from './Rectangle'

const AXIS = {
	NONE: 1,
	HORIZONTAL: 2,
	VERTICAL: 3,
	BOTH: 4
}

export default class Camera {
	followed: any = null
	viewportRect: Rectangle
	worldRect: Rectangle
	axis: number
	xView: number
	yView: number
	hView: number
	wView: number
	xDeadZone: number
	yDeadZone: number

	constructor(xView: number, yView: number, viewportWidth:number, viewportHeight:number, worldWidth:number, worldHeight:number) {
		this.xView = xView ?? 0
		this.yView = yView ?? 0
		this.axis = AXIS.BOTH
		this.hView = viewportHeight
		this.wView = viewportWidth
		this.viewportRect = new Rectangle(this.xView, this.yView, this.wView, this.hView)
		this.worldRect = new Rectangle(0, 0, worldWidth, worldHeight)
	}

	follow(gamePosition, xDeadZone: number, yDeadZone: number) {
		this.followed = gamePosition
		this.xDeadZone = xDeadZone
		this.yDeadZone = yDeadZone
	}

	update() {
		if (this.followed) {
			if (this.axis === AXIS.HORIZONTAL || this.axis === AXIS.BOTH) {
				if (this.followed.x - this.xView + this.xDeadZone > this.wView) {
					this.xView = this.followed.x - (this.wView - this.xDeadZone)
				} else if (this.followed.x - this.xDeadZone < this.xView) {
					this.xView = this.followed.x - this.xDeadZone
				}
			}
			if (this.axis === AXIS.VERTICAL || this.axis === AXIS.BOTH) {
				if (this.followed.y - this.yView + this.yDeadZone > this.hView) {
					this.yView = this.followed.y - (this.hView - this.yDeadZone)
				} else if (this.followed.y - this.yDeadZone < this.yView) {
					this.yView = this.followed.y - this.yDeadZone
				}
			}
		}

		this.viewportRect.set(this.xView, this.yView)

		// don't let camera leaves the world's boundary
		if (!this.viewportRect.within(this.worldRect)) {
			if (this.viewportRect.left < this.worldRect.left)
				this.xView = this.worldRect.left;
			if (this.viewportRect.top < this.worldRect.top)
				this.yView = this.worldRect.top;
			if (this.viewportRect.right > this.worldRect.right)
				this.xView = this.worldRect.right - this.wView;
			if (this.viewportRect.bottom > this.worldRect.bottom)
				this.yView = this.worldRect.bottom - this.hView;
		}
	}

}