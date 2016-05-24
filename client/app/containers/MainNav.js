import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import MainNav from '../components/MainNav.jsx'

function mapStateToProps(state) {
  return { todos: state.todos }
}

function mapDispatchToProps(dispatch) {
  return {
    onButtonClick: () => dispatch(push('/schema'))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainNav)
