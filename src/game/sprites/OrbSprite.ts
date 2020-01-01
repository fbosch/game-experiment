import Sprite from './Sprite'
import blueOrb from '../../assets/Other/Blue_orb.png'

export default class OrbSprite extends Sprite {
	constructor(left: number, top: number) {
		super(blueOrb, 7, 7, left, top, -50, 50, true)
	}
}