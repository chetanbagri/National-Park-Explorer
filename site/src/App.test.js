import React from "react";
import {render, screen, waitFor, fireEvent, getByLabelText} from "@testing-library/react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Login from "./pages/Login";
import Home from "./pages/Home";

afterEach(() => {
    window.history.pushState(null, document.title, "/");
});

beforeEach(() => {
    fetch.resetMocks();
});

// test("full login rendering", async () => {
//     const user = userEvent.setup();
//     render(<Login />, { wrapper: BrowserRouter });
//
//     // verify page content for default route
//     // expect(screen.getByText(/Login/)).toBeInTheDocument(); // Multiple elements with Login so don't use
//     expect(screen.getByText(/Username/)).toBeInTheDocument();
//     expect(screen.getByText(/Password/)).toBeInTheDocument();
//     expect(screen.getByTestId('test-loginBtn')).toBeInTheDocument();
// });

test("App.js file coverage", async () => {
    const user = userEvent.setup();
    render(<App />, { wrapper: BrowserRouter }); // Triggers App.js coverage but defaults to Home.jsx

    // verify page content for default route
    // expect(screen.getByTestId("test-login")).toBeInTheDocument();
    // expect(screen.getByText(/CreateAccount/i)).toBeInTheDocument();
    expect(screen.getByText("Username:")).toBeInTheDocument();

});

test("Home.jsx render and navigation", async () => {
    render(<Home />, { wrapper: BrowserRouter }); // Triggers App.js coverage but defaults to Home.jsx

    // verify page content for default route

    expect(screen.getByText(/Login/)).toBeInTheDocument();
    expect(screen.getByText(/Create Account/)).toBeInTheDocument();
    expect(screen.getByText(/Explore the National Parks of the U.S./)).toBeInTheDocument();


    fireEvent.click(screen.getByTestId('test-loginBtn'));

    expect(window.location.href).toBe("http://localhost/login");
});
