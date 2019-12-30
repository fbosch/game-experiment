import Rectangle from '../Rectangle'
import Tile from './Tile'
import TreeSprite from '../sprites/TreeSprite'

export default class TreeTile extends Tile {
	sprite: TreeSprite
	constructor(rectangle: Rectangle) {
		super(rectangle, '#3b7d4f', false, true)
		this.sprite = new TreeSprite(rectangle.left, rectangle.top)
	}
}