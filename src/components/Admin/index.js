import React, { Component } from 'react';
import { withFirebase } from '../Firebase';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {list : []};
  }

  componentDidMount () {
    this.props.firebase.getPendingUsers()
    .get()
    .then(users => {
      users.forEach(user => {
        const { list } = this.state;
        this.setState({list: [...list, user.data()]});
      });
    });
  }

  
  render() {
    const { list } = this.state;
    return list.map(user => (
    <div key = {user.email}>
      {user.email}
    </div>
    ));
  }
}

export default withFirebase(Admin);
