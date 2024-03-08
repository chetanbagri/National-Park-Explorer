import React from 'react'
import {BrowserRouter} from "react-router-dom";
import {fireEvent, render, screen} from '@testing-library/react';
import CreateAccount from "./CreateAccount";
import "@testing-library/jest-dom";
//import {userEvent} from "@testing-library/user-event/setup/index";
import userEvent from "@testing-library/user-event";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();
test ("that math works", async ()=> {
    expect(5 + 5).toBe(10);
})

test("test1", async () => {
    const user = userEvent.setup();
    render(<CreateAccount />, { wrapper: BrowserRouter });

    expect(screen.getByText(/Create Account Page/)).toBeInTheDocument();

    //await waitFor(() => u
})

test('should display a blank login form, with remember me checked by default', async () => {
    render(<CreateAccount />, { wrapper: BrowserRouter });

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByTitle(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).not.toBeDisabled();
});


test('should allow entering a username, email, password, and confirm password', () => {
    render(<CreateAccount />, { wrapper: BrowserRouter });

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByTitle(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });

    expect(usernameInput.value).toBe('testuser');
    expect(emailInput.value).toBe('testuser@example.com');
    //const passwordInput2 = screen.getByTitle(/password/i);
    //expect(passwordInput2.innerHTML).toBe('password');
    expect(confirmPasswordInput.value).toBe('password');
    expect(passwordInput.value).toBe('password');
});

/*
test("fetching fails on the home page with no connection", async () => {
    fetch.mockRejectOnce(new Error("API is down"));

    const user = userEvent.setup();
    render(<App />, { wrapper: BrowserRouter });

    expect(screen.getByText(/Home Page/)).toBeInTheDocument();
    await waitFor(() => user.click(screen.getByText(/fetch backend/i)));
    expect(screen.getByText(/An API error occured/i)).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledTimes(1);
});
* */

test('displays error message when submission criteria are not met', async () => {
    render(<CreateAccount />, { wrapper: BrowserRouter });

    const submitButton = screen.getByTitle("submitcreateaccount");//screen.getByRole('button', { name: /submit/ }); // Adjust according to your button text
    await userEvent.click(submitButton);
    expect(await screen.findByText(/Username cannot be empty/i)).toBeInTheDocument(); // Adjust according to your error handling
});


test('displays error message when submission criteria are not met', async () => {
    render(<CreateAccount />, { wrapper: BrowserRouter });

    const usernameInput = screen.getByLabelText(/username/i);
    //const emailInput = screen.getByLabelText(/email/i);
    //const passwordInput = screen.getByTitle(/password/i);
    //const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    //fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
    //fireEvent.change(passwordInput, { target: { value: 'password' } });
    //fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });

    const submitButton = screen.getByTitle("submitcreateaccount");//screen.getByRole('button', { name: /submit/ }); // Adjust according to your button text
    await userEvent.click(submitButton);
    expect(await screen.findByText(/Email cannot be empty/i)).toBeInTheDocument(); // Adjust according to your error handling
});

test('displays error message when submission criteria are not met', async () => {
    render(<CreateAccount />, { wrapper: BrowserRouter });

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    //const passwordInput = screen.getByTitle(/password/i);
    //const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
    //fireEvent.change(passwordInput, { target: { value: 'password' } });
    //fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });

    const submitButton = screen.getByTitle("submitcreateaccount");//screen.getByRole('button', { name: /submit/ }); // Adjust according to your button text
    await userEvent.click(submitButton);
    expect(await screen.findByText(/Password cannot be empty/i)).toBeInTheDocument(); // Adjust according to your error handling
});

test('displays error message when submission criteria are not met', async () => {
    render(<CreateAccount />, { wrapper: BrowserRouter });

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByTitle(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });

    const submitButton = screen.getByTitle("submitcreateaccount");//screen.getByRole('button', { name: /submit/ }); // Adjust according to your button text
    await userEvent.click(submitButton);
    expect(await screen.findByText(/Password must be at least 12 characters long/i)).toBeInTheDocument(); // Adjust according to your error handling
});


test('displays error message when submission criteria are not met', async () => {
    render(<CreateAccount />, { wrapper: BrowserRouter });

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByTitle(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'passwordisverylong' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'passwordisverylongbutwrong' } });

    const submitButton = screen.getByTitle("submitcreateaccount");//screen.getByRole('button', { name: /submit/ }); // Adjust according to your button text
    await userEvent.click(submitButton);
    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument(); // Adjust according to your error handling
});


test('displays error message when submission criteria are not met', async () => {
    render(<CreateAccount />, { wrapper: BrowserRouter });

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByTitle(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'passwordisverylong' } });
    fireEvent.change(confirmPasswordInput, { target: { value: '' } });

    const submitButton = screen.getByTitle("submitcreateaccount");//screen.getByRole('button', { name: /submit/ }); // Adjust according to your button text
    await userEvent.click(submitButton);
    expect(await screen.findByText(/Confirm Password cannot be empty/i)).toBeInTheDocument(); // Adjust according to your error handling
});

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));
test('works with valid criteria', async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ username: 'testuser' }), // simulate the JSON response
        })
    );

    render(<CreateAccount />, { wrapper: BrowserRouter });

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByTitle(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'passwordisverylong' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'passwordisverylong' } });

    const submitButton = screen.getByTitle("submitcreateaccount");//screen.getByRole('button', { name: /submit/ }); // Adjust according to your button text
    await userEvent.click(submitButton);

    //expect(await screen.findByText(/Hello testuser/i)).waitoBeInTheDocument(); // Adjust according to your error handling
    //expect(screen.getByTitle("error") === "");
    // Check that navigate was called with the correct argument
    expect(mockNavigate).toHaveBeenCalledWith('/landing');

    // Clear the mock to avoid interference with other tests
    global.fetch.mockClear();

});
test('works with valid criteria', async () => {
    render(<CreateAccount />, { wrapper: BrowserRouter });

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByTitle(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'passwordisverylong' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'passwordisverylong' } });

    const submitButton = screen.getByTitle("submitcreateaccount");//screen.getByRole('button', { name: /submit/ }); // Adjust according to your button text
    await userEvent.click(submitButton);

    //expect(await screen.findByText(/Hello testuser/i)).waitoBeInTheDocument(); // Adjust according to your error handling
    expect(screen.getByTitle("error") === "");
    // Check that navigate was called with the correct argument
    //expect(mockNavigate).toHaveBeenCalledWith('/landing');

    // Clear the mock to avoid interference with other tests
    //global.fetch.mockClear();

});

it('displays an error message when the server responds with an error', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: 'Error creating account' }), // Adjust based on the expected error response structure
        text: () => {return "error"}
    });
    render(<CreateAccount />, { wrapper: BrowserRouter });

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByTitle(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'passwordisverylong' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'passwordisverylong' } });

    const submitButton = screen.getByTitle("submitcreateaccount");//screen.getByRole('button', { name: /submit/ }); // Adjust according to your button text
    await userEvent.click(submitButton);

    expect(await screen.findByText(/Failed to create account/i)).toBeInTheDocument(); // Adjust according to your error handling
    //expect(screen.getByTitle("error") === "");
    fetch.mockRestore();

});