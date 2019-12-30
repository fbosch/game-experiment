import Rectangle from '../Rectangle'
import RockSprite from '../sprites/RockSprite'
import Tile from './Tile'

export default class RockTile extends Tile {
	sprite: RockSprite
	constructor(rectangle: Rectangle) {
		super(rectangle, '#3b7d4f', true, false)
		this.sprite = new RockSprite
	}
}