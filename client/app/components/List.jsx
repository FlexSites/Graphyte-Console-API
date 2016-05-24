import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import { lightGreen300, white } from 'material-ui/styles/colors'
import EditMenuItem from './EditMenuItem.jsx';

export default class SchemaList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Drawer open={true}>
          <AppBar
            title="Graphyte.io"
            />
        {
          this.props.list.map((item) => {
            let style = {};
            let children = item.name;
            return (
              <EditMenuItem
                key={item.id}
                value={item.name}
                onTouchTap={() => this.props.onRowClick(item.id)}
                onChange={this.props.onEditName}
                isSelected={this.props.selected === item.id} />
            );
          })
        }
      </Drawer>
    )
  }
}

SchemaList.propTypes = {
  list: React.PropTypes.array,
  onRowClick: React.PropTypes.func,
  selected: React.PropTypes.string,
  onEditName: React.PropTypes.func,
};

SchemaList.defaultProps = {
  list: [],
  onRowClick: () => {},
  onEditName: () => {},
};
