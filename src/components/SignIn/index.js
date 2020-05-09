import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { SignUpLink } from "../SignUp";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { PasswordForgetLink } from "../PasswordForget";
const SignInPage = () => (
  <div style={{ textAlign: "center", paddingTop: "6rem" }}>
    <h1>SignIn</h1>
    <SignInForm />
    <SignUpLink />
    <PasswordForgetLink />

  </div>
);
const INITIAL_STATE = {
  email: "",
  password: "",
  error: null,
};
class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  signIn = (event) => {
    const { email, password } = this.state;
    this.props.firebase
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.props.firebase
          .user(email)
          .get()
          .then((res) => {
            const data = res.data();
            if (data.blocked && data.blocked !== 'false') {
              if (data.blocked === "blocked") {
                this.props.firebase.signOut();
                this.setState({ error: { message: "user been blocked!!!" } });
              } else if (data.blocked === "init") {
                this.props.history.push(ROUTES.ACCOUNT);
                this.props.firebase.user(email).update({ blocked: "blocked" });
              }
            } else {
              this.props.history.push(ROUTES.ACCOUNT);
            }
          });
        this.setState({ ...INITIAL_STATE });
      })
      .catch((error) => {
        this.setState({ error });
      });
    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === "" || email === "";
    return (
      <form onSubmit={this.signIn}>
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        /><br />
        <input
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        /><br />
        <button disabled={isInvalid} type="submit">
          Sign In
        </button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}
const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);

export default SignInPage;
export { SignInForm };
