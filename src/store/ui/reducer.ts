import { produce } from 'immer'
import { toInteger } from 'lodash'

const initialState = {
	selectedBlock: null
}


export default (state = initialState, action) => produce(state, ui => {
	 switch (action.type) {
			case 'ui/BLOCK_SELECTED': {
				const y = toInteger(action.payload.y)
				const x = toInteger(action.payload.x)
				ui.selectedBlock = { x, y }
			}
	 }
	 return ui
})
