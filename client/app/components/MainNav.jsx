import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import AppBar from 'material-ui/AppBar';

export default class MainNav extends React.Component {

  constructor(props) {
    super(props);
    this.onButtonClick = props.onButtonClick;
    this.state = {
      value: 3,
    };
  }

  handleChange(event, index, value){
    this.setState({value});
  }

  render() {
    return (
      <AppBar
        title="Graphyte.io2"
        iconClassNameRight="muidocs-icon-navigation-expand-more"
        onRightIconButtonTouchTap={this.props.login}
      />
    );
  }
}
