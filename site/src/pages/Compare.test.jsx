import fetchMock from "jest-fetch-mock";
import {render} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import SearchParks from "./SearchParks";
import React from "react";
import Compare from "./Compare";

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