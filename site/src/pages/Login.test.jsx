import {render, screen} from "@testing-library/react";
import Login from "./Login";
import {BrowserRouter} from "react-router-dom";
import React from "react";

test("full login rendering", async () => {
    render(<Login />, { wrapper: BrowserRouter });

    // verify page content for default route
    // expect(screen.getByText(/Login/)).toBeInTheDocument(); // Multiple elements with Login so don't use
    expect(screen.getByText(/Username/)).toBeInTheDocument();
    expect(screen.getByText(/Password/)).toBeInTheDocument();
    expect(screen.getByTestId('test-loginBtn')).toBeInTheDocument();
});