import Rectangle from '../Rectangle'
import Tile from './Tile'

export default class GroundTile extends Tile {
	constructor(path: string, rectangle: Rectangle) {
		super(path, rectangle, '#3b7d4f', true)
	}
}