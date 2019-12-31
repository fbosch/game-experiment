import { get, has } from 'lodash'

import Rectangle from '../Rectangle'
import { TILE_SIZE } from '../settings'

export default class Sprite {
	loaded: Promise<any>
	height: number = 0
	width: number = 0
	blocking: boolean = true
	currentFrame: number = 0
	spritesheet: object = {}
	sprite: ImageBitmap
	animatingSprite: number
	animationSpeed: number
	offsetTop: number = 0
	offsetLeft: number = 0
	rectangle: Rectangle

	constructor(source: any, width:number, height:number, left?: number, top?: number, offsetTop?:number, offsetLeft?:number, blocking?:boolean) {
		this.width = width
		this.height = height
		this.offsetTop = (this.height / 100) * offsetTop || this.offsetTop
		this.offsetLeft = (this.width / 100) * offsetLeft || this.offsetLeft
		const rectWidth =  width * 2
		const rectHeight = height * 2
		const rectOffsetTop = (rectHeight / 100) * offsetTop || 0
		const rectOffsetLeft = (rectWidth / 100) * offsetTop || 0
		this.rectangle = new Rectangle(left - ((rectWidth / 2)) + (TILE_SIZE / 2), top - ((rectHeight / 2)) + (TILE_SIZE / 2), rectWidth, rectHeight)
		const loadedResources = []
		if (typeof source === 'string') {
			const loadingImage = new Promise(resolve => {
				const image = new Image()
				image.src = source
				image.onload = () => {
					this.spritesheet = image
					resolve(image)
				}
			})
			loadedResources.push(loadingImage)

		} else {
			Object.keys(source)
			.forEach(key => {
				const sprite = source[key]
				Object.keys(sprite).forEach(facing => {
					const src = sprite[facing]
					const image = new Image()
					const loadingImage = new Promise(resolve => {
						image.src = src
						image.onload = () => {
							this.spritesheet[key] = {
								...this.spritesheet[key],
								[facing]: image
							}
							resolve(image)
						}
					})
					loadedResources.push(loadingImage)
				})
			})
		}
			this.loaded = Promise.all(loadedResources)
			this.loaded
				.then(() => this.update())
				.then(() => this.updateFrames())
	}

	private updateFrames() {
		if (this.animationSpeed !== 0) {
			window.clearInterval(this.animatingSprite)
			const frameLength = this.sprite.width / this.width
			this.currentFrame = ++this.currentFrame % frameLength
			this.animatingSprite = window.setTimeout(() => this.updateFrames(), this.animationSpeed)
		}
	}

	update(spriteSelector?: string, animationSpeed?: number) {
		const updatedSprite = has(this.spritesheet, spriteSelector) ? get(this.spritesheet, spriteSelector) : this.spritesheet
		if (this.sprite !== updatedSprite) {
			this.currentFrame = 0
		}
		this.sprite = updatedSprite
		this.animationSpeed = animationSpeed
	}

	draw(context: CanvasRenderingContext2D, xView?:number, yView?:number, width?:number, height?:number) {
		context.save()
		const posY = yView - (this.height)
		const posX =  xView - (this.width / 2)
		context.drawImage(this.sprite, this.currentFrame * this.width, 0, this.width, this.height, posX, posY, this.width * 2, this.height * 2)
		context.restore()
	}

}