import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
                sessionStorage.setItem('userInfo', JSON.stringify(createdUser));
                navigate('/landing');
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

            <div className="login-form">
                <h2>Login</h2>
                {<p title="error" id="error" style={{ color: "red" }}>{error}</p>}
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
                <div>
                    <button id="loginBtn" data-testid="test-loginBtn" title={"submit"} onClick={handleLogin}>Login</button>
                </div>
                <div>
                    <a href="/create-account">Create Account</a>
                </div>
            </div>
        </div>
    );
}

export default Login;
