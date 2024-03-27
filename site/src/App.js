import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import LandingPage from "./pages/LandingPage";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/create-account" element={<CreateAccount />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} /> {}
                <Route path="/home" element={<Home />} /> {}
            </Routes>
        </div>
    );
}

export default App