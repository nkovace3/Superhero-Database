import React, { useState } from 'react';
import './css/UnauthFieldSearch.css';

const UnauthFieldSearch = () => {
    const [searchValues, setSearchValues] = useState([]);
    const [searchQuery, setSearchQuery] = useState({
        name: '',
        race: '',
        publisher: '',
        powers: '',
      });
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchQuery((prevQuery) => ({
          ...prevQuery,
          [name]: value,
        }));
      };
    
      const handleSearch = (e) => {
        fetch('localhost:3000/api/unauth/search', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchQuery),
        })
        .then(res => {
            if(res.ok){
                res.json()
                .then(data => {
                    setSearchValues(data);
                    console.log(data);
                })
            }else{
                console.log("Error: " + res.status);
            }
        })
      };
    
      return (
        <flex>
          <div className="search-container">
            <div className="search-box">
              <label htmlFor="search1">Name:</label>
              <input type="text" id="name" value={searchValues.name} onChange={handleInputChange} />
            </div>
    
            <div className="search-box">
              <label htmlFor="search2">Race:</label>
              <input type="text" id="race" value={searchValues.race} onChange={handleInputChange} />
            </div>
    
            <div className="search-box">
              <label htmlFor="search3">Publisher:</label>
              <input type="text" id="publisher" value={searchValues.publisher} onChange={handleInputChange} />
            </div>
    
            <div className="search-box">
              <label htmlFor="search4">Power:</label>
              <input type="text" id="search4" value={searchValues.powers} onChange={handleInputChange} />
            </div>
          <button type="submit" id="submit-btn" onClick={handleSearch}>Submit</button>
        </div>
        <div>
        <h2>Search Results:</h2>
        <ul>
          {searchValues.map((hero) => (
            <li key={hero.id}>{hero.name}</li>
          ))}
        </ul>
      </div>
      </flex>
      );
  };
  
  export default UnauthFieldSearch;