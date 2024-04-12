import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import { BrowserRouter } from 'react-router-dom';
import SearchParks from './SearchParks';

fetchMock.enableMocks();

beforeEach(() => {
    fetch.resetMocks();
});

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
};

test('renders Search Parks component correctly', () => {
    const { getByText } = renderWithRouter(<SearchParks />);
    expect(getByText('Search Parks')).toBeInTheDocument();
});

test('searches for parks based on query', async () => {
    fetch.mockResponseOnce(JSON.stringify({
        data: [
            {
                id: '1',
                parkCode: 'abcd',
                fullName: 'Mock Park',
                images: [{ url: 'https://example.com/image.jpg' }],
                description: 'Description of mock park',
                addresses: [{ city: 'Mock City', stateCode: 'MC' }],
                url: 'https://example.com',
                entranceFees: [{ cost: '0' }],
                activities: [{ id: 'act1', name: 'Hiking' }],
                operatingHours: [{ description: '9 AM to 5 PM' }],
            }
        ]
    }));

    renderWithRouter(<SearchParks />);

    fireEvent.change(screen.getByLabelText('Search:'), { target: { value: 'Mock' } });
    fireEvent.click(screen.getByTitle('search'));

    await waitFor(() => expect(screen.getByText('Mock Park')).toBeInTheDocument());
});

test('handles search errors', async () => {
    fetch.mockReject(() => Promise.reject("API is down"));

    renderWithRouter(<SearchParks />);

    fireEvent.change(screen.getByLabelText('Search:'), { target: { value: 'Error' } });
    fireEvent.click(screen.getByTitle('search'));

    await waitFor(() => expect(screen.getByText('Error fetching data.')).toBeInTheDocument());
});

test('loads more results on button click', async () => {
    fetch.mockResponseOnce(JSON.stringify({
        data: Array(10).fill().map((_, index) => ({
            id: `${index}`,
            parkCode: `code${index}`,
            fullName: `Mock Park ${index}`,
            images: [{ url: 'https://example.com/image.jpg' }],
            description: `Description of mock park ${index}`,
            addresses: [{ city: 'Mock City', stateCode: 'MC' }],
            url: 'https://example.com',
            entranceFees: [{ cost: '0' }],
            activities: [{ id: 'act1', name: 'Hiking' }],
            operatingHours: [{ description: '9 AM to 5 PM' }],
        }))
    }));

    renderWithRouter(<SearchParks />);

    fireEvent.click(screen.getByTitle('search'));
    await waitFor(() => expect(screen.getByText('Mock Park 0')).toBeInTheDocument());

    fireEvent.click(screen.getByTitle('loadMoreResults'));
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
});

