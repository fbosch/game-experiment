import Sprite from './Sprite'
import blueOrb from '../../assets/Other/Blue_orb.png'

export default class OrbSprite extends Sprite {
	private glow: number = 2
	hue: number = 0

	constructor(left: number, top: number, hue?:number) {
		super(blueOrb, 7, 7, left, top, -50, 50, true)
		this.hue = hue || this.hue
	}

	private frames = {
		0: 3,
		1: 4,
		2: 5,
		3: 6,
		4: 7,
		5: 8,
		6: 7,
		7: 6,
		8: 5,
		9: 4
	}

	updateFrames = () => {
		window.clearTimeout(this.animatingSprite)
		this.currentFrame = ++this.currentFrame % 10
		this.animatingSprite = window.setTimeout(() => this.updateFrames(), 180)
	}

	draw(context: CanvasRenderingContext2D, xView?:number, yView?:number, width?:number, height?:number) {
		if (this.sprite instanceof Image === false) return
		context.save()
		const frame = this.frames[this.currentFrame]
		const posY = yView - ((this.height / 2) + (this.offsetTop / 2))
		const posX = xView -  ((this.width / 2) - (this.offsetLeft))
		context.filter = `contrast(1.2) drop-shadow(0px 0px ${frame}px #0ffcff) hue-rotate(${this.hue}deg)`

		context.drawImage(this.sprite, 0, 0, this.width, this.height, posX, posY, this.width * 2, this.height * 2)
		// context.globalCompositeOperation = "source-in";

		// draw color
		// context.fillStyle = "#09f";
		// context.fillRect(posX, posY, this.width * 2, this.height * 2)
		// context.globalCompositeOperation = "source-over";
		context.restore()
	}
}