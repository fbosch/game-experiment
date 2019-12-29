import { getPlayerPosition, getPlayerSize } from '../../store/player/selectors'

import { changePosition } from '../../store/player/actions'
import store from '../../store'

export default class Player {


	get x(): number {
		return getPlayerPosition(store.getState()).x
	}

	get y(): number {
		return getPlayerPosition(store.getState()).y
	}

	get width(): number {
		return getPlayerSize(store.getState()).w
	}

	get height(): number {
		return getPlayerSize(store.getState()).h
	}

	set x(value: number) {
		store.dispatch(changePosition({ x: value }))
	}

	set y(value: number) {
		store.dispatch(changePosition({ y: value }))
	}

	draw (context: CanvasRenderingContext2D, xView?:number, yView?:number) {
		context.save()
		context.fillStyle = 'blue'
		context.fillRect(this.x - xView, this.y - yView, this.height, this.width)
		context.restore()
	}
}