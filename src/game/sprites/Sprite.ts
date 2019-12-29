import { get } from 'lodash'

export default class Sprite {
	loaded: Promise<any>
	height: number = 0
	width: number = 0
	sprites: any = {}
	sprite: ImageBitmap
	currentFrame: number = 0
	animatingSprite: number
	animationSpeed: number = 250

	constructor(width:number, height:number, sources:any) {
		this.width = width
		this.height = height
		const loadedResources = []
		Object.keys(sources)
			.forEach(key => {
				const sprite = sources[key]
				Object.keys(sprite).forEach(facing => {
					const src = sprite[facing]
					const image = new Image()
					const loadingImage = new Promise(resolve => {
						image.src = src
						image.onload = () => {
							this.sprites[key] = {
								...this.sprites[key],
								[facing]: image
							}
							resolve(image)
						}
					})
					loadedResources.push(loadingImage)
				})
			})
			this.loaded = Promise.all(loadedResources)
			this.loaded
				.then(() => this.update())
				.then(() => this.updateFrames())
	}

	updateFrames() {
		window.clearInterval(this.animatingSprite)
		const frameLength = this.sprite.width / this.width
		this.currentFrame = ++this.currentFrame % frameLength
		this.animatingSprite = window.setTimeout(() => this.updateFrames(), this.animationSpeed)
	}

	update(spriteSelector: string = 'idle.down', animationSpeed: number = 250) {
		const updatedSprite = get(this.sprites, spriteSelector)
		if (this.sprite !== updatedSprite) {
			this.currentFrame = 0
		}
		this.sprite = updatedSprite
		this.animationSpeed = animationSpeed
	}

	draw(context: CanvasRenderingContext2D, xView?:number, yView?:number, width?:number, height?:number) {
		context.save()
		context.drawImage(this.sprite, this.currentFrame * this.width, 0, this.width, this.height, xView, yView, width, height)
		context.restore()
	}

}