import React, { Component } from 'react'
import * as ROUTES from '../../constants/routes';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';



const PasswordForgetPage = () => (
  <div>
    <h1>Password forget</h1>
    <PasswordResetForm />

  </div>
);

const INITIAL_STATE = {
  email: '',
  error: null,
};


class PasswordResetFormBase extends Component {

  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  async checkIfUserExist(userEmail) {
    let userExist = await this.props.firebase.user(userEmail)
      .get()
      .then(res => {
        if (res.exists) return Promise.resolve(true);
        else return Promise.resolve(false);
      });

    if (!userExist) {
      userExist = await this.props.firebase.pendingUser(userEmail)
        .get()
        .then(res => {
          if (res.exists) return Promise.resolve(true);
          else return Promise.resolve(false);
        });
    }

    return userExist;
  }
  newPendingUser = async (event) => {
    const { name, email, interest, credential, reference } = this.state;
    this.checkIfUserExist(email).then(userExist => {
      if (!userExist) {
        this.props.firebase.pendingUser(email)
          .set({ name, email, interest, credential, reference, rejected: "init", createdAt: new Date() })
          .then(res => {
            this.setState({ ...INITIAL_STATE });
            this.props.history.push(ROUTES.HOME);
          })
          .catch(error => {
            this.setState({ error });
          });
      }
      else this.setState({ error: { message: 'user exists!!!' } });
    });
    event.preventDefault();
  }

  render() {
    const {
      email,
      error,
    } = this.state;
    const isInvalid =
      email === '';
    return (
      <form onSubmit={this.newPendingUser}>

        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />


        <button type="submit" disabled={isInvalid}>Send email</button>
        {error && <p>{error.message}</p>}
      </form>
    )
  }
}

const PasswordResetForm = compose(
  withRouter,
  withFirebase,
)(PasswordResetFormBase);


const PasswordForgetLink = () => (
  <p>
    Forgot your password? <Link to={ROUTES.PASSWORD_FORGET}>Reset your password</Link>
  </p>
);



export default PasswordForgetPage;
export { PasswordResetForm, PasswordForgetLink };