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
                sortedIDs: [{parkCode1: 2}]
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
                sortedIDs: [{parkCode1: 2}]
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
                sortedIDs: [{parkCode1: 2}]
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
                sortedIDs: [{parkCode1: 2}]
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
                sortedIDs: [{parkCode1: 2}]
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

test('fetchAmenitiesOfPark EXCEPTION', async () => {
    sessionStorage.setItem('userInfo', JSON.stringify({ username: 'testUser' }));

    // Mock fetch to throw an error
    const origFetch = global.fetch;

    fetch.mockResponses(
        [JSON.stringify({data: ["NickoOG1"]}), {status: 200}],
        [
            JSON.stringify({
                parksToUsers: [
                    {parkCode1: ['NickoOG1', 'testUser']}
                ],
                groupSize: 1,
                sortedIDs: [{parkCode1: 2}]
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