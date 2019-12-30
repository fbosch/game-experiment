import { produce } from 'immer'

const initialState = {
	selectedCell: null,
	hover: null
}

export default (state = initialState, action) => produce(state, ui => {
	 switch (action.type) {
			case 'ui/CELL_SELECTED': {
				ui.selectedCell = action.payload.path === ui.selectedCell ? null : action.payload.path
			}
			case 'ui/CELL_HOVER': {
				ui.hover = action?.payload?.path || null
			}
	 }
	 return ui
})
