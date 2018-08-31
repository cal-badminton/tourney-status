import React from 'react';
import View from './View.js';

class Manager extends React.Component {
  constructor(props) {
    super(props);
    this.id = atob(props.id);

    this.state = {
      status: '',
      queue: [],
      queueName: '',
      queueLeftTeam: [],
      queueRightTeam: [],
      playerName: '',
      removePlayer: '',
      location: '',
      addMatch: '',
      matches: []
    }

    this.setStatus = this.setStatus.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.setQueueName = this.setQueueName.bind(this);
    this.setPlayerName = this.setPlayerName.bind(this);
    this.addPlayerLeft = this.addPlayerLeft.bind(this);
    this.addPlayerRight = this.addPlayerRight.bind(this);
    this.setRemovePlayer = this.setRemovePlayer.bind(this);
    this.removePlayer = this.removePlayer.bind(this);
    this.addToQueue = this.addToQueue.bind(this);
    this.setLocation = this.setLocation.bind(this);
    this.addToMatches = this.addToMatches.bind(this);
    this.setAddMatch = this.setAddMatch.bind(this);

    props.socket.emit('get queue', this.id);
    props.socket.emit('get matches', this.id);

    props.socket.on('update queue', function(data) {
      if (this.mounted) {
        this.setState({queue: data});
      }
    }.bind(this));

    props.socket.on('update matches', function(data) {
      if (this.mounted) {
        this.setState({matches: data});
      }
    }.bind(this));
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setStatus(event) {
    this.setState({status: event.target.value});
  }

  updateStatus() {
    this.props.socket.emit('update status', {name: this.id,
                                             status: this.state.status});
    this.setState({status: ''});
  }

  setQueueName(event) {
    this.setState({queueName: event.target.value});
  }

  setPlayerName(event) {
    this.setState({playerName: event.target.value});
  }

  addPlayerLeft() {
    if (this.state.playerName === '') {
      alert('Cannot add player with no name!');
    } else {
      this.state.queueLeftTeam.push(this.state.playerName);
      this.setState({playerName: ''});
    }
  }

  addPlayerRight() {
    if (this.state.playerName === '') {
      alert('Cannot add player with no name!');
    } else {
      this.state.queueRightTeam.push(this.state.playerName);
      this.setState({playerName: ''});
    }
  }

  setRemovePlayer(event) {
    this.setState({removePlayer: event.target.value});
  }

  removePlayer() {
    if (this.state.removePlayer === '') {
      alert('No players to remove!');
    } else {
      if (this.state.queueLeftTeam.includes(this.state.removePlayer)) {
        let arr = this.state.queueLeftTeam.filter(function(obj) {
          return obj !== this.state.removePlayer;
        }.bind(this));
        console.log(arr);
        this.setState({queueLeftTeam: arr});
      } else if (this.state.queueRightTeam.includes(this.state.removePlayer)) {
        let arr = this.state.queueRightTeam.filter(function(obj) {
          return obj !== this.state.removePlayer;
        }.bind(this));
        this.setState({queueRightTeam: arr});
      }
      this.setState({removePlayer: ''});
    }
  }

  addToQueue() {
    if (this.state.queueName === '' ||
        this.state.queueLeftTeam === [] ||
        this.state.queueRightTeam === []) {
          alert('fill in all fields!');
    } else {
      this.props.socket.emit('add queue', {id: this.id,
                                           name: this.state.queueName,
                                           leftTeam: this.state.queueLeftTeam,
                                           rightTeam: this.state.queueRightTeam});
      this.setState({queueName: '', queueLeftTeam: [], queueRightTeam: []});
    }
  }

  setLocation(event) {
    this.setState({location: event.target.value});
  }

  setAddMatch(event) {
    this.setState({addMatch: event.target.value})
  }

  addToMatches() {

  }

  mapTeams(arr) {
    return arr.map((name) =>
      <li key={name}>{name}</li>
    );
  }

  mapOptions(arr) {
    return arr.map((name) =>
      <option key={name} value={name}>{name}</option>
    );
  }

  render() {
    return (
      <div>
        <div>
          <p> editor tab for {this.id}</p>

          {/* Handle editing status */}
          <div>
            <input type="text" value={this.state.status} onInput={this.setStatus} />
            <button onClick={this.updateStatus}> Update Status Button </button>
          </div>

          {/* Handle editing queue */}
          <div>
            <div>
              <p> Name: </p>
              <input type="text" value={this.state.queueName} onInput={this.setQueueName} />
            </div>
            <div>
              <ul>{this.mapTeams(this.state.queueLeftTeam)}</ul>
              <ul>{this.mapTeams(this.state.queueRightTeam)}</ul>
              <button onClick={this.addPlayerLeft}> Add to Left </button>
              <input type="text" value={this.state.playerName} onInput={this.setPlayerName} />
              <button onClick={this.addPlayerRight}> Add to Right </button>
              <select onChange={this.setRemovePlayer}>
                <option value='none'></option>
                {this.mapOptions(this.state.queueLeftTeam.concat(this.state.queueRightTeam))}
              </select>
              <button onClick={this.removePlayer}> Remove Player </button>
            </div>
            <button onClick={this.addToQueue}> Add to Queue </button>
          </div>

          {/* Handle editing current matches */}
          <div>
            <input type="text" value={this.state.location} onInput={this.setLocation} />
            <select onChange={this.setAddMatch}>
              <option value='none'></option>
              {this.mapOptions(this.state.queueLeftTeam.concat(this.state.queueRightTeam))}
            </select>
            <button onClick={this.addToMatches}> Add to Matches </button>
          </div>
        </div>

        {/* Displays what users will see on the right */}
        <div>
          <View id={this.id} socket={this.props.socket} />
        </div>
      </div>
    )
  }
}

export default Manager;
