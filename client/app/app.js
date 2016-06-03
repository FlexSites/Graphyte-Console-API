import React from 'react'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { lightGreen700, darkBlack, white, grey400, grey600, grey700, grey800, grey900 } from 'material-ui/styles/colors';
import App from './containers/App';

import reducers from './reducers'

import { configureStore } from './lib/store'
import routes from './routes'
import './global.css'

// Redux Middleware
import thunk from 'redux-thunk'

// Needed for onTouchTap
injectTapEventPlugin()

const middleware = [
  thunk,
  routerMiddleware(browserHistory)
]

let themeOverrides = {
  // appBar: {
  //   color: grey900
  // },

  // palette: {
  //   accent1Color: lightGreen700,
  //   canvasColor: grey700,
  // },
  // navDrawer: {
  //   color: grey800,
  //   textColor: white
  // }
}

/* eslint-disable react/display-name */ // This is not a react component
export default (initialState) => {
  const store = configureStore(reducers, initialState, middleware)
  const history = syncHistoryWithStore(browserHistory, store)

  return (
    <Provider store={store}>
      <MuiThemeProvider muiTheme={getMuiTheme(themeOverrides)}>
        <App style={{ backgroundColor: grey700 }} />
      </MuiThemeProvider>
    </Provider>
  )
}
