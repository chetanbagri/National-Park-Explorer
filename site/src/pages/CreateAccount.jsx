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

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
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

            alert("Successful Account Creation");
            navigate('/landing', { state: { user: createdUser } });
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
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Account</button>
                <button type="button" onClick={() => navigate('/login')}>Login?</button>
            </form>
        </div>
    );
};

export default CreateAccount;