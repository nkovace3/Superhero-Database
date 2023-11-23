import React, { useState } from 'react';
import ExpandableSearchResults from './ExpandableSearchResults';
import axios from 'axios';

const FieldSearch = () => {

    const [inputs, SetInputs] = useState({
        name: '',
        race: '',
        publisher: '',
        power: '',
    });
    const [results, SetResults] = useState([]);
    
    const handleInputChange = (e) => {
        SetInputs({ ...inputs, [e.target.name]: e.target.value});
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get('/api/unauth/search', {
                params: {
                    name: inputs.name,
                    race: inputs.race,
                    power: inputs.power,
                    publisher: inputs.publisher
                }
            });
            SetResults(res.data);
        }
        catch (error) {
            console.log("Error fetching data", error);
        }
      };
    
    return (
        <flex>
        <form onSubmit = {handleSubmit}>
          <div className="search-container">
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
        {results.length > 0 && (
            <div>
            <h2>Search Results:</h2>
            <ul>
            {results.map((hero) => (
                <ExpandableSearchResults key = {hero.id} title = {`${hero.name} - ${hero.Publisher}`} content = {
                    <>
                    <div>
                    <span style={{ fontWeight: 'bold'}}>Info</span>
                    </div>
                    Gender: {hero.Gender}
                    <br />
                    Eye color: {hero["Eye color"]}
                    <br />
                    Race: {hero["Race"]}
                    <br />
                    Hair color: {hero["Hair color"]}
                    <br />
                    Height: {hero["Height"]}
                    <br />
                    Skin color: {hero["Skin color"]}
                    <br />
                    Alignment: {hero["Alignment"]}
                    <br />
                    Weight: {hero["Weight"]}
                    <br />
                    <div>
                    <span style={{ fontWeight: 'bold'}}>Powers</span>
                    </div>
                    {hero["powers"] && Object.keys(hero["powers"]).map((key) => (
                      <div key={key}>
                        {key}
                      </div>
                    ))}
                    <a href={`https://duckduckgo.com/?q=${hero.name} ${hero.Publisher}`} target="_blank" rel="noopener noreferrer">Search On DDG</a>
                  </>
                  } 
                />
            ))}
            </ul>
            </div>
        )}
      </flex>
      );
  };
  
  export default FieldSearch;