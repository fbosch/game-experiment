import BushSprite from '../sprites/BushSprite'
import Entity from "./Entity"
import Sprite from "../sprites/Sprite"

export default class Bush extends Entity {
	sprite: Sprite

	constructor(entity:any, path:string, left?:number, top?:number) {
		super(entity, path, new BushSprite(left, top))
	}

}