// Import necessary modules and components from React, Firebase authentication, Axios, and local components
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import ExpandableSearchResults from '../unauthuser/ExpandableSearchResults';
import DeleteList from './DeleteList';
import AddList from './AddList';

// Define the functional component ViewLists
const ViewLists = () => {
  // State variables to manage user, lists, editing state, and selected list
  const [user, setUser] = useState(null);
  const [lists, setLists] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedList, setSelectedList] = useState(null);

  // Effect hook to fetch user and lists data on component mount
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log(user.displayName);
        fetchLists(user.displayName);
      } else {
        setUser(null);
        setLists([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Function to fetch hero information for a given ID
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

  // Function to fetch lists for the given username, including hero information
  const fetchLists = async (username) => {
    try {
      const response = await axios.get(`/api/auth/lists/${username}`);
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
      const sortedLists = listsWithHeroInfo.sort((a, b) => b.modification_time - a.modification_time);
      setLists(sortedLists);
    } catch (error) {
      console.error('Error fetching lists:', error.message);
    }
  };

  // Function to handle the click event for editing a list
  const handleEditClick = (list) => {
    setSelectedList(list);
    setIsEditing(true);
  };

  // Function to handle canceling the editing state
  const handleCancelEdit = () => {
    setSelectedList(null);
    setIsEditing(false);
  };

  // Render the UI for viewing personal lists
  return (
    <div>
      <h2>View Personal Lists</h2>
      {user && (
        <div>
          <ul>
            {/* Map through the lists and render ExpandableSearchResults for each list */}
            {lists.map((list) => (
              <li key={list.list_name}>
                <ExpandableSearchResults
                  title={list.list_name}
                  content={
                    <>
                      <div>
                        <span style={{ fontWeight: 'bold' }}>{list.description}</span>
                      </div>
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
                                    <span style={{ fontWeight: 'bold' }}>Powers</span>
                                  </div>
                                  {hero["powers"] &&
                                    Object.keys(hero["powers"]).map((key) => (
                                      <div key={key}>{key}</div>
                                    ))}
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
                      <span
                        style={{
                          color: 'black',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          marginRight: '10px',  
                        }}
                        onClick={() => handleEditClick(list)}
                      >
                        Edit
                      </span>
                      {/* Render the DeleteList component for each list */}
                      <DeleteList listName={list.list_name} onDelete={() => fetchLists(user.displayName)} />
                      {/* Render the AddList component when editing is true and the list matches the selected list */}
                      {isEditing && list.list_name === selectedList.list_name && (
                        <AddList
                          isEditing={isEditing}
                          onCancelEdit={() => handleCancelEdit()}
                          onUpdate={() => fetchLists(user.displayName)}
                          selectedList={selectedList}
                        />
                      )}
                      <div>
                        <span style={{ fontWeight: 'bold' }}>
                          {list.rating.length > 0
                            ? `Avg Rating: ${(list.rating.reduce((sum, num) => sum + num, 0) / list.rating.length).toFixed(1)}`
                            : 'No Ratings'}
                        </span>
                      </div>
                      {/* Render reviews if available */}
                      {list.reviews.length > 0 && (
                        <div>
                          {/* Render hidden reviews if any */}
                          {list.reviews.some(review => review.hidden) && (
                            <div>
                              <span style={{ fontWeight: 'bold' }}>Reviews:</span>
                              <ul>
                                {list.reviews
                                  .filter(review => review.hidden)
                                  .map(review => (
                                    <li key={review.date}>
                                      <div>{`${review.username}: ${review.review}`}</div>
                                      <div>{new Date(review.date).toLocaleDateString()}</div>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Export the ViewLists component as the default export
export default ViewLists;
