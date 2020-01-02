import Player from "../Player"
import Rectangle from "../Rectangle"
import Sprite from "../sprites/Sprite"
import { destroyEntity } from '../../store/map/actions'
import store from '../../store'

export default class Entity {
	sprite: Sprite
	entity: any
	path: string

	get loaded():Promise<ImageData> {
		return this.sprite?.loaded
	}

	get rectangle():Rectangle {
		return this.sprite?.rectangle || null
	}

	get blocking():boolean {
		return this.sprite?.blocking || false
	}

	destroy() {
		store.dispatch(destroyEntity({ entity: this.entity, path: this.path }))
	}

	constructor(entity:any, path:string, sprite:Sprite) {
		this.sprite = sprite
		this.entity = entity
		this.path = path
	}

	update(entity:Entity, path:string) {
		this.entity = entity
		this.path = path
		this.sprite?.update()
	}

	interact(player?: Player) {
	}

	draw(context: CanvasRenderingContext2D, xView?:number, yView?:number, width?:number, height?:number) {
		this.sprite?.draw(context, xView, yView)
	}

}