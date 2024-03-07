import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username){
            setError("Username cannot be empty");
            return;
        }
        if (!email){
            setError("Email cannot be empty");
            return;
        }
        if (!password){
            setError("Password cannot be empty");
            return;
        }
        if (!confirmPassword){
            setError("Confirm Password cannot be empty");
            return;
        }
        if (password.length<12){
            setError("Password must be at least 12 characters long");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setError("");

        const userData = {
            username: username,
            email: email,
            password: password
        };

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                setError(`Failed to create account: ${errorText}`);
                return;
            }

            // Assuming the backend responds with the created user data
            const createdUser = await response.json();
            sessionStorage.setItem('userInfo', JSON.stringify(createdUser));

            //alert("Successful Account Creation");
            //setError("Successful Account Creation");
            navigate('/landing');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h2>Create Account</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button id="submission" type="submit">Create Account</button>
            </form>
        </div>
    );
};

export default CreateAccount;