import React from "react";
import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";
const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);
      this.state = { authUser: null };
    }
    componentDidMount() {
      this.unSubscribeStateChange = this.props.firebase.auth.onAuthStateChanged(
        (authUser) => {
          if (authUser) {
            this.unSubscribeSnapChange = this.props.firebase.user(authUser.email).onSnapshot((user) => {
              const data = user.data();
              this.setState({ authUser: data });
            });
          } else this.setState({ authUser: null });
        }
      );
    }
    componentWillUnmount() {
      this.unSubscribeStateChange();
      this.unSubscribeSnapChange();
    }
    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }
  return withFirebase(WithAuthentication);
};
export default withAuthentication;