test('fetches park details and amenities on park selection', async () => {
    fetch.mockResponses(
        [JSON.stringify({
            data: [
                {
                    id: '1',
                    parkCode: 'abcd',
                    fullName: 'Mock Park Details',
                    images: [{ url: 'https://example.com/image.jpg' }],
                    description: 'Detailed description',
                    addresses: [{ city: 'Mock City', stateCode: 'MC' }],
                    url: 'https://example.com',
                    entranceFees: [{ cost: '0' }],
                    activities: [{ id: 'act1', name: 'Hiking' }],
                    operatingHours: [{ description: '9 AM to 5 PM' }],
                }
            ]
        })],
        [JSON.stringify({
            data: [
                {
                    id: '1',
                    parkCode: 'abcd',
                    fullName: 'Mock Park Details',
                    images: [{ url: 'https://example.com/image.jpg' }],
                    description: 'Detailed description',
                    addresses: [{ city: 'Mock City', stateCode: 'MC' }],
                    url: 'https://example.com',
                    entranceFees: [{ cost: '0' }],
                    activities: [{ id: 'act1', name: 'Hiking' }],
                    operatingHours: [{ description: '9 AM to 5 PM' }],
                }
            ]
        })],
        [JSON.stringify({
            data: [
                {
                    id: 'amen1',
                    name: 'Restrooms'
                }
            ]
        })]
    );

    renderWithRouter(<SearchParks />);

    fireEvent.click(screen.getByTitle('search'));
    await waitFor(() => expect(screen.getByText('Mock Park Details')).toBeInTheDocument());

    fireEvent.click(screen.getByTitle('detailsButton_abcd'));
    await waitFor(() => expect(screen.getByText('Description: Detailed description')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Restrooms')).toBeInTheDocument());
});
test('fetches park details and amenities on park selection 2', async () => {
    fetch.mockResponses(
        [JSON.stringify({
            data: [
                {
                    id: '1',
                    parkCode: 'abcd',
                    fullName: 'Mock Park Details',
                    images: [{ url: 'https://example.com/image.jpg' }],
                    description: 'Detailed description',
                    addresses: [{ city: 'Mock City', stateCode: 'MC' }],
                    url: 'https://example.com',
                    entranceFees: [{ cost: '0' }],
                    activities: [{ id: 'act1', name: 'Hiking' }, { id: 'act2', name: 'Hiking2' } ],
                    operatingHours: [{ description: '9 AM to 5 PM' }],
                }
            ]
        })],
        [JSON.stringify({
            data: [
                {
                    id: '1',
                    parkCode: 'abcd',
                    fullName: 'Mock Park Details',
                    images: [{ url: 'https://example.com/image.jpg' }],
                    description: 'Detailed description',
                    addresses: [{ city: 'Mock City', stateCode: 'MC' }],
                    url: 'https://example.com',
                    entranceFees: [{ cost: '0' }],
                    activities: [{ id: 'act1', name: 'Hiking' }, { id: 'act2', name: 'Hiking2' } ],
                    operatingHours: [{ description: '9 AM to 5 PM' }],
                }
            ]
        })],
        [JSON.stringify({
            data: [
                {
                    id: 'amen1',
                    name: 'Restrooms'
                },
                {
                    id: 'amen2',
                    name: 'Restrooms2'
                }
            ]
        })]
    );

    renderWithRouter(<SearchParks />);

    fireEvent.click(screen.getByTitle('search'));
    await waitFor(() => expect(screen.getByText('Mock Park Details')).toBeInTheDocument());

    fireEvent.click(screen.getByTitle('detailsButton_abcd'));
    await waitFor(() => expect(screen.getByText('Description: Detailed description')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Restrooms')).toBeInTheDocument());
});


test('fetches park details and amenities on park selection without any fees, activities, or amenities', async () => {
    fetch.mockResponses(
        [JSON.stringify({
            data: [
                {
                    id: '1',
                    parkCode: 'abcd',
                    fullName: 'Mock Park Details',
                    images: [{ url: 'https://example.com/image.jpg' }],
                    description: 'Detailed description',
                    addresses: [{ city: 'Mock City', stateCode: 'MC' }],
                    url: 'https://example.com',
                    entranceFees: [{ cost: '0' }],
                    activities: [{ id: 'act1', name: 'Hiking' }],
                    operatingHours: [{ description: '9 AM to 5 PM' }],
                }
            ]
        })],
        [JSON.stringify({
            data: [
                {
                    id: '1',
                    parkCode: 'abcd',
                    fullName: 'Mock Park Details',
                    images: [{ url: 'https://example.com/image.jpg' }],
                    description: 'Detailed description',
                    addresses: [{ city: 'Mock City', stateCode: 'MC' }],
                    url: 'https://example.com',
                    entranceFees: [],
                    activities: [],
                    operatingHours: [{ description: '9 AM to 5 PM' }],
                }
            ]
        })],
        [JSON.stringify({
            data: [
            ]
        })]
    );

    renderWithRouter(<SearchParks />);

    fireEvent.click(screen.getByTitle('search'));
    await waitFor(() => expect(screen.getByText('Mock Park Details')).toBeInTheDocument());

    fireEvent.click(screen.getByTitle('detailsButton_abcd'));
    await waitFor(() => expect(screen.getByText('Description: Detailed description')).toBeInTheDocument());
});

test('clicks on an amenity from the details screen', async () => {
    // Initial mock response for the park details and amenities
    fetch.mockResponses(
        [JSON.stringify({
            data: [
                {
                    id: '1',
                    parkCode: 'abcd',
                    fullName: 'Mock Park Details',
                    images: [{ url: 'https://example.com/image.jpg' }],
                    description: 'Detailed description',
                    addresses: [{ city: 'Mock City', stateCode: 'MC' }],
                    url: 'https://example.com',
                    entranceFees: [{ cost: '0' }],
                    activities: [{ id: 'act1', name: 'Hiking' }],
                    operatingHours: [{ description: '9 AM to 5 PM' }],
                }
            ]
        })],
        [JSON.stringify({
            data: [
                {
                    id: '1',
                    parkCode: 'abcd',
                    fullName: 'Mock Park Details',
                    images: [{ url: 'https://example.com/image.jpg' }],
                    description: 'Detailed description',
                    addresses: [{ city: 'Mock City', stateCode: 'MC' }],
                    url: 'https://example.com',
                    entranceFees: [{ cost: '0' }],
                    activities: [{ id: 'act1', name: 'Hiking' }],
                    operatingHours: [{ description: '9 AM to 5 PM' }],
                }
            ]
        })],
        [JSON.stringify({
            data: [
                {
                    id: 'amen1',
                    name: 'Restrooms'
                }
            ]
        })]
    );

    renderWithRouter(<SearchParks />);

    // Mock the response for clicking on an amenity
    fetch.mockResponseOnce(JSON.stringify({
        data: [
            {
                id: '2',
                parkCode: 'efgh',
                fullName: 'Another Mock Park',
                images: [{ url: 'https://example.com/image2.jpg' }],
                description: 'Another park description',
                addresses: [{ city: 'Another City', stateCode: 'AC' }],
                url: 'https://example.com',
                entranceFees: [{ cost: '10' }],
                activities: [{ id: 'act2', name: 'Camping' }],
                operatingHours: [{ description: '8 AM to 6 PM' }],
            }
        ]
    }));

    // Perform initial search to display parks
    fireEvent.click(screen.getByTitle('search'));
    await waitFor(() => expect(screen.getByText('Mock Park Details')).toBeInTheDocument());

    // Simulate clicking on the details button to show park details and amenities
    fireEvent.click(screen.getByTitle('detailsButton_abcd'));
    await waitFor(() => expect(screen.getByText('Restrooms')).toBeInTheDocument());

    // Simulate clicking on an amenity
    fireEvent.click(screen.getByText('Restrooms'));

    // Wait for the amenity-based search to complete and verify the new park is displayed
    await waitFor(() => expect(screen.getByText('Another Mock Park')).toBeInTheDocument());
});

test('clicks on an activity from the details screen', async () => {
    // Initial mock response for the park details
    fetch.mockResponses(
        [JSON.stringify({
            data: [
                {
                    id: '1',
                    parkCode: 'abcd',
                    fullName: 'Mock Park Details',
                    images: [{ url: 'https://example.com/image.jpg' }],
                    description: 'Detailed description',
                    addresses: [{ city: 'Mock City', stateCode: 'MC' }],
                    url: 'https://example.com',
                    entranceFees: [{ cost: '0' }],
                    activities: [{ id: 'act1', name: 'Hiking' }],
                    operatingHours: [{ description: '9 AM to 5 PM' }],
                }
            ]
        })],
        [JSON.stringify({
            data: [
                {
                    id: '1',
                    parkCode: 'abcd',
                    fullName: 'Mock Park Details',
                    images: [{ url: 'https://example.com/image.jpg' }],
                    description: 'Detailed description',
                    addresses: [{ city: 'Mock City', stateCode: 'MC' }],
                    url: 'https://example.com',
                    entranceFees: [{ cost: '0' }],
                    activities: [{ id: 'act1', name: 'Running' }],
                    operatingHours: [{ description: '9 AM to 5 PM' }],
                }
            ]
        })],
        [JSON.stringify({
            data: [
                {
                    id: 'act1',
                    name: 'Hiking'
                }
            ]
        })]
    );

    renderWithRouter(<SearchParks />);

    // Mock the response for clicking on an activity
    fetch.mockResponseOnce(JSON.stringify({
        data: [
            {
                id: '2',
                parkCode: 'efgh',
                fullName: 'Adventure Park',
                images: [{ url: 'https://example.com/image2.jpg' }],
                description: 'Adventure park description',
                addresses: [{ city: 'Adventure City', stateCode: 'AC' }],
                url: 'https://example.com',
                entranceFees: [{ cost: '15' }],
                activities: [{ id: 'act2', name: 'Biking' }],
                operatingHours: [{ description: '7 AM to 7 PM' }],
            }
        ]
    }));

    // Perform initial search to display parks
    fireEvent.click(screen.getByTitle('search'));
    await waitFor(() => expect(screen.getByText('Mock Park Details')).toBeInTheDocument());

    // Simulate clicking on the details button to show park details and activities
    fireEvent.click(screen.getByTitle('detailsButton_abcd'));
    await waitFor(() => expect(screen.getByText('Hiking')).toBeInTheDocument());

    // Simulate clicking on an activity
    fireEvent.click(screen.getByText('Running'));

    // Wait for the activity-based search to complete and verify the new park is displayed
    await waitFor(() => expect(screen.getByText('Adventure Park')).toBeInTheDocument());
});

test('clicks on a location from the details screen', async () => {
    // Initial mock response for the park details
    fetch.mockResponses(
        [JSON.stringify({
            data: [
                {
                    id: '1',
                    parkCode: 'abcd',
                    fullName: 'Mock Park Details',
                    images: [{ url: 'https://example.com/image.jpg' }],
                    description: 'Detailed description',
                    addresses: [{ city: 'Mock City', stateCode: 'MC' }],
                    url: 'https://example.com',
                    entranceFees: [{ cost: '0' }],
                    activities: [{ id: 'act1', name: 'Hiking' }],
                    operatingHours: [{ description: '9 AM to 5 PM' }],
                }
            ]
        })],
        [JSON.stringify({
            data: [
                {
                    id: '1',
                    parkCode: 'abcd',
                    fullName: 'Mock Park Details',
                    images: [{ url: 'https://example.com/image.jpg' }],
                    description: 'Detailed description',
                    addresses: [{ city: 'Mock City', stateCode: 'MC' }],
                    url: 'https://example.com',
                    entranceFees: [{ cost: '0' }],
                    activities: [{ id: 'act1', name: 'Running' }],
                    operatingHours: [{ description: '9 AM to 5 PM' }],
                }
            ]
        })],
        [JSON.stringify({
            data: [
                {
                    id: 'act1',
                    name: 'Hiking'
                }
            ]
        })]
    );

    renderWithRouter(<SearchParks />);

    // Mock the response for clicking on an activity
    fetch.mockResponseOnce(JSON.stringify({
        data: [
            {
                id: '2',
                parkCode: 'efgh',
                fullName: 'Adventure Park',
                images: [{ url: 'https://example.com/image2.jpg' }],
                description: 'Adventure park description',
                addresses: [{ city: 'Adventure City', stateCode: 'AC' }],
                url: 'https://example.com',
                entranceFees: [{ cost: '15' }],
                activities: [{ id: 'act2', name: 'Biking' }],
                operatingHours: [{ description: '7 AM to 7 PM' }],
            }
        ]
    }));

    // Perform initial search to display parks
    fireEvent.click(screen.getByTitle('search'));
    await waitFor(() => expect(screen.getByText('Mock Park Details')).toBeInTheDocument());

    // Simulate clicking on the details button to show park details and activities
    fireEvent.click(screen.getByTitle('detailsButton_abcd'));
    await waitFor(() => expect(screen.getByText('Hiking')).toBeInTheDocument());

    // Simulate clicking on an activity
    fireEvent.click(screen.getByText('Mock City, MC'));

    // Wait for the activity-based search to complete and verify the new park is displayed
    await waitFor(() => expect(screen.getByText('Adventure Park')).toBeInTheDocument());
});

test('searches for parks by state code', async () => {
    // Mock the fetch response for searching by state code
    fetch.mockResponseOnce(JSON.stringify({
        data: [
            {
                id: '3',
                parkCode: 'ijkl',
                fullName: 'State Park Example',
                images: [{ url: 'https://example.com/image3.jpg' }],
                description: 'A beautiful state park in CA',
                addresses: [{ city: 'State City', stateCode: 'CA' }],
                url: 'https://example.com/statepark',
                entranceFees: [{ cost: '5' }],
                activities: [{ id: 'act3', name: 'Kayaking' }],
                operatingHours: [{ description: '8 AM to 6 PM' }],
            }
        ]
    }));

    renderWithRouter(<SearchParks />);

    // Simulate selecting the state search option
    fireEvent.click(screen.getByLabelText('State'));

    // Simulate typing the state code into the search field
    fireEvent.change(screen.getByLabelText('Search:'), { target: { value: 'CA' } });

    // Simulate submitting the search
    fireEvent.click(screen.getByTitle('search'));

    // Wait for the search results to display and verify the state park is shown
    await waitFor(() => expect(screen.getByText('State Park Example')).toBeInTheDocument());
});

test('searches for parks by activity', async () => {
    // Mock the fetch response for searching by activity
    fetch.mockResponseOnce(JSON.stringify({
        data: [
            {
                id: '4',
                parkCode: 'mnop',
                fullName: 'Activity Park Example',
                images: [{ url: 'https://example.com/image4.jpg' }],
                description: 'A park well-known for its extensive hiking trails',
                addresses: [{ city: 'Activity City', stateCode: 'AC' }],
                url: 'https://example.com/activitypark',
                entranceFees: [{ cost: '0' }],
                activities: [{ id: 'act4', name: 'Hiking' }],
                operatingHours: [{ description: '7 AM to 7 PM' }],
            }
        ]
    }));

    renderWithRouter(<SearchParks />);

    // Simulate selecting the activity search option
    fireEvent.click(screen.getByLabelText('Activity'));

    // Simulate typing the activity into the search field
    fireEvent.change(screen.getByLabelText('Search:'), { target: { value: 'Hiking' } });

    // Simulate submitting the search
    fireEvent.click(screen.getByTitle('search'));

    // Wait for the search results to display and verify the park with the specified activity is shown
    await waitFor(() => expect(screen.getByText('Activity Park Example')).toBeInTheDocument());
});

test('first searches by state, then by park name', async () => {
    // Mock the fetch responses for the two search types
    // First response for searching by state
    fetch.mockResponseOnce(JSON.stringify({
        data: [
            {
                id: '5',
                parkCode: 'qrst',
                fullName: 'State Specific Park',
                images: [{ url: 'https://example.com/image5.jpg' }],
                description: 'A park in the specified state with beautiful views',
                addresses: [{ city: 'State City', stateCode: 'ST' }],
                url: 'https://example.com/statepark',
                entranceFees: [{ cost: '20' }],
                activities: [{ id: 'act5', name: 'Boating' }],
                operatingHours: [{ description: '10 AM to 4 PM' }],
            }
        ]
    }));

    renderWithRouter(<SearchParks />);

    // Simulate selecting the state search option and entering a state code
    fireEvent.click(screen.getByLabelText('State'));
    fireEvent.change(screen.getByLabelText('Search:'), { target: { value: 'ST' } });
    fireEvent.click(screen.getByTitle('search'));

    // Wait for the state search results to display and verify
    await waitFor(() => expect(screen.getByText('State Specific Park')).toBeInTheDocument());

    // Prepare the second response for searching by park name
    fetch.mockResponseOnce(JSON.stringify({
        data: [
            {
                id: '6',
                parkCode: 'uvwx',
                fullName: 'Park Name Specific Search Result',
                images: [{ url: 'https://example.com/image6.jpg' }],
                description: 'A park matching the specific search by name',
                addresses: [{ city: 'Name City', stateCode: 'NC' }],
                url: 'https://example.com/parkname',
                entranceFees: [{ cost: '5' }],
                activities: [{ id: 'act6', name: 'Climbing' }],
                operatingHours: [{ description: '8 AM to 5 PM' }],
            }
        ]
    }));

    // Simulate changing the search criteria to park name and entering a new query
    fireEvent.click(screen.getByLabelText('Park Name'));
    fireEvent.change(screen.getByLabelText('Search:'), { target: { value: 'Specific Search Result' } });
    fireEvent.click(screen.getByTitle('search'));

    // Wait for the park name search results to display and verify
    await waitFor(() => expect(screen.getByText('Park Name Specific Search Result')).toBeInTheDocument());
});

test('toggles park details window on clicking the details button twice', async () => {
    fetch.mockResponses(
        [JSON.stringify({
            data: [
                {
                    id: '1',
                    parkCode: 'abcd',
                    fullName: 'Mock Park Details',
                    images: [{ url: 'https://example.com/image.jpg' }],
                    description: 'Detailed description',
                    addresses: [{ city: 'Mock City', stateCode: 'MC' }],
                    url: 'https://example.com',
                    entranceFees: [{ cost: '0' }],
                    activities: [{ id: 'act1', name: 'Hiking' }],
                    operatingHours: [{ description: '9 AM to 5 PM' }],
                }
            ]
        })],
        [JSON.stringify({
            data: [
                {
                    id: '1',
                    parkCode: 'abcd',
                    fullName: 'Mock Park Details',
                    images: [{ url: 'https://example.com/image.jpg' }],
                    description: 'Detailed description',
                    addresses: [{ city: 'Mock City', stateCode: 'MC' }],
                    url: 'https://example.com',
                    entranceFees: [{ cost: '0' }],
                    activities: [{ id: 'act1', name: 'Hiking' }],
                    operatingHours: [{ description: '9 AM to 5 PM' }],
                }
            ]
        })],
        [JSON.stringify({
            data: [
                {
                    id: 'amen1',
                    name: 'Restrooms'
                }
            ]
        })]
    );

    renderWithRouter(<SearchParks />);

    fireEvent.click(screen.getByTitle('search'));
    await waitFor(() => expect(screen.getByText('Mock Park Details')).toBeInTheDocument());

    fireEvent.click(screen.getByTitle('detailsButton_abcd'));
    await waitFor(() => expect(screen.getByText('Description: Detailed description')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Restrooms')).toBeInTheDocument());

    fireEvent.click(screen.getByTitle('detailsButton_abcd'));
});

test('loads more results on button click when searching by state', async () => {
    // Mock the initial fetch response for searching by state
    fetch.mockResponseOnce(JSON.stringify({
        data: Array(10).fill().map((_, index) => ({
            id: `initial${index}`,
            parkCode: `initCode${index}`,
            fullName: `Initial State Park ${index}`,
            images: [{url: 'https://example.com/image.jpg'}],
            description: `Description of initial park ${index}`,
            addresses: [{ city: 'Initial City', stateCode: 'IS' }],
            url: 'https://example.com',
            entranceFees: [{ cost: '0' }],
            activities: [{ id: 'act1', name: 'Hiking' }],
            operatingHours: [{ description: '9 AM to 5 PM' }],
        }))
    }));

    renderWithRouter(<SearchParks />);

    // Simulate selecting the state search option and entering a state code
    fireEvent.click(screen.getByLabelText('State'));
    fireEvent.change(screen.getByLabelText('Search:'), { target: { value: 'IS' } });

    // Simulate submitting the search to display initial state parks
    fireEvent.click(screen.getByTitle('search'));

    await waitFor(() => expect(screen.getByText('Initial State Park 0')).toBeInTheDocument());

    // Prepare the second mock fetch response for loading more results
    fetch.mockResponseOnce(JSON.stringify({
        data: Array(10).fill().map((_, index) => ({
            id: `more${index}`,
            parkCode: `moreCode${index}`,
            fullName: `More State Park ${index}`,
            images: [{url: 'https://example.com/moreImage.jpg'}],
            description: `Description of more park ${index}`,
            addresses: [{ city: 'More City', stateCode: 'MS' }],
            url: 'https://example.com/more',
            entranceFees: [{ cost: '10' }],
            activities: [{ id: 'act2', name: 'Cycling' }],
            operatingHours: [{ description: '8 AM to 6 PM' }],
        }))
    }));

    // Simulate clicking the "Load More Results" button
    fireEvent.click(screen.getByTitle('loadMoreResults'));

    // Verify that more results are loaded and displayed
    await waitFor(() => expect(screen.getByText('More State Park 0')).toBeInTheDocument());
});

test('handles failure to fetch parks', async () => {
    // Mock fetch to simulate a failure
    fetch.mockReject(new Error('Failed to fetch'));

    renderWithRouter(<SearchParks />);

    // Assuming the search is triggered automatically or by a user action, like clicking a search button
    fireEvent.click(screen.getByTitle('search'));

    // Verify that an error message is displayed
    await waitFor(() => expect(screen.getByText('Error fetching data.')).toBeInTheDocument());
});

test('handles unsuccessful response from the server', async () => {
    // Mock the fetch response to simulate an unsuccessful response
    fetch.mockResponseOnce('', { status: 404, statusText: 'Not Found' });

    renderWithRouter(<SearchParks />);

    // Assuming the search is triggered automatically or by a user action, like clicking a search button
    fireEvent.click(screen.getByTitle('search'));

    // Verify that an error message is displayed, indicating the failure to fetch parks
    await waitFor(() => expect(screen.getByText('Failed to fetch parks.')).toBeInTheDocument());
});

test('fetches amenities fails', async () => {
    fetch.mockResponses(
        [JSON.stringify({
            data: [
                {
                    id: '1',
                    parkCode: 'abcd',
                    fullName: 'Mock Park Details',
                    images: [{ url: 'https://example.com/image.jpg' }],
                    description: 'Detailed description',
                    addresses: [{ city: 'Mock City', stateCode: 'MC' }],
                    url: 'https://example.com',
                    entranceFees: [{ cost: '0' }],
                    activities: [{ id: 'act1', name: 'Hiking' }],
                    operatingHours: [{ description: '9 AM to 5 PM' }],
                }
            ]
        })],
        [JSON.stringify({
            data: [
                {
                    id: '1',
                    parkCode: 'abcd',
                    fullName: 'Mock Park Details',
                    images: [{ url: 'https://example.com/image.jpg' }],
                    description: 'Detailed description',
                    addresses: [{ city: 'Mock City', stateCode: 'MC' }],
                    url: 'https://example.com',
                    entranceFees: [{ cost: '0' }],
                    activities: [{ id: 'act1', name: 'Hiking' }],
                    operatingHours: [{ description: '9 AM to 5 PM' }],
                }
            ]
        })]
    );
    fetch.mockResponseOnce('', { status: 404, statusText: 'Not Found' });


    renderWithRouter(<SearchParks />);

    fireEvent.click(screen.getByTitle('search'));
    await waitFor(() => expect(screen.getByText('Mock Park Details')).toBeInTheDocument());

    fireEvent.click(screen.getByTitle('detailsButton_abcd'));
    //await waitFor(() => expect(screen.getByText('Failed to fetch amenities')).toBeInTheDocument());
});

test('fetches amenities fails', async () => {
    fetch.mockResponses(
        [JSON.stringify({
            data: [
                {
                    id: '1',
                    parkCode: 'abcd',
                    fullName: 'Mock Park Details',
                    images: [{ url: 'https://example.com/image.jpg' }],
                    description: 'Detailed description',
                    addresses: [{ city: 'Mock City', stateCode: 'MC' }],
                    url: 'https://example.com',
                    entranceFees: [{ cost: '0' }],
                    activities: [{ id: 'act1', name: 'Hiking' }],
                    operatingHours: [{ description: '9 AM to 5 PM' }],
                }
            ]
        })],
        [JSON.stringify({
            data: [
                {
                    id: '1',
                    parkCode: 'abcd',
                    fullName: 'Mock Park Details',
                    images: [{ url: 'https://example.com/image.jpg' }],
                    description: 'Detailed description',
                    addresses: [{ city: 'Mock City', stateCode: 'MC' }],
                    url: 'https://example.com',
                    entranceFees: [{ cost: '0' }],
                    activities: [{ id: 'act1', name: 'Hiking' }],
                    operatingHours: [{ description: '9 AM to 5 PM' }],
                }
            ]
        })]
    );
    fetch.mockReject(new Error('Failed to fetch'));


    renderWithRouter(<SearchParks />);

    fireEvent.click(screen.getByTitle('search'));
    await waitFor(() => expect(screen.getByText('Mock Park Details')).toBeInTheDocument());

    fireEvent.click(screen.getByTitle('detailsButton_abcd'));
    //await waitFor(() => expect(screen.getByText('Failed to fetch amenities')).toBeInTheDocument());
});

test('fetch park details fails', async () => {
    fetch.mockResponses(
        [JSON.stringify({
            data: [
                {
                    id: '1',
                    parkCode: 'abcd',
                    fullName: 'Mock Park Details',
                    images: [{ url: 'https://example.com/image.jpg' }],
                    description: 'Detailed description',
                    addresses: [{ city: 'Mock City', stateCode: 'MC' }],
                    url: 'https://example.com',
                    entranceFees: [{ cost: '0' }],
                    activities: [{ id: 'act1', name: 'Hiking' }],
                    operatingHours: [{ description: '9 AM to 5 PM' }],
                }
            ]
        })]
    );
    fetch.mockResponseOnce('', { status: 404, statusText: 'Not Found' });


    renderWithRouter(<SearchParks />);

    fireEvent.click(screen.getByTitle('search'));
    await waitFor(() => expect(screen.getByText('Mock Park Details')).toBeInTheDocument());

    fireEvent.click(screen.getByTitle('detailsButton_abcd'));
    //await waitFor(() => expect(screen.getByText('Failed to fetch amenities')).toBeInTheDocument());
});

test('changes search type from park name to amenities and performs a search', async () => {
    // Mock the fetch responses for the two search types
    // First response for searching by park name
    fetch.mockResponseOnce(JSON.stringify({
        data: [
            {
                id: '9',
                parkCode: 'park1',
                fullName: 'Park Name Search Result',
                images: [{url: 'https://example.com/parkname.jpg'}],
                description: 'A park matching the park name search',
                addresses: [{ city: 'Park City', stateCode: 'PC' }],
                url: 'https://example.com/parkname',
                entranceFees: [{ cost: '0' }],
                activities: [{ id: 'act9', name: 'Bird Watching' }],
                operatingHours: [{ description: '6 AM to 8 PM' }],
            }
        ]
    }));

    renderWithRouter(<SearchParks />);

    // Simulate typing the park name into the search field and submitting the search
    fireEvent.change(screen.getByLabelText('Search:'), { target: { value: 'Yellowstone' } });
    fireEvent.click(screen.getByTitle('search'));

    // Wait for the park name search results to display and verify
    await waitFor(() => expect(screen.getByText('Park Name Search Result')).toBeInTheDocument());

    // Prepare the mock response for searching by amenities
    fetch.mockResponseOnce(JSON.stringify({
        data: [
            {
                id: '10',
                parkCode: 'ameni2',
                fullName: 'Amenities Search Result Park',
                images: [{url: 'https://example.com/amenities.jpg'}],
                description: 'A park with specific amenities',
                addresses: [{ city: 'Amenities City', stateCode: 'AC' }],
                url: 'https://example.com/amenitiespark',
                entranceFees: [{ cost: '10' }],
                activities: [{ id: 'act10', name: 'Kayaking' }],
                operatingHours: [{ description: '8 AM to 6 PM' }],
            }
        ]
    }));

    // Simulate changing the search type to amenities and entering a new search term
    fireEvent.click(screen.getByLabelText('Amenities'));
    fireEvent.change(screen.getByLabelText('Search:'), { target: { value: 'Playground' } });
    fireEvent.click(screen.getByTitle('search'));

    // Wait for the amenities search results to display and verify the new park is displayed
    await waitFor(() => expect(screen.getByText('Amenities Search Result Park')).toBeInTheDocument());


});
test('adds a park to favorites', async () => {
    const createdUser = {
        username: "NickoOG_SEARCH_TMP"
    };
    sessionStorage.setItem('userInfo', JSON.stringify(createdUser));

    // Mock the fetch responses for fetching parks and user favorites
    fetch.mockResponses(
        [JSON.stringify({
            favorites: []
        })],
        [JSON.stringify({
            data: [
                {
                    id: '1',
                    parkCode: 'abcd',
                    fullName: 'Mock Park Details',
                    images: [{ url: 'https://example.com/image.jpg' }],
                    description: 'Detailed description',
                    addresses: [{ city: 'Mock City', stateCode: 'MC' }],
                    url: 'https://example.com',
                    entranceFees: [{ cost: '0' }],
                    activities: [{ id: 'act1', name: 'Hiking' }],
                    operatingHours: [{ description: '9 AM to 5 PM' }],
                }
            ]
        })]
    );

    fetch.mockResponseOnce(JSON.stringify({ success: true }), { status: 200 });

    renderWithRouter(<SearchParks />);

    fireEvent.click(screen.getByTitle('search'));
    await waitFor(() => expect(screen.getByText('Mock Park Details')).toBeInTheDocument());

    fireEvent.mouseEnter(screen.getByText('Mock Park Details'));
    fireEvent.click(screen.getByText('+'));

    await waitFor(() => expect(screen.getByText('Park successfully added to favorites!')).toBeInTheDocument());
});

test('does not add a park to favorites if it is already in the list', async () => {
    const createdUser = {
        username: "NickoOG_SEARCH_TMP"
    };
    sessionStorage.setItem('userInfo', JSON.stringify(createdUser));

    fetch.mockResponses(
        [JSON.stringify({
            favorites: ['abcd']
        })],
        [JSON.stringify({
            data: [
                {
                    id: '1',
                    parkCode: 'abcd',
                    fullName: 'Mock Park Details',
                    images: [{ url: 'https://example.com/image.jpg' }],
                    description: 'Detailed description',
                    addresses: [{ city: 'Mock City', stateCode: 'MC' }],
                    url: 'https://example.com',
                    entranceFees: [{ cost: '0' }],
                    activities: [{ id: 'act1', name: 'Hiking' }],
                    operatingHours: [{ description: '9 AM to 5 PM' }],
                }
            ]
        })]
    );

    renderWithRouter(<SearchParks />);

    fireEvent.click(screen.getByTitle('search'));
    await waitFor(() => expect(screen.getByText('Mock Park Details')).toBeInTheDocument());

    fireEvent.mouseEnter(screen.getByText('Mock Park Details'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.mouseEnter(screen.getByText('Mock Park Details'));
    fireEvent.click(screen.getByText('+'));

    await waitFor(() => expect(screen.getByText('Error: This park is already in your favorites.')).toBeInTheDocument());

    fireEvent.mouseLeave(screen.getByText('Mock Park Details'));
});

test('handles error when adding a park to favorites', async () => {
    const createdUser = {
        username: "NickoOG_SEARCH_TMP"
    };
    sessionStorage.setItem('userInfo', JSON.stringify(createdUser));

    fetch.mockResponses(
        [JSON.stringify({
            favorites: []
        })],
        [JSON.stringify({
            data: [
                {
                    id: '1',
                    parkCode: 'abcd',
                    fullName: 'Mock Park Details',
                    images: [{ url: 'https://example.com/image.jpg' }],
                    description: 'Detailed description',
                    addresses: [{ city: 'Mock City', stateCode: 'MC' }],
                    url: 'https://example.com',
                    entranceFees: [{ cost: '0' }],
                    activities: [{ id: 'act1', name: 'Hiking' }],
                    operatingHours: [{ description: '9 AM to 5 PM' }],
                }
            ]
        })]
    );

    fetch.mockResponseOnce('', { status: 500, statusText: 'Internal Server Error' });

    renderWithRouter(<SearchParks />);

    fireEvent.click(screen.getByTitle('search'));
    await waitFor(() => expect(screen.getByText('Mock Park Details')).toBeInTheDocument());

    fireEvent.mouseEnter(screen.getByText('Mock Park Details'));
    fireEvent.click(screen.getByText('+'));

    await waitFor(() => expect(screen.getByText('Error adding park to favorites.')).toBeInTheDocument());
});

test('fetches user favorites on component mount', async () => {
    const createdUser = {
        username: "NickoOG_SEARCH_TMP"
    };
    sessionStorage.setItem('userInfo', JSON.stringify(createdUser));

    fetch.mockResponseOnce(JSON.stringify({
        favorites: ['abcd', 'efgh', 'ijkl']
    }));

    fetch.mockResponseOnce(JSON.stringify({
        data: [
            {
                id: '1',
                parkCode: 'abcd',
                fullName: 'Mock Park 1',
                images: [{ url: 'https://example.com/image1.jpg' }],
                description: 'Description of Mock Park 1',
                addresses: [{ city: 'Mock City 1', stateCode: 'MC1' }],
                url: 'https://example.com/park1',
                entranceFees: [{ cost: '0' }],
                activities: [{ id: 'act1', name: 'Hiking' }],
                operatingHours: [{ description: '9 AM to 5 PM' }],
            },
            {
                id: '2',
                parkCode: 'efgh',
                fullName: 'Mock Park 2',
                images: [{ url: 'https://example.com/image2.jpg' }],
                description: 'Description of Mock Park 2',
                addresses: [{ city: 'Mock City 2', stateCode: 'MC2' }],
                url: 'https://example.com/park2',
                entranceFees: [{ cost: '5' }],
                activities: [{ id: 'act2', name: 'Camping' }],
                operatingHours: [{ description: '8 AM to 6 PM' }],
            },
            {
                id: '3',
                parkCode: 'ijkl',
                fullName: 'Mock Park 3',
                images: [{ url: 'https://example.com/image3.jpg' }],
                description: 'Description of Mock Park 3',
                addresses: [{ city: 'Mock City 3', stateCode: 'MC3' }],
                url: 'https://example.com/park3',
                entranceFees: [{ cost: '10' }],
                activities: [{ id: 'act3', name: 'Kayaking' }],
                operatingHours: [{ description: '7 AM to 7 PM' }],
            }
        ]
    }));

    renderWithRouter(<SearchParks />);

    fireEvent.click(screen.getByTitle('search'));
    await waitFor(() => expect(screen.getByText('Mock Park 1')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Mock Park 2')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Mock Park 3')).toBeInTheDocument());

    expect(JSON.parse(sessionStorage.getItem('userInfo')).username).toBeDefined();
    expect(JSON.parse(sessionStorage.getItem('userInfo')).favorites).toEqual(['abcd', 'efgh', 'ijkl']);
});

test('fail to fetch user favorites on component mount', async () => {
    const createdUser = {
        username: "NickoOG_SEARCH_TMP"
    };
    sessionStorage.setItem('userInfo', JSON.stringify(createdUser));
    fetch.mockResolvedValue({
        ok: false,
        text: () => Promise.resolve(''), // Mock error text
    });
    renderWithRouter(<SearchParks />);
    await waitFor(() => expect(screen.getByText('Failed to fetch user favorites')).toBeInTheDocument());
    expect(JSON.parse(sessionStorage.getItem('userInfo')).username).toBeDefined();
});

test('fetch zero parks', async () => {
    const createdUser = {
        username: "NickoOG_SEARCH_TMP"
    };
    sessionStorage.setItem('userInfo', JSON.stringify(createdUser));

    fetch.mockResponseOnce(JSON.stringify({
        favorites: []
    }));
    fetch.mockResponseOnce(JSON.stringify({
        ok: true,
        data: []
    }));

    renderWithRouter(<SearchParks />);

    fireEvent.change(screen.getByLabelText('Search:'), { target: { value: 'Mock' } });
    fireEvent.click(screen.getByTitle('search'));

    await waitFor(() => expect(screen.getByText('There are no more results for this query')).toBeInTheDocument());
});

