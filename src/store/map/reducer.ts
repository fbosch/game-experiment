import { isEqual } from 'lodash'
import { produce } from 'immer'

const initialState = {
	cellState: {
		"4.3": {
			entities: [
				{
					id: 'bush'
				}
			]
		},
		"4.4": {
			entities: [
				{
					id: 'blueOrb',
					position: {
						x: -5,
						y: -30
					}
				},
				{
					id: 'blueOrb',
					position: {
						x: 50,
						y: 50
					}
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
			case 'map/ENTITY_DESTROYED': {
				const { path, entity } = action.payload
				const cellEntities = map.cellState[path].entities
				map.cellState[path].entities = cellEntities.filter(cellEntity => !isEqual(cellEntity, entity))
			}
			break
		}
	 return map
})
