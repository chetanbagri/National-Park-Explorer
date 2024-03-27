import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateAccount from './CreateAccount';
import {useNavigate} from "react-router-dom";


const mockNavigate = jest.fn();
// Mock navigate from react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('CreateAccount Component', () => {
    test('renders and displays form elements', () => {
        render(<CreateAccount />);

        expect(screen.getByLabelText(/Username:/i)).toBeInTheDocument();
        expect(screen.getByLabelText("Password:")).toBeInTheDocument();
        expect(screen.getByLabelText("Confirm Password:")).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
        expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
    });

    test('allows user to input and submit form', async () => {
        render(<CreateAccount />);

        fireEvent.change(screen.getByLabelText(/Username:/i), { target: { value: 'testUser' } });
        fireEvent.change(screen.getByLabelText("Password:"), { target: { value: 'Password123' } });
        fireEvent.change(screen.getByLabelText("Confirm Password:"), { target: { value: 'Password123' } });

        // Mock fetch response
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ username: 'testUser' }),
            })
        );

        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/register', expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: 'testUser', password: 'Password123', confirmPassword: "Password123" }),
            }));
        });
    });

    test('handles cancellation flow correctly', () => {
        render(<CreateAccount />);

        // Trigger the modal/dialog by clicking the Cancel button
        fireEvent.click(screen.getByText(/Cancel/i));
        expect(screen.getByText(/Are you sure you want to cancel your account creation?/i)).toBeInTheDocument();

        fireEvent.click(screen.getByText(/No/i));

        // The modal/dialog should no longer be visible
        expect(screen.queryByText(/Are you sure you want to cancel your account creation?/i)).toBeNull();
    });

    test('navigates to login on confirm cancellation', async () => {
        render(<CreateAccount />);

        // Trigger the modal/dialog by clicking the Cancel button
        fireEvent.click(screen.getByText(/Cancel/i));
        expect(screen.getByText(/Are you sure you want to cancel your account creation?/i)).toBeInTheDocument();

        // Simulate clicking "Yes" to confirm cancellation
        fireEvent.click(screen.getByText(/Yes/i));

        // Access the mocked useNavigate function
        const navigateMock = useNavigate();

        // Verify that navigate was called with '/login'
        expect(navigateMock).toHaveBeenCalledWith('/login');
    });

    test('displays error when fetch response is not ok', async () => {
        // Mock fetch to return a response with .ok being false
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                text: () => Promise.resolve('Error creating account'),
            })
        );

        render(<CreateAccount />);

        // Fill in the form and submit it
        fireEvent.change(screen.getByLabelText(/Username:/i), { target: { value: 'testUser' } });
        fireEvent.change(screen.getByLabelText("Password:"), { target: { value: 'Password123' } });
        fireEvent.change(screen.getByLabelText("Confirm Password:"), { target: { value: 'Password123' } });
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(screen.getByText(/Error: Error creating account/i)).toBeInTheDocument();
        });
    });

    test('displays error when fetch operation throws an exception', async () => {
        // Mock fetch to throw an error
        global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

        render(<CreateAccount />);

        // Fill in the form and submit it
        fireEvent.change(screen.getByLabelText(/Username:/i), { target: { value: 'testUser' } });
        fireEvent.change(screen.getByLabelText("Password:"), { target: { value: 'Password123' } });
        fireEvent.change(screen.getByLabelText("Confirm Password:"), { target: { value: 'Password123' } });
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(screen.getByText(/Network error/i)).toBeInTheDocument();
        });
    });

    afterEach(() => {
        if (global.fetch && jest.isMockFunction(global.fetch)) {
            global.fetch.mockClear();
        }
        delete global.fetch;
    });
});
