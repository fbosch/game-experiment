import { omit } from 'lodash'
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
	},
	facing: 'down'
}

export default (state = initialState, action) => produce(state, player => {

	switch (action.type) {
		case 'player/POSITION_CHANGED': {
			player.position = { ...player.position, ...action.payload }
		}
		break
		case 'player/MOVEMENT': {
			player.movement = { ...player.movement, ...action.payload }
			setPlayerFacing(player, action)
		}
		break

		default: return player
	}
})


function setPlayerFacing(player, action) {
	switch (Object.keys(omit(action.payload, 'isMoving'))[0]) {
		case 'movingUp': {
			if (player.movement.movingUp) {
				player.facing = 'up'
			}
		}
			break
		case 'movingDown': {
			if (player.movement.movingDown) {
				player.facing = 'down'
			}
			break
		}
		case 'movingRight': {
			if (player.movement.movingRight) {
				player.facing = 'right'
			}
			break
		}
		case 'movingLeft': {
			if (player.movement.movingLeft) {
				player.facing = 'left'
			}
			break
		}
	}
}