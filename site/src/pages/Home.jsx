import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import Header from '../components/Header.jsx'

function Home() {

    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/login");
    };


    return (
        <div>
            {/*<Header />*/}

            <div className="bodycss">
                <div className="btns">
                    <div>
                        <button data-testid="test-loginBtn" className="login-button" onClick={handleLoginClick} title={"login-button"}
                        aria-label={"Login"}>
                            Login
                        </button>
                        <Link to="/create-account" className="create-acct">
                            Create Account Page
                        </Link>
                    </div>
                </div>
                <div className="landscape-image">
                    <img src="https://cdn.glitch.me/b29dd3df-e938-4d03-84fc-259d988ad64d/landscape.png?v=1709606071707"
                         alt="Landscape"
                         className="landscape-imagee"
                         aria-label={"Landscape"}
                    />
                    <div className="center">
                        Explore the National Parks of the U.S.
                    </div>

                </div>


                <div className="box">
                    <div className="list">

                        <ul>


                            <li>Search for a Park</li>
                            <li>Create a list of your Favorites</li>
                            <li>Compare your Favorites with your Friends & Make Suggestions</li>
                            {/*<li>Suggest Parks to Each Other </li>*/}
                        </ul>


                    </div>
                </div>


            </div>
        </div>

    );
}

export default Home;