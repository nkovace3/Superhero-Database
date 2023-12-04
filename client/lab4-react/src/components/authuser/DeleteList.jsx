// Import necessary modules and components from React, Axios, and Firebase authentication
import React, { useState } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

// Define the functional component DeleteList
const DeleteList = ({ listName, onDelete }) => {
  // State variable to manage the deleting state
  const [isDeleting, setIsDeleting] = useState(false);
  // Get the authentication object from Firebase
  const auth = getAuth();

  // Function to handle the deletion of a list
  const handleDelete = async () => {
    try {
      // Display a confirmation dialog and proceed only if the user confirms
      const confirmation = window.confirm(`Are you sure you want to delete the list "${listName}"?`);
      if (!confirmation) {
        return; 
      }

      // Set the deleting state to true to show the "Deleting..." message
      setIsDeleting(true);

      // Get the user's ID token for authentication
      const idToken = await auth.currentUser.getIdToken();

      // Make a DELETE request to the server to delete the specified list
      await axios.delete(`/api/lists/${listName}`, {
        headers: {
          Authorization: idToken,
        },
        data: {
          username: auth.currentUser.displayName,
        },
      });

      // Trigger the onDelete callback to update the UI
      onDelete();
    } catch (error) {
      console.error(`Error deleting list ${listName}:`, error.message);
    } finally {
      // Set the deleting state back to false regardless of success or failure
      setIsDeleting(false);
    }
  };

  // Render a clickable text to initiate the delete operation
  return (
    <span
      style={{
        color: 'red',
        fontWeight: 'bold',
        cursor: 'pointer',
      }}
      // Attach the handleDelete function to the onClick event
      onClick={handleDelete}
    >
      {/* Display "Deleting..." while the deletion is in progress, otherwise, show "Delete List" */}
      {isDeleting ? 'Deleting...' : 'Delete List'}
    </span>
  );
};

// Export the DeleteList component as the default export
export default DeleteList;
