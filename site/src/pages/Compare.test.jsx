import React from "react";
import {render, fireEvent, waitFor, screen, act, cleanup} from "@testing-library/react";
import '@testing-library/jest-dom';
import fetchMock from "jest-fetch-mock";
import {BrowserRouter} from "react-router-dom";
import Compare from "./Compare";
import userEvent from "@testing-library/user-event";

// fetchMock.enableMocks();

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

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
};

test('renders Compare component correctly', () => {
    const { getByText } = renderWithRouter(<Compare />);
    expect(getByText('Compare Parks and Give Suggestions')).toBeInTheDocument();
});

test('add a user to group', async () => {
    const createdUser = {
        username: "NickoOG"
    };
    sessionStorage.setItem('userInfo', JSON.stringify(createdUser));
    fetch.mockResponseOnce(JSON.stringify({
        data: [
            "NickoOG1"
        ]
    }));

    renderWithRouter(<Compare />);

    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'NickoOG1' } });
    fireEvent.click(screen.getByTitle('Submit Username'));

    await waitFor(() => expect(screen.getByText('Successfully added NickoOG1 to your group of friends')).toBeInTheDocument());
});

test('fail to add a user to group', async () => {
    const createdUser = {
        username: "NickoOG"
    };
    sessionStorage.setItem('userInfo', JSON.stringify(createdUser));
    fetch.mockResolvedValue({
        ok: false,
        text: () => Promise.resolve('Username does not exist'), // Mock error text
    });

    renderWithRouter(<Compare />);

    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'not_a_user' } });
    fireEvent.click(screen.getByTitle('Submit Username'));

    await waitFor(() => expect(screen.getByText('Error: Username does not exist')).toBeInTheDocument());
});

test('exception from adding user to group', async () => {
    const createdUser = {
        username: "NickoOG"
    };
    sessionStorage.setItem('userInfo', JSON.stringify(createdUser));

    // Mock fetch to throw an error
    const origFetch = global.fetch;
    global.fetch = jest.fn(() => Promise.reject(new Error('Exception occurred while adding user to group')));


    renderWithRouter(<Compare />);

    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'not_a_user' } });
    fireEvent.click(screen.getByTitle('Submit Username'));

    await waitFor(() => expect(screen.getByText('Exception occurred while adding user to group')).toBeInTheDocument());
    global.fetch = origFetch; // IMPORTANT TO RESET FOR FUTURE TESTS
});

test('compare parks', async () => {
    sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));

    // 1 fetch from handleAddToGroup()
    // handleCompare() -> fetchGroupFavorites(username)
    // handleCompare() -> fetchParkDetails(parkCode)
    fetch.mockResponses(
        [JSON.stringify({data: ["NickoOG1"]}), {status: 200}],
        [
            JSON.stringify({
                parksToUsers: [
                    {parkCode1: ['NickoOG1', 'testUser']}
                ],
                groupSize: 1,
                sortedIDs: [{parkCode1: 2}],
                groupMembers: ["NickoOG1"]
            }),
            { status: 200 }
        ],
        [JSON.stringify({ data: [{ fullName: 'Park One' }] }), { status: 200 }],
    );

    renderWithRouter(<Compare />);

    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'NickoOG' } });
    fireEvent.click(screen.getByTitle('Submit Username'));

    fireEvent.click(screen.getByTitle("Submit Compare"));

    await waitFor(() => {
        expect(screen.getByText(/Park One/i)).toBeInTheDocument();
    });
});

test('compare parks and view details', async () => {
    sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));

    // 1 fetch from handleAddToGroup()
    // handleCompare() -> fetchGroupFavorites(username)
    // handleCompare() -> fetchParkDetails(parkCode) // Just need to display names for initial list
    // handleParkSelection() -> fetchParkDetails(parkCode)
    // handleParkSelection() -> fetchAmenitiesOfPark(parkCode)
    fetch.mockResponses(
        [JSON.stringify({data: ["NickoOG1"]}), {status: 200}],
        [
            JSON.stringify({
                parksToUsers: [
                    {parkCode1: ['NickoOG1', 'testUser']}
                ],
                groupSize: 1,
                sortedIDs: [{parkCode1: 2}],
                groupMembers: ["NickoOG1"]
            }),
            { status: 200 }
        ],
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

    renderWithRouter(<Compare />);

    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'NickoOG' } });
    fireEvent.click(screen.getByTitle('Submit Username'));

    fireEvent.click(screen.getByTitle("Submit Compare"));

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

