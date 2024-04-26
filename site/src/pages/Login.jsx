import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../images/login_camping_logo.png';
import Footer from '../components/Footer.jsx'
import '../styles/login.css'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        //add actual functionality
        e.preventDefault();
        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({username, password})
            })
            if(response.ok) {
                const createdUser = await response.json();
                console.log(`LOGIN USER: ${JSON.stringify(createdUser)}`);
                sessionStorage.setItem('userInfo', JSON.stringify(createdUser));
                navigate('/search');
            }
            else {
                const errorText = await response.text();
                setError(`Error: ${errorText}`)
            }
        }
        catch(error){
            setError(error.message);
        }


    };

    return (


        <div className="login-page">
            <div className="login-header">
                <p className="login-header-p">Team 20</p>
            </div>
            <div className="logo-image-div">
                <img className="logo-image"
                     src={logo}
                     alt="Campfire logo and Let's Go Camping! message in bright green"
                     aria-label="Campfire logo and Let's Go Camping! message in bright green"
                />
            </div>
            <div className="login-form">
                <h2>Login</h2>
                {<p title="error" id="error" style={{color: "red"}}>{error}</p>}
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        data-testid="test-username"
                        value={username}
                        title={"Username Field"}
                        aria-label={"Enter username"}
                        alt={"Enter username"}
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
                        title={"Password Field"}
                        aria-label={"Enter password"}
                        alt={"Enter password"}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <button aria-label={"login"} id="loginBtn" data-testid="test-loginBtn" title={"submit"} onClick={handleLogin}>Login
                    </button>
                </div>
                <div>
                    <a id="create-account" href="/create-account" title={"Go to Create Account"}>Create Account</a>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Login;
