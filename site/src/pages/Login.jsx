import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from '../images/login_camping_logo.png';
import Footer from '../components/Footer.jsx'
import '../styles/login.css'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const [ fetchResponse, handleFetchResponse ] = useState();

    const handleLogin = () => {
        //add actual functionality
        setMessage('Logging in...');

        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                param0: document.getElementById("username").value,
                param1: document.getElementById("password").value
            })
        })
        .then((response) => response.json())
        .then((response) => {
            if(response?.data){
                handleFetchResponse(response.data);
                // if(fetchResponse != null && fetchResponse === "Login Unsuccessful, one more attempt to log in allowed"){
                //     navigate("/AccountBlockedPage");
                // }
            }
        });
    };

    return (
        <div className="login-page">
            <div className="login-header">
                <p className="login-header-p">Team 20</p>
            </div>
            <div className="logo-image-div">
                <img className="logo-image"
                     src={logo}
                     alt="Campfire logo and Let's Go Camping! message in bright green"/>
            </div>
            <div className="login-form">
                <h2>Login</h2>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        data-testid="test-username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        data-testid="test-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button id="loginBtn" data-testid="test-loginBtn" title={"submit"} onClick={handleLogin}>Login</button>
                <div id="response" title={"response"}>{fetchResponse}</div>
                {/*<div id="response">{message}</div>*/}
            </div>
            <Footer />
        </div>
    );
}

export default Login;
