import Sprite from './Sprite'
import { random } from 'lodash'
import rock from '../../assets/Other/Misc/Rock.png'

export default class RockSprite extends Sprite {
	constructor(left: number, top: number) {
		super(rock, 15, 15, left, top, random(-90, 90), random(-90, 90), true)
	}
}