test('hovering on compared park', async () => {
    sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));

    // 1 fetch from handleAddToGroup()
    // handleCompare() -> fetchGroupFavorites(username)
    // handleCompare() -> fetchParkDetails(parkCode)
    fetch.mockResponses(
        [JSON.stringify({data: ["NickoOG1"]}), {status: 200}],
        [
            JSON.stringify({
                parksToUsers: [
                    {parkCode1: ['NickoOG1', 'testUser']}
                ],
                groupSize: 1,
                sortedIDs: [{parkCode1: 2}],
                groupMembers: ["NickoOG1"]
            }),
            { status: 200 }
        ],
        [JSON.stringify({ data: [{ fullName: 'Park One' }] }), { status: 200 }],
    );

    renderWithRouter(<Compare />);

    const user = userEvent.setup(); // Configures some stuff and starts a session
    await act(()=>{
        user.type(screen.getByLabelText(/Username/), "NickoOG1");
        user.click(screen.getByTitle(/Submit Username/));
        user.click(screen.getByTitle(/Submit Compare/));
    });

    // fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'NickoOG1' } });
    // fireEvent.click(screen.getByTitle('Submit Username'));
    // fireEvent.click(screen.getByTitle("Submit Compare"));

    await waitFor(() => {
        expect(screen.getByText(/Park One/i)).toBeInTheDocument();
    });

    // Hover/click stuff
    // await user.hover(await screen.findByText('2 / 2'));

    // fireEvent.click(await screen.findByText('2 / 2'));
    fireEvent.click(await screen.getByTestId('p-0'));

    // fireEvent.mouseLeave(await screen.findByText('2 / 2'));
    // fireEvent.mouseEnter(await screen.findByText('2 / 2'));


    fireEvent.click(await screen.getByTestId('p-0'));
    await waitFor( () => {
        // expect(screen.getByText('NickoOG1')).toBeInTheDocument();
        // expect(screen.getByText('testUser')).toBeInTheDocument();
        expect(screen.getByText(/Park One/i)).toBeInTheDocument();
    });
});

test('no ratio to display', async () => {
    sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));

    // 1 fetch from handleAddToGroup()
    // handleCompare() -> fetchGroupFavorites(username)
    // handleCompare() -> fetchParkDetails(parkCode)
    fetch.mockResponses(
        [JSON.stringify({data: ["NickoOG1"]}), {status: 200}],
        [
            JSON.stringify({
                parksToUsers: [
                    {}
                ],
                groupSize: 1,
                sortedIDs: [{parkCode1: 2}],
                groupMembers: []
            }),
            { status: 200 }
        ],
        [JSON.stringify({ data: [{ fullName: 'Park One' }] }), { status: 200 }],
    );

    renderWithRouter(<Compare />);

    const user = userEvent.setup(); // Configures some stuff and starts a session
    await act(()=>{
        user.type(screen.getByLabelText(/Username/), "NickoOG1");
        user.click(screen.getByTitle(/Submit Username/));
        user.click(screen.getByTitle(/Submit Compare/));
    });

    await waitFor(() => {
        expect(screen.getByText(/Park One/i)).toBeInTheDocument();
    });
});

