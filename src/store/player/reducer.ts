import { memoize } from 'lodash'
import { produce } from 'immer'

const initialState = Object.freeze({
	position: {
		x: 5,
		y: 5
	},
	size: {
		h: 16,
		w: 16
	},
	cell: null,
	isMoving: false,
	movement: {
		movingUp: false,
		movingDown: false,
		movingRight: false,
		movingLeft: false
	},
	facing: 'down'
})

export default (state = initialState, action) => produce(state, player => {

	switch (action.type) {
		case 'player/POSITION_CHANGED': {
			handlePlayerFacing(player, action.payload)
			player.position = action.payload

		}
		break
		case 'player/MOVEMENT_CHANGED': {
			player.movement = { ...player.movement, ...action.payload }
			return handlePlayerMovement(player, action)
		}
		case 'player/STOPPED_MOVING': {
			player.isMoving = false
			player.movement= initialState.movement
		}
		case 'player/CELL_CHANGED': {
			player.cell = action.payload
		}
		break

		default: return player
	}
})


function XOR(a, b) {
	return ( a || b ) && !( a && b );
}

function handlePlayerFacing(player, payload) {
	const movedDown = payload.y > player.position.y
	const movedUp = payload.y < player.position.y
	const movedRight = payload.x > player.position.x
	const movedLeft = payload.x < player.position.x

	if (player.movement.movingUp || movedUp) {
		player.facing = 'up'
	}
	if (player.movement.movingDown || movedDown) {
		player.facing = 'down'
	}
	if (player.movement.movingRight || movedRight) {
		player.facing = 'right'
	}
	if (player.movement.movingLeft || movedLeft) {
		player.facing = 'left'
	}
	return player
}

// TODO: Fix Facing
function handlePlayerMovement(player, action) {
	player.isMoving = Object.values(player.movement).some(movement => movement)
	switch (Object.keys(action.payload)[0]) {
		case 'movingRight': {
			if (player.movement.movingRight) {
				player.isMoving = XOR(player.movement.movingRight, player.movement.movingLeft) || XOR(player.movement.movingDown, player.movement.movingUp)
			}
		}
		break

		case 'movingLeft': {
			if (player.movement.movingLeft) {
				player.isMoving = XOR(player.movement.movingRight, player.movement.movingLeft) || XOR(player.movement.movingDow, player.movement.movingUp)
			}
		}
		break

		case 'movingUp': {
			if (player.movement.movingUp) {
				if (player.movement.movingLeft || player.movement.movingRight) {
					player.isMoving = XOR(player.movement.movingDown, player.movement.movingUp) && XOR(player.movement.movingRight, player.movement.movingLeft)
				} else {
					player.isMoving = XOR(player.movement.movingDown, player.movement.movingUp)
				}
			}
		}
		break

		case 'movingDown': {
			if (player.movement.movingDown) {
				if (player.movement.movingLeft || player.movement.movingRight) {
					player.isMoving = XOR(player.movement.movingDown, player.movement.movingUp) && XOR(player.movement.movingRight, player.movement.movingLeft)
				} else {
					player.isMoving = XOR(player.movement.movingDown, player.movement.movingUp)
				}
			}
		}
		break

	}
	return player
}