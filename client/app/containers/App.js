import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import uuid from '../lib/uuid'

import App from '../components/App.jsx'
import { fetchSchemaList, saveSchemaItem, fetchSchemaItem, schemaItemAdd } from '../actions'


function mapStateToProps(state) {
  return {
    list: state.schema.list,
    entry: state.schema.item,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchList: fetchSchemaList,
    selectEntry: fetchSchemaItem,
    saveEntry: saveSchemaItem,
    addEntry: () => schemaItemAdd({ id: uuid() }),

  }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
