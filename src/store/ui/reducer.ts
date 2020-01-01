import { produce } from 'immer'

// TODO: implement persist for ui caching
const initialState = {
	selectedCell: null,
	hover: null,
	hitboxOverlay: false,
	adjacentOverlay: false
}

export default (state = initialState, action) => produce(state, ui => {
	 switch (action.type) {
			case 'ui/CELL_SELECTED': {
				ui.selectedCell = action.payload.path === ui.selectedCell ? null : action.payload.path
			}
			break
			case 'ui/CELL_HOVER': {
				ui.hover = action?.payload?.path || null
			}
			break
			case 'ui/TOGGLED_HITBOX_OVERLAY': {
				ui.hitboxOverlay = !ui.hitboxOverlay
			}
			break
			case 'ui/TOGGLED_ADJACENT_BLOCKS_OVERLAY': {
				ui.adjacentOverlay = !ui.adjacentOverlay
			}
			break
	 }
	 return ui
})
