// import React, { useState, useEffect } from 'react';
// import Select from 'react-select';

// const UserList = () => {
//     const [usernames, setUsernames] = useState([]);
//     const [selectedUser, setSelectedUser] = useState(null);
  
//     useEffect(() => {
//       fetch('/api/admin/usernames')
//         .then((response) => response.json())
//         .then((data) => {
//           setUsernames(data);
//         })
//         .catch((error) => {
//           console.error('Error fetching usernames:', error.message);
//         });
//     }, []);
  
//     const handleUserChange = (selectedOption) => {
//       setSelectedUser(selectedOption);
//     };
  
//     const handleMakeAdminClick = () => {
//         if (!selectedUser) {
//           alert('Please select a user before making them an admin.');
//           return;
//         }
//         console.log(selectedUser);
//         // Call the API to make the selected user an admin
//         fetch('/api/admin/setAdminClaim', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': selectedUser.value,
//           },
//         })
//           .then((response) => response.json())
//           .then((data) => {
//             if (data.success) {
//               alert(`User ${selectedUser.label} is now an admin.`);
//               // Optionally, you can update the UI or perform additional actions
//             } else {
//               alert('Failed to make the user an admin.');
//             }
//           })
//           .catch((error) => {
//             console.error('Error making user an admin:', error.message);
//             alert('Failed to make the user an admin.');
//           });
//       };

//     return (
//       <div>
//         <label htmlFor="userDropdown">Select User:</label>
//         <Select
//           id="userDropdown"
//           options={usernames.map((username) => ({ value: username, label: username }))}
//           value={selectedUser}
//           onChange={handleUserChange}
//         />
//         <button onClick={handleMakeAdminClick}>Make Admin</button>
//       </div>
//     );
// };


// export default UserList;

// import React, { useState, useEffect } from 'react';
// import Select from 'react-select';
// import { auth } from '../../authentication';

// const UserList = () => {
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);

//   const user = auth.currentUser;
//   const idToken = user.getIdToken();
//   console.log(idToken);

//   useEffect(() => {
//     fetch('/api/admin/usernames', {
//         headers: {
//             'authorization': idToken
//         }
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data);
//         setUsers(data);
//       })
//       .catch((error) => {
//         console.error('Error fetching users:', error.message);
//       });
//   }, []);

//   const handleUserChange = (selectedOption) => {
//     setSelectedUser(selectedOption);
//   };

//   const handleMakeAdminClick = () => {
//     if (!selectedUser) {
//       alert('Please select a user before making them an admin.');
//       return;
//     }
//     console.log(selectedUser.value.uid);
//     // Call the API to make the selected user an admin
//     fetch('/api/admin/setAdminClaim', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'authorization': idToken, // Pass UID as authorization header
//       },
//       body: JSON.stringify(selectedUser.value.uid)
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.success) {
//           alert(`User ${selectedUser.label} is now an admin.`);
//           // Optionally, you can update the UI or perform additional actions
//         } else {
//           alert('Failed to make the user an admin.');
//         }
//       })
//       .catch((error) => {
//         console.error('Error making user an admin:', error.message);
//         alert('Failed to make the user an admin.');
//       });
//   };

//   return (
//     <div>
//       <label htmlFor="userDropdown">Select User:</label>
//       <Select
//         id="userDropdown"
//         options={users.map((user) => ({ value: user, label: user.username }))}
//         value={selectedUser}
//         onChange={handleUserChange}
//       />
//       <button onClick={handleMakeAdminClick}>Make Admin</button>
//     </div>
//   );
// };

// export default UserList;
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { auth } from '../../authentication';
import '../css/Admin.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const user = auth.currentUser;

  const fetchData = async () => {
    try {
        const idToken = await user.getIdToken();
        console.log(idToken);
        const response = await fetch('/api/admin/nonAdminUsernames', {
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleUserChange = (selectedOption) => {
    setSelectedUser(selectedOption);
  };

  const handleMakeAdminClick = async () => {
    if (!selectedUser) {
      alert('Please select a user before making them an admin.');
      return;
    }
    console.log(selectedUser.value.uid);
    
    try {
        const idToken = await user.getIdToken();
        const response = await fetch('/api/admin/setAdminClaim/' + selectedUser.value.uid, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': idToken,
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`User ${selectedUser.label} is now an admin.`);
        // Optionally, you can update the UI or perform additional actions
      } else {
        alert('Failed to make the user an admin.');
      }
    } catch (error) {
      console.error('Error making user an admin:', error.message);
      alert('Failed to make the user an admin.');
    }
  };

  return (
    <div>
        <h1>Add Admins</h1>
    <div className = "user-list-container">
      <label htmlFor="userDropdown">Select User:</label>
      <Select
        id="userDropdown"
        options={users.map((user) => ({ value: user, label: user.username }))}
        value={selectedUser}
        onChange={handleUserChange}
      />
      <button onClick={handleMakeAdminClick}>Make Admin</button>
    </div>
    </div>
  );
};

export default UserList;