import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from '../Navigation';
import * as ROUTES from '../../constants/routes';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import StatusPage from '../RegisterStatus';
import { withAuthentication } from '../Session';
import ToolBar from '../ToolBar/ToolBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';
import { Switch } from 'react-router-dom';
// import pages
import Home from '../Home/';

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
          <Route path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route path={ROUTES.ADMIN} component={AdminPage} />
          <Route exact path={ROUTES.LANDING} component={LandingPage} />

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