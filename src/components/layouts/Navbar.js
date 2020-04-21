import React from 'react';
{/* when we have logo as svg file,
    do import logo from '../logo.svg';  */}
//import { Link } from 'react-router-dom';


function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-dark">
            <a className="navbar-brand" href="#">Teaming System(Logo)</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span>
                    <i className="fas fa-bars" style={{ color: '#fff' }} />
                </span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav m-auto">
                    <li className="nav-item active">
                        <a className="nav-link text-white text-uppercase ml-5" href="/home">Home&nbsp;<i class="fa fa-home" />
                            <span class="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-white text-uppercase ml-5" href="/signin">Sign In</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-white text-uppercase ml-5" href="/signup">Sign Up</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-white text-uppercase ml-5" href="/status">Registration Status</a>
                    </li>
                </ul>
            </div>

        </nav>

    );
}
{/*
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
                </form> */}




export default Navbar;