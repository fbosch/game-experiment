import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import { combineReducers } from 'redux'
import { createWhitelistFilter } from 'redux-persist-transform-filter'
import localForage from 'localforage'
import map from './map/reducer'
import { persistCombineReducers } from 'redux-persist'
import player from './player/reducer'
import ui from './ui/reducer'

const whitelists = [
	createWhitelistFilter('player', ['position', 'cell', 'facing']),
	createWhitelistFilter('ui', ['selectedCell', 'hitboxOverlay', 'adjacentOverlay']),
	createWhitelistFilter('map', ['matrix'])
]

const config = {
	key: 'root',
	storage: localForage,
	stateReconciler: autoMergeLevel2,
	whitelist: ['ui', 'player', 'map'],
	transforms: [...whitelists]
}

const reducers = {
	player,
	ui,
	map
}

export default persistCombineReducers(config, reducers)