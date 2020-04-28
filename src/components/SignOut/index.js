import React from "react";
import { withFirebase } from "../Firebase";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

const SignOut = ({ firebase }) => (
  <li className="nav-item">
    <Link
      className="nav-link text-white text-uppercase ml-5"
      to={ROUTES.LANDING}
      onClick={() => firebase.signOut()}
    >
      Sign out
    </Link>
  </li>
);
export default withFirebase(SignOut);
