// Import necessary modules and functions from React and Firebase
import React, { useState } from 'react';
import { auth } from '../../authentication';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';

// Define the functional component CreateAccount
const CreateAccount = ({ setJustCreatedAccount }) => {
  // State variables to store email, username, and password
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Function to create a new user and send email verification
  const createUserAndSendEmailVerification = (e) => {
    e.preventDefault();
    // Use Firebase Auth API to create a new user with email and password
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Retrieve the user from the userCredential
        const user = userCredential.user;

        // Alert the user to verify their account and send a verification email
        alert('Please verify your account. Verification email sent to: ' + user.email);

        // Log the created user to the console
        console.log('User created:', user);

        // Send an email verification to the user
        sendEmailVerification(user)
          .then(() => {
            // Update the user profile with the provided username
            updateProfile(user, { displayName: username });

            // Set the state to indicate that an account was just created
            setJustCreatedAccount(true);
          });
      })
      .catch((error) => {
        // Handle errors during user creation
        console.log(error.code);

        // Check error codes and show appropriate alerts for user feedback
        if (error.code === 'auth/email-already-in-use') {
          alert("Account already exists with that email!");
        }
        if (error.code === "auth/missing-email") {
          alert("Please enter an email.")
        }
        if (error.code === "auth/missing-password") {
          alert("Please enter a password.")
        }
        if (error.code === "auth/invalid-email") {
          alert("Please enter a valid email.")
        }
      });
  }

  // Render the component UI
  return (
    <div className='log-in-container'>
      {/* Form for user registration */}
      <form onSubmit={createUserAndSendEmailVerification}>
        <h1>Sign Up</h1>
        {/* Input fields for email, username, and password */}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}></input>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
        {/* Submit button for user registration */}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

// Export the CreateAccount component as the default export
export default CreateAccount;
