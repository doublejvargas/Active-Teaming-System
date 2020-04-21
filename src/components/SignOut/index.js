import React, { Component } from 'react';
import { withFirebase } from '../Firebase';

class SignOut extends Component {
  render() {
    return (
      <div>
        <br>
          <p>signout page</p></br>
        <btn SignOutButton> </btn>
      </div >
    );
  }
}


const SignOutButton = ({ firebase }) => (
  <button type="button" onClick={firebase.signOut}>
    Sign Out
  </button>
);
export default SignOut;