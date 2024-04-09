import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import logo from '../images/login_camping_logo.png';
import '../styles/header.css'

function Header() {
    const navigate = useNavigate();

    useEffect(() => {
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        if(userInfo == null){
            navigate('/login');
        }
    }, []);
    // Included empty dependency array so effect only runs once when mounted/loaded

    const handleLogOut = async (e) => {
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        const username = userInfo.username; // Username of currently logged in user
        sessionStorage.removeItem('userInfo');
        navigate('/login');
    }

    return (
        <header className="header">
            <div className="logo-general-image-div">
                <img className="logo-general-image"
                     src={logo}
                     alt="Campfire logo and Let's Go Camping! message in bright green"/>
                <a href={"search"} className={"nav-link"}>Search</a>
                <a href={"#"} className={"nav-link"}>Favorites</a>
                <a href={"compare"} className={"nav-link"}>Compare</a>
                <a href={""} onClick={handleLogOut} className={"nav-link"}>Logout</a>
            </div>
            <div className="header-text-div">
            <p className="header-text-p">Team 20</p>
            </div>
        </header>
    );
}

export default Header;