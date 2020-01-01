import { createSelector } from 'reselect'
import { get } from 'lodash'

export const getMap = state => state.map
export const getMatrix = createSelector(getMap, map => map.matrix)
export const getCellValue = createSelector(getMatrix, matrix => path => get(matrix, path))
export const getCellState = createSelector(getMap, map => path => map?.cellState[path] || null)