import React from "react";

import logo from '../images/login_camping_logo.png';
import '../styles/header.css'

function Header() {
    return (
        <header className="header">
            <div className="logo-general-image-div">
                <img className="logo-general-image"
                     src={logo}
                     alt="Campfire logo and Let's Go Camping! message in bright green"/>
                <a href={"search"} className={"nav-link"}>Search</a>
                <a href={"compare"} className={"nav-link"}>Compare</a>
            </div>
            <div className="header-text-div">
                <p className="header-text-p">Team 20</p>
            </div>
        </header>
    );
}

export default Header;