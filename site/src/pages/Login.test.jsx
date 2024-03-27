import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';
import CreateAccount from "./CreateAccount";

// Mock navigate from react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn()
}));

describe('Login Component', () => {
    test('renders login form and input fields', () => {
        render(<Login />);

        expect(screen.getByLabelText(/Username:/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password:/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    test('allows user to input and successfully login', async () => {
        render(<Login />);

        fireEvent.change(screen.getByLabelText(/Username:/i), { target: { value: 'testUser' } });
        fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'correctPassword123' } });

        // Mock fetch response for successful login
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
            })
        );

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        // Wait for async operations like fetch to settle
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/login', expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: 'testUser', password: 'correctPassword123' }),
            }));
        });
    });

    test('handles login with invalid credentials', async () => {
        render(<Login />);

        fireEvent.change(screen.getByLabelText(/Username:/i), { target: { value: 'testUser' } });
        fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'wrongPassword' } });

        // Mock fetch response for failed login
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                text: () => Promise.resolve('Invalid credentials'),
            })
        );

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        // Wait for the error message to appear
        const errorMessage = await screen.findByText(/Login failed: Invalid credentials/i);
        expect(errorMessage).toBeInTheDocument();
    });

    test('displays error when fetch operation throws an exception', async () => {
        // Mock fetch to throw an error
        global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

        render(<Login />);

        // Fill in the form and submit it
        fireEvent.change(screen.getByLabelText(/Username:/i), { target: { value: 'testUser' } });
        fireEvent.change(screen.getByLabelText("Password:"), { target: { value: 'Password123' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

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
