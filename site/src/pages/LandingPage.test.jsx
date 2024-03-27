import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LandingPage from './LandingPage';

// Mocking sessionStorage
const mockSessionStorage = (userInfo) => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
        if (key === 'userInfo') {
            return JSON.stringify(userInfo);
        }
    });
};

describe('LandingPage Component', () => {
    afterEach(() => {
        jest.restoreAllMocks(); // Restore original implementation after each test
    });

    it('renders user information from sessionStorage', () => {
        const userInfo = { username: 'testuser', email: 'testuser@example.com' };
        mockSessionStorage(userInfo);

        render(<LandingPage />);
        expect(screen.getByText(/welcome, testuser/i)).toBeInTheDocument();
    });

    it('handles invalid JSON in sessionStorage gracefully', () => {
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => 'invalid JSON');
        // You could also mock console.error to suppress error logs for this test if you want
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(<LandingPage />);
        // We expect no greeting or credentials to be rendered if the JSON is invalid
        expect(screen.queryByText(/welcome,/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/your email is:/i)).not.toBeInTheDocument();

        consoleSpy.mockRestore();
    });

    it('does not render user information when sessionStorage is empty', () => {
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);

        render(<LandingPage />);
        // We expect no greeting or credentials to be rendered if the sessionStorage is empty
        expect(screen.queryByText(/welcome,/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/your email is:/i)).not.toBeInTheDocument();
    });
});
