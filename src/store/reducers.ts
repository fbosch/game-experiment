import { combineReducers } from 'redux'
import map from './map/reducer'
import player from './player/reducer'
import ui from './ui/reducer'

const reducers = {
	player,
	ui,
	map
}

export default combineReducers(reducers)