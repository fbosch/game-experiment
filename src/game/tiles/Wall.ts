import Rectangle from '../Rectangle'
import Tile from './Tile'

export default class WallTile extends Tile {
	constructor(path: string, rectangle: Rectangle) {
		super(path, rectangle, 'grey', false)
	}
}