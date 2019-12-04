import React, { Component }  from 'react';
import {  Router, Route, Switch } from 'react-router-dom';
 import { Provider} from "react-redux";
import store from "./store";
import './App.scss';
import ObjectDetectionComponent from './components/object_detection';
import {history} from './_helpers/history'

require('dotenv').config()


// const App = () => (
  class App extends Component {
    constructor(props) {
      super(props);
      this.showMenu = false;
      this.state = {
          showMenu: this.showMenu
      };
      this.stateChange = this.stateChange;
  }

  stateChange = (showMenu) => {
      this.setState({
          showMenu: showMenu
      });
  };
  render() {
    return (
  <Provider store={store}>
  <Router  history={history}>
    <div>
      <main>
        <Switch>    
        <Route exact={false} path='/' render={() => (
              <div>
                  <ObjectDetectionComponent  history={history} showMenu={this.state.showMenu}/>
              </div>
          )} />  
 
        </Switch>
      </main>
    </div>
  </Router>
  </Provider>
);
          }
        }

export default App;