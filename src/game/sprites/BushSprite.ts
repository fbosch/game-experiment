import Sprite from './Sprite'
import bush from '../../assets/Other/Misc/Bush.png'

export default class BushSprite extends Sprite {
	constructor(left: number, top: number) {
		super(bush, 15, 13, left, top, -100, 35, true, 2)
	}
}