import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import Home from './js/Home.js';
import View from './js/View.js';
import Manager from './js/Manager.js';
import io from 'socket.io-client';
let socket = io("http://localhost:8000");

socket.on('warning', function(data) {
  alert(data);
});

const myHome = ({history}) => {
  return (
    <Home history={history} socket={socket} />
  );
}

const myView = ({match}) => {
  return (
    <View id={match.params.id} socket={socket} />
  );
}

const myManager = ({match}) => {
  return (
    <Manager id={match.params.id} socket={socket} />
  );
}


class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route path="/home" component={myHome} />
            <Route path='/view/:id' component={myView} />
            <Route path='/manage/:id' component={myManager} />
            <Redirect to="/home" />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
