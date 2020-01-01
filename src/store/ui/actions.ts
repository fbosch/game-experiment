import { createAction } from 'redux-actions'

export const selectCell = createAction('ui/CELL_SELECTED')
export const hoverCell = createAction('ui/CELL_HOVER')
export const toggleHitboxOverlay = createAction('ui/TOGGLED_HITBOX_OVERLAY')
export const toggleAdjacentOverlay = createAction('ui/TOGGLED_ADJACENT_BLOCKS_OVERLAY')