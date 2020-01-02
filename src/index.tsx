import store, { persistor } from './store'

import Game from './components/Game'
import Info from './components/Info'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom'

function App() {
	return (
		<Provider store={store}>
			<PersistGate persistor={persistor}>
				<Game />
				<Info />
			</PersistGate>
		</Provider>
	)

}

ReactDOM.render(<App />, document.getElementById('root'))
