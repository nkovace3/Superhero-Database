// import React, { useState, useEffect } from 'react';

// const DisableUser = () => {
//   const [users, setUsers] = useState([]);
//   const [selectedUsers, setSelectedUsers] = useState([]);

//   useEffect(() => {
//     // Fetch list of Firebase users
//     fetch('/api/admin/allUsernames', {
//       headers: {
//         'Authorization': 'YOUR_ID_TOKEN', // Add your ID token here
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setUsers(data);
//       })
//       .catch((error) => {
//         console.error('Error fetching users:', error.message);
//       });
//   }, []);

//   const handleCheckboxChange = (uid) => {
//     // Toggle selected users
//     setSelectedUsers((prevSelectedUsers) => {
//       if (prevSelectedUsers.includes(uid)) {
//         return prevSelectedUsers.filter((user) => user !== uid);
//       } else {
//         return [...prevSelectedUsers, uid];
//       }
//     });
//   };

//   const handleDisableUsers = () => {
//     // Call API to disable selected users
//     selectedUsers.forEach(async (uid) => {
//       try {
//         const response = await fetch(`/api/admin/disableUser/${uid}`, {
//           method: 'POST',
//         });

//         const data = await response.json();

//         if (data.success) {
//           console.log(`User with UID ${uid} has been disabled.`);
//         } else {
//           console.error(`Failed to disable user with UID ${uid}.`);
//         }
//       } catch (error) {
//         console.error('Error disabling users:', error.message);
//       }
//     });
//   };

//   return (
//     <div>
//       <h2>User Management</h2>
//       <ul>
//         {users.map((user) => (
//           <li key={user.uid}>
//             <input
//               type="checkbox"
//               id={user.uid}
//               checked={selectedUsers.includes(user.uid)}
//               onChange={() => handleCheckboxChange(user.uid)}
//             />
//             <label htmlFor={user.uid}>{user.username}</label>
//           </li>
//         ))}
//       </ul>
//       <button onClick={handleDisableUsers}>Disable Selected Users</button>
//     </div>
//   );
// };

// export default DisableUser;
import React, { useState, useEffect } from 'react';
import { auth } from '../../authentication';

const DisableUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idToken = await user.getIdToken();
        const response = await fetch('/api/admin/allUsernames', {
          headers: {
            'authorization': idToken
          },
        });

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange = (uid) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(uid)) {
        return prevSelectedUsers.filter((user) => user !== uid);
      } else {
        return [...prevSelectedUsers, uid];
      }
    });
  };

  const handleDisableUsers = async () => {
    try {
      const idToken = await user.getIdToken();
      for (const uid of selectedUsers) {
        const response = await fetch(`/api/admin/disableUser/${uid}`, {
          method: 'POST',
          headers: {
            'authorization': idToken
          },
        });

        const data = await response.json();

        if (data.success) {
          console.log(`User with UID ${uid} has been disabled.`);
        } else {
          console.error(`Failed to disable user with UID ${uid}.`);
        }
      }
    } catch (error) {
      console.error('Error disabling users:', error.message);
    }
  };

  return (
    <div>
      <h2>Disable Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.uid}>
            <input
              type="checkbox"
              id={user.uid}
              checked={selectedUsers.includes(user.uid)}
              onChange={() => handleCheckboxChange(user.uid)}
            />
            <label htmlFor={user.uid}>{user.username}</label>
          </li>
        ))}
      </ul>
      <button onClick={handleDisableUsers}>Disable Selected Users</button>
    </div>
  );
};

export default DisableUser;
