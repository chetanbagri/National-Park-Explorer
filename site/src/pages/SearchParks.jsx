import React, {useEffect, useState} from 'react';
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
    const [userFavorites, setUserFavorites] = useState([]);    const [isFavorite, setIsFavorite] = useState(false);
    const [hoveredPark, setHoveredPark] = useState(null);
    const [favoriteParks, setFavoriteParks] = useState([]);
    const [favoriteMessage, setFavoriteMessage] = useState("");
    const [favoriteMessageColor, setFavoriteMessageColor] = useState("");

    const API_KEY = process.env.REACT_APP_API_KEY;
    const BASE_URL = "https://developer.nps.gov/api/v1/parks";
    const [allFetchedParks, setFetchedParks] = useState([]); // Store ALL parks from previous search
    let start_idx = 0;

    useEffect(() => {
        // Assuming username is stored in sessionStorage; adjust as per your application's auth strategy
        const username = JSON.parse(sessionStorage.getItem('userInfo'))?.username;
        if (username) {
            fetchUserFavorites(username).then(favorites => {
                setUserFavorites(favorites)

                let updatedUser = JSON.parse(sessionStorage.getItem('userInfo'));
                updatedUser.favorites = favorites;
                sessionStorage.setItem('userInfo', JSON.stringify(updatedUser));
            });
            // console.log(userFavorites);
        }
    }, []); // Empty dependency array ensures this runs only once on component mount

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
                if (data.data.length === 0) {
                    setError("There are no more results for this query")
                }
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
    const fetchUserFavorites = async (username) => {
        try {
            const response = await fetch(`/favorites?username=${username}`);
            if (!response.ok) {
                setError('Failed to fetch user favorites');
            }
            const data = await response.json();
            console.log('User favorites:', data.favorites);
            return data.favorites;
        } catch (error) {
            console.error('Error fetching user favorites:', error);
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
            setIsFavorite(userFavorites.includes(parkCode));
        }
    };

    // Nick: Wasn't used so commented it to help with coverage
    // const addToFavorites = async (parkCode) => {
    //     try {
    //         const username = JSON.parse(sessionStorage.getItem('userInfo')).username;
    //         const response = await fetch(`/favorites/add?username=${username}&parkId=${parkCode}`, {
    //             method: 'POST',
    //         });
    //
    //         if (!response.ok) {
    //             throw new Error('Failed to add park to favorites');
    //         }
    //         else{
    //             console.log("response ok");
    //         }
    //
    //         const data = await response.json();
    //         setUserFavorites([...userFavorites, parkCode]);
    //     } catch (error) {
    //         console.error('Error adding park to favorites:', error);
    //     }
    // };



    const handleSearch = async (e) => {
        e.preventDefault();
        setPageNumber(1); // Reset to the first page

        let parameters = `?limit=${limit}`;

        console.log(searchType);

        if (searchQuery != "") {
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
        }

        const fetchedParks = await fetchParks(parameters);
        setParks(fetchedParks);
        setSelectedPark(null); // Reset selected park details
    };

    const loadMoreResults = async () => {
        setPageNumber(prevPage => prevPage + 1);

        let parameters = `?limit=${limit}&start=${pageNumber * limit}`;

        if (searchQuery != "") {
            if (searchType !== "state") {
                parameters += `&q=${encodeURIComponent(searchQuery)}`;
            } else if (searchType === "state") {
                parameters += `&stateCode=${encodeURIComponent(searchQuery)}`;
            }
        }
        // Handle other parameters as necessary

        const fetchedParks = await fetchParks(parameters);
        setParks(prevParks => [...prevParks, ...fetchedParks]);
    };


    const handleAddToFavorites = async (parkCode) => {
        try {
            const username = JSON.parse(sessionStorage.getItem('userInfo')).username;

            if (userFavorites.includes(parkCode)) {
                setFavoriteMessage("Error: This park is already in your favorites.");
                setFavoriteMessageColor("red");
                return;
            }
            const response = await fetch(`/favorites/add?username=${username}&parkId=${parkCode}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to add park to favorites');
            }
            else{
                console.log("response ok");
                setFavoriteMessage("Park successfully added to favorites!");
                setFavoriteMessageColor("green");
            }

            const data = await response.json();
            setUserFavorites([...userFavorites, parkCode]);
        } catch (error) {
            console.error('Error adding park to favorites:', error);
            setFavoriteMessage("Error adding park to favorites.");
            setFavoriteMessageColor("red");
        }
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
                    
                    
                    .add-to-favorites {
                        font-size: 24px;
                        font-weight: bold;
                        color: green;
                        margin-left: 10px;
                        cursor: pointer;
                    }

                   
                    .main {
                        overflow: scroll;
                        height: 80%;
                    }
                    
                    ul {
                        list-style-type: none; /* Remove bullet points from ul elements */
                        padding-left: 30; /* Remove padding to align content to the left */
                    }
                    
                    .favorite-status {
                        font-weight: bold;
                        color: red;
                    }
                `}</style>
            <div className={"main"}>
                <Header/>
                <h2>Search Parks</h2>
                <div className="favmessage" style={{color: favoriteMessageColor}}>
                    {favoriteMessage && <p>{favoriteMessage}</p>}
                </div>
                <form onSubmit={handleSearch}>
                    <label htmlFor={"searchQuery"}>Search: </label>
                    <input id="searchQuery" type="text" value={searchQuery} title={"Search Box"}
                           onChange={(e) => setSearchQuery(e.target.value)} tabIndex={0} autoFocus/>

                    <input type="radio" id="parkName" name="searchTerm" value="parkName"
                           checked={searchType === "parkName"} title={"Park Radio Button"}
                           onChange={() => setSearchType("parkName")} tabIndex={1}/>
                    <label htmlFor="parkName">Park Name</label><br/>

                    <input type="radio" id="amenities" name="searchTerm" value="amenities"
                           title={"Amenities Radio Button"}
                           checked={searchType === "amenities"} onChange={() => setSearchType("amenities")}/>
                    <label htmlFor="amenities">Amenities</label><br/>

                    <input type="radio" title={"stateRadio"} id="state" name="searchTerm" value="state"
                           checked={searchType === "state"}
                           onChange={() => setSearchType("state")}/>
                    <label htmlFor="state">State</label><br/>

                    <input type="radio" id="activity" name="searchTerm" value="activity" title={"Activity Radio Button"}
                           checked={searchType === "activity"}
                           onChange={() => setSearchType("activity")}/>
                    <label htmlFor="activity">Activity</label><br/>

                    <input type="submit" value="Search" title={"search"} id={"search"} tabIndex={2}/>
                </form>
                {parks.length > 0 && (
                    <button onClick={loadMoreResults} title={"loadMoreResults"} id={"loadMoreResults"} tabIndex={3}>Load
                        More Results</button>
                )}
                {error && <p>{error}</p>}
                <ul>
                    {parks.map(park => (
                        <li key={park.id} className={"search-result"}
                            onMouseEnter={() => setHoveredPark(park.parkCode)}
                            onMouseLeave={() => setHoveredPark(null)}>
                            <div className="park-button">
                                <button title={`detailsButton_${park.parkCode}`} className={"search-result-button"}
                                        onClick={() => handleParkSelection(park.parkCode)}>
                                    {park.fullName}
                                </button>
                                {hoveredPark === park.parkCode && (
                                    <span className="add-to-favorites" tabIndex="0"
                                          role="button"
                                          aria-label="Add to favorites"
                                          onClick={() => handleAddToFavorites(park.parkCode)}>
                                            +
                                    </span>
                                )}
                            </div>
                            {selectedPark && selectedPark.parkCode === park.parkCode && (
                                <div className="detailsBox">
                                    <h3 className={"park-full-name"}>{selectedPark.fullName}</h3>
                                    <img className={"park-picture"} src={selectedPark.images[0].url}
                                         alt={`View of ${selectedPark.fullName}`}
                                         style={{width: '100%', maxHeight: '300px', objectFit: 'cover'}}/>
                                    <p className={"park-description"}>Description: {selectedPark.description}</p>
                                    <div>
                                        <h4>Location:</h4>
                                        <p tabIndex={0} onClick={() => handleLocationClick(selectedPark.addresses[0].stateCode)}
                                           className="clickable-text park-location"
                                           onKeyDown={(event) => {
                                               // Trigger the click event when the Enter key is pressed
                                               if (event.key === 'Enter') {
                                                   handleLocationClick(selectedPark.addresses[0].stateCode);
                                               }
                                           }}
                                        >
                                            {selectedPark.addresses[0].city}, {selectedPark.addresses[0].stateCode}
                                        </p>
                                    </div>
                                    <a className={"park-url"} href={selectedPark.url} target="_blank"
                                       rel="noopener noreferrer">Visit Park
                                        Website</a>
                                    <p className={"park-entrance-fee"}>Entrance
                                        Fees: {selectedPark.entranceFees.length > 0 ? `$${selectedPark.entranceFees[0].cost}` : 'No fees information available'}</p>

                                    {userFavorites.includes(park.parkCode) && (
                                        <p className="favorite-status">This park is in your favorites list.</p>
                                    )}
                                    {!userFavorites.includes(park.parkCode) && (
                                        <p className="favorite-status">This park is not in your favorites list.</p>
                                    )}
                                    <h4>Activities:</h4>
                                    <p className={"park-activities"}>
                                        {selectedPark.activities.map((activity, index) => (
                                            <React.Fragment key={activity.id}>
                                            <span className="clickable-text"
                                                  tabIndex="0"
                                                  onClick={() => handleActivitiesClick(activity.name)}
                                                  onKeyDown={(event) => {
                                                      // Trigger the click event when the Enter key is pressed
                                                      if (event.key === 'Enter') {
                                                          handleActivitiesClick(activity.name);
                                                      }
                                                  }}
                                            >
                                                {activity.name}
                                            </span>{index < selectedPark.activities.length - 1 ? ', ' : ''}
                                            </React.Fragment>
                                        ))}
                                    </p>

                                    <h4>Amenities:</h4>
                                    <p className={"park-amenities"}>
                                        {parkAmenities.map((amenity, index) => (
                                            <React.Fragment key={amenity.id}>
                                            <span className="amenities-clickable-text clickable-text"
                                                  tabIndex="0"
                                                  onClick={() => handleAmenitiesClick(amenity.name)}
                                                  onKeyDown={(event) => {
                                                      // Trigger the click event when the Enter key is pressed
                                                      if (event.key === 'Enter') {
                                                          handleAmenitiesClick(amenity.name);
                                                      }
                                                  }}
                                            >
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
                <Footer/>
            </div>
        </>
    );
}

export default SearchParks;