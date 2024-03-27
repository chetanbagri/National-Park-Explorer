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

test("Submit invalid login form and get fecthed response", async () => {
    fetch.mockResponseOnce(JSON.stringify({ data: "Login Unsuccessful" }));

    const user = userEvent.setup();
    render(<Login />, { wrapper: BrowserRouter });

    // verify page content for default route

    expect(screen.getByText(/Username/)).toBeInTheDocument();
    expect(screen.getByText(/Password/)).toBeInTheDocument();
    expect(screen.getByTestId('test-loginBtn')).toBeInTheDocument();

    // fill out login form
    fireEvent.change(screen.getByTestId('test-username'), {target: {value: 'Nick'}});
    fireEvent.change(screen.getByTestId('test-password'), {target: {value: 'mypassword'}});

    fireEvent.click(screen.getByTestId('test-loginBtn'));

    expect(fetch).toHaveBeenCalledTimes(1);
});

test("Test default null fetched response (inputs don't matter)", async () => {
    fetch.mockResponseOnce(JSON.stringify({ }));

    const user = userEvent.setup();
    render(<Login />, { wrapper: BrowserRouter });

    // verify page content for default route

    expect(screen.getByText(/Username/)).toBeInTheDocument();
    expect(screen.getByText(/Password/)).toBeInTheDocument();
    expect(screen.getByTestId('test-loginBtn')).toBeInTheDocument();

    // fill out login form
    fireEvent.change(screen.getByTestId('test-username'), {target: {value: 'Nick'}});
    fireEvent.change(screen.getByTestId('test-password'), {target: {value: 'mypassword'}});

    fireEvent.click(screen.getByTestId('test-loginBtn'));

    expect(fetch).toHaveBeenCalledTimes(1);
});


// test("Test default null fetched response", async () => {
//     fetch.mockResponseOnce("");
//
//     const user = userEvent.setup();
//     render(<Login />, { wrapper: BrowserRouter });
//
//     // verify page content for default route
//
//     expect(screen.getByText(/Username/)).toBeInTheDocument();
//     expect(screen.getByText(/Password/)).toBeInTheDocument();
//     expect(screen.getByTestId('test-loginBtn')).toBeInTheDocument();
//
//     // fill out login form
//     fireEvent.change(screen.getByTestId('test-username'), {target: {value: 'Nick'}});
//     fireEvent.change(screen.getByTestId('test-password'), {target: {value: 'mypassword'}});
//
//     fireEvent.click(screen.getByTestId('test-loginBtn'));
//
//     expect(fetch).toHaveBeenCalledTimes(1);
// });

test("test App.js file + Home.jsx", async () => {
    const user = userEvent.setup();
    render(<App />, { wrapper: BrowserRouter }); // Triggers App.js coverage but defaults to Home.jsx

    // verify page content for default route

    expect(screen.getByText(/Create Account Page/)).toBeInTheDocument();
});

test("test Home.jsx render and navigation", async () => {
    const user = userEvent.setup();
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