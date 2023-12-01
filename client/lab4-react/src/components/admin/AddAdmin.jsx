import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { auth } from '../../authentication';
import '../css/Admin.css';
import { onAuthStateChanged } from 'firebase/auth';

const AddAdmin = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchData = async () => {
    try {
        const user = auth.currentUser;
          const idToken = await user.getIdToken();
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData();
      }
    });

    return () => unsubscribe();
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
        const user = auth.currentUser;  
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
        <h2>Add Admins</h2>
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

export default AddAdmin;