import React, { Component } from 'react';
import styled from 'styled-components';

function Footer() {
    return (
        <FooterContainer className="main-footer" >
            <div className="footer-middle">
                <div className="container">
                    <div className="row">
                        {/* Column 1 */}
                        <div className="col-md-3 col-sm-6">
                            <h4>Lorem ipsum</h4>
                            <ul className="list-unstyled">
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
                            </ul>
                        </div>
                        {/* Column 3 */}
                        <div className="col-md-3 col-sm-6">
                            <h4>Lorem ipsum</h4>
                            <ul className="list-unstyled">
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
        </FooterContainer>
    );
}

export default Footer;


const FooterContainer = styled.footer`

    .main-footer{
        position:absolute;
        left:0;
        bottom:0;
        right:0;
    }

    .footer-middle{
        position:absolute;
        bottom: 0;
        width: 100%;
        height: 10rem;            /* Footer height */
        background: #343a40;
        padding-top: 2rem;
        color: #fff;
        text-align:right;
        padding-left:8rem;


    }

    .footer-bottom {
        padding-bottom: 2rem;
        position: absolute;
        bottom: 0;
        height: 2rem;
        text-align:center;

    }

    ul li a {
        color: rgba(109,109,109);
    }

    ul li a:hover {
        color: rgba(172,172,172);
    }

`;

