import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
const SignUpPage = () => (
    <div>
      <h1>Sign Up</h1>
      <SignUpForm />
    </div>
  );

  const INITIAL_STATE = {
    name: '',
    email: '',
    interest: '',
    credential: '',
    reference: '',
    error: null,
  };


class SignUpFormBase extends Component {

  constructor(props) {
    super(props);
    this.state = {...INITIAL_STATE};
  }

  onChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  }

  submit = (event) => {
    const tempPassword = '123456';
    const { name, email } = this.state;

    this.props.firebase.createUserWithEmailAndPassword(email, tempPassword)
    .then(res => {
      this.setState({...INITIAL_STATE});
      this.props.firebase.passwordReset(email);
      this.props.history.push(ROUTES.HOME);
    })
    .catch(error => {
      this.setState({error});
    });
    event.preventDefault();
  }
  
  render() {
    const {
      name,
      email,
      interest,
      credential,
      reference,
      error,
    } = this.state;
    const isInvalid =
      email === '' || name === '' || interest === ''
      || credential === '';
    return (
      <form onSubmit={this.submit}>
        <input
          name="name"
          value={name}
          onChange={this.onChange}
          type="text"
          placeholder="Full Name"
        />
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <input
          name="interest"
          value={interest}
          onChange={this.onChange}
          type="text"
          placeholder="Interest"
        />
        <input
          name="credential"
          value={credential}
          onChange={this.onChange}
          type="text"
          placeholder="Credential"
        />
        <input
          name="reference"
          value={reference}
          onChange={this.onChange}
          type="text"
          placeholder="Reference"
        />
        <button type="submit" disabled={isInvalid}>Sign Up</button>
        {error && <p>{error.message}</p>}
      </form>
    )
  }
}

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

const signUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

export default SignUpPage;
export { SignUpForm, signUpLink };