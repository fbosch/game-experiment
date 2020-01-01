import { createSelector } from 'reselect'

export const getUi = state => state.ui
export const getSelectedCell = createSelector(getUi, ui => ui.selectedCell)
export const getHoveredCell = createSelector(getUi, ui => ui.hover)
export const getHitboxOverlayEnabled = createSelector(getUi, ui => ui.hitboxOverlay)
export const getAdjacentOverlayEnabled = createSelector(getUi, ui => ui.adjacentOverlay)
