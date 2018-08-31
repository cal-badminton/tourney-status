import React from 'react';

class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.id,
      status: '',
      queue: [],
      matches: []
    };

    props.socket.emit('get view', props.id);

    props.socket.on('update view', function(data) {
      if (this.mounted) {
        console.log(data);
        this.setState({status: data.status,
                       queue: data.queue,
                       matches: data.matches});
      }
    }.bind(this));

    props.socket.on('update status', function(data) {
      if (this.mounted) {
        this.setState({status: data.status});
      }
    }.bind(this));
  }

    componentDidMount() {
      this.mounted = true;
    }

    componentWillUnmount() {
      this.mounted = false;
    }

  render() {
    return (
      <div>
        <p>{this.props.id}</p>
        <p>{this.state.status}</p>
        <p>{this.state.queue}</p>
        <p>{this.state.matches}</p>
      </div>
    )
  }
}

export default View;
