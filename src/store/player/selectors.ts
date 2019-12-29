import { createSelector } from 'reselect'

export const getPlayer = state => state.player
export const getPlayerPosition = createSelector(getPlayer, player => player.position)
export const getPlayerMovement = createSelector(getPlayer, player => player.movement)
export const getPlayerIsMoving = createSelector(getPlayerMovement, movement => movement.isMoving)
export const getPlayerSize = createSelector(getPlayer, player => player.size)
export const getPlayerFacing = createSelector(getPlayer, player => player.facing)