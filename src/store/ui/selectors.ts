import { createSelector } from 'reselect'

export const getUi = state => state.ui
export const getSelectedBlock = createSelector(getUi, ui => ui.selectedBlock)