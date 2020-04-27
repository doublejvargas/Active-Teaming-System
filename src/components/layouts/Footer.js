import React, { Component } from 'react';
import styled from 'styled-components';

function Footer() {
    return (
        <FooterContainer className="main-footer">
            <div className="footer-middle">
                <div className="container">
                    <div className="row">
                        {/* Column 1 */}
                        <div className="col-md-3 col-sm-6">
                            <h4>Lorem ipsum</h4>
                            <ul className="list-unstyled">
                                <li>helorem</li>
                                <li>helorem</li>
                                <li>helorem</li>
                                <li>helorem</li>
                            </ul>
                        </div>
                        {/* Column 2 */}
                        <div className="col-md-3 col-sm-6">
                            <h4>Lorem ipsum</h4>
                            <ul className="list-unstyled">
                                <li><a href="/">this </a></li>
                                <li><a href="/">will be</a></li>
                                <li><a href="/">our </a></li>
                                <li><a href="/">contact info</a></li>
                            </ul>
                        </div>
                        {/* Column 3 */}
                        <div className="col-md-3 col-sm-6">
                            <h4>Lorem ipsum</h4>
                            <ul className="list-unstyled">
                                <li><a href="/">helorem</a></li>
                                <li><a href="/">helorem</a></li>
                                <li><a href="/">helorem</a></li>
                                <li><a href="/">helorem</a></li>
                            </ul>
                        </div>
                    </div>
                    {/* Footer Bottom */}
                    <div className="footer-bottom">
                        <p className="text-xs-center">
                            &copy;{new Date().getFullYear()} Teaming System by Team E - All Rights Reserved
                 </p>
                    </div>
                </div>
            </div>
        </FooterContainer >
    );
}

export default Footer;


const FooterContainer = styled.footer`
    .footer-middle{
        background: #343a40;
        padding-top: 3rem;
        color: #fff;
    }

    .footer-bottom {
        padding-top: 3rem;
        padding-bottom: 2rem;
    }

    ul li a {
        color: rgba(109,109,109);
    }

    ul li a:hover {
        color: rgba(172,172,172);
    }

`;

