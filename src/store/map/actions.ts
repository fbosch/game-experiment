import { createAction } from 'redux-actions'

export const changeMatrix = createAction('map/MATRIX_CHANGED')
export const updateCell = createAction('map/CELL_UPDATED')
export const updateCellState = createAction('map/CELL_STATE_CHANGED')