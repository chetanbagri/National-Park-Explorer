import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import Login from "../pages/Login";
import {BrowserRouter} from "react-router-dom";
import React from "react";
import Header from "./Header";
import SearchParks from "../pages/SearchParks";
import userEvent from "@testing-library/user-event";

test("Header Rendering", async () => {
    render(<Header />, { wrapper: BrowserRouter });

    expect(screen.getByText("Team 20")).toBeInTheDocument();
});

test("Logout", async () => {
    const userE = userEvent.setup();
    const createdUser = {
        username: "NickoOG"
    };
    sessionStorage.setItem('userInfo', JSON.stringify(createdUser));

    render(<Header />, { wrapper: BrowserRouter });

    await waitFor(() => userE.click(screen.getByText(/Logout/i)));
    expect(screen.getByText(/Team 20/i)).toBeInTheDocument();
});