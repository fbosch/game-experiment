import Sprite from './Sprite'
import tree from '../../assets/Other/Misc/Tree/Tree.png'

export default class TreeSprite extends Sprite {
	constructor(left: number, top: number) {
		super(tree, 48, 54, left, top, 10)
	}
}