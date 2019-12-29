import Sprite from './Sprite'
import spriteIdleDown from '../assets/Character/Char_one/Idle/Char_idle_down.png'
import spriteIdleLeft from '../assets/Character/Char_one/Idle/Char_idle_left.png'
import spriteIdleRight from '../assets/Character/Char_one/Idle/Char_idle_right.png'
import spriteIdleUp from '../assets/Character/Char_one/Idle/Char_idle_up.png'
import spriteWalkDown from '../assets/Character/Char_one/Walk/Char_walk_down.png'
import spriteWalkLeft from '../assets/Character/Char_one/Walk/Char_walk_left.png'
import spriteWalkRight from '../assets/Character/Char_one/Walk/Char_walk_right.png'
import spriteWalkUp from '../assets/Character/Char_one/Walk/Char_walk_up.png'

export default class PlayerSprite extends Sprite {
	constructor() {
		const spriteSources = {
			idle: {
				up: spriteIdleUp,
				down: spriteIdleDown,
				left: spriteIdleLeft,
				right: spriteIdleRight
			},
			walk: {
				up: spriteWalkUp,
				down: spriteWalkDown,
				left: spriteWalkLeft,
				right: spriteWalkRight
			}
		}
		super(16, 16, spriteSources)
	}
}