// Import necessary modules and components
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpandableSearchResults from '../unauthuser/ExpandableSearchResults';

// Define the functional component UnauthFieldSearch
const UnauthFieldSearch = () => {
  // State variable to store recent public lists
  const [publicLists, setPublicLists] = useState([]);

  // Fetch recent public lists when the component mounts
  useEffect(() => {
    fetchRecentPublicLists();
  }, []);

  // Function to fetch hero information from the API based on hero id
  const fetchHeroInfo = async (id) => {
    try {
      const response = await axios.get(`/api/info/${id}`);
      const heroInfo = response.data;

      const powersResponse = await axios.get(`/api/powers/${id}`);
      heroInfo.powers = powersResponse.data;

      return heroInfo;
    } catch (error) {
      console.error(`Error fetching hero info for id ${id}:`, error.message);
      return null;
    }
  };

  // Function to fetch recent public lists and associated hero information
  const fetchRecentPublicLists = async () => {
    try {
      // Fetch recent public lists from the API
      const response = await axios.get('/api/lists/public');
      // Process and format hero information for each list
      const listsWithHeroInfo = await Promise.all(
        response.data.map(async (list) => {
          const heroInfoPromises = list.ids.map(async (id) => {
            const heroInfo = await fetchHeroInfo(id);
            return heroInfo;
          });
          const heroInfoArray = await Promise.all(heroInfoPromises);
          return {
            ...list,
            heroInfo: heroInfoArray,
          };
        })
      );
      // Sort the lists based on modification time and store in state
      const sortedPublicLists = listsWithHeroInfo.sort((a, b) => b.modification_time - a.modification_time);
      setPublicLists(sortedPublicLists.slice(0, 10));
    } catch (error) {
      console.error('Error fetching recent public lists:', error.message);
    }
  };

  // Render the UI for the UnauthFieldSearch component
  return (
    <div>
      <h2>Recent Public Lists</h2>
      <ul>
        {/* Map through public lists and render each ExpandableSearchResults component */}
        {publicLists.map((list) => (
          <li key={list.list_name}>
            <ExpandableSearchResults
              title={list.list_name}
              content={
                <>
                  {/* Display list details such as description, number of heroes, creator, and average rating */}
                  <div>
                    <span style={{ fontWeight: 'bold' }}>{list.description}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold' }}>{`Number of Heroes: ${list.ids.length}`}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold' }}>{`Created by: ${list.username}`}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold' }}>
                      {list.rating.length > 0
                        ? `Avg Rating: ${(list.rating.reduce((sum, num) => sum + num, 0) / list.rating.length).toFixed(1)}`
                        : 'No Ratings'}
                    </span>
                  </div>
                  {/* Map through hero information and render each ExpandableSearchResults component */}
                  {list.heroInfo &&
                    list.heroInfo.map((hero) => (
                      <div key={hero.id}>
                        <ExpandableSearchResults
                          title={`${hero.name} - ${hero.Publisher}`}
                          content={
                            <>
                              <div>
                                <span style={{ fontWeight: 'bold' }}>Info</span>
                              </div>
                              {/* Display hero details such as gender, eye color, race, etc. */}
                              Gender: {hero.Gender}
                              <br />
                              Eye color: {hero["Eye color"]}
                              <br />
                              Race: {hero["Race"]}
                              {/* ... (other details) ... */}
                              <br />
                              <div>
                                <span style={{ fontWeight: 'bold' }}>Powers</span>
                              </div>
                              {/* Display hero powers */}
                              {hero["powers"] && Object.keys(hero["powers"]).map((key) => (
                                <div key={key}>{key}</div>
                              ))}
                              {/* Link to search hero on DuckDuckGo */}
                              <a
                                href={`https://duckduckgo.com/?q=${hero.name} ${hero.Publisher}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Search On DDG
                              </a>
                            </>
                          }
                        />
                      </div>
                    ))}
                </>
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

// Export the UnauthFieldSearch component as the default export
export default UnauthFieldSearch;
