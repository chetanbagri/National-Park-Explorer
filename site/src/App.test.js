import React from "react";
import {render, screen, fireEvent} from "@testing-library/react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";

afterEach(() => {
    window.history.pushState(null, document.title, "/");
});

beforeEach(() => {
    fetch.resetMocks();
});

test("App.js file coverage", async () => {
    render(<App />, { wrapper: BrowserRouter }); // Triggers App.js coverage but defaults to Home.jsx

    // verify page content for default route
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