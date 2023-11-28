import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpandableSearchResults from '../unauthuser/ExpandableSearchResults';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const AuthPublicLists = () => {
  const [publicLists, setPublicLists] = useState([]);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const auth = getAuth();
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
      const response = await axios.get(`/api/auth/lists/public/${displayName}`);
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
                    <span style={{ fontWeight: 'bold' }}>{`Created by: ${list.username}`}</span>
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
                </>
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuthPublicLists;
