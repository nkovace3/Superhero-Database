// Import necessary modules and components from React, Axios, Firebase, and other libraries
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpandableSearchResults from '../unauthuser/ExpandableSearchResults';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../authentication';

// Define the functional component AuthPublicLists
const AuthPublicLists = () => {
  // State variables to manage public lists, display name, selected list, ratings, and reviews
  const [publicLists, setPublicLists] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [selectedList, setSelectedList] = useState(null);
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});

  // Effect hook to set up authentication state and fetch recent public lists
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDisplayName(user.displayName);
        fetchRecentPublicLists(user.displayName);
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to fetch hero information based on the provided ID
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

  // Function to fetch recent public lists for the given display name
  const fetchRecentPublicLists = async (displayName) => {
    try {
      const user = auth.currentUser;
      const idToken = await user.getIdToken();
      const response = await axios.get(`/api/auth/lists/public/${displayName}`, {
        headers: {
          'authorization': idToken
        }
      });
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
      const sortedPublicLists = listsWithHeroInfo.sort((a, b) => b.modification_time - a.modification_time);
      setPublicLists(sortedPublicLists.slice(0, 10)); 
    } catch (error) {
      console.error('Error fetching recent public lists:', error.message);
    }
  };

  // Function to handle the submission of a review for a specific list
  const handleReviewSubmit = async (listName) => {
    try {
      const user = auth.currentUser;
      const idToken = await user.getIdToken();
      console.log(reviews[listName]);
      const response = await axios.post(`/api/auth/lists/review/${listName}`, {
        review: reviews[listName] || '',
        rating: ratings[listName] || 0,
        username: displayName,
      }, {
        headers: {
          "authorization": idToken,
        },
      });

      alert(response.data.message);
      // Optionally, you can update the state or perform other actions after submitting the review
    } catch (error) {
      console.error('Error submitting review:', error.message);
      // Handle the error, show a message to the user, etc.
    }
  };

  // Function to handle the selection of a list
  const handleListSelect = (listName) => {
    setSelectedList(listName);
  };

  // Render the AuthPublicLists component
  return (
    <div>
      {/* Render the title for the section */}
      <h2>Recent Public Lists</h2>
      {/* Render the list of public lists */}
      <ul>
        {publicLists.map((list) => (
          <li key={list.list_name}>
            {/* Render an ExpandableSearchResults component for each list */}
            <ExpandableSearchResults
              title={list.list_name}
              content={
                <>
                  {/* Render list details and metadata */}
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
                  {/* Render hero information for each hero in the list */}
                  {list.heroInfo &&
                        list.heroInfo.map((hero) => (
                          <div key={hero.id}>
                            {/* Render an ExpandableSearchResults component for each hero */}
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
                                  {/* Render hero powers */}
                                  {hero["powers"] &&
                                    Object.keys(hero["powers"]).map((key) => (
                                      <div key={key}>{key}</div>
                                    ))}
                                  {/* Render a link to search for the hero on DuckDuckGo */}
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
                        {/* Render a form for submitting reviews */}
                        <div>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleReviewSubmit(list.list_name);}}>
                      <label>
                        Rating:
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={ratings[list.list_name] || 0}
                          onChange={(e) => setRatings({ ...ratings, [list.list_name]: e.target.value})}
                        />
                      </label>
                      <br />
                      <label>
                        Review:
                        <textarea
                          value={reviews[list.list_name] || ''}
                          onChange={(e) => setReviews({ ...reviews, [list.list_name]: e.target.value})}
                        />
                      </label>
                      <br />
                      {/* Render a button to submit the review */}
                      <button type="submit">Submit Review</button>
                    </form>
                  </div>
                </>
                
              }
              onClick={() => handleListSelect(list.list_name)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

// Export the AuthPublicLists component as the default export
export default AuthPublicLists;
