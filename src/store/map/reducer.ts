import { get, set } from 'lodash'

import { produce } from 'immer'

const initialState = {
	matrix: []
}

export default (state = initialState, action) => produce(state, map => {
	 switch (action.type) {
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
