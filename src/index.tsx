import Game from './components/Game'
import Info from './components/Info'
import { Provider } from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom'
import store from './store'

function App() {
	return (
		<Provider store={store}>
			<Game />
			<Info />
		</Provider>
	)

}

ReactDOM.render(<App />, document.getElementById('root'))
