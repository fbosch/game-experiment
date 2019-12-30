import { createAction } from 'redux-actions'

export const changePosition = createAction('player/POSITION_CHANGED')
export const changeMovement = createAction('player/MOVEMENT_CHANGED')