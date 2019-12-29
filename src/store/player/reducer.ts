import { produce } from 'immer'

const initialState = {
	position: {
		x: 0,
		y: 0
	},
	size: {
		h: 32,
		w: 32
	},
	movement: {
		isMoving: false,
		movingUp: false,
		movingDown: false,
		movingRight: false,
		movingLeft: false
	}
}

export default (state = initialState, action) => produce(state, player => {

	switch (action.type) {
		case 'player/POSITION_CHANGED': {
			player.position = { ...player.position, ...action.payload }
		}
		break
		case 'player/MOVEMENT': {
			player.movement = { ...player.movement, ...action.payload }
		}
		break

		default: return player
	}
})