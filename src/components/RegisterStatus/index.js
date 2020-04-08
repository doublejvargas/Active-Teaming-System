import React, { Component } from 'react';
import { withFirebase } from '../Firebase';

class StatusPage extends Component {
    constructor(props) {
      super(props);
      this.state = {result: false, email: ""};
    }

    search = (event) => {
      if (this.state.email){
        this.props.firebase.pendingUser(this.state.email)
        .get()
        .then(res => {
          if (res.exists){
            this.setState({result: true, rejected: res.data().rejected});
          }
          else
            alert('not found')
        })
      }
      event.preventDefault();
    }

    onChange = (event) => {
      this.setState({[event.target.name]: event.target.value});
    }

    appeal = () => {
      this.props.firebase.pendingUser(this.state.email)
      .update({rejected: 'appeal'});
      this.setState({result: false});
    }

    render() {
      const {email} = this.state;
      const canAppeal = this.state.rejected !== 'rejected';

      if (!this.state.result) {
        return (
          <form onSubmit={this.search}>
            <h1>Check your status</h1>
            <input
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Your email"
            />
            <button type="submit">Search</button>
          </form>
        )
      }
      else {
        return (
          <div>
            <div>{this.state.email}</div>
            <div>{this.state.rejected}</div>
            <button onClick={this.appeal} disabled={canAppeal}>Appeal</button>
          </div>
        )
      }
    }
  }

export default withFirebase(StatusPage);