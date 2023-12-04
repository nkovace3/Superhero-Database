// Import necessary modules and components from React and other libraries
import React, { useState, useEffect } from 'react';
import { auth } from '../../authentication';
import { onAuthStateChanged } from 'firebase/auth';

// Define the functional component DisableUser
const DisableUser = () => {
  // State variables for storing the list of users and the selected users to disable
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const user = auth.currentUser;

  // useEffect hook to fetch data and set up event listeners when the component mounts
  useEffect(() => {
    // Function to fetch data from the server
    const fetchData = async () => {
      try {
        // Get the current user and their ID token
        const user = auth.currentUser;

        if (user) {
          const idToken = await user.getIdToken();
          // Fetch all user data including whether they are disabled
          const response = await fetch('/api/admin/allUsernames', {
            headers: {
              'authorization': idToken,
            },
          });

          // Parse the response and update the state with user data
          const data = await response.json();
          setUsers(data);
          // Set selected users to those already disabled
          setSelectedUsers(data.filter(user => user.disabled).map(user => user.uid));
        }
      } catch (error) {
        // Handle errors during the fetch operation
        console.error('Error fetching users:', error.message);
      }
    };

    // Run fetchData when the component mounts
    fetchData();

    // Listen for changes in authentication state
    const unsubscribe = onAuthStateChanged(auth, () => {
      // When authentication state changes, run fetchData again
      fetchData();
    });

    // Cleanup function to unsubscribe from onAuthStateChanged
    return () => unsubscribe();
  }, []);

  // Event handler for checkbox changes to select/deselect users to disable
  const handleCheckboxChange = (uid) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(uid)) {
        return prevSelectedUsers.filter((user) => user !== uid);
      } else {
        return [...prevSelectedUsers, uid];
      }
    });
  };

  // Event handler for disabling/enabling selected users
  const handleDisableUsers = async () => {
    try {
      // Get the ID token of the current user
      const idToken = await user.getIdToken();

      // Get the list of all user IDs
      const allUserIds = users.map((user) => user.uid);

      // Determine which users should be disabled and enabled
      const usersToDisable = selectedUsers;
      const usersToEnable = allUserIds.filter((uid) => !selectedUsers.includes(uid));

      // Array of promises for disabling users
      const disablePromises = usersToDisable.map(async (uid) => {
        const response = await fetch(`/api/admin/disableUser/${uid}`, {
          method: 'POST',
          headers: {
            'authorization': idToken,
          },
        });
      
        const data = await response.json();
      
        if (data.success) {
          console.log(`User with UID ${uid} has been disabled.`);
        } else {
          console.error(`Failed to disable user with UID ${uid}.`);
        }
      
        return data.success;
      });

      // Array of promises for enabling users
      const enablePromises = usersToEnable.map(async (uid) => {
        const response = await fetch(`/api/admin/enableUser/${uid}`, {
          method: 'POST',
          headers: {
            'authorization': idToken,
          },
        });
      
        const data = await response.json();
      
        if (data.success) {
          console.log(`User with UID ${uid} has been enabled.`);
        } else {
          console.error(`Failed to enable user with UID ${uid}.`);
        }
      
        return data.success;
      });

      // Wait for all disable and enable promises to complete
      const [disableResults, enableResults] = await Promise.all([
        Promise.all(disablePromises),
        Promise.all(enablePromises),
      ]);

      // Check if all operations were successful and show an alert
      if (disableResults.every((result) => result) && enableResults.every((result) => result)) {
        alert('Disabled users updated successfully!');
      } else {
        alert('Some updates failed. Check the console for details.');
      }

      // Fetch updated user data after making changes
      const updatedResponse = await fetch('/api/admin/allUsernames', {
        headers: {
          'authorization': idToken,
        },
      });

      const updatedData = await updatedResponse.json();
      setUsers(updatedData);
      setSelectedUsers(updatedData.filter(user => user.disabled).map(user => user.uid));
    } catch (error) {
      // Handle errors during the attempt to disable/enable users
      console.error('Error disabling/enabling users:', error.message);
    }
  };

  // Render the component UI
  return (
    <div>
      <h2>Disabled Users</h2>
      <div className="disabled-list">
        {/* Display a list of users with checkboxes for selection */}
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
        {/* Button to trigger the disable/enable operation */}
        <button onClick={handleDisableUsers}>Save Changes</button>
      </div>
    </div>
  );
};

// Export the DisableUser component as the default export
export default DisableUser;
