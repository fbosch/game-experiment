import { combineReducers } from 'redux'
import player from './player/reducer'

const ui = (state = {}, action) => {

	return state
}


const reducers = {
	player,
	ui
}

export default combineReducers(reducers)