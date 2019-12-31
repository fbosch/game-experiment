import Rectangle from '../Rectangle'
import Tile from './Tile'

export default class WallTile extends Tile {
	constructor(rectangle: Rectangle) {
		super(rectangle, 'grey', false)
	}
}