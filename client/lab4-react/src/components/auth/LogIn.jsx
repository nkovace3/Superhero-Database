// Import necessary dependencies and functions from Firebase
import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// Define the LogIn functional component
const LogIn = ({ justCreatedAccount }) => {
  // State variables for email, password, verification alert, and login click status
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationAlertShown, setVerificationAlertShown] = useState(false);
  const [loginClicked, setLoginClicked] = useState(false);

  // Get the navigate function from react-router-dom and initialize Firebase auth
  const navigate = useNavigate();
  const auth = getAuth();

  // Function to handle user sign-in
  const signIn = (e) => {
    e.preventDefault();
    setLoginClicked(true);

    // Sign in with email and password
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Check if the user's email is verified
        if (!user.emailVerified && !verificationAlertShown) {
          setVerificationAlertShown(true);

          // Send email verification
          sendEmailVerification(user);
          alert('Account is not yet validated. Verification email sent to: ' + user.email);
        } else {
          alert('Log-in successful!');
        }
      })
      .catch((error) => {
        // Handle different authentication error codes
        console.log(error.code);
        if (error.code === 'auth/missing-password') {
          alert('Please enter a password.');
        }
        if (error.code === 'auth/invalid-email') {
          alert('Please enter an email.');
        }
        if (error.code === 'auth/invalid-login-credentials') {
          alert('Log-in unsuccessful.');
        }
        if (error.code === 'auth/user-disabled') {
          alert('Your account has been disabled, please contact the site administrator.');
        }
      });
  };

  // Effect hook to listen for changes in authentication state
  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && loginClicked && user.emailVerified) {
        // If user is logged in and email is verified, navigate based on user role
        user.getIdTokenResult()
          .then((idTokenResult) => {
            const isAdmin = !!idTokenResult.claims.admin;
            if (isAdmin) {
              navigate('adminHome');
            } else {
              navigate('authenticatedHome');
            }
          })
          .catch((error) => {
            console.error('Error getting ID token result:', error);
          });
      }
    });

    // Unsubscribe from auth state changes when component unmounts
    return () => unsubscribe();
  }, [auth, navigate, justCreatedAccount, loginClicked]);

  // Render the LogIn component UI
  return (
    <div className="log-in-container">
      <form onSubmit={signIn}>
        <h1>Log In</h1>
        {/* Input fields for email and password */}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
        {/* Button to submit the form and log in */}
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

// Export the LogIn component as the default export
export default LogIn;
