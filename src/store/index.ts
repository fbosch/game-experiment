import { compose, createStore } from 'redux'

import middleware from './middleware'
import reducers from './reducers'

const enhancers = []
const devToolsExtension = window['__REDUX_DEVTOOLS_EXTENSION__']
if (typeof devToolsExtension === 'function') {
	enhancers.push(devToolsExtension())
}

const composedEnhancers = compose(middleware, ...enhancers)

const store = createStore(reducers, composedEnhancers)

export default store