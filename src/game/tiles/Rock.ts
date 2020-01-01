import Rectangle from '../Rectangle'
import RockSprite from '../sprites/RockSprite'
import Tile from './Tile'

export default class RockTile extends Tile {
	sprite: RockSprite
	constructor(path: string, rectangle: Rectangle) {
		super(path, rectangle, '#3b7d4f', true, false)
		this.sprite = new RockSprite(rectangle.left, rectangle.top)
	}
}