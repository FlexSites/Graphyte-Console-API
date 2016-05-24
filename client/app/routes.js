import React from 'react'
import { Route, IndexRoute } from 'react-router'

// Route Components
import App from './containers/App'
import SchemaList from './containers/SchemaList'
import EntryEditor from './containers/EntryEditor'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={SchemaList} />
    <Route path="schema" component={SchemaList} />
    <Route path="entries/:entryId" component={EntryEditor} />
  </Route>
)
