import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Favorites from './Favorites';
import {BrowserRouter} from "react-router-dom";
import Compare from "./Compare";
import fetchMock from "jest-fetch-mock";
import SearchParks from "./SearchParks";

fetchMock.enableMocks();

// Idk why but these 2 functions mess up the render test
// jest.mock('react-router-dom', () => ({
//     useNavigate: jest.fn(),
// }));

// global.sessionStorage = {
//     getItem: jest.fn(),
// };

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
};

describe('Favorites', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('renders Search Parks component correctly', () => {
        const { getByText } = renderWithRouter(<Favorites />);
        expect(getByText('My Favorite Parks')).toBeInTheDocument();
    });

    // test('fetches user favorites and park details on component mount', async () => {
    //     global.sessionStorage.getItem.mockReturnValue(JSON.stringify({ username: 'testuser' }));
    //     const fetchUserFavoritesMock = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    //         ok: true,
    //         json: () => Promise.resolve({ favorites: ['parkCode1', 'parkCode2'] }),
    //     });
    //     const fetchParkDetailsMock = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    //         ok: true,
    //         json: () => Promise.resolve({ data: [{ fullName: 'Park 1' }] }),
    //     });
    //
    //     render(<Favorites />);
    //
    //     await waitFor(() => expect(fetchUserFavoritesMock).toHaveBeenCalled());
    //     await waitFor(() => expect(fetchParkDetailsMock).toHaveBeenCalledTimes(2));
    //
    //     const parkNameElement = await screen.findByText(/Park 1/i);
    //     expect(parkNameElement).toBeInTheDocument();
    // });

    // test('handles clearing all favorites', async () => {
    //     global.sessionStorage.getItem.mockReturnValue(JSON.stringify({ username: 'testuser' }));
    //     const fetchUserFavoritesMock = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    //         ok: true,
    //         json: () => Promise.resolve({ favorites: ['parkCode1', 'parkCode2'] }),
    //     });
    //     const deleteFavoritesMock = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    //         ok: true,
    //     });
    //
    //     render(<Favorites />);
    //
    //     await waitFor(() => expect(fetchUserFavoritesMock).toHaveBeenCalled());
    //
    //     const deleteAllButton = screen.getByRole('button', { name: /Delete All/i });
    //     fireEvent.click(deleteAllButton);
    //
    //     const confirmButton = await screen.findByRole('button', { name: /Confirm/i });
    //     fireEvent.click(confirmButton);
    //
    //     await waitFor(() => expect(deleteFavoritesMock).toHaveBeenCalled());
    //
    //     const favoritesListElement = screen.queryByRole('list');
    //     expect(favoritesListElement?.children.length).toBe(0);
    // });
    //
    // test('handles removing a single favorite', async () => {
    //     global.sessionStorage.getItem.mockReturnValue(JSON.stringify({ username: 'testuser' }));
    //     const fetchUserFavoritesMock = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    //         ok: true,
    //         json: () => Promise.resolve({ favorites: ['parkCode1', 'parkCode2'] }),
    //     });
    //     const fetchParkDetailsMock = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    //         ok: true,
    //         json: () => Promise.resolve({ data: [{ fullName: 'Park 1', parkCode: 'parkCode1' }] }),
    //     });
    //     const deleteFavoriteMock = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    //         ok: true,
    //     });
    //
    //     render(<Favorites />);
    //
    //     await waitFor(() => expect(fetchUserFavoritesMock).toHaveBeenCalled());
    //     await waitFor(() => expect(fetchParkDetailsMock).toHaveBeenCalledTimes(2));
    //
    //     const parkButton = screen.getAllByRole('button')[0];
    //     userEvent.click(parkButton);
    //
    //     const removeIcon = await screen.findByText('-');
    //     userEvent.click(removeIcon);
    //
    //     const confirmButton = await screen.findByRole('button', { name: /Confirm/i });
    //     fireEvent.click(confirmButton);
    //
    //     await waitFor(() => expect(deleteFavoriteMock).toHaveBeenCalled());
    //
    //     const favoritesListElement = screen.getByRole('list');
    //     expect(favoritesListElement.children.length).toBe(1);
    // });
});