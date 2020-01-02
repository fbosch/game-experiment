import { get, has } from 'lodash'

import Rectangle from '../Rectangle'
import { TILE_SIZE } from '../settings'

export default class Sprite {
	loaded: Promise<any>
	height: number = 0
	width: number = 0
	blocking: boolean = false
	currentFrame: number = 0
	spritesheet: object = {}
	sprite: ImageBitmap
	animatingSprite: number
	animationSpeed: number = 0
	offsetTop: number = 0
	offsetLeft: number = 0
	rectangle: Rectangle

	constructor(source: any, width:number, height:number, left?: number, top?: number, offsetTop?:number, offsetLeft?:number, blocking?:boolean, blockModifier: number = 2, animationSpeed?: number) {
		this.width = width
		this.height = height
		this.offsetTop = (this.height / 100) * offsetTop || this.offsetTop
		this.offsetLeft = (this.width / 100) * offsetLeft || this.offsetLeft
		this.blocking = blocking || this.blocking
		this.animationSpeed = animationSpeed || this.animationSpeed
		const rectWidth =  width * blockModifier
		const rectHeight = height * blockModifier
		const posY = left - ((rectWidth / 2) - (this.offsetLeft)) + (TILE_SIZE / 2)
		const posX = top - ((rectHeight / 2) - (this.offsetTop / 2)) + (TILE_SIZE / 2)
		this.rectangle = new Rectangle(posY, posX, rectWidth, rectHeight)

		const loadedResources = []
		if (typeof source === 'string') {
			// console.log(source)
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

	updateFrames() {
		if (this.animationSpeed !== 0) {
			window.clearTimeout(this.animatingSprite)
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
		if (this.sprite instanceof Image === false) return
		context.save()
		const posY = yView - ((this.height / 2) + (this.offsetTop / 2))
		const posX = xView -  ((this.width / 2) - (this.offsetLeft))
		context.drawImage(this.sprite, this.currentFrame * this.width, 0, this.width, this.height, posX, posY, this.width * 2, this.height * 2)
		context.restore()
	}

}