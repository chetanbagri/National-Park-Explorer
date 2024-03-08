import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CreateAccount from "./pages/CreateAccount";


function App() {
    return (
        <div>
            <Routes>
                <Route path="/create-account" element={<CreateAccount />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="*" element={<Navigate to="/create-account" replace />} />
            </Routes>
        </div>
    );
}

export default App;