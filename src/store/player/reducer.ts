import { produce } from 'immer'

const initialState = {
	position: {
		x: 5,
		y: 5
	},
	size: {
		h: 16,
		w: 16
	},
	isMoving: false,
	movement: {
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
			player.position = action.payload
		}
		break
		case 'player/MOVEMENT': {
			player.movement = { ...player.movement, ...action.payload }
			return handlePlayerFacingAndIdleState(player, action)
		}
		break

		default: return player
	}
})


function XOR(a, b) {
	return ( a || b ) && !( a && b );
}

function handlePlayerFacingAndIdleState(player, action) {
	player.isMoving = Object.values(player.movement).some(movement => movement)
	switch (Object.keys(action.payload)[0]) {
		case 'movingUp': {
			if (player.movement.movingUp) {
				player.facing = 'up'
				player.movement.movingDown = false
				player.isMoving = XOR(player.movement.movingDown, player.movement.movingUp)
			}
		}
		case 'movingDown': {
			if (player.movement.movingDown) {
				player.facing = 'down'
				player.movement.movingUp = false
				player.isMoving = XOR(player.movement.movingDown, player.movement.movingUp)
			}
		}
		case 'movingRight': {
			if (player.movement.movingRight) {
				player.facing = 'right'
				player.movement.movingLeft = false
				player.isMoving = XOR(player.movement.movingRight, player.movement.movingLeft)
			}
		}
		case 'movingLeft': {
			if (player.movement.movingLeft) {
				player.facing = 'left'
				player.movement.movingRight = false
				player.isMoving = XOR(player.movement.movingRight, player.movement.movingLeft)
			}
		}
	}
	return player
}