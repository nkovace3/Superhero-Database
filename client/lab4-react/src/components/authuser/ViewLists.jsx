// import React, { useState, useEffect } from 'react';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import axios from 'axios';
// import ExpandableSearchResults from '../unauthuser/ExpandableSearchResults';
// import DeleteList from './DeleteList';

// const ViewLists = () => {
//   const [user, setUser] = useState(null);
//   const [lists, setLists] = useState([]);

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUser(user);
//         console.log(user.displayName);
//         fetchLists(user.displayName);
//       } else {
//         setUser(null);
//         setLists([]);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   const fetchHeroInfo = async (id) => {
//     try {
//       const response = await axios.get(`/api/info/${id}`);
//       const heroInfo = response.data;

//       const powersResponse = await axios.get(`/api/powers/${id}`);
//       heroInfo.powers = powersResponse.data;

//       return heroInfo;

//     } catch (error) {
//       console.error(`Error fetching hero info for id ${id}:`, error.message);
//       return null;
//     }
//   };

//   const fetchLists = async (username) => {
//     try {
//       const response = await axios.get(`/api/auth/lists/${username}`);
//       const listsWithHeroInfo = await Promise.all(
//         response.data.map(async (list) => {
//           const heroInfoPromises = list.ids.map(async (id) => {
//             const heroInfo = await fetchHeroInfo(id);
//             return heroInfo;
//           });
//           const heroInfoArray = await Promise.all(heroInfoPromises);
//           return {
//             ...list,
//             heroInfo: heroInfoArray,
//           };
//         })
//       );
//       setLists(listsWithHeroInfo);
//     } catch (error) {
//       console.error('Error fetching lists:', error.message);
//     }
//   };

//   return (
//     <div>
//       <h2>View Personal Lists</h2>
//       {user && (
//         <div>
//           <ul>
//           {lists.map((list) => (
//             <li key={list.list_name}>
//               <ExpandableSearchResults
//                 title={list.list_name}
//                 content={
//                   <>
//                     <div>
//                       <span style={{ fontWeight: 'bold' }}>{list.description}</span>
//                     </div>
//                     {list.heroInfo &&
//                       list.heroInfo.map((hero) => (
//                         <div key={hero.id}>
//                           <ExpandableSearchResults
//                             title={`${hero.name} - ${hero.Publisher}`}
//                             content={
//                               <>
//                                 <div>
//                                   <span style={{ fontWeight: 'bold' }}>Info</span>
//                                 </div>
//                                 Gender: {hero.Gender}
//                                 <br />
//                                 Eye color: {hero["Eye color"]}
//                                 <br />
//                                 Race: {hero["Race"]}
//                                 <br />
//                                 Hair color: {hero["Hair color"]}
//                                 <br />
//                                 Height: {hero["Height"]}
//                                 <br />
//                                 Skin color: {hero["Skin color"]}
//                                 <br />
//                                 Alignment: {hero["Alignment"]}
//                                 <br />
//                                 Weight: {hero["Weight"]}
//                                 <br />
//                                 <div>
//                                   <span style={{ fontWeight: 'bold' }}>Powers</span>
//                                 </div>
//                                 {hero["powers"] &&
//                                   Object.keys(hero["powers"]).map((key) => (
//                                     <div key={key}>{key}</div>
//                                   ))}
//                                 <a
//                                   href={`https://duckduckgo.com/?q=${hero.name} ${hero.Publisher}`}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                 >
//                                   Search On DDG
//                                 </a>
//                               </>
//                             }
//                           />
//                         </div>
//                       ))}
//                       <DeleteList listName={list.list_name} onDelete={() => fetchLists(user.displayName)} />
//                   </>
//                 }
//               />
//             </li>
//           ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewLists;
// import React, { useState, useEffect } from 'react';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import axios from 'axios';
// import ExpandableSearchResults from '../unauthuser/ExpandableSearchResults';
// import DeleteList from './DeleteList';
// import AddList from './AddList';

// const ViewLists = () => {
//   const [user, setUser] = useState(null);
//   const [lists, setLists] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [selectedList, setSelectedList] = useState(null);

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUser(user);
//         console.log(user.displayName);
//         fetchLists(user.displayName);
//       } else {
//         setUser(null);
//         setLists([]);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   const fetchHeroInfo = async (id) => {
//     try {
//       const response = await axios.get(`/api/info/${id}`);
//       const heroInfo = response.data;

//       const powersResponse = await axios.get(`/api/powers/${id}`);
//       heroInfo.powers = powersResponse.data;

//       return heroInfo;

//     } catch (error) {
//       console.error(`Error fetching hero info for id ${id}:`, error.message);
//       return null;
//     }
//   };

