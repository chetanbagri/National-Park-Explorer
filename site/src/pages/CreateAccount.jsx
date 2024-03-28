import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CreateAccount = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showCancelDiv, setCancelDiv] = useState(false);
    const navigate = useNavigate();

    const handleCancel = () => {
        setCancelDiv(true);
    };

    const handleNo = () => {
        setCancelDiv(false); // Hide the modal
    };

    const handleYes = () => {
        navigate('/login'); // Redirect to login page
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // if (!username){
        //     setError("Username cannot be empty");
        //     return;
        // }
        // if (!password){
        //     setError("Password cannot be empty");
        //     return;
        // }
        // if (!confirmPassword){
        //     setError("Confirm Password cannot be empty");
        //     return;
        // }
        // if (password !== confirmPassword) {
        //     setError("Passwords do not match");
        //     return;
        // }
        setError("");


        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password, confirmPassword})
            })

            if (!response.ok) {
                const errorText = await response.text();
                setError(`Error: ${errorText}`);
                return;
            }

            navigate('/login');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <Header />
            <div className="createAccount-form">
                <h2>Create Account</h2>
                {<p title="error" id="error" style={{ color: "red" }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor={"username"}>Username:</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor={"password"}>Password:</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            title={"password"}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor={"confirmPassword"}>Confirm Password:</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button id="submission" type="submit" name={"submit"} role={"button"} title={"submitcreateaccount"}>Create Account</button>
                    <button id= "cancel" type="button" onClick={handleCancel}>Cancel</button>
                </form>
            </div>
            {showCancelDiv && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <p>Are you sure you want to cancel your account creation?</p>
                        <div>
                            <button id="yes" onClick={handleYes}>Yes</button>
                            <button id="no" onClick={handleNo}>No</button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    )
}

export default CreateAccount;