import React, { Component, PasswordlessAuthComponent } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from '../Navigation';
import * as ROUTES from '../../constants/routes';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordChangePage from '../PasswordChange';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import StatusPage from '../RegisterStatus';
import { withAuthentication, withAuthUser } from '../Session';
import ToolBar from '../ToolBar/ToolBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';
import { Switch, Redirect} from 'react-router-dom';

// import pages
import Home from '../Home/';
import GroupPage from '../Group/groupPage'

const LoginRouteBase = ({ component: Comp, authUser, path, ...rest }) => {
  return (
    <Route
      path={path}
      {...rest}
      render={props => {
        return authUser ? (
          <Comp {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
            }}
          />
        );
      }}
    />
  );
};
const LoginRoute = withAuthUser(LoginRouteBase)
const AdminRouteBase = ({ component: Comp, authUser, path, ...rest }) => {
  return (
    <Route
      path={path}
      {...rest}
      render={props => {
        return authUser && (authUser.role==='SU' || authUser.role==='DSU') ? (
          <Comp {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
            }}
          />
        );
      }}
    />
  );
};
const AdminRoute = withAuthUser(AdminRouteBase)
class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/signin" component={SignInPage} />
          <Route path="/signup" component={SignUpPage} />
          <Route path="/status" component={StatusPage} />
          <Route path='/passwordChange' component={PasswordChangePage} />
          <LoginRoute path={"/account"} component={AccountPage} />
          <AdminRoute path={"/admin"} component={AdminPage} />
          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <LoginRoute path="/group/:id" component={GroupPage} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

{/*}
class App extends Component {
  render() {
    return (
      <div className="App">
        <main style={{ marginTop: '64px' }}>
          <p>This is the page content!</p>
        </main>
      </div>
    );
  }
}
*/}
{/*
const App = () => (
  <Router>
    <div>
      <ToolBar />


      <Navigation />
      
      <
      <hr />
      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route path={ROUTES.REGISTER_STATUS} component={StatusPage} />
      <Route
        path={ROUTES.PASSWORD_FORGET}
        component={PasswordForgetPage}
      />
      <Route path={ROUTES.HOME} component={HomePage} />
      <Route path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route path={ROUTES.ADMIN} component={AdminPage} />

    </div>
  </Router>

);
      */}

export default withAuthentication(App);