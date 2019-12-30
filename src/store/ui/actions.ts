import { createAction } from 'redux-actions'

export const selectCell = createAction('ui/CELL_SELECTED')
export const hoverCell = createAction('ui/CELL_HOVER')