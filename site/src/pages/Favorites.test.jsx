import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Favorites from './Favorites'; // Adjust the import path as necessary.
import { cleanup } from '@testing-library/react';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

beforeEach(() => {
    fetch.resetMocks();
    sessionStorage.clear();
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
});

describe('Favorites component', () => {
    test('render page', async () => {
        sessionStorage.setItem('userInfo', JSON.stringify({username: 'testUser'}));
        fetch.mockResponses(
            [JSON.stringify({ favorites: ['parkCode1'] }), { status: 200 }],
            [JSON.stringify({ data: [{ fullName: 'Park One' }] }), { status: 200 }]
        );
        render(<Favorites />);
        await waitFor(() => expect(fetch).toHaveBeenCalled());
        expect(screen.getByText('My Favorite Parks')).toBeInTheDocument();
        expect(screen.getByText('Delete All')).toBeInTheDocument();
        await waitFor(() => expect(screen.getByText('Park One')).toBeInTheDocument());
    });

    test('error in fetching favorites', async () => {
        sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));
        fetch.mockResponseOnce(JSON.stringify({ favorites: ['parkCode1'] }), { status: 400 });
        render(<Favorites />);
        await waitFor(() => expect(fetch).toHaveBeenCalled());
        expect(console.error).toHaveBeenCalledWith('Failed to fetch user favorites');
    });


    test('error in user info', () => {
        render(<Favorites />);
        expect(console.error).toHaveBeenCalledWith('User info not found in session storage');
    });

    test('shows and hides confirmation popup when deleting all favorites', () => {
        render(<Favorites />);
        fireEvent.click(screen.getByText('Delete All'));
        expect(screen.getByText('Confirm Delete All Favorites')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Cancel'));
        expect(screen.queryByText('Confirm Delete All Favorites')).not.toBeInTheDocument();
    });

    test('clears favorites on confirming delete all', async () => {
        sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));
        fetch.mockResponseOnce(JSON.stringify({}), { status: 200 });
        render(<Favorites />);
        fireEvent.click(screen.getByText('Delete All'));
        fireEvent.click(screen.getByText('Confirm'));
        await waitFor(() => expect(fetch).toHaveBeenCalledWith(
            '/favorites/clear?username=testUser',
            expect.objectContaining({ method: 'DELETE' })
        ));
    });

    test('delete all error', async () => {
        sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));
        fetch.mockResponses(
            [JSON.stringify({}), { status: 200 }], // First fetch (initial load)
            [JSON.stringify({}), { status: 400 }]  // Second fetch (delete operation fails)
        );
        render(<Favorites />);
        fireEvent.click(screen.getByText('Delete All'));
        fireEvent.click(screen.getByText('Confirm'));
        await waitFor(() => expect(fetch).toHaveBeenCalledWith(
            '/favorites/clear?username=testUser',
            expect.objectContaining({ method: 'DELETE' })
        ));
        expect(console.error).toHaveBeenCalledWith('Failed to clear favorites');
    });

    test('handles exceptions during favorite clearance', async () => {
        sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));
        fetch.mockResponses(
            [JSON.stringify({}), { status: 200 }], // First fetch (initial load)
        );
        fetch.mockReject(new Error("Network Error"));
        render(<Favorites />);

        fireEvent.click(screen.getByText('Delete All'));
        fireEvent.click(screen.getByText('Confirm'));


        await waitFor(() =>
            expect(console.error).toHaveBeenCalledWith('Error clearing favorites: Network Error')
        );
    });


    test('removes a single favorite', async () => {
        sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));
        fetch.mockResponseOnce(JSON.stringify({}), { status: 200 });
        render(<Favorites />);
    });


    test('handles failure when fetching user favorites', async () => {
        sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));
        fetch.mockReject(new Error('Failed to fetch'));
        const consoleSpy = jest.spyOn(console, 'error');
        render(<Favorites />);
        await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Error fetching user favorites:', expect.any(Error)));
    })

    test('displays park details along with amenities when a park button is clicked', async () => {
        sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));
        fetch.mockResponses(
            [JSON.stringify({ favorites: ['parkCode1'] }), { status: 200 }],
            [JSON.stringify({ data: [{ fullName: 'Park One' }] }), { status: 200 }],
            [JSON.stringify({
                data: [{
                    parkCode: 'parkCode1',
                    fullName: 'Park One',
                    images: [{ url: 'http://example.com/test.jpg' }],
                    description: 'Test Description',
                    addresses: [{
                        city: 'Test City',
                        stateCode: 'TC'
                    }],
                    url: 'http://example.com',
                    entranceFees: [{ cost: '10.00' }],
                    activities: [{ id: 'act1', name: 'Hiking' }],
                    operatingHours: [{ description: '9 AM to 5 PM' }]
                }],
                ok: true
            }), { status: 200 }],
            [JSON.stringify({
                data: [
                    { id: 'amenity1', name: 'Restrooms' },
                    { id: 'amenity2', name: 'Picnic Areas' }
                ]
            }), { status: 200 }]
        );

        render(<Favorites />);
        await waitFor(() => expect(screen.getByText('Park One')).toBeInTheDocument());

        fireEvent.click(screen.getByText('Park One'));

        await waitFor(() => {
            expect(screen.getByText(/test description/i)).toBeInTheDocument();
            expect(screen.getByText('Test City, TC')).toBeInTheDocument();
            expect(screen.getByText('Visit Park Website')).toHaveAttribute('href', 'http://example.com');
            expect(screen.getByText('Hiking')).toBeInTheDocument();
            expect(screen.getByText('Restrooms')).toBeInTheDocument();
            expect(screen.getByText('Picnic Areas')).toBeInTheDocument();
        });
    });

    test('removes a park from favorites on user confirmation', async () => {
        sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));
        fetch.mockResponses(
            [JSON.stringify({ favorites: ['parkCode1'] }), { status: 200 }],
            [JSON.stringify({ data: [{ parkCode: 'parkCode1', fullName: 'Park One' }] }), { status: 200 }]
        );

        render(<Favorites />);

        const parkButton = await screen.findByText('Park One');

        fireEvent.mouseEnter(parkButton);
        fireEvent.mouseLeave(parkButton);
        fireEvent.mouseEnter(parkButton);

        const removeButton = await screen.findByText('-');
        fireEvent.click(removeButton);

        const cancelButton = await screen.findByText('Cancel');
        fireEvent.click(cancelButton);

        fireEvent.click(removeButton);

        const confirmButton = await screen.findByText('Confirm');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                '/favorites/remove?username=testUser&parkId=parkCode1',
                { method: 'DELETE' }
            );
        });
    });

    test('removes a park error', async () => {
        sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));
        fetch.mockResponses(
            [JSON.stringify({ favorites: ['parkCode1'] }), { status: 200 }],
            [JSON.stringify({ data: [{ parkCode: 'parkCode1', fullName: 'Park One' }] }), { status: 200 }],
            [JSON.stringify({}), { status: 400 }]
        );

        render(<Favorites />);

        const parkButton = await screen.findByText('Park One');

        fireEvent.mouseEnter(parkButton);


        const removeButton = await screen.findByText('-');
        fireEvent.click(removeButton);

        const cancelButton = await screen.findByText('Cancel');
        fireEvent.click(cancelButton);

        fireEvent.click(removeButton);

        const confirmButton = await screen.findByText('Confirm');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                '/favorites/remove?username=testUser&parkId=parkCode1',
                { method: 'DELETE' }
            );
        });
        expect(console.error).toHaveBeenCalledWith('Failed to remove park from favorites');
    });

    test('handles error fetching park details correctly', async () => {
        sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));
        fetch.mockResponses(
            [JSON.stringify({ favorites: ['parkCode1'] }), { status: 200 }],
            [null, { status: 404 }]
        );
        const consoleSpy = jest.spyOn(console, 'error');

        render(<Favorites />);

        await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch park details'));
    });

});

