/* global Auth0Lock:false */

import React, { Component, PropTypes } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid';
import brace from 'brace';
import AceEditor from 'react-ace';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import List from './List.jsx';
import MainNav from '../containers/MainNav'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import Subheader from 'material-ui/Subheader';
import EntryActions from './EntryActions.jsx';

import 'brace/theme/tomorrow_night';

class App extends Component {

  constructor(props) {
    super(props)

    this.state = { entry: { type: '', resolve: '', mock: '' } }
    this.props.fetchList();

    this.lock = new Auth0Lock('YIFJWLW0nB8bOSdctNeNBZ8ffSBD153B', 'flexhub.auth0.com')
    this.showLogin = this.lock.show.bind(this.lock)
    this.selectEntry = this.selectEntry.bind(this)
    this.onEditName = this.onEditName.bind(this);
    this.saveEntry = this.saveEntry.bind(this);

    this.handleDefChange = this.onChange.bind(this, 'type');
    this.handleResChange = this.onChange.bind(this, 'resolve');
    this.handleMockChange = this.onChange.bind(this, 'mock');
  }

  selectEntry(id) {
    console.log('select', id);
    this.setState({ entry: this.props.list.find((item) => item.id === id) });
  }

  showLogin() {
    return this.lock.show({
      closable: false,
    }, (err, profile, token) => {
      if (err) console.error(err);
      localStorage.userToken = token;
    })
  }

  onEditName(value) {
    console.log('setting internal state', value, this.state.entry);
    this.state.entry.name = value;
    this.setState({
      entry: this.state.entry,
    })
  }

  onChange(prop, value) {
    this.state.entry[prop] = value;
    // this.setState()
  }

  saveEntry() {
    this.props.saveEntry(this.state.entry);
  }

  componentWillMount() {
    //Extending function defined in step 2.
    // ...
    this.setState({idToken: this.getIdToken()})
  }

  componentWillReceiveProps(nextProps) {
      console.log('props', nextProps);
  }

  getIdToken() {
    var idToken = localStorage.getItem('userToken');
    var authHash = this.lock.parseHash(window.location.hash);
    if (!idToken && authHash) {
      if (authHash.id_token) {
        idToken = authHash.id_token
        localStorage.setItem('userToken', authHash.id_token);
      }
      if (authHash.error) {
        return null;
      }
    }
    return idToken;
  }

  render() {

    let paperStyle = {
      margin: '10px 0',
    };

    console.log('render', this.props);
    return (
      <div>
        <MainNav login={this.showLogin} />
        <div style={{ paddingLeft: '256px' }}>
          <Grid fluid={true}>
            <Row>
              <Col xs={12} md={6}>
                <h4>Type Definition</h4>
                <Paper style={paperStyle} zDepth={1} rounded={false}>
                  <AceEditor
                    mode="java"
                    theme="tomorrow_night"
                    value={this.state.entry.type}
                    onChange={this.handleDefChange}
                    name="UNIQUE_ID_OF_DIV"
                    width="100%"
                    editorProps={{$blockScrolling: true}}
                  />
                </Paper>
              </Col>
              <Col xs={12} md={6}>
                <h4>Resolver</h4>
                <Paper style={paperStyle} zDepth={1} rounded={false}>
                  <AceEditor
                    mode="java"
                    theme="tomorrow_night"
                    value={this.state.entry.resolve}
                    onChange={this.handleResChange}
                    width="100%"
                    name="UNIQUE_ID_OF_DIV2"
                    editorProps={{$blockScrolling: true}}
                  />
                </Paper>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <EntryActions saveEntry={this.saveEntry} />
              </Col>
            </Row>
          </Grid>
        </div>


        <List
          selected={this.state.entry.id}
          list={this.props.list}
          onRowClick={this.selectEntry}
          onEditName={this.onEditName}
           />
        <Snackbar
          open={this.state.open}
          message={this.state.message}
          action="undo"
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
        />
        <FloatingActionButton
          secondary={true}
          onTouchTap={this.props.addEntry}
          style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    )
  }

}

App.propTypes = {
  children: PropTypes.element,
  fetchList: PropTypes.func.isRequired,
  list: PropTypes.array,
  addEntry: React.PropTypes.func,
}

App.defaultProps = {
  list: [],
}

App.displayName = 'App'

export default App
