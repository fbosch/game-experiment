import { createSelector } from 'reselect'

export const getPlayer = state => state.player
export const getPlayerPosition = createSelector(getPlayer, player => player.position)
export const getPlayerMovement = createSelector(getPlayer, player => player.movement)
export const getPlayerIsMoving = createSelector(getPlayer, player => player.isMoving)
export const getPlayerSize = createSelector(getPlayer, player => player.size)
export const getPlayerFacing = createSelector(getPlayer, player => player.facing)
export const getPlayerCell = createSelector(getPlayer, player => player.cell)