//   const fetchLists = async (username) => {
//     try {
//       const response = await axios.get(`/api/auth/lists/${username}`);
//       const listsWithHeroInfo = await Promise.all(
//         response.data.map(async (list) => {
//           const heroInfoPromises = list.ids.map(async (id) => {
//             const heroInfo = await fetchHeroInfo(id);
//             return heroInfo;
//           });
//           const heroInfoArray = await Promise.all(heroInfoPromises);
//           return {
//             ...list,
//             heroInfo: heroInfoArray,
//           };
//         })
//       );
//       setLists(listsWithHeroInfo);
//     } catch (error) {
//       console.error('Error fetching lists:', error.message);
//     }
//   };

//   const handleEditClick = (list) => {
//     setSelectedList(list);
//     setIsEditing(true);
//   };

//   const handleCancelEdit = () => {
//     setSelectedList(null);
//     setIsEditing(false);
//   };

//   return (
//     <div>
//       <h2>View Personal Lists</h2>
//       {user && (
//         <div>
//           <ul>
//             {lists.map((list) => (
//               <li key={list.list_name}>
//                 <ExpandableSearchResults
//                   title={list.list_name}
//                   content={
//                     <>
//                       <div>
//                         <span style={{ fontWeight: 'bold' }}>{list.description}</span>
//                       </div>
//                       {list.heroInfo &&
//                         list.heroInfo.map((hero) => (
//                           <div key={hero.id}>
//                             <ExpandableSearchResults
//                               title={`${hero.name} - ${hero.Publisher}`}
//                               content={
//                                 <>
//                                   <div>
//                                     <span style={{ fontWeight: 'bold' }}>Info</span>
//                                   </div>
//                                   Gender: {hero.Gender}
//                                   <br />
//                                   Eye color: {hero["Eye color"]}
//                                   <br />
//                                   Race: {hero["Race"]}
//                                   <br />
//                                   Hair color: {hero["Hair color"]}
//                                   <br />
//                                   Height: {hero["Height"]}
//                                   <br />
//                                   Skin color: {hero["Skin color"]}
//                                   <br />
//                                   Alignment: {hero["Alignment"]}
//                                   <br />
//                                   Weight: {hero["Weight"]}
//                                   <br />
//                                   <div>
//                                     <span style={{ fontWeight: 'bold' }}>Powers</span>
//                                   </div>
//                                   {hero["powers"] &&
//                                     Object.keys(hero["powers"]).map((key) => (
//                                       <div key={key}>{key}</div>
//                                     ))}
//                                   <a
//                                     href={`https://duckduckgo.com/?q=${hero.name} ${hero.Publisher}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                   >
//                                     Search On DDG
//                                   </a>
//                                 </>
//                               }
//                             />
//                           </div>
//                         ))}
//                       {/* "Edit" button */}
//                       <span
//                         style={{
//                           color: 'black',  // Changed color to black
//                           fontWeight: 'bold',
//                           cursor: 'pointer',
//                           marginRight: '10px',  // Added margin for separation
//                         }}
//                         onClick={() => handleEditClick(list)}
//                       >
//                         Edit
//                       </span>
//                       {/* DeleteList component */}
//                       <DeleteList listName={list.list_name} onDelete={() => fetchLists(user.displayName)} />
//                       {/* Conditionally render AddList component based on isEditing */}
//                       {isEditing && list.list_name === selectedList.list_name && (
//                         <AddList
//                           isEditing={isEditing}
//                           onCancelEdit={() => handleCancelEdit()}
//                           onSave={() => fetchLists(user.displayName)}
//                           selectedList={selectedList} // Make sure to pass the selectedList
//                         />
//                       )}
//                     </>
//                   }
//                 />
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewLists;
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import ExpandableSearchResults from '../unauthuser/ExpandableSearchResults';
import DeleteList from './DeleteList';
import AddList from './AddList';

const ViewLists = () => {
  const [user, setUser] = useState(null);
  const [lists, setLists] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedList, setSelectedList] = useState(null);

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

  const handleEditClick = (list) => {
    setSelectedList(list);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setSelectedList(null);
    setIsEditing(false);
  };

  return (
    <div>
      <h2>View Personal Lists</h2>
      {user && (
        <div>
          <ul>
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
                      <DeleteList listName={list.list_name} onDelete={() => fetchLists(user.displayName)} />
                      {isEditing && list.list_name === selectedList.list_name && (
                        <AddList
                          isEditing={isEditing}
                          onCancelEdit={() => handleCancelEdit()}
                          onUpdate={() => fetchLists(user.displayName)}
                          selectedList={selectedList}
                        />
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

export default ViewLists;
