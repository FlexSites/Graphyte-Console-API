import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import List from '../components/List.jsx'
import { fetchSchemaList } from '../actions'


function mapStateToProps(state) {
  return { list: state.schemaList }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchItems: () => dispatch(fetchSchemaList()),
    onRowClick: (id) => dispatch(push(`/entries/${id}`))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List)
