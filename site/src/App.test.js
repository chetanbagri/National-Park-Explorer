import React from 'react'
import {BrowserRouter} from "react-router-dom";
import {fireEvent, render, screen} from '@testing-library/react';
import "@testing-library/jest-dom";
//import {userEvent} from "@testing-library/user-event/setup/index";
import userEvent from "@testing-library/user-event";
import fetchMock from "jest-fetch-mock";
import App from "./App";

test("test App.js file + Home.jsx", async () => {
    const user = userEvent.setup();
    render(<App />, { wrapper: BrowserRouter }); // Triggers App.js coverage but defaults to Home.jsx

    // verify page content for default route

    expect(screen.getByText(/Create Account Page/)).toBeInTheDocument();
});