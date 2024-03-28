import {fireEvent, render, screen} from "@testing-library/react";
import Home from "./Home";
import {BrowserRouter} from "react-router-dom";
import React from "react";

test("test Home.jsx render and navigation", async () => {
    render(<Home />, { wrapper: BrowserRouter }); // Triggers App.js coverage but defaults to Home.jsx

    // verify page content for default route

    expect(screen.getByText(/Login/)).toBeInTheDocument();
    expect(screen.getByText(/Create Account Page/)).toBeInTheDocument();
    expect(screen.getByText(/Explore the National Parks of the U.S./)).toBeInTheDocument();

    // await waitFor(() => user.click(screen.getByTestId('test-loginBtn')));
    fireEvent.click(screen.getByTestId('test-loginBtn'));
    // await waitFor(() => expect(screen.getByText(/Username/)).toBeInTheDocument());
    // expect(screen.getByText(/Password/)).toBeInTheDocument();
    // expect(screen.getByTestId('test-loginBtn')).toBeInTheDocument();
    expect(window.location.href).toBe("http://localhost/login");
});