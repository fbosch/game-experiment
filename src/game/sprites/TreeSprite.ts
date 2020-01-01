import Sprite from './Sprite'
import { random } from 'lodash'
import tree from '../../assets/Other/Misc/Tree/Tree.png'

export default class TreeSprite extends Sprite {
	constructor(left: number, top: number) {
		super(tree, 48, 54, left, top, random(-50, 50), random(-50, 50), true, 1.5)
	}
}