import React from 'react';
import View from './View.js';

class Manager extends React.Component {
  constructor(props) {
    super(props);
    this.id = atob(props.id);

    this.state = {
      status: ''
    }

    this.setStatus = this.setStatus.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
  }

  setStatus(event) {
    this.setState({status: event.target.value})
  }

  updateStatus() {
    this.props.socket.emit('update status', {name: this.id,
                                             status: this.state.status})
  }

  render() {
    return (
      <div>
        <div>
          <p> editor tab for {this.id}</p>
          <input type="text" onInput={this.setStatus} />
          <button onClick={this.updateStatus}> Update Status </button>
        </div>
        <div>
          <View id={this.id} socket={this.props.socket} />
        </div>
      </div>
    )
  }
}

export default Manager;