test('fetchAmenitiesOfPark NOT OK', async () => {
    sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));

    // 1 fetch from handleAddToGroup()
    // handleCompare() -> fetchGroupFavorites(username)
    // handleCompare() -> fetchParkDetails(parkCode) // Just need to display names for initial list
    // handleParkSelection() -> fetchParkDetails(parkCode)
    // handleParkSelection() -> fetchAmenitiesOfPark(parkCode)
    fetch.mockResponses(
        [JSON.stringify({data: ["NickoOG1"]}), {status: 200}],
        [
            JSON.stringify({
                parksToUsers: [
                    {parkCode1: ['NickoOG1', 'testUser']}
                ],
                groupSize: 1,
                sortedIDs: [{parkCode1: 2}],
                groupMembers: ["NickoOG1"]
            }),
            { status: 200, ok: false }
        ],
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
        [null, { status: 404 }]
    );


    renderWithRouter(<Compare />);

    const user = userEvent.setup(); // Configures some stuff and starts a session
    await act(()=>{
        user.type(screen.getByLabelText(/Username/), "NickoOG1");
        user.click(screen.getByTitle(/Submit Username/));
        user.click(screen.getByTitle(/Submit Compare/));
    });

    await waitFor(() => {
        expect(screen.getByText('Park One')).toBeInTheDocument();
    });
    await act(() => {
        user.click(screen.getByText('Park One'));
    });
    const consoleSpy = jest.spyOn(console, 'error');
    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch amenities.'));
});

test('fetchParkDetails NOT OK', async () => {
    sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));

    // 1 fetch from handleAddToGroup()
    // handleCompare() -> fetchGroupFavorites(username)
    // handleCompare() -> fetchParkDetails(parkCode) // Just need to display names for initial list
    // handleParkSelection() -> fetchParkDetails(parkCode)
    fetch.mockResponses(
        [JSON.stringify({data: ["NickoOG1"]}), {status: 200}],
        [
            JSON.stringify({
                parksToUsers: [
                    {parkCode1: ['NickoOG1', 'testUser']}
                ],
                groupSize: 1,
                sortedIDs: [{parkCode1: 2}],
                groupMembers: ["NickoOG1"]
            }),
            { status: 200, ok: false }
        ],
        [JSON.stringify({ data: [{ fullName: 'Park One' }] }), { status: 200 }],
        [null, { status: 404 }]
    );


    renderWithRouter(<Compare />);

    const user = userEvent.setup(); // Configures some stuff and starts a session
    await act(()=>{
        user.type(screen.getByLabelText(/Username/), "NickoOG1");
        user.click(screen.getByTitle(/Submit Username/));
        user.click(screen.getByTitle(/Submit Compare/));
    });

    await waitFor(() => {
        expect(screen.getByText('Park One')).toBeInTheDocument();
    });
    await act(() => {
        user.click(screen.getByText('Park One'));
    });
    const consoleSpy = jest.spyOn(console, 'error');
    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch park details'));
});

test('fetchGroupFavorites NOT OK', async () => {
    sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));

    // 1 fetch from handleAddToGroup()
    // handleCompare() -> fetchGroupFavorites(username)
    fetch.mockResponses(
        [JSON.stringify({data: ["NickoOG1"]}), {status: 200}],
        [null, { status: 404 }]
    );


    renderWithRouter(<Compare />);

    const user = userEvent.setup(); // Configures some stuff and starts a session
    await act(()=>{
        user.type(screen.getByLabelText(/Username/), "NickoOG1");
        user.click(screen.getByTitle(/Submit Username/));
        user.click(screen.getByTitle(/Submit Compare/));
    });
    const consoleSpy = jest.spyOn(console, 'error');
    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Error fetching group favorites:'));
    // Nick: Somehow causes an exception in handleCompare() but it works for this test since it does the console.error() there...
});

