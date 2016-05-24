import { connect } from 'react-redux'

import EntryEditor from '../components/EntryEditor.jsx'
import { fetchSchemaEntry, saveSchemaEntry } from '../actions'


function mapStateToProps(state) {
  return { entry: state.schemaEdit }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchEntry: (id) => dispatch(fetchSchemaEntry(id)),
    saveEntry: (id) => dispatch(saveSchemaEntry(id))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntryEditor)
