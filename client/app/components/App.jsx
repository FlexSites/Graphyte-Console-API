/* global Auth0Lock:false */

import React, { Component, PropTypes } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid';
import brace from 'brace';
import { set } from 'object-path';
import AceEditor from 'react-ace';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import List from './List.jsx';
import MainNav from '../containers/MainNav'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Subheader from 'material-ui/Subheader';
import EntryActions from './EntryActions.jsx';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import { ENTRY_TYPES } from '../constants';

import 'brace/theme/tomorrow_night';

const BLANK_ENTRY = { entry: { type: '', resolve: {}, mock: '' } };

class App extends Component {

  constructor(props) {
    super(props)

    this.state = BLANK_ENTRY;
    this.props.fetchList();

    this.lock = new Auth0Lock('YIFJWLW0nB8bOSdctNeNBZ8ffSBD153B', 'flexhub.auth0.com')
    this.showLogin = this.lock.show.bind(this.lock)
    this.selectEntry = this.selectEntry.bind(this)
    this.onEditName = this.onEditName.bind(this);
    this.saveEntry = this.saveEntry.bind(this);

    this.handleDefChange = this.onChange.bind(this, 'definition');
    this.handleResChange = function (key, value){
      console.log('handling res change', key, value);
      this.onChange(`resolve.${this.state.entry.name}.${key}`, value);
    }.bind(this);
    this.handleMockChange = this.onChange.bind(this, 'mock');
    this.handleTypeChange = this.handleTypeChange.bind(this);

    console.log(typeof this.handleTypeChange, this.handleTypeChange.toString());
  }

  handleTypeChange(event, index, value) {
    return this.onChange('type', value);
  }

  selectEntry(id) {
    console.log('select', id);
    this.setState({ entry: this.props.list.find((item) => item.id === id) || BLANK_ENTRY });
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
    console.log('2setting internal state', value, this.state.entry);
    this.state.entry.name = value;
    this.setState({
      entry: this.state.entry,
    })
  }

  getChildContext() {
    return {muiTheme: getMuiTheme()};
  }

  onChange(prop, value) {
    set(this.state.entry, prop, value);
    this.setState({
      entry: this.state.entry,
    })
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

    let resolves = (this.state.entry.resolve || {})[this.state.entry.name] || {};

    let possibleResolves = (this
      .state
      .entry
      .definition || '')
      .split('\n')
      .map(
        ln => ln
          .split(/[:(]/)[0]
          .trim()
      )
      .filter(val => !!val);

    console.log('stuff and crap', resolves);

    console.log('render', this.props);
    return (
      <div>
        <MainNav login={this.showLogin} />
        <div style={{ paddingLeft: '256px' }}>
          <Grid fluid={true}>
            <Row>
              <Col xs={6} md={6}>
                <h4>Type Definitions</h4>
              </Col>
              <Col xs={6} md={6}>
                <SelectField value={this.state.entry.type} onChange={this.handleTypeChange} fullWidth={true} floatingLabelText="Entry Type">
                  {ENTRY_TYPES.map((type) => (<MenuItem value={type.toLowerCase()} primaryText={type} />))}
                </SelectField>
              </Col>
              <Col xs={12} md={6}>
                <Paper style={paperStyle} zDepth={1} rounded={false}>
                  <AceEditor
                    mode="java"
                    theme="tomorrow_night"
                    value={this.state.entry.definition}
                    onChange={this.handleDefChange}
                    name="UNIQUE_ID_OF_DIV"
                    width="100%"
                    editorProps={{$blockScrolling: true}}
                  />
                </Paper>
              </Col>
            </Row>
            {(possibleResolves || []).map((key, idx) => {
              return (
                <Paper style={paperStyle} zDepth={1} rounded={false} key={key}>
                  <Toolbar>
                    <ToolbarGroup>
                      <ToolbarTitle text={key} />
                    </ToolbarGroup>
                    {
                      resolves[key] ? (<div></div>) : (<ToolbarGroup lastChild={true}>
                      <IconButton touch={true} onTouchTap={() => this.handleResChange(key, '// stuff')}>
                        <NavigationExpandMoreIcon />
                      </IconButton>
                    </ToolbarGroup>)
                    }
                  </Toolbar>
                  {resolves[key] ? (<AceEditor
                    mode="javascript"
                    theme="tomorrow_night"
                    value={resolves[key]}
                    onChange={(val) => {
                      console.log('What the butt', key, val);
                      return this.handleResChange(key, val);
                    }}
                    width="100%"
                    height="200px"
                    name={`UNIQUE_ID_OF_DIV_${idx}`}
                    editorProps={{$blockScrolling: true}}
                  />) : (<div></div>)}
                </Paper>
              );
            })}
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

App.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
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