test('fetchAmenitiesOfPark EXCEPTION', async () => {
    sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));

    // Mock fetch to throw an error
    const origFetch = global.fetch;

    // 1 fetch from handleAddToGroup()
    // handleCompare() -> fetchGroupFavorites(username)
    // handleCompare() -> fetchParkDetails(parkCode) // Just need to display names for initial list
    // handleParkSelection() -> fetchParkDetails(parkCode)
    // handleParkSelection() -> fetchAmenitiesOfPark(parkCode) -> EXCEPTION
    fetch.mockResponses(
        [JSON.stringify({data: ["NickoOG1"]}), {status: 200}],
        [
            JSON.stringify({
                parksToUsers: [
                    {parkCode1: ['NickoOG1', 'testUser']}
                ],
                groupSize: 1,
                sortedIDs: [{parkCode1: 2}],
                groupMembers: ["NickoOG1"]
            }),
            { status: 200, ok: false }
        ],
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
        }), { status: 200 }]
    );
    fetch.mockReject(new Error('Failed to fetch'));


    renderWithRouter(<Compare />);

    const user = userEvent.setup(); // Configures some stuff and starts a session
    await act(()=>{
        user.type(screen.getByLabelText(/Username/), "NickoOG1");
        user.click(screen.getByTitle(/Submit Username/));
        user.click(screen.getByTitle(/Submit Compare/));
    });

    await waitFor(() => {
        expect(screen.getByText('Park One')).toBeInTheDocument();
    });
    await act(() => {
        user.click(screen.getByText('Park One'));
    });
    const consoleSpy = jest.spyOn(console, 'error');
    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Error fetching amenities data.'));


    global.fetch = origFetch; // IMPORTANT TO RESET FOR FUTURE TESTS
});

test('handleCompare EXCEPTION', async () => {
    sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));

    // Mock fetch to throw an error
    const origFetch = global.fetch;

    // 1 fetch from handleAddToGroup()
    // handleCompare() -> fetchGroupFavorites(username) -> EXCEPTION
    fetch.mockResponses(
        [JSON.stringify({data: ["NickoOG1"]}), {status: 200}]
    );
    fetch.mockReject(new Error(''));


    renderWithRouter(<Compare />);

    const user = userEvent.setup(); // Configures some stuff and starts a session
    await act(()=>{
        user.type(screen.getByLabelText(/Username/), "NickoOG1");
        user.click(screen.getByTitle(/Submit Username/));
        user.click(screen.getByTitle(/Submit Compare/));
    });

    const consoleSpy = jest.spyOn(console, 'error');
    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Error fetching group favorites:'));
    // An exception seems to trigger and be catched in fetchGroupFavorites(), which does a setError but since it won't
    // return the valid data that handleCompare() needs, that will also throw an exception with an error message
    // regarding sortedIDs (if you include the error variable in the catch).


    global.fetch = origFetch; // IMPORTANT TO RESET FOR FUTURE TESTS
});

