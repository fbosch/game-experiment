import Sprite from './Sprite'
import { random } from 'lodash'
import tree from '../../assets/Other/Misc/Tree/Tree.png'

export default class TreeSprite extends Sprite {
	constructor(left: number, top: number) {
		super(tree, 48, 54, left, top, random(-50, 80), random(-20, 80), true, 1.7)
	}
}