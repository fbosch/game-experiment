import Entity from "./Entity"
import OrbSprite from '../sprites/OrbSprite'
import Player from "../Player"
import Sprite from "../sprites/Sprite"

export default class RedOrb extends Entity {
	sprite: Sprite

	constructor(entity:any, path:string, left?:number, top?:number) {
		super(entity, path, new OrbSprite(left, top, -180))
	}

	interact(player: Player) {
		console.log('Orb picked up')
		this.destroy()
	}

}