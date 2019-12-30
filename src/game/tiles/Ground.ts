import Rectangle from '../Rectangle'
import Tile from './Tile'

export default class GroundTile extends Tile {
	constructor(rectangle: Rectangle) {
		super(rectangle, '#3b7d4f', true)
	}
}