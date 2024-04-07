import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SearchParks = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("parkName"); // Default search type
    const [parks, setParks] = useState([]);
    const [selectedPark, setSelectedPark] = useState(null); // State to track selected park for details
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [pageNumber, setPageNumber] = useState(1);
    const limit = 10;
    const [parkAmenities, setParkAmenities] = useState([]); // State to store amenities

    // const API_KEY = "uWVzTURerzitH3nepQc1tvbSW1Ia5cnt7g8Pp0yA";
    const API_KEY = process.env.REACT_APP_API_KEY;
    const BASE_URL = "https://developer.nps.gov/api/v1/parks";

    const [allFetchedParks, setFetchedParks] = useState([]); // Store ALL parks from previous search
    let start_idx = 0;

    const fetchParks = async (parameters) => {
        if (parameters === "?limit=10&q=") {
            parameters = "?limit=10";
        }
        const url = `${BASE_URL}${parameters}`;

        console.log("fetchParks: " + url);
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'X-Api-Key': API_KEY, }
            });
            // if(parameters == "?limit=10&q="){
            //     setError("Test");
            //     return [];
            // }
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                return data.data; // Return the parks data
            } else {
                setError("Failed to fetch parks.");
                return []; // Return empty array on failure
            }
        } catch (error) {
            setError("Error fetching data.");
            return [];
        }
    };

    const fetchAmenitiesOfPark = async (parkCode) => {
        const url = `https://developer.nps.gov/api/v1/amenities?q=${parkCode}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'X-Api-Key': API_KEY }
            });
            if (response.ok) {
                const data = await response.json();
                console.log(`fetchAmenitiesOfPark: ${url}`);
                console.log(data);
                return data.data; // Adjust if the data structure requires
            } else {
                console.error("Failed to fetch amenities.");
                return [];
            }
        } catch (error) {
            console.error("Error fetching amenities data.");
            return [];
        }
    };

    const fetchParkDetails = async (parkCode) => {
        // Placeholder for the real implementation
        // In a real scenario, you would fetch this data from your backend
        const response = await fetch(`${BASE_URL}?parkCode=${parkCode}`, {
            method: 'GET',
            headers: { 'X-Api-Key': API_KEY }
        });
        if (!response.ok) {
            console.error("Failed to fetch park details");
            return null;
        }
        const data = await response.json();
        console.log(`fetchParkDetails: ${BASE_URL}?parkCode=${parkCode}`);
        console.log(data);
        return data.data[0]; // Assuming the API returns an array and you're interested in the first item
    };

    const handleParkSelection = async (parkCode) => {
        if (selectedPark && selectedPark.parkCode === parkCode) {
            // If the selected park is already open, close the details
            setSelectedPark(null);
            setParkAmenities([]);
        } else {
            // Fetch and show the details for the new park
            console.log(`Calling fetchParkDetails(${parkCode})`)
            const details = await fetchParkDetails(parkCode);
            setSelectedPark(details);
            // Fetch and show amenities for the new park
            console.log(`Calling fetchAmenitiesOfPark(${parkCode})`)
            const amenities = await fetchAmenitiesOfPark(`${parkCode}`);
            setParkAmenities(amenities);
        }
    };


    const handleSearch = async (e) => {
        e.preventDefault();
        setPageNumber(1); // Reset to the first page

        let parameters = `?limit=${limit}`;

        console.log(searchType);

        if (searchType !== "state") {
            /*if(searchType === "amenities"){
                parameters = `/parksplaces${parameters}&q=${encodeURIComponent(searchQuery)}`;
                const fetchedParks = await fetchAmenities(parameters);
                setFetchedParks(fetchedParks);
                setParks(fetchedParks.slice(0, 10));
                start_idx = 0;
                setSelectedPark(null); // Reset selected park details
                return;
            }*/
            parameters += `&q=${encodeURIComponent(searchQuery)}`;
        } else if (searchType === "state") {
            parameters += `&stateCode=${encodeURIComponent(searchQuery)}`;
        }
        // Add more parameters based on searchType as necessary

        const fetchedParks = await fetchParks(parameters);
        setParks(fetchedParks);
        setSelectedPark(null); // Reset selected park details
    };

    const loadMoreResults = async () => {
        setPageNumber(prevPage => prevPage + 1);

        let parameters = `?limit=${limit}&start=${pageNumber * limit}`;

        if (searchType !== "state") {
            parameters += `&q=${encodeURIComponent(searchQuery)}`;
        } else if (searchType === "state") {
            parameters += `&stateCode=${encodeURIComponent(searchQuery)}`;
        }
        // Handle other parameters as necessary

        const fetchedParks = await fetchParks(parameters);
        setParks(prevParks => [...prevParks, ...fetchedParks]);
    };

    const handleAmenitiesClick = async (amenity) => {
        setSearchQuery(amenity);
        setSearchType('amenities');
        await handleSearchWithNewTerm(amenity, 'amenities');
    };

    const handleActivitiesClick = async (activity) => {
        setSearchQuery(activity);
        setSearchType('activity');
        await handleSearchWithNewTerm(activity, 'activity');
    };

    const handleLocationClick = async (stateCode) => {
        setSearchQuery(stateCode);
        setSearchType('state');
        await handleSearchWithNewTerm(stateCode, 'state');
    };

    const handleSearchWithNewTerm = async (newSearchTerm, newSearchType) => {
        // Trigger a new search with the clicked info as the search term
        let parameters = `?limit=${limit}`;

        if (newSearchType === 'state') {
            parameters += `&stateCode=${encodeURIComponent(newSearchTerm)}`;
        } else {
            parameters += `&q=${encodeURIComponent(newSearchTerm)}`;
        }

        // Add more parameters based on searchType as necessary

        const fetchedParks = await fetchParks(parameters);
        setParks(fetchedParks);
        setSelectedPark(null); // Reset selected park details
    };

    return (
        <>
            <style>{`
                    .detailsBox {
                        border: 1px solid #ccc;
                        padding: 16px;
                        margin-top: 16px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        background-color: #fff;
                    }
                    
                    .clickable-text {
                        color: #0645AD; /* A color typically used for links */
                        cursor: pointer;
                        text-decoration: underline;
                        margin-right: 5px; /* Add a little space between the items */
                    }
                `}</style>
            <div>
                <Header />
                <h2>Search Parks</h2>
                <form onSubmit={handleSearch}>
                    <label htmlFor={"searchQuery"}>Search: </label>
                    <input id="searchQuery" type="text" value={searchQuery} title={"Search Box"}
                           onChange={(e) => setSearchQuery(e.target.value)} tabIndex={0} autoFocus/>

                    <input type="radio" id="parkName" name="searchTerm" value="parkName" checked={searchType === "parkName"} title={"Park Radio Button"}
                           onChange={() => setSearchType("parkName")} tabIndex={1}/>
                    <label htmlFor="parkName">Park Name</label><br/>

                    <input type="radio" id="amenities" name="searchTerm" value="amenities" title={"Amenities Radio Button"}
                           checked={searchType === "amenities"} onChange={() => setSearchType("amenities")} />
                    <label htmlFor="amenities">Amenities</label><br/>

                    <input type="radio" title={"stateRadio"} id="state" name="searchTerm" value="state" checked={searchType === "state"}
                           onChange={() => setSearchType("state")} />
                    <label htmlFor="state">State</label><br/>

                    <input type="radio" id="activity" name="searchTerm" value="activity" title={"Activity Radio Button"} checked={searchType === "activity"}
                           onChange={() => setSearchType("activity")} />
                    <label htmlFor="activity">Activity</label><br/>

                    <input type="submit" value="Search" title={"search"} id={"search"} tabIndex={2}/>
                </form>
                {parks.length > 0 && (
                    <button onClick={loadMoreResults} title={"loadMoreResults"} id={"loadMoreResults"} tabIndex={3}>Load More Results</button>
                )}
                {error && <p>{error}</p>}
                <ul>
                    {parks.map(park => (
                        <li key={park.id}>
                            <button title={"detailsButton_" + park.parkCode} onClick={() => handleParkSelection(park.parkCode)}>{park.fullName}</button>
                            {selectedPark && selectedPark.parkCode === park.parkCode && (
                                <div className="detailsBox">
                                    <h3>{selectedPark.fullName}</h3>
                                    <img src={selectedPark.images[0].url} alt={`View of ${selectedPark.fullName}`}
                                         style={{width: '100%', maxHeight: '300px', objectFit: 'cover'}}/>
                                    <p>Description: {selectedPark.description}</p>
                                    <div>
                                        <h4>Location:</h4>
                                        <p onClick={() => handleLocationClick(selectedPark.addresses[0].stateCode)} className="clickable-text">
                                            {selectedPark.addresses[0].city}, {selectedPark.addresses[0].stateCode}
                                        </p>
                                    </div>
                                    <a href={selectedPark.url} target="_blank" rel="noopener noreferrer">Visit Park
                                        Website</a>
                                    <p>Entrance
                                        Fees: {selectedPark.entranceFees.length > 0 ? `$${selectedPark.entranceFees[0].cost}` : 'No fees information available'}</p>

                                    <h4>Activities:</h4>
                                    <p>
                                        {selectedPark.activities.map((activity, index) => (
                                            <React.Fragment key={activity.id}>
                                            <span className="clickable-text"
                                                  onClick={() => handleActivitiesClick(activity.name)}>
                                                {activity.name}
                                            </span>{index < selectedPark.activities.length - 1 ? ', ' : ''}
                                            </React.Fragment>
                                        ))}
                                    </p>

                                    <h4>Amenities:</h4>
                                    <p>
                                        {parkAmenities.map((amenity, index) => (
                                            <React.Fragment key={amenity.id}>
                                            <span className="clickable-text" onClick={() => handleAmenitiesClick(amenity.name)}>
                                                {amenity.name}
                                            </span>
                                                {index < parkAmenities.length - 1 ? ', ' : ''}
                                            </React.Fragment>
                                        ))}
                                    </p>
                                    <div>
                                        <h4>Operating Hours:</h4>
                                        <p>{selectedPark.operatingHours[0].description}</p>
                                    </div>

                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                <Footer />
            </div>
        </>
    );
}

export default SearchParks;
