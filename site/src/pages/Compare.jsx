import Header from "../components/Header";
import Footer from "../components/Footer";
import React, {useState} from "react";
import '../styles/compare.css'

function Compare(){
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [usernameQuery, setUsernameQuery] = useState("");
    const [parks, setParks] = useState([]);
    const [selectedPark, setSelectedPark] = useState(null); // State to track selected park for details


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
                const groupMembers = await response.json();
                console.log(groupMembers);
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

    const handleCompare = async (e) => {
        try {
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
            const username = userInfo.username; // Username of currently logged in user

            const response = await fetch("/compareparks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({username})
            })
            if(response.ok) {
                const data = await response.json();
                console.log(data);
                setError("");
                // setSuccess(`Successfully added ${usernameQuery} to your group of friends`);

                // Will probably receive park IDs and their counts within the data
                // then need to fetch for each ID to get the other info
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

        // const fetchedParks = await fetchParks(parameters);
        // setParks(fetchedParks);
        // setSelectedPark(null); // Reset selected park details
    };

    const handleSuggest = async (e) => {

    };

    return(
        <div>
            <Header/>
            <h2>Add A Friend to Your Group</h2>
            <form onSubmit={handleAddToGroup}>
                <label htmlFor={"usernameQuery"}>Username: </label>
                <input id="usernameQuery" type="text" value={usernameQuery} title={"Username Box for adding to group"}
                       onChange={(e) => setUsernameQuery(e.target.value)} tabIndex={0} autoFocus/>
                <input type="submit" value="Add To Group" title={"Submit Username"} id={"addUserBtn"} tabIndex={1}/>
            </form>
            {/*{parks.length > 0 && (*/}
            {/*    <button onClick={loadMoreResults} title={"loadMoreResults"} id={"loadMoreResults"} tabIndex={3}>Load*/}
            {/*        More Results</button>*/}
            {/*)}*/}
            {success && <p>{success}</p>}
            {error && <p>{error}</p>}

            <h2>Compare Parks and Give Suggestions</h2>
            <button title={"Submit Compare"} id={"compareBtn"} tabIndex={3} onClick={handleCompare}>Compare</button>
            <button title={"Submit Suggestion"} id={"suggestBtn"} tabIndex={4} onClick={handleSuggest}>Suggest the Best Park</button>
            {/*<ul>*/}
            {/*    {parks.map(park => (*/}
            {/*        <li key={park.id}>*/}
            {/*            <button title={"detailsButton_" + park.parkCode}*/}
            {/*                    onClick={() => handleParkSelection(park.parkCode)}>{park.fullName}</button>*/}
            {/*            {selectedPark && selectedPark.parkCode === park.parkCode && (*/}
            {/*                <div className="detailsBox">*/}
            {/*                    <h3>{selectedPark.fullName}</h3>*/}
            {/*                    <img src={selectedPark.images[0].url} alt={`View of ${selectedPark.fullName}`}*/}
            {/*                         style={{width: '100%', maxHeight: '300px', objectFit: 'cover'}}/>*/}
            {/*                    <p>Description: {selectedPark.description}</p>*/}
            {/*                    <div>*/}
            {/*                        <h4>Location:</h4>*/}
            {/*                        <p onClick={() => handleLocationClick(selectedPark.addresses[0].stateCode)}*/}
            {/*                           className="clickable-text">*/}
            {/*                            {selectedPark.addresses[0].city}, {selectedPark.addresses[0].stateCode}*/}
            {/*                        </p>*/}
            {/*                    </div>*/}
            {/*                    <a href={selectedPark.url} target="_blank" rel="noopener noreferrer">Visit Park*/}
            {/*                        Website</a>*/}
            {/*                    <p>Entrance*/}
            {/*                        Fees: {selectedPark.entranceFees.length > 0 ? `$${selectedPark.entranceFees[0].cost}` : 'No fees information available'}</p>*/}

            {/*                    <h4>Activities:</h4>*/}
            {/*                    <p>*/}
            {/*                        {selectedPark.activities.map((activity, index) => (*/}
            {/*                            <React.Fragment key={activity.id}>*/}
            {/*                                <span className="clickable-text"*/}
            {/*                                      onClick={() => handleActivitiesClick(activity.name)}>*/}
            {/*                                    {activity.name}*/}
            {/*                                </span>{index < selectedPark.activities.length - 1 ? ', ' : ''}*/}
            {/*                            </React.Fragment>*/}
            {/*                        ))}*/}
            {/*                    </p>*/}

            {/*                    <h4>Amenities:</h4>*/}
            {/*                    <p>*/}
            {/*                        {parkAmenities.map((amenity, index) => (*/}
            {/*                            <React.Fragment key={amenity.id}>*/}
            {/*                                <span className="clickable-text"*/}
            {/*                                      onClick={() => handleAmenitiesClick(amenity.name)}>*/}
            {/*                                    {amenity.name}*/}
            {/*                                </span>*/}
            {/*                                {index < parkAmenities.length - 1 ? ', ' : ''}*/}
            {/*                            </React.Fragment>*/}
            {/*                        ))}*/}
            {/*                    </p>*/}
            {/*                    <div>*/}
            {/*                        <h4>Operating Hours:</h4>*/}
            {/*                        <p>{selectedPark.operatingHours[0].description}</p>*/}
            {/*                    </div>*/}

            {/*                </div>*/}
            {/*            )}*/}
            {/*        </li>*/}
            {/*    ))}*/}
            {/*</ul>*/}
            <Footer/>
        </div>
    );
}

export default Compare;