import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Favorites, {reorder, moveItem} from './Favorites';
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


    test('handles privacy toggle', async () => {
        sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));
        fetch.mockResponseOnce(JSON.stringify({}), { status: 200 });
        render(<Favorites />);
        fireEvent.click(screen.getByText('Make Favorites Public'));
        await waitFor(() => expect(fetch).toHaveBeenCalledWith(
            '/favorites/privacy?username=testUser',
            expect.objectContaining({ method: 'PUT' })
        ));
        await waitFor(() => expect(screen.getByText('Make Favorites Private')).toBeInTheDocument());
    });


    test('shows error message if the fetch for user favorites fails', async () => {
        sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));
        fetch.mockReject(() => Promise.reject("Failed to fetch"));
        render(<Favorites />);
        const errorMessage = "Error fetching user favorites:";
        await waitFor(() => expect(console.error).toHaveBeenCalledWith(errorMessage, "Failed to fetch"));
    });


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
            [JSON.stringify({}), { status: 200 }],
            [JSON.stringify({}), { status: 400 }]
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
            [JSON.stringify({}), { status: 200 }],
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



describe('reorder utility function', () => {
        test('correctly reorders an array by moving an element from a lower index to a higher index', () => {
            const list = ['a', 'b', 'c', 'd'];
            const startIndex = 1;
            const endIndex = 3;
            const expectedResult = ['a', 'c', 'd', 'b'];
            expect(reorder(list, startIndex, endIndex)).toEqual(expectedResult);
        });

        test('correctly reorders an array by moving an element from a higher index to a lower index', () => {
            const list = ['a', 'b', 'c', 'd'];
            const startIndex = 3;
            const endIndex = 1;
            const expectedResult = ['a', 'd', 'b', 'c'];
            expect(reorder(list, startIndex, endIndex)).toEqual(expectedResult);
        });

        test('returns the same list if start and end indexes are the same', () => {
            const list = ['a', 'b', 'c', 'd'];
            const startIndex = 2;
            const endIndex = 2;
            expect(reorder(list, startIndex, endIndex)).toEqual(list);
        });
    });

    describe('moveItem utility function', () => {
        test('moves an item up in the list when direction is "up"', () => {
            const list = ['a', 'b', 'c', 'd'];
            const index = 2;
            const direction = 'up';
            const expectedResult = ['a', 'c', 'b', 'd'];
            expect(moveItem(list, index, direction)).toEqual(expectedResult);
        });

        test('moves an item down in the list when direction is "down"', () => {
            const list = ['a', 'b', 'c', 'd'];
            const index = 1;
            const direction = 'down';
            const expectedResult = ['a', 'c', 'b', 'd'];
            expect(moveItem(list, index, direction)).toEqual(expectedResult);
        });

        test('returns the same list if moving up at the first index', () => {
            const list = ['a', 'b', 'c', 'd'];
            const index = 0;
            const direction = 'up';
            expect(moveItem(list, index, direction)).toEqual(list);
        });

        test('returns the same list if moving down at the last index', () => {
            const list = ['a', 'b', 'c', 'd'];
            const index = 3;
            const direction = 'down';
            expect(moveItem(list, index, direction)).toEqual(list);
        });
    });


    test('handles exceptions during favorite clearance', async () => {
        sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));
        fetch.mockResponseOnce(JSON.stringify({ favorites: ['parkCode1'] }), { status: 200 });
        fetch.mockReject(new Error("Network Error"));

        const { getByText } = render(<Favorites />);
        await waitFor(() => getByText('Delete All'));

        fireEvent.click(getByText('Delete All'));
        fireEvent.click(getByText('Confirm'));

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith('Error clearing favorites: Network Error');
        });
    });

    test('handles drag and drop reordering of favorites', async () => {
        sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));
        fetch.mockResponses(
            [JSON.stringify({ favorites: ['parkCode1', 'parkCode2'] }), { status: 200 }],
            [JSON.stringify({ data: [{ fullName: 'Park One' }, { fullName: 'Park Two' }] }), { status: 200 }]
        );
        render(<Favorites />);
        await waitFor(() => screen.getByTestId('park-button-parkCode1'));
        const startingPositions = screen.getAllByTestId(/park-button-/);
        const source = startingPositions[0];
        const destination = startingPositions[1];
        fireEvent.dragStart(source);
        fireEvent.drop(destination);
        await waitFor(() => {
            const reorderedPositions = screen.getAllByTestId(/park-button-/);
            expect(reorderedPositions[0]).toHaveAttribute('data-testid', 'park-button-parkCode1');
        });
    });


});



