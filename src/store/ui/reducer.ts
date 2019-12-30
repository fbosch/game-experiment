import { produce } from 'immer'

const initialState = {
	selectedCell: null,
	hover: null
}

export default (state = initialState, action) => produce(state, ui => {
	 switch (action.type) {
			case 'ui/CELL_SELECTED': {
				ui.selectedCell = action.payload
			}
			case 'ui/CELL_HOVER': {
				ui.hover = action.payload || null
			}
	 }
	 return ui
})
