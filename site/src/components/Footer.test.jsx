import {render, screen} from "@testing-library/react";
import Login from "../pages/Login";
import {BrowserRouter} from "react-router-dom";
import React from "react";
import Footer from "./Footer";

test("Footer Rendering", async () => {
    render(<Footer />, { wrapper: BrowserRouter });

    expect(screen.getByText("Team 20")).toBeInTheDocument();
});