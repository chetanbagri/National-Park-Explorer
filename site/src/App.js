import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
// import CreateAccount from "./pages/CreateAccount";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} /> {}
                <Route path="/login" element={<Login />} /> {}
                {/*<Route path="/create-account" element={<CreateAccount />} /> {}*/}

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}

export default App;
