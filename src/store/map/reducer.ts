import { get, set } from 'lodash'

import { produce } from 'immer'

const initialState = {
	cellState: {
		"4.3": {
			entities: [
				{
					type: 'foliage',
					id: 'bush'
				}
			]
		}
	},
	matrix: []
}

export default (state = initialState, action) => produce(state, map => {
	 switch (action.type) {
		  case 'map/CELL_STATE_CHANGED': {
				const value = action.payload.value
				const path = action.payload.path
				map.cellState[path] = value
			}
			case 'map/MATRIX_CHANGED': {
				map.matrix = action.payload
			}
			break
			case 'map/CELL_UPDATED': {
				const [y, x] = action.payload.path.split('.')
				map.matrix[x][y] = action.payload.value
			}
			break
	 }
	 return map
})
