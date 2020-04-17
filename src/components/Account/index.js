import React, { Component } from 'react';
import { withAuthUser } from '../Session';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
class AccountPageBase extends Component {
  constructor(props) {
    super(props);
    this.state = {references: []};
  }

  componentDidMount() {
    this.setState(this.props.authUser, this.getReferences);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.authUser === null) {
      this.setState(this.props.authUser, this.getReferences);
    }
  }

  getReferences = () => {
    const { refs } = this.state;
    if (refs) {
      refs.forEach(ref => {
        ref.get()
        .then(doc => {
          this.setState((prev) => ({
            prev,
            references: [...prev.references, doc.data()]
          }))
        })
      })
    }
  }

  onChange = (event, email, max) => {
    let value = event.target.value;
    if (value > max) value = max;
    this.setState((prev) => ({
      prev,
      references: prev.references.map(ref => {
        if (ref.email === email){
          ref.score = value;
        }
        return ref;
      })
    }));
  }

  submitScore = (email, score) => {
    this.props.firebase.user(email).update({score})
    const docRef = this.props.firebase.user(email);
    this.props.firebase.user(this.state.email).update({
      refs: this.props.firebase.app.firestore.FieldValue.arrayRemove(docRef)
    })
    this.setState((prev) => ({
      prev,
      references: prev.references.filter(ref => ref.email !== email)
    }))
  }

  render() {
    let max = 10;
    if (this.state.role === 'VIP') max = 20;
    if (this.state.references) {
      return this.state.references.map(ref => (
        <div>
          <input onChange={(event) => this.onChange(event, ref.email, max)}
                 value={ref.score}   type='number' placeholder="score" max={max}/>
          {ref.email}
          <button onClick={() => this.submitScore(ref.email, ref.score)}>comfirm</button>
        </div>
        )
      )
    }
    else {
      return (<div></div>)
    }
  }
}

const AccountPage = compose(
  withAuthUser,
  withFirebase,
)(AccountPageBase);

export default withAuthUser(AccountPage);
