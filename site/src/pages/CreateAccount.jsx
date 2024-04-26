import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import logo from "../images/login_camping_logo.png";
import "../styles/header.css";

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
            <header className="header">
                <div className="logo-general-image-div">
                    <img className="logo-general-image"
                         src={logo}
                         alt="Campfire logo and Let's Go Camping! message in bright green"
                         aria-label={"Campfire logo and Let's Go Camping! message in bright green"}
                    />
                </div>
                <div className="header-text-div">
                    <p className="header-text-p">Team 20</p>
                </div>
            </header>

            <div className="createAccount-form">
                <h2>Create Account</h2>
                {<p title="error" id="error" style={{color: "red"}}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor={"username"}>Username:</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            title={"Username Field"}
                            aria-label={"Enter username"}
                            alt={"Enter username"}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor={"password"}>Password:</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            title={"Password Field"}
                            aria-label={"Enter password"}
                            alt={"Enter password"}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor={"confirmPassword"}>Confirm Password:</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            title={"Confirm Password Field"}
                            aria-label={"Confirm password"}
                            alt={"Confirm password"}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button id="submission" type="submit" name={"submit"} role={"button"} title={"submitcreateaccount"} aria-label={"create account"}>Create Account</button>
                    <button id= "cancel" type="button" onClick={handleCancel} aria-label={"cancel"}>Cancel</button>
                </form>
            </div>
            {showCancelDiv && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <p>Are you sure you want to cancel your account creation?</p>
                        <div>
                            <button id="yes" onClick={handleYes} aria-label={"Yes, cancel account creation."}>Yes</button>
                            <button id="no" onClick={handleNo} aria-label={"No, do not cancel account creation."}>No</button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    )
}

export default CreateAccount;