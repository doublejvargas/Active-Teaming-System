import React, { Component } from 'react';
import { withFirebase } from '../Firebase';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {list : []};
    this.pendingListSubcriber = null;
  }

  componentDidMount () {
    this.pendingListSubcriber = this.props.firebase.getPendingUsers()
    .onSnapshot(users => {
      if (users.empty) this.setState({list: []});
      else {
        users.forEach(user => {
        const { list } = this.state;
        this.setState({list: [...list, user.data()]});
        });
      }
    });
  }

  componentWillUnmount(){
    this.pendingListSubcriber();
  }

  acceptRegister(userInfo) {
    const tempPassword = '123456';
    const {name, email, interest, credential, reference} = userInfo;
    this.props.firebase.createUserWithEmailAndPassword(email, tempPassword)
    .then(res => {
      return this.props.firebase.setUser(email)
              .set({name, email, interest, credential, reference, role: 'OU'});
    })
    .then(res => {
      this.props.firebase.updatePendingUserInfo(email, {rejected: "accept"});
      this.props.firebase.passwordReset(email);
    })
    .catch(error => {
      alert(error);
    });
  }

  rejectRegister(userInfo) {
    console.log(userInfo)
    let rejected = userInfo.rejected;
    if (rejected === "zero") rejected = "once";
    else rejected = "block";
    this.props.firebase.updatePendingUserInfo(userInfo.email, {rejected});
  }

  render() {
    const { list } = this.state;
    return list.map(user => (
    <div key = {user.email}>
      {user.email}
      <button onClick = {() => this.acceptRegister(user)}>Accept</button>
      <button onClick = {() => this.rejectRegister(user)}>Reject</button>
    </div>
    ));
  }
}

export default withFirebase(Admin);
