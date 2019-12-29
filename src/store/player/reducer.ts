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
			player.position = { ...player.position, ...action.payload }
		}
		break
		case 'player/MOVEMENT': {
			player.movement = { ...player.movement, ...action.payload }
			handlePlayerFacingAndIdleState(player, action)
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
				player.isMoving = XOR(player.movement.movingDown, player.movement.movingUp)
			}
		}
			break
		case 'movingDown': {
			if (player.movement.movingDown) {
				player.facing = 'down'
				player.isMoving = XOR(player.movement.movingDown, player.movement.movingUp)
			}
			break
		}
		case 'movingRight': {
			if (player.movement.movingRight) {
				player.facing = 'right'
				player.isMoving = XOR(player.movement.movingRight, player.movement.movingLeft)
			}
			break
		}
		case 'movingLeft': {
			if (player.movement.movingLeft) {
				player.facing = 'left'
				player.isMoving = XOR(player.movement.movingRight, player.movement.movingLeft)
			}
			break
		}
	}
	return player
}