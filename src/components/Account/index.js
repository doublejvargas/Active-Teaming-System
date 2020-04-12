import React, { Component } from 'react';
import { withAuthUser } from '../Session';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
class AccountPageBase extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.setState(this.props.authUser);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.authUser === null) {
      this.setState(this.props.authUser);
    }
  }

  getReferences = () => {
    const { references } = this.state;
    if (references) {
      references.foreach(ref => {
        ref.get()
        .then(doc => {
          this.setState((prev) => ({
            prev,
            refs: [...prev.refs, doc.data()]
          }))
        })
      })
    }
  }

  onChange = (event) => {
    this.setState({'score': event.target.value});
  }

  submitScore = (email) => {
    const {score} = this.state;
    this.props.firebase.user(email).update({score})
    this.props.firebase.user(this.state.email).update({
      refs: this.props.firebase.app.firestore.FieldValue.arrayRemove(email)
    })
    this.setState((prev) => ({
      prev,
      refs: prev.refs.filter(ref => ref !== email)
    }))
  }

  render() {
    this.getReferences();
    let max = 10;
    if (this.state.role === 'VIP') max = 20;
    if (this.state.refs) {
      return this.state.refs.map(email => (
        <div>
          <input onChange={this.onChange} type='number' placeholder="score" max={max}/>
          {email}
          <button onClick={() => this.submitScore(email)}>comfirm</button>
        </div>
        )
      )
    }
    else {
      return (<div>loading...</div>)
    }
  }
}

const AccountPage = compose(
  withAuthUser,
  withFirebase,
)(AccountPageBase);

export default withAuthUser(AccountPage);
