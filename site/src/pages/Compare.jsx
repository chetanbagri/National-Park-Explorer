import Header from "../components/Header";
import Footer from "../components/Footer";
import React, {useState} from "react";
import '../styles/compare.css'

function Compare(/* {initexpanded= null} */){
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [usernameQuery, setUsernameQuery] = useState("");
    const [parks, setParks] = useState([]);
    const [selectedPark, setSelectedPark] = useState(null); // State to track selected park for details
    const [userFavorites, setUserFavorites] = useState([]);
    const [favoriteParks, setFavoriteParks] = useState([]);
    const [parkAmenities, setParkAmenities] = useState([]);
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
    const [hoveredPark, setHoveredPark] = useState(null);
    const [hoveredRatio, setHoveredRatio] = useState(null); // useState(initexpanded);
    const [showSingleDeleteConfirmation, setShowSingleDeleteConfirmation] = useState(false);
    const [parkToDelete, setParkToDelete] = useState(null);
    const [numberInGroup, setNumberInGroup] = useState("");
    const [numberFavorited, setNumberFavorited] = useState(null);
    const [groupMembers, setGroupMembers] = useState(null);
    const [parksToUsers, setParksToUsers] = useState(null);
    const [ratioUsers, setRatioUsers] = useState("");
    const [suggestedPark, setSuggestedPark] = useState([]);
    // const [suggestedParkSelected, setSuggestedParkSelected] = useState([]);

    const API_KEY = process.env.REACT_APP_API_KEY;
    const BASE_URL = "https://developer.nps.gov/api/v1/parks";

    const handleAddToGroup = async (e) => {
        e.preventDefault();
        try {
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
            const username = userInfo.username; // Username of currently logged in user

            const response = await fetch("/adduser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({username, usernameQuery})
            })
            if(response.ok) {
                const groupMembersTmp = await response.json();
                // console.log("Add to Group groupMembersTmp: " + groupMembersTmp);
                setGroupMembers(groupMembersTmp);
                setError("");
                setSuccess(`Successfully added ${usernameQuery} to your group of friends`);
            }
            else {
                const errorText = await response.text();
                setSuccess("");
                setError(`Error: ${errorText}`);
            }
        }
        catch(error){
            setError(error.message);
        }
    };

    const handleCompare = async () => {

        let fetchedParks = [];
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        const username = userInfo.username; // Username of currently logged in user
        fetchGroupFavorites(username)
            .then((favorites) => {
                // console.log(favorites);
                let parkIDs = [];
                let counts = [];

                // Extract park IDs and counts into separate arrays
                favorites.sortedIDs.forEach((group) => {
                    // Get the park code (group key)
                    const parkCode = Object.keys(group)[0];
                    // Get the count (group value)
                    const count = group[parkCode];
                    // Push park code and count into arrays
                    parkIDs.push(parkCode);
                    counts.push(count);
                });

                // console.log("parkIDs: " + parkIDs);
                // console.log("counts: " + counts);
                setNumberFavorited(counts);

                console.log(favorites);
                console.log(userInfo);
                setParksToUsers(favorites.parksToUsers);

                setNumberInGroup(favorites.groupSize + 1);
                setGroupMembers(favorites.groupMembers);
                // console.log("groupMembers: " + groupMembers);

                setUserFavorites(parkIDs);
                Promise.all(parkIDs.map(async (parkCode) => {
                    const park = await fetchParkDetails(parkCode);
                    // console.log("Favorites: " + parkIDs);
                    // console.log("parkCode: " + parkCode);
                    // console.log(park);
                    // console.log("park?.fullName: " + park?.fullName);
                    return park?.fullName;
                }))
                    .then(setFavoriteParks);
                    // .catch((error) => {
                    //     console.error('Error fetching group favorite park names:', error);
                    // });
            })
            .catch(() => {
                console.error('Error fetching group favorites:');
            });

        setError("");

        // setParks(fetchedParks);
        // setSelectedPark(null); // Reset selected park details

    };

    const handleParkSelection = async (parkCode) => {
        if (selectedPark && selectedPark.parkCode === parkCode) {
            setSelectedPark(null);
            setParkAmenities([]);
        } else {
            const details = await fetchParkDetails(parkCode);
            setSelectedPark(details);
            const amenities = await fetchAmenitiesOfPark(`${parkCode}`);
            setParkAmenities(amenities);
        }
    };

    const handleSuggestParkSelection = async (parkCode, suggestedParkDetails) => {
        console.log(parkCode);
        if (selectedPark && selectedPark.parkCode === parkCode) {
            setSelectedPark(null);
            setParkAmenities([]);
        } else {
            // We already have details from handleSuggest()
            // const details = await fetchParkDetails(parkCode);
            setSelectedPark(suggestedParkDetails);
            const amenities = await fetchAmenitiesOfPark(`${parkCode}`);
            setParkAmenities(amenities);
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
                return data.data;
            } else {
                console.error("Failed to fetch amenities.");
                return [];
            }
        } catch (error) {
            console.error("Error fetching amenities data.");
            return [];
        }
    };

    const handleRatioHover = async (parkCode) => {
        if(hoveredRatio != null){
            setHoveredRatio(null);
            return;
        }

        setHoveredRatio(parkCode);

        // console.log("handleRatioHover(): ", parksToUsers);
        // console.log("parkCode: " + parkCode);
        // console.log("parksToUsers[parkCode]: ", parksToUsers[parkCode]);
        // const parkObject = parksToUsers.find(item => item[parkCode]);
        // console.log(parkObject);
        setRatioUsers(parksToUsers[parkCode]);
        // setRatioUsers(parkObject);
    };

    const handleSuggest = async (e) => {
            e.preventDefault();
            try {
                if(groupMembers == null){
                    await handleCompare().then(handleSuggestHelper);
                }
                await handleSuggestHelper();
            } catch (error) {
                setError(`Error fetching suggestions: ${error.message}`);
            }
    };

    const handleSuggestHelper = async () => {
        let commonFavorites = [];
        let favoriteCounts = [];
        console.log("groupMembers: " + groupMembers);
        for (const member of groupMembers) {
            const favorites = await fetchUserFavorites(member);
            console.log(favorites);
            if(favorites == null){
                continue;
            }

            for(const favorite of favorites){ // Iterate over favorite park codes array
                favoriteCounts[favorite] = (favoriteCounts[favorite] || 0) + 1;
            }

            // if (commonFavorites.length === 0) {
            //     commonFavorites = favorites;
            // } else {
            //     commonFavorites = commonFavorites.filter(park => favorites.includes(park));
            // }
        }
        // Now do it again for the user themselves
        // console.log("username: " + JSON.parse(sessionStorage.getItem('userInfo')).username);
        const favorites = await fetchUserFavorites(JSON.parse(sessionStorage.getItem('userInfo')).username);
        for(const favorite of favorites){ // Iterate over favorite park codes array
            favoriteCounts[favorite] = (favoriteCounts[favorite] || 0) + 1;
        }
        console.log(favoriteCounts);
        // if (commonFavorites.length === 0) {
        //     commonFavorites = favorites;
        // } else {
        //     commonFavorites = commonFavorites.filter(park => favorites.includes(park));
        // }
        favoriteCounts.sort((a, b) => b.count - a.count); // Sort the counts I retrieved (keys are still the park code)
        console.log(groupMembers);
        console.log(favoriteCounts);
        commonFavorites = Object.keys(favoriteCounts)[0];
        console.log(commonFavorites);

        // DEAL WITH TIEBREAKERS HERE
        if(Object.values(favoriteCounts)[0] === Object.values(favoriteCounts)[1]){
            handleTieBreaker();
        }

        if (commonFavorites.length > 0) {
            const parkDetails = await fetchParkDetails(commonFavorites);
            console.log(parkDetails);
            // setSelectedPark(parkDetails); // Just makes details window appear with no amenities. NOT GOOD ENOUGH.
            setParkAmenities([]);
            setSelectedPark(null);
            setUserFavorites([]);
            setSuggestedPark(parkDetails);
        } else {
            setError("No common favorites found among the group.");
        }
    }

    const handleTieBreaker = async () => {

    }

    const fetchGroupFavorites = async (username) => {
        try {
            const response = await fetch("/compareparks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({username})
            })
            if(response.ok) {
                const parkIDs = await response.json();
                // console.log("Park IDs: " + parkIDs);
                return parkIDs;
            }
            else {
                const errorText = await response.text();
                setSuccess("");
                setError(`Error: ${errorText}`);
            }
        }
        catch(error){
            setError(error.message);
        }
    };


    // Completely written by Anika
    const fetchUserFavorites = async (username) => {
        try {
            const response = await fetch(`/favorites?username=${username}`);
            if (!response.ok) {
                console.error('Failed to fetch user favorites');
                throw new Error('Failed to fetch user favorites');
            }
            const data = await response.json();
            return data.favorites;
        } catch (error) {
            console.error('Error fetching user favorites:', error);
            setError(`Error fetching favorites for user ${username}: ${error.message}`);
            return [];
        }
    };

    const fetchParkDetails = async (parkCode) => {
        const response = await fetch(`${BASE_URL}?parkCode=${parkCode}`, {
            method: 'GET',
            headers: { 'X-Api-Key': API_KEY }
        });
        if (!response.ok) {
            console.error("Failed to fetch park details");
            return null;
        }
        const data = await response.json();
        return data.data[0];
    };

    return (
        <div>
            <Header/>
            <h2>Add A Friend to Your Group</h2>
            <form onSubmit={handleAddToGroup}>
                <label htmlFor={"usernameQuery"}>Username: </label>
                <input
                    id="usernameQuery"
                    type="text"
                    value={usernameQuery}
                    onChange={(e) => setUsernameQuery(e.target.value)}
                    title={"Username Box for adding to group"}
                    tabIndex={0}
                    aria-label={"Username Box for adding to group"}
                    alt={"Username Box for adding to group"}
                    autoFocus
                />
                <input
                    type="submit"
                    value="Add To Group"
                    title={"Submit Username"}
                    id={"addUserBtn"}
                    aria-label={"Submit username"}
                    alt={"Submit username"}
                    tabIndex={0}
                />
            </form>
            {success && <p>{success}</p>}
            {error && <p>{error}</p>}

            <h2>Compare Parks and Give Suggestions</h2>
            <button title={"Submit Compare"} id={"compareBtn"} tabIndex={0} onClick={handleCompare} aria-label={"Submit Compare"}>Compare</button>
            <button title={"Submit Suggestion"} id={"suggestBtn"} tabIndex={0} onClick={handleSuggest} aria-label={"Suggest the Best Park"}>Suggest the Best Park</button>
            {userFavorites && userFavorites.length > 0 && (
                <ul>
                    {userFavorites.map((parkCode, index) => (
                        <li key={parkCode}
                            // onMouseEnter={() => setHoveredPark(parkCode)}
                            // onMouseLeave={() => setHoveredPark(null)}
                        >
                            <button tabIndex={0} title={`detailsButton_${parkCode}`} onClick={() => handleParkSelection(parkCode)} className="search-result-button">
                                {favoriteParks[index]}
                            </button>
                            <span tabIndex={0} data-testid={`p-${index}`} id={`pid-${index}`} onClick={() => handleRatioHover(parkCode)} onKeyDown={() => handleRatioHover(parkCode)}>
                                <span>{numberFavorited[index]} / {numberInGroup}</span>
                                {hoveredRatio === parkCode && (
                                    <span className="ratio-popup">
                                        <div className="ratio-content">
                                            {ratioUsers && ratioUsers.map((user, index) => (
                                                <p key={index}>{user}</p>
                                            ))}
                                        </div>
                                    </span>
                                )}
                            </span>
                            {selectedPark && selectedPark.parkCode === parkCode && (
                                <div className="detailsBox" tabIndex={0}>
                                    <h3 className={"park-full-name"}>{selectedPark.fullName}</h3>
                                    <img src={selectedPark.images[0].url}
                                         alt={`View of ${selectedPark.fullName}`}
                                         style={{width: '100%', maxHeight: '300px', objectFit: 'cover'}}
                                         className={"park-picture"}/>
                                    <p className={"park-description"}>Description: {selectedPark.description}</p>
                                    <div>
                                        <h4>Location:</h4>
                                        <p className="park-location">
                                            {selectedPark.addresses[0].city}, {selectedPark.addresses[0].stateCode}
                                        </p>
                                    </div>
                                    <a className={"park-url"} href={selectedPark.url} target="_blank"
                                       rel="noopener noreferrer">
                                        Visit Park Website
                                    </a>
                                    <p className={"park-entrance-fee"}>
                                        Entrance
                                        Fees: {selectedPark.entranceFees.length > 0 ? `$${selectedPark.entranceFees[0].cost}` : 'No fees information available'}
                                    </p>
                                    <h4>Activities:</h4>
                                    <p className={"park-activities"}>
                                        {selectedPark.activities.map((activity, index) => (
                                            <React.Fragment key={activity.id}>
                                                <span >{activity.name}</span>
                                                {index < selectedPark.activities.length - 1 ? ', ' : ''}
                                            </React.Fragment>
                                        ))}
                                    </p>
                                    <h4>Amenities:</h4>
                                    <p className={"park-amenities"}>
                                        {parkAmenities.map((amenity, index) => (
                                            <React.Fragment key={amenity.id}>
                                                <span >{amenity.name}</span>
                                                {index < parkAmenities.length - 1 ? ', ' : ''}
                                            </React.Fragment>
                                        ))}
                                    </p>
                                    <h4>Operating Hours:</h4>
                                    <p>{selectedPark.operatingHours[0].description}</p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            {suggestedPark && Object.keys(suggestedPark).length > 0 && (
                <div tabIndex={0} title="Click Suggested Park for Details" className="suggestedParkBox" onClick={() => handleSuggestParkSelection(suggestedPark.parkCode, suggestedPark)} onKeyDown={() => handleSuggestParkSelection(suggestedPark.parkCode, suggestedPark)}>
                    <div key={suggestedPark.parkCode}> {/* Add a unique key to each child element */}
                        <h2 className="suggestedName">Your suggested park is</h2>
                        <p className="suggestedName">{suggestedPark.fullName}</p> {/* Access suggested park's fullName property */}
                        <p className="suggestedLocation">{suggestedPark.addresses[0].city}, {suggestedPark.addresses[0].stateCode}</p>
                        <div className="suggestedParkImgContainer">
                            <img
                                src={suggestedPark.images[0].url}
                                alt={suggestedPark.images[0].altText}
                                className="suggestedImage"/>
                            <img
                                src={suggestedPark.images[1].url}
                                alt={suggestedPark.images[1].altText}
                                className="suggestedImage"/>
                            <img
                                src={suggestedPark.images[2].url}
                                alt={suggestedPark.images[2].altText}
                                className="suggestedImage"/>
                        </div>
                    </div>
                    {selectedPark && selectedPark.parkCode === suggestedPark.parkCode && (
                        <div className="detailsBox">
                            <h3 className={"park-full-name"}>{suggestedPark.fullName}</h3>
                            <img src={suggestedPark.images[0].url}
                                 alt={`View of ${suggestedPark.fullName}`}
                                 style={{width: '100%', maxHeight: '300px', objectFit: 'cover'}}
                                 className={"park-picture"}/>
                            <p className={"park-description"}>Description: {suggestedPark.description}</p>
                            <div>
                                <h4>Location:</h4>
                                <p className="park-location">
                                    {suggestedPark.addresses[0].city}, {suggestedPark.addresses[0].stateCode}
                                </p>
                            </div>
                            <a className={"park-url"} href={suggestedPark.url} target="_blank"
                               rel="noopener noreferrer">
                                Visit Park Website
                            </a>
                            <p className={"park-entrance-fee"}>
                                Entrance
                                Fees: {suggestedPark.entranceFees.length > 0 ? `$${suggestedPark.entranceFees[0].cost}` : 'No fees information available'}
                            </p>
                            <h4>Activities:</h4>
                            <p className={"park-activities"}>
                                {suggestedPark.activities.map((activity, index) => (
                                    <React.Fragment key={activity.id}>
                                        <span >{activity.name}</span>
                                        {index < suggestedPark.activities.length - 1 ? ', ' : ''}
                                    </React.Fragment>
                                ))}
                            </p>
                            <h4>Amenities:</h4>
                            <p className={"park-amenities"}>
                                {parkAmenities.map((amenity, index) => (
                                    <React.Fragment key={amenity.id}>
                                                <span>{amenity.name}</span>
                                        {index < parkAmenities.length - 1 ? ', ' : ''}
                                    </React.Fragment>
                                ))}
                            </p>
                            <h4>Operating Hours:</h4>
                            <p>{suggestedPark.operatingHours[0].description}</p>
                        </div>
                    )}
                </div>
            )}

            <Footer/>
        </div>
    );
}

export default Compare;