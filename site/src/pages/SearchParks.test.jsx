import React from 'react';
import {render, screen, waitFor, act, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SearchParks from './SearchParks'; // Make sure the path is correct

// Mock the global fetch function
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({
            data: [
                // ... your mock data here ...
            ],
        }),
    })
);

// Mock the navigate function from useNavigate
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
    useNavigate: () => jest.fn(),
}));
const mockNavigate = jest.fn();
describe('SearchParks', () => {
    beforeEach(() => {
        fetch.mockClear();
        mockNavigate.mockClear();
    });

    it('renders the component and executes a search', async () => {
        render(
            <BrowserRouter>
                <SearchParks />
            </BrowserRouter>
        );

        const searchInput = screen.getByLabelText(/Search:/i);
        await userEvent.type(searchInput, 'Yellowstone');
        const searchButton = screen.getByTitle('search');
        await userEvent.click(searchButton);

        // Wait for the mock fetch call to resolve and the component to update
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    });

    // Add more tests as needed
    it('renders the search form and executes a search', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: [{ id: '1', fullName: 'Yellowstone National Park', parkCode: 'yell' }] }),
        });

        render(
            <BrowserRouter>
                <SearchParks />
            </BrowserRouter>
        );

        const searchInput = screen.getByLabelText(/Search:/i);
        userEvent.type(searchInput, 'Yellowstone');
        const searchButton = screen.getByTitle('search');

        // Wrap the user event in act when it will trigger state updates
        await act(async () => {
            userEvent.click(searchButton);
        });

        // Wait for the fetch to be called and verify if parks are rendered
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
            expect(screen.getByText('Yellowstone National Park')).toBeInTheDocument();
        });
    });

    it('loads more results when button is clicked', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                data: new Array(10).fill(null).map((_, index) => ({
                    id: String(index),
                    fullName: `Park ${index}`,
                    parkCode: `code${index}`,
                })),
            }),
        });


        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: [{ id: '1', fullName: 'Yellowstone National Park', parkCode: 'yell' }] }),
        });

        render(
            <BrowserRouter>
                <SearchParks />
            </BrowserRouter>
        );

        const searchInput = screen.getByLabelText(/Search:/i);
        userEvent.type(searchInput, 'Yellowstone');
        const searchButton = screen.getByTitle('search');

        // Wrap the user event in act when it will trigger state updates
        await act(async () => {
            userEvent.click(searchButton);
        });

        // Assume initial fetch for parks
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

        // Mock fetch for loading more parks
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                data: new Array(10).fill(null).map((_, index) => ({
                    id: String(index + 10),
                    fullName: `Park ${index + 10}`,
                    parkCode: `code${index + 10}`,
                })),
            }),
        });

        const loadMoreButton = screen.getByTitle('loadMoreResults');
        await act(async () => {
            userEvent.click(loadMoreButton);
        });

        // Verify fetch is called again and more parks are loaded
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(2);
            expect(screen.getByText('Park 9')).toBeInTheDocument();
        });
    });

    it('failed to fetch parks', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            // json: async () => ({ data: [] }),
        });

        render(
            <BrowserRouter>
                <SearchParks />
            </BrowserRouter>
        );

        const searchInput = screen.getByLabelText(/Search:/i);
        // userEvent.type(searchInput, '');
        const searchButton = screen.getByTitle('search');

        // Wrap the user event in act when it will trigger state updates
        await act(async () => {
            userEvent.click(searchButton);
        });

        // Wait for the fetch to be called and verify if parks are rendered
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
            expect(screen.getByText("Failed to fetch parks.")).toBeInTheDocument();
        });
    });

    it('fetch park and see its ameninities', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: [{ id: '1', fullName: 'Yellowstone National Park', parkCode: 'yell' }] }),
        });

        render(
            <BrowserRouter>
                <SearchParks />
            </BrowserRouter>
        );

        const searchInput = screen.getByLabelText(/Search:/i);
        userEvent.type(searchInput, 'Yellowstone');
        const searchButton = screen.getByTitle('search');

        // Wrap the user event in act when it will trigger state updates
        await act(async () => {
            userEvent.click(searchButton);
        });

        // Wait for the fetch to be called and verify if parks are rendered
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
            expect(screen.getByText('Yellowstone National Park')).toBeInTheDocument();
        });

        // My attempt to use details feature. I think the first fetch works but doesn't update coverage so not sure
        // fetchParkDetails
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                data:
                    [
                        {
                            "id": "77E0D7F0-1942-494A-ACE2-9004D2BDC59E",
                            "url": "https://www.nps.gov/abli/index.htm",
                            "fullName": "Yellowstone National Park",
                            "parkCode": "abli",
                            "description": "For over a century people from around the world have come to rural Central Kentucky to honor the humble beginnings of our 16th president, Abraham Lincoln. His early life on Kentucky's frontier shaped his character and prepared him to lead the nation through Civil War. Visit our country's first memorial to Lincoln, built with donations from young and old, and the site of his childhood home.",
                            "latitude": "37.5858662",
                            "longitude": "-85.67330523",
                            "latLong": "lat:37.5858662, long:-85.67330523",
                            "activities": [
                                {
                                    "id": "13A57703-BB1A-41A2-94B8-53B692EB7238",
                                    "name": "Astronomy"
                                },
                                {
                                    "id": "D37A0003-8317-4F04-8FB0-4CF0A272E195",
                                    "name": "Stargazing"
                                }
                            ],
                            "topics": [
                                {
                                    "id": "D10852A3-443C-4743-A5FA-6DD6D2A054B3",
                                    "name": "Birthplace"
                                },
                                {
                                    "id": "F669BC40-BDC4-41C0-9ACE-B2CD25373045",
                                    "name": "Presidents"
                                },
                                {
                                    "id": "0D00073E-18C3-46E5-8727-2F87B112DDC6",
                                    "name": "Animals"
                                }
                            ],
                            "states": "KY",
                            "contacts": {
                                "phoneNumbers": [
                                    {
                                        "phoneNumber": "2703583137",
                                        "description": "",
                                        "extension": "",
                                        "type": "Voice"
                                    },
                                    {
                                        "phoneNumber": "2703583874",
                                        "description": "",
                                        "extension": "",
                                        "type": "Fax"
                                    }
                                ],
                                "emailAddresses": [
                                    {
                                        "description": "",
                                        "emailAddress": "ABLI_Administration@nps.gov"
                                    }
                                ]
                            },
                            "entranceFees": [],
                            "entrancePasses": [],
                            "fees": [],
                            "directionsInfo": "The Birthplace Unit of the park is located approximately 2 miles south of the town of Hodgenville on U.S. Highway 31E South. The Boyhood Home Unit at Knob Creek is located approximately 10 miles northeast of the Birthplace Unit of the park.",
                            "directionsUrl": "http://www.nps.gov/abli/planyourvisit/directions.htm",
                            "operatingHours": [
                                {
                                    "exceptions": [
                                        {
                                            "exceptionHours": {},
                                            "startDate": "2024-11-28",
                                            "name": "Park is Closed",
                                            "endDate": "2024-11-28"
                                        },
                                        {
                                            "exceptionHours": {},
                                            "startDate": "2024-12-25",
                                            "name": "Park is Closed",
                                            "endDate": "2024-12-25"
                                        },
                                        {
                                            "exceptionHours": {},
                                            "startDate": "2025-01-01",
                                            "name": "Park is Closed",
                                            "endDate": "2025-01-01"
                                        }
                                    ],
                                    "description": "Memorial Building:\nopen 9:00 am - 4:30 pm eastern time.\n\nBirthplace Unit Visitor Center and Grounds: \nopen 9:00 am - 5:00 pm eastern time.",
                                    "standardHours": {
                                        "wednesday": "9:00AM - 5:00PM",
                                        "monday": "9:00AM - 5:00PM",
                                        "thursday": "9:00AM - 5:00PM",
                                        "sunday": "9:00AM - 5:00PM",
                                        "tuesday": "9:00AM - 5:00PM",
                                        "friday": "9:00AM - 5:00PM",
                                        "saturday": "9:00AM - 5:00PM"
                                    },
                                    "name": "Birthplace Unit"
                                },
                                {
                                    "exceptions": [
                                        {
                                            "exceptionHours": {
                                                "wednesday": "Closed",
                                                "monday": "Closed",
                                                "thursday": "Closed",
                                                "sunday": "10:00AM - 4:00PM",
                                                "tuesday": "Closed",
                                                "friday": "Closed",
                                                "saturday": "10:00AM - 4:00PM"
                                            },
                                            "startDate": "2024-04-01",
                                            "name": "Spring Hours",
                                            "endDate": "2024-05-31"
                                        }
                                    ],
                                    "description": "The Boyhood Home Unit at Knob Creek Grounds:\nopen daily dawn to dusk.\n\nKnob Creek Tavern Visitor Center:\nHours are seasonal. Hours are to be announced for 2024.",
                                    "standardHours": {
                                        "wednesday": "Closed",
                                        "monday": "Closed",
                                        "thursday": "Closed",
                                        "sunday": "Closed",
                                        "tuesday": "Closed",
                                        "friday": "Closed",
                                        "saturday": "Closed"
                                    },
                                    "name": "Boyhood Unit"
                                }
                            ],
                            "addresses": [
                                {
                                    "postalCode": "42748",
                                    "city": "Hodgenville",
                                    "stateCode": "KY",
                                    "countryCode": "US",
                                    "provinceTerritoryCode": "",
                                    "line1": "2995 Lincoln Farm Road",
                                    "type": "Physical",
                                    "line3": "",
                                    "line2": ""
                                },
                                {
                                    "postalCode": "42748",
                                    "city": "Hodgenville",
                                    "stateCode": "KY",
                                    "countryCode": "US",
                                    "provinceTerritoryCode": "",
                                    "line1": "2995 Lincoln Farm Road",
                                    "type": "Mailing",
                                    "line3": "",
                                    "line2": ""
                                }
                            ],
                            "images": [
                                {
                                    "credit": "NPS Photo",
                                    "title": "The Memorial Building with fall colors",
                                    "altText": "The Memorial Building surrounded by fall colors",
                                    "caption": "Over 200,000 people a year come to walk up the steps of the Memorial Building to visit the site where Abraham Lincoln was born",
                                    "url": "https://www.nps.gov/common/uploads/structured_data/3C861078-1DD8-B71B-0B774A242EF6A706.jpg"
                                },
                                {
                                    "credit": "NPS Photo",
                                    "title": "The Memorial Building",
                                    "altText": "The first memorial erected to honor Abraham Lincoln",
                                    "caption": "The Memorial Building constructed on the traditional site of the birth of Abraham Lincoln.",
                                    "url": "https://www.nps.gov/common/uploads/structured_data/3C861263-1DD8-B71B-0B71EF9B95F9644F.jpg"
                                },
                                {
                                    "credit": "NPS Photo",
                                    "title": "The Symbolic Birth Cabin of Abraham Lincoln",
                                    "altText": "The symbolic birth cabin on the traditional site of the birth of Abraham Lincoln.",
                                    "caption": "The symbolic birth cabin of Abraham Lincoln.",
                                    "url": "https://www.nps.gov/common/uploads/structured_data/3C86137D-1DD8-B71B-0B978BACD7EBAEF1.jpg"
                                },
                                {
                                    "credit": "NPS Photo",
                                    "title": "Statue of the Lincoln Family in the Visitor Center",
                                    "altText": "Statue of the Lincoln family in the park's Visitor Center",
                                    "caption": "Visitors to the park can view the statue of the Lincoln family.",
                                    "url": "https://www.nps.gov/common/uploads/structured_data/3C8614D1-1DD8-B71B-0B1AF72CA452B051.jpg"
                                }
                            ]
                        }
                    ]
            }),
        });
        // fetchAmenitiesOfPark
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: [

                        {
                            "id": "4E4D076A-6866-46C8-A28B-A129E2B8F3DB",
                            "name": "Accessible Rooms",
                            "categories": [
                                "Accessibility"
                            ]
                        }

                ]
            }),
        });

        fireEvent.click(screen.getByText('Yellowstone National Park'));
        // fireEvent works for this. NOT userEvent

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(2);
            // expect(screen.getByText('Accessible Rooms')).toBeInTheDocument();
        }, {timeout: 5000});
    });

    // fectchAmenities (from searching)
    it('fetchAmenities basic success', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                total: 1,
                limit: 10,
                start: 0,
                data: [
                    [
                        {
                            id: '4E4D076A-6866-46C8-A28B-A129E2B8F3DB',
                            name: 'Accessible Rooms',
                            parks: [
                                {
                                    "states": "KY",
                                    "designation": "National Historical Park",
                                    "parkCode": "abli",
                                    "fullName": "Abraham Lincoln Birthplace National Historical Park",
                                    "places": [
                                        {
                                            "title": "Lincoln Tavern",
                                            "id": "D5265572-4FD7-4078-A73E-F9B13956C5E5",
                                            "url": "https://www.nps.gov/places/lincoln-tavern.htm"
                                        }
                                    ],
                                    "url": "http://www.nps.gov/abli/",
                                    "name": "Abraham Lincoln Birthplace"
                                }
                            ]
                        }
                    ]
                ]
            }),
        });

        render(
            <BrowserRouter>
                <SearchParks />
            </BrowserRouter>
        );


        const searchInput = screen.getByLabelText(/Search:/i);
        userEvent.type(searchInput, 'Wheelchair Accessible');
        const searchButton = screen.getByTitle('search');

        // Click on Amenities button
        userEvent.click(screen.getByLabelText('Amenities'));

        // Wrap the user event in act when it will trigger state updates
        await act(async () => {
            userEvent.click(searchButton);
        });

        // Wait for the fetch to be called and verify if parks are rendered
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
            expect(screen.getByText("Abraham Lincoln Birthplace National Historical Park")).toBeInTheDocument();
        }, {timeout: 5000}); // timeout of 5000 is 5 seconds
    });

    it('fetchAmenities basic fail', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({
                total: 1,
                limit: 10,
                start: 0,
                data: [
                    [
                        {

                        }
                    ]
                ]
            }),
        });

        render(
            <BrowserRouter>
                <SearchParks />
            </BrowserRouter>
        );


        const searchInput = screen.getByLabelText(/Search:/i);
        userEvent.type(searchInput, 'Wheelchair Accessible');
        const searchButton = screen.getByTitle('search');

        // Click on Amenities button
        userEvent.click(screen.getByLabelText('Amenities'));

        // Wrap the user event in act when it will trigger state updates
        await act(async () => {
            userEvent.click(searchButton);
        });

        // Wait for the fetch to be called and verify if parks are rendered
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
            expect(screen.getByText("Failed to fetch amenities.")).toBeInTheDocument();
        }, {timeout: 5000}); // timeout of 5000 is 5 seconds
    });
});