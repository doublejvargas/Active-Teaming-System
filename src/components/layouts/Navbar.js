import React from "react";
import { AuthUserContext } from "../Session";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
{
  /* when we have logo as svg file,
    do import logo from '../logo.svg';  */
}
//import { Link } from 'react-router-dom';

const Navbar = () => (
  <div>
    <nav className="navbar navbar-expand-lg navbar-light bg-dark">
      <a className="navbar-brand" href="#">
        Teaming System(Logo)
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span>
          <i className="fas fa-bars" style={{ color: "#fff" }} />
        </span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <AuthUserContext.Consumer>
          {(authUser) =>
            authUser ? <NavigationAuth /> : <NavigationNonAuth />
          }
        </AuthUserContext.Consumer>
      </div>
    </nav>
  </div>
);
function NavigationNonAuth() {
  return (
    <ul className="navbar-nav m-auto">
      <li className="nav-item active">
        <Link
          className="nav-link text-white text-uppercase ml-5"
          to={ROUTES.LANDING}
        >
          Landing
          <i class="fa fa-home" />
          <span class="sr-only">(current)</span>
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link text-white text-uppercase ml-5"
          to={ROUTES.SIGN_IN}
        >
          Sign In
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link text-white text-uppercase ml-5"
          to={ROUTES.SIGN_UP}
        >
          Sign Up
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link text-white text-uppercase ml-5"
          to={ROUTES.REGISTER_STATUS}
        >
          Registration Status
        </Link>
      </li>
    </ul>
  );
}

function NavigationAuth() {
  return (
    <ul className="navbar-nav m-auto">
      <li className="nav-item active">
        <Link
          className="nav-link text-white text-uppercase ml-5"
          to={ROUTES.LANDING}
        >
          Landing
          <i class="fa fa-home" />
          <span class="sr-only">(current)</span>
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link text-white text-uppercase ml-5"
          to={ROUTES.ACCOUNT}
        >
          Account
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link text-white text-uppercase ml-5"
          to={ROUTES.ADMIN}
        >
          Admin
        </Link>
      </li>
    </ul>
  );
}
{
  /*
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Dropdown
        </a>
                        <div className="dropdown-menu text-black" aria-labelledby="navbarDropdown">
                            <a className="dropdown-item" href="#">Action</a>
                            <a className="dropdown-item" href="#">Another action</a>
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" href="#">Something else here</a>
                        </div>
                    </li>

                    <li className="nav-item">
                        <a className="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
                    </li>

                </ul>
                <form className="form-inline my-2 my-lg-0">
                    <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                    <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">Search</button>
                </form> */
}

export default Navbar;
