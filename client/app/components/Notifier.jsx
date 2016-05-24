import React, { Component } from 'react'

export default Notifier extends Component {



  render() {
    return (
      <Snackbar
        open={this.state.open}
        message={this.state.message}
        action="undo"
        autoHideDuration={3000}
        onRequestClose={this.handleRequestClose}
      />
    )
  }
}
