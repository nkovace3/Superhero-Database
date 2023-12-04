// Import necessary modules and components from React and other libraries
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { auth } from '../../authentication';
import '../css/Admin.css';
import { onAuthStateChanged } from 'firebase/auth';

// Define the functional component AddAdmin
const AddAdmin = () => {
  // State variables for storing the list of users and the selected user
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Function to fetch non-admin users from the server
  const fetchData = async () => {
    try {
        // Get the current user and their ID token
        const user = auth.currentUser;
        const idToken = await user.getIdToken();
        
        // Fetch non-admin users from the server using the ID token
        const response = await fetch('/api/admin/nonAdminUsernames', {
          headers: {
            'authorization': idToken
          },
        });

        // Parse the response and update the users state
        const data = await response.json();
        setUsers(data);
    } catch (error) {
      // Handle errors during the fetch operation
      console.error('Error fetching users:', error.message);
    }
  };

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fetch data when a user is authenticated
        fetchData();
      }
    });

    // Unsubscribe from authentication state changes when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array means this effect runs only once, on mount

  // Event handler for selecting a user from the dropdown
  const handleUserChange = (selectedOption) => {
    setSelectedUser(selectedOption);
  };

  // Event handler for making the selected user an admin
  const handleMakeAdminClick = async () => {
    // Check if a user is selected before attempting to make them an admin
    if (!selectedUser) {
      alert('Please select a user before making them an admin.');
      return;
    }
    
    // Log the UID of the selected user to the console
    console.log(selectedUser.value.uid);

    try {
        // Get the current user and their ID token
        const user = auth.currentUser;  
        const idToken = await user.getIdToken();
        
        // Send a request to the server to set the admin claim for the selected user
        const response = await fetch('/api/admin/setAdminClaim/' + selectedUser.value.uid, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorization': idToken,
          }
        });

        // Parse the response and show a success or failure alert
        const data = await response.json();
        if (data.success) {
          alert(`User ${selectedUser.label} is now an admin.`);
        } else {
          alert('Failed to make the user an admin.');
        }
    } catch (error) {
      // Handle errors during the attempt to make the user an admin
      console.error('Error making user an admin:', error.message);
      alert('Failed to make the user an admin.');
    }
  };

  // Render the component UI
  return (
    <div>
      <h2>Add Admins</h2>
      <div className="user-list-container">
        <label htmlFor="userDropdown">Select User:</label>
        {/* Dropdown for selecting a user */}
        <Select
          id="userDropdown"
          options={users.map((user) => ({ value: user, label: user.username }))}
          value={selectedUser}
          onChange={handleUserChange}
        />
        {/* Button to trigger making the selected user an admin */}
        <button onClick={handleMakeAdminClick}>Make Admin</button>
      </div>
    </div>
  );
};

// Export the AddAdmin component as the default export
export default AddAdmin;
