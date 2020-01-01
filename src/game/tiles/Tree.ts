import Rectangle from '../Rectangle'
import Tile from './Tile'
import TreeSprite from '../sprites/TreeSprite'

export default class TreeTile extends Tile {
	sprite: TreeSprite
	constructor(path: string, rectangle: Rectangle) {
		super(path, rectangle, '#3b7d4f', true, true)
		this.sprite = new TreeSprite(rectangle.left, rectangle.top)
	}
}