import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers
} from 'redux'

const devToolsExist = typeof window === 'object'
  && typeof window.devToolsExtension !== 'undefined'

const devTools = devToolsExist
  ? window.devToolsExtension()
  : (f) => f

const configureStore = (reducer, initialState, middlewares = []) => {
  const store = createStore(reducer, initialState, compose(
    applyMiddleware(...middlewares),
    devTools
  ))

  return store
}

export { combineReducers, configureStore }
