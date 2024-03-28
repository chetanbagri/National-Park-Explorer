import {render, screen} from "@testing-library/react";
import Login from "../pages/Login";
import {BrowserRouter} from "react-router-dom";
import React from "react";
import Header from "./Header";

test("Header Rendering", async () => {
    render(<Header />, { wrapper: BrowserRouter });

    expect(screen.getByText("Team 20")).toBeInTheDocument();
});