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
			handlePlayerFacing(player, action)
			player.position = action.payload

		}
		break
		case 'player/MOVEMENT': {
			player.movement = { ...player.movement, ...action.payload }
			return handlePlayerMovement(player, action)
		}
		break

		default: return player
	}
})


function XOR(a, b) {
	return ( a || b ) && !( a && b );
}

function handlePlayerFacing(player, action) {
	const movedDown = action.payload.y > player.position.y
	const movedUp = action.payload.y < player.position.y
	const movedRight = action.payload.x > player.position.x
	const movedLeft = action.payload.x < player.position.x

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

}

// TODO: Fix Facing
function handlePlayerMovement(player, action) {
	player.isMoving = Object.values(player.movement).some(movement => movement)
	switch (Object.keys(action.payload)[0]) {
		case 'movingUp': {
			if (player.movement.movingUp) {
				player.isMoving = XOR(player.movement.movingDown, player.movement.movingUp)
			}
		}
		break

		case 'movingDown': {
			if (player.movement.movingDown) {
				player.isMoving = XOR(player.movement.movingDown, player.movement.movingUp)
			}
		}
		break

		case 'movingRight': {
			if (player.movement.movingRight) {
				player.isMoving = XOR(player.movement.movingRight, player.movement.movingLeft)
			}
		}
		break

		case 'movingLeft': {
			if (player.movement.movingLeft) {
				player.isMoving = XOR(player.movement.movingRight, player.movement.movingLeft)
			}
		}
		break

	}
	return player
}