test('with no fee info, open and close details widget', async () => {
    sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));

    // 1 fetch from handleAddToGroup()
    // handleCompare() -> fetchGroupFavorites(username)
    // handleCompare() -> fetchParkDetails(parkCode) // Just need to display names for initial list
    // handleParkSelection() -> fetchParkDetails(parkCode)
    // handleParkSelection() -> fetchAmenitiesOfPark(parkCode)
    fetch.mockResponses(
        [JSON.stringify({data: ["NickoOG1"]}), {status: 200}],
        [
            JSON.stringify({
                parksToUsers: [
                    {parkCode1: ['NickoOG1', 'testUser']}
                ],
                groupSize: 1,
                sortedIDs: [{parkCode1: 2}],
                groupMembers: ["NickoOG1"]
            }),
            { status: 200 }
        ],
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
                entranceFees: [],
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

    renderWithRouter(<Compare />);

    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'NickoOG' } });
    fireEvent.click(screen.getByTitle('Submit Username'));

    fireEvent.click(screen.getByTitle("Submit Compare"));

    await waitFor(() => expect(screen.getByText('Park One')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Park One'));

    await waitFor(() => {
        expect(screen.getByText(/test description/i)).toBeInTheDocument();
        expect(screen.getByText('Test City, TC')).toBeInTheDocument();
        expect(screen.getByText('Visit Park Website')).toHaveAttribute('href', 'http://example.com');
        expect(screen.getByText('Hiking')).toBeInTheDocument();
        expect(screen.getByText('Restrooms')).toBeInTheDocument();
        expect(screen.getByText('Picnic Areas')).toBeInTheDocument();

        expect(screen.getByText('Entrance Fees: No fees information available')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTitle('detailsButton_parkCode1'));
    await waitFor(() => expect(screen.getByText('Park One')).toBeInTheDocument());
});

// --------------------------------
// Anika's Suggest Park tests
test('successfully suggests a common favorite park', async () => {
    sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));

    // 1 fetch from handleAddToGroup()
    // handleCompare() -> fetchGroupFavorites(username)
    // handleCompare() -> fetchParkDetails(parkCode)
    // handleSuggest() -> fetchUserFavorites(member)
    // handleSuggest() -> fetchUserFavorites(member)
    // handleSuggest() -> fetchParkDetails(commonFavorites[0])
    fetch.mockResponses(
        [JSON.stringify({data: ["NickoOG1"]}), {status: 200}],
        [
            JSON.stringify({
                parksToUsers: [
                    {parkCode1: ['NickoOG1', 'testUser']}
                ],
                groupSize: 1,
                sortedIDs: [{parkCode1: 2}],
                groupMembers: ["NickoOG1"]
            }),
            { status: 200 }
        ],
        [JSON.stringify({ data: [{ fullName: 'Park One' }] }), { status: 200 }],
        [JSON.stringify({favorites: ['parkCode1']}), { status: 200 }],
        [JSON.stringify({favorites: ['parkCode1']}), { status: 200 }],
        [JSON.stringify({
            data: [{
                parkCode: 'parkCode1',
                fullName: 'Common Park',
                images: [{ url: 'http://example.com/park.jpg' }],
                description: 'A common favorite park',
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
        }), { status: 200 }]
    );

    renderWithRouter(<Compare />);

    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'NickoOG1' } });
    fireEvent.click(screen.getByTitle('Submit Username'));

    await waitFor(() => expect(screen.getByText('Successfully added NickoOG1 to your group of friends')).toBeInTheDocument());

    fireEvent.click(screen.getByTitle("Submit Compare"));

    await waitFor(() => {
        expect(screen.getByText(/Park One/i)).toBeInTheDocument();
    });


    // Compare parks done, now do suggest stuff
    fireEvent.click(screen.getByTitle('Submit Suggestion'));

    await waitFor(() => {
        expect(screen.getByText('Common Park')).toBeInTheDocument();
        expect(screen.getByText('Description: A common favorite park')).toBeInTheDocument();
        expect(screen.getByAltText('View of Common Park').src).toBe('http://example.com/park.jpg');
    });
});

// test('handles no common favorites scenario', async () => {
//     fetch.mockResponseOnce(JSON.stringify([]), { status: 200 }); // No common favorites returned
//
//     renderWithRouter(<Compare />);
//     fireEvent.click(screen.getByTitle('Submit Suggestion'));
//
//     await waitFor(() => {
//         expect(screen.getByText('No common favorites found among the group.')).toBeInTheDocument();
//     });
// });
//
// test('error handling when suggestion fetch fails', async () => {
//     fetch.mockReject(new Error('Network Error'));
//
//     renderWithRouter(<Compare />);
//     fireEvent.click(screen.getByTitle('Submit Suggestion'));
//
//     await waitFor(() => {
//         expect(screen.getByText('Error fetching suggestions: Network Error')).toBeInTheDocument();
//     });
// });
//
// test('suggests a park when no common favorites are found', async () => {
//     fetch.mockResponses(
//         [JSON.stringify([]), { status: 200 }],
//         [JSON.stringify({ fullName: 'Random Park', description: 'Randomly chosen park', images: [{ url: 'http://example.com/park.jpg' }] }), { status: 200 }]
//     );
//
//     renderWithRouter(<Compare />);
//     fireEvent.click(screen.getByTitle('Submit Suggestion'));
//
//     await waitFor(() => {
//         expect(screen.getByText('Random Park')).toBeInTheDocument();
//         expect(screen.getByText('Randomly chosen park')).toBeInTheDocument();
//         expect(screen.getByAltText('View of Random Park').src).toBe('http://example.com/park.jpg');
//     });
// });