// Import necessary modules and components
import React, { useState } from 'react';
import ExpandableSearchResults from './ExpandableSearchResults';
import axios from 'axios';

// Define the functional component FieldSearch
const FieldSearch = () => {
    // State variables to manage input values and search results
    const [inputs, SetInputs] = useState({
        name: '',
        race: '',
        publisher: '',
        power: '',
    });
    const [results, SetResults] = useState([]);
    
    // Event handler for input changes
    const handleInputChange = (e) => {
        SetInputs({ ...inputs, [e.target.name]: e.target.value });
    };
    
    // Event handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Fetch search results from the API based on input values
            const res = await axios.get('/api/unauth/search', {
                params: {
                    name: inputs.name,
                    race: inputs.race,
                    power: inputs.power,
                    publisher: inputs.publisher
                }
            });
            SetResults(res.data);
        } catch (error) {
            console.log("Error fetching data", error);
        }
    };
    
    // Render the UI for the FieldSearch component
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Field Search</h2>
                <div className="search-container">
                    {/* Input fields for name, race, publisher, and power */}
                    <div className="search-box">
                        <label htmlFor="search1">Name:</label>
                        <input type="text" name="name" value={inputs.name} onChange={handleInputChange} />
                    </div>
                    <div className="search-box">
                        <label htmlFor="search2">Race:</label>
                        <input type="text" name="race" value={inputs.race} onChange={handleInputChange} />
                    </div>
                    <div className="search-box">
                        <label htmlFor="search3">Publisher:</label>
                        <input type="text" name="publisher" value={inputs.publisher} onChange={handleInputChange} />
                    </div>
                    <div className="search-box">
                        <label htmlFor="search4">Power:</label>
                        <input type="text" name="power" value={inputs.power} onChange={handleInputChange} />
                    </div>
                    <button type="submit" id="submit-btn">Submit</button>
                </div>
            </form>

            {/* Display search results if available */}
            {results.length > 0 && (
                <div>
                    <h2>Search Results:</h2>
                    <ul>
                        {/* Map through search results and render each ExpandableSearchResults component */}
                        {results.map((hero) => (
                            <ExpandableSearchResults
                                key={hero.id}
                                title={`${hero.name} - ${hero.Publisher}`}
                                content={
                                    <>
                                        <div>
                                            <span style={{ fontWeight: 'bold' }}>Info</span>
                                        </div>
                                        {/* Display hero information */}
                                        Gender: {hero.Gender}
                                        <br />
                                        Eye color: {hero["Eye color"]}
                                        <br />
                                        Race: {hero["Race"]}
                                        <br />
                                        {/* ... (other details) ... */}
                                        <br />
                                        {/* Display hero powers */}
                                        <div>
                                            <span style={{ fontWeight: 'bold' }}>Powers</span>
                                        </div>
                                        {hero["powers"] && Object.keys(hero["powers"]).map((key) => (
                                            <div key={key}>{key}</div>
                                        ))}
                                        {/* Link to search hero on DuckDuckGo */}
                                        <a href={`https://duckduckgo.com/?q=${hero.name} ${hero.Publisher}`} target="_blank" rel="noopener noreferrer">Search On DDG</a>
                                    </>
                                }
                            />
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// Export the FieldSearch component as the default export
export default FieldSearch;
