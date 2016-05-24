import { routerReducer } from 'react-router-redux'

import { combineReducers } from '../lib/store'

// Reducers
import schema from './schema'

export default combineReducers({
  routing: routerReducer,
  schema,
})
