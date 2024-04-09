import fetchMock from "jest-fetch-mock";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import SearchParks from "./SearchParks";
import React from "react";
import Compare from "./Compare";
import Login from "./Login";

fetchMock.enableMocks();

beforeEach(() => {
    fetch.resetMocks();
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
    global.fetch = jest.fn(() => Promise.reject(new Error('Exception occurred while adding user to group')));


    renderWithRouter(<Compare />);

    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'not_a_user' } });
    fireEvent.click(screen.getByTitle('Submit Username'));

    await waitFor(() => expect(screen.getByText('Exception occurred while adding user to group')).toBeInTheDocument());
});