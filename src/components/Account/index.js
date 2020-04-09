import React, { Component } from 'react';
import { withAuthUser } from '../Session';
class AccountPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.setState(this.props.authUser);
    this.getReferences();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.authUser === null) {
      this.setState(this.props.authUser);
      this.getReferences();
    }
  }

  getReferences = () => {
    const references = this.state.references;
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

  render() {
    return (<div>{this.state.email}</div>)
  }
}

export default withAuthUser(AccountPage);
