import { combineReducers } from 'redux'
import player from './player/reducer'
import ui from './ui/reducer'

const reducers = {
	player,
	ui
}

export default combineReducers(reducers)