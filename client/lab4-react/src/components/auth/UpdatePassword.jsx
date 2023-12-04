// Import necessary modules and functions from React, Firebase, and react-router-dom
import React, { useState } from 'react';
import { auth } from '../../authentication'
import { updatePassword } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import '../../pages/css/LogInCreateAccountStyle.css';

// Define the functional component UpdateUserPassword
const UpdateUserPassword = () => {
  // State variable to store the new password
  const [newPassword, setNewPassword] = useState('');
  // React Router's navigation hook
  const navigate = useNavigate();

  // Function to handle the update of the user's password
  const handleUpdatePassword = async () => {
    try {
      // Get the current user from Firebase Auth
      const user = auth.currentUser;

      // Check if there is a signed-in user
      if (user) {
        // Use Firebase Auth API to update the user's password
        await updatePassword(user, newPassword);

        // Alert the user about the successful password update
        alert('Password updated successfully!');

        // Navigate to the authenticated home page
        navigate('../authenticatedHome');
      } else {
        // Log an error if no user is currently signed in
        console.error('No user is currently signed in.');
      }
    } catch (error) {
      // Handle errors during the password update process
      console.error('Error updating password:', error.message);
    }
  };

  // Render the component UI
  return (
    <div className="login-create-account-container">
      <h2>Update Password</h2>
      {/* Container for the password update form */}
      <div className="login-container">
        {/* Input field for the new password */}
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {/* Button to trigger the password update */}
        <button onClick={handleUpdatePassword}>Update Password</button>
      </div>
    </div>
  );
};

// Export the UpdateUserPassword component as the default export
export default UpdateUserPassword;
