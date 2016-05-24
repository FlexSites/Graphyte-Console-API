import React, { Component } from 'react';
import { lightGreen300, white } from 'material-ui/styles/colors'
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import ReactDOM from 'react-dom';

export default class EditMenuItem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      style: this.props.style,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      style: {
        backgroundColor: props.isSelected ? lightGreen300 : null
      }
    });
  }

  render() {
    return (
      <MenuItem
        onTouchTap={this.props.onTouchTap}
        style={this.state.style}
        >
        <TextField
          hintText="Schema Name"
          fullWidth={true}
          value={this.props.value}
          underlineShow={false}
          onChange={(event) => {console.log(event.target.value); this.props.onChange(event.target.value); }}
        />
      </MenuItem>
    )
  }
}

EditMenuItem.propTypes = {
  value: React.PropTypes.string,
  onTouchTap: React.PropTypes.func,
  isSelected: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  style: React.PropTypes.object,
};

EditMenuItem.defaultProps = {
  value: '',
  onTouchTap: () => {},
  isSelected: false,
  onChange: () => {},
  style: {},
};
