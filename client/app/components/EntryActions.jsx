import React, { Component } from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

export default class EntryActions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 2
    };
  }

  render() {
    return (
      <Toolbar>
        <ToolbarGroup>
          <RaisedButton label="Save Entry" onTouchTap={this.props.saveEntry} secondary={true} />
        </ToolbarGroup>
      </Toolbar>
    )
  }
}
