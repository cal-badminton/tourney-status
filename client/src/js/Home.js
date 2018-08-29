import React from 'react';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createName: '',
      createPassword: '',
      findName: '',
      manageName: '',
      managePassword: ''
    }
    this.updateCreateName = this.updateCreateName.bind(this);
    this.updateCreatePassword = this.updateCreatePassword.bind(this);
    this.updateFindName = this.updateFindName.bind(this);
    this.updateManageName = this.updateManageName.bind(this);
    this.updateManagePassword = this.updateManagePassword.bind(this);
    this.createTourney = this.createTourney.bind(this);
    this.findTourney = this.findTourney.bind(this);
    this.manageTourney = this.manageTourney.bind(this);

    props.socket.on('view', function(data) {
      props.history.push('/view/' + data);
    });

    props.socket.on('manage', function(data) {
      props.history.push('/manage/' + data);
    })
  }

  updateCreateName(event) {
    this.setState({createName: event.target.value});
    console.log(this.state);
  }

  updateCreatePassword(event) {
    this.setState({createPassword: event.target.value});
    console.log(this.state);
  }

  updateFindName(event) {
    this.setState({findName: event.target.value});
    console.log(this.state);
  }

  updateManageName(event) {
    this.setState({manageName: event.target.value});
    console.log(this.state);
  }

  updateManagePassword(event) {
    this.setState({managePassword: event.target.value});
    console.log(this.state);
  }

  createTourney() {
    if (this.state.createName === '' || this.state.createPassword === '') {
      alert('fill in all fields!');
    } else {
      this.props.socket.emit('create tourney',
        {name: this.state.createName, password: this.state.createPassword});
    }
  }

  findTourney() {
    if (this.state.findName === '') {
      alert('fill in all fields!');
    } else {
      this.props.socket.emit('find tourney',
        {name: this.state.findName});
    }
  }

  manageTourney() {
    if (this.state.manageName === '' || this.state.managePassword === '') {
      alert('fill in all fields!');
    } else {
      this.props.socket.emit('manage tourney',
        {name: this.state.manageName, password: this.state.managePassword});
    }
  }

  render() {
    return (
      <div>
        <div>
          <input type="text" onInput={this.updateCreateName} />
          <input type="text" onInput={this.updateCreatePassword} />
          <button onClick={this.createTourney}> Create Tourney </button>
        </div>
        <div>
          <input type="text" onInput={this.updateFindName} />
          <button onClick={this.findTourney}> Find Tourney </button>
        </div>
        <div>
          <input type="text" onInput={this.updateManageName} />
          <input type="text" onInput={this.updateManagePassword} />
          <button onClick={this.manageTourney}> Manage Tourney </button>
        </div>
      </div>
    );
  }
}

export default Home;
