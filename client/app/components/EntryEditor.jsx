import React, { Component } from 'react'
import brace from 'brace';
import AceEditor from 'react-ace';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import List from './List.jsx';
import { Grid, Row, Col } from 'react-flexbox-grid';

import 'brace/mode/java';

function onChange(newValue) {
}

export default class EntryEditor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      entry: { type: '', resolve: '', mocks: '' },
      loading: false,
    };

    if (this.props.params.entryId){
      this.props.fetchEntry(this.props.params.entryId);
      this.state.loading = true;
    }

    this.saveEntry = this.saveEntry.bind(this);

    this.handleDefChange = this.onChange.bind(this, 'type');
  }

  onChange(prop, value) {
    this.state.entry[prop] = value;
    // this.setState()
  }

  saveEntry() {
    this.props.saveEntry(this.state.entry);
  }

  componentWillReceiveProps(props) {
    let newState = { entry: props.entry };
    if (this.state.loading && props.entry) {
      newState.loading = false;
    }
    this.setState(newState);
  }

  render() {

    if (this.state.loading) {
      return (<CircularProgress />)
    }

    return (
      <Grid fluid={true}>
        <Row>
          <Col xs={2} md={2}>
            <List />
          </Col>
          <Col xs={5} md={5}>
            <AceEditor
              mode="java"
              theme="github"
              value={this.state.entry.type}
              onChange={this.handleDefChange}
              name="UNIQUE_ID_OF_DIV"
              editorProps={{$blockScrolling: true}}
            />
          </Col>
          <Col xs={5} md={5}>
            <AceEditor
              mode="java"
              theme="github"
              value={this.state.entry.type}
              onChange={this.handleDefChange}
              name="UNIQUE_ID_OF_DIV2"
              editorProps={{$blockScrolling: true}}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <RaisedButton label="Secondary" onTouchTap={this.saveEntry} secondary={true} />
          </Col>
        </Row>
      </Grid>
    )
  }
}

EntryEditor.propTypes = {
  entry: React.PropTypes.object,
  fetchEntry: React.PropTypes.func,
  saveEntry: React.PropTypes.func,
};

EntryEditor.defaultProps = {
  list: {},
  fetchEntry: () => {},
  saveEntry: () => {},
};
