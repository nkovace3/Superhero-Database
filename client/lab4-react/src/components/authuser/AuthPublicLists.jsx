import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpandableSearchResults from '../unauthuser/ExpandableSearchResults';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../authentication';

const AuthPublicLists = () => {
  const [publicLists, setPublicLists] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [selectedList, setSelectedList] = useState(null);
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDisplayName(user.displayName);
        fetchRecentPublicLists(user.displayName);
      }
    });

    return () => unsubscribe();
  }, []);

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

  const handleListSelect = (listName) => {
    setSelectedList(listName);
  };

  return (
    <div>
      <h2>Recent Public Lists</h2>
      <ul>
        {publicLists.map((list) => (
          <li key={list.list_name}>
            <ExpandableSearchResults
              title={list.list_name}
              content={
                <>
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

export default AuthPublicLists;