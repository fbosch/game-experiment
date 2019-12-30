import Rectangle from '../Rectangle'
import Tile from './Tile'

export default class GroundTile extends Tile {
	constructor(rectangle: Rectangle) {
		super(rectangle, 'grey', false)
	}
}