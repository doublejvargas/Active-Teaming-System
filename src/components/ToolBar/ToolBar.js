import React from 'react';

import './ToolBar.css';

const toolbar = props => (
    <header className="toolbar">
        <nav className="toolbar_navigation">
            <div></div>
            <div><a href="/">The Logo</a></div>
            <div className="toolbar_navigation-items">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/">Sign In</a></li>
                    <li><a href="/">Sign UP</a></li>
                    <li><a href="/">Registeration Status</a></li>
                </ul>
            </div>
        </nav>
    </header>
);


export default toolbar;