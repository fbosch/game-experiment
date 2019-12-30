import { createAction } from 'redux-actions'

export const changePosition = createAction('player/POSITION_CHANGED')
export const changeMovement = createAction('player/MOVEMENT_CHANGED')
export const stopMoving = createAction('player/STOPPED_MOVING')
export const changeCell = createAction('player/CELL_CHANGED')