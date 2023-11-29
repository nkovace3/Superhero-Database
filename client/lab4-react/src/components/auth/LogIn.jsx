// import React, { useState } from 'react';
// import { auth } from '../../authentication';
// import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
// import { useNavigate } from "react-router-dom";

//         const LogIn = () => {
//         const [email, setEmail] = useState('');
//         const [password, setPassword] = useState('');
//         const navigate = useNavigate();

//         const signIn = (e) => {
//             e.preventDefault();
//             signInWithEmailAndPassword(auth, email, password)
//             .then((userCredential) => {
//                 const user = userCredential.user;
//                 console.log(user.email);
//                 if (!user.emailVerified) {
//                     sendEmailVerification(user);
//                     alert('Account is not yet validated. Verification email sent to: ' + user.email);
//                 }else{
//                     alert("Log-in successful!");
//                     navigate('authenticatedHome');
//                 }
//             }).catch((error) => {
//                 console.log(error.code);
//                 if(error.code === "auth/missing-password"){
//                     alert("Please enter a password.")
//                 }
//                 if(error.code === "auth/invalid-email"){
//                     alert("Please enter an email.")
//                 }
//                 if(error.code === "auth/invalid-login-credentials"){
//                     alert("Log-in unsuccessful.")
//                 }
//                 if(error.code === "auth/user-disabled"){
//                     alert("Your account has been disabled, please contact site administrator.");
//                 }
//             })
//         }

//         return (
//             <div className = 'log-in-container'>
//                 <form onSubmit={signIn}>
//                 <h1>Log In</h1>
//                 <input type = "email" placeholder="Email" value = {email} onChange={(e) => setEmail(e.target.value)}></input>
//                 <input type = "password" placeholder="Password" value = {password} onChange={(e) => setPassword(e.target.value)}></input>
//                 <button type = "submit">Log In</button>
//                 </form>
//             </div>
//         )
// };

// export default LogIn

// import React, { useState, useEffect } from 'react';
// import { getAuth, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
// import { useNavigate } from "react-router-dom";

//         const LogIn = ({ justCreatedAccount}) => {
//         const [email, setEmail] = useState('');
//         const [password, setPassword] = useState('');
//         const navigate = useNavigate();
//         const auth = getAuth();
//         //const [justCreatedAccount, setJustCreatedAccount] = useState(false);

//         const signIn = (e) => {
//             e.preventDefault();
//             signInWithEmailAndPassword(auth, email, password)
//             .then((userCredential) => {
//                 const user = userCredential.user;
//                 console.log(user.email);
//                 if (!user.emailVerified) {
//                     sendEmailVerification(user);
//                     alert('Account is not yet validated. Verification email sent to: ' + user.email);
//                 }else{
//                     alert("Log-in successful!");
//                     //navigate('authenticatedHome');
//                 }
//             }).catch((error) => {
//                 console.log(error.code);
//                 if(error.code === "auth/missing-password"){
//                     alert("Please enter a password.")
//                 }
//                 if(error.code === "auth/invalid-email"){
//                     alert("Please enter an email.")
//                 }
//                 if(error.code === "auth/invalid-login-credentials"){
//                     alert("Log-in unsuccessful.")
//                 }
//                 if(error.code === "auth/user-disabled"){
//                     alert("Your account has been disabled, please contact site administrator.");
//                 }
//             })
//         };

//         useEffect(() => {
//             const unsubscribe = onAuthStateChanged(auth, (user) => {
//               if (user) {
//                 user.getIdTokenResult()
//                   .then((idTokenResult) => {
//                     const isAdmin = !!idTokenResult.claims.admin;
//                     if (isAdmin) {
//                       navigate('adminHome');
//                     } else{
//                       if(!user.emailVerified) {
//                         sendEmailVerification(user);
//                         alert('Account is not yet validated. Verification email sent to: ' + user.email);
//                       }else if (!justCreatedAccount){
//                         navigate('authenticatedHome');
//                       }
//                     } 
//                   })
//                   .catch((error) => {
//                     console.error('Error getting ID token result:', error);
//                   });
//               }
//             });
        
//             return () => unsubscribe();
//           }, [auth, navigate, justCreatedAccount]);

//         return (
//             <div className = 'log-in-container'>
//                 <form onSubmit={signIn}>
//                 <h1>Log In</h1>
//                 <input type = "email" placeholder="Email" value = {email} onChange={(e) => setEmail(e.target.value)}></input>
//                 <input type = "password" placeholder="Password" value = {password} onChange={(e) => setPassword(e.target.value)}></input>
//                 <button type = "submit">Log In</button>
//                 </form>
//             </div>
//         );
// };

// export default LogIn;
import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const LogIn = ({ justCreatedAccount }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationAlertShown, setVerificationAlertShown] = useState(false);
  const [loginClicked, setLoginClicked] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const signIn = (e) => {
    e.preventDefault();
    setLoginClicked(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (!user.emailVerified && !verificationAlertShown) {
          setVerificationAlertShown(true);
          sendEmailVerification(user);
          alert('Account is not yet validated. Verification email sent to: ' + user.email);
        } else {
          alert('Log-in successful!');
          // navigate('authenticatedHome');
        }
      })
      .catch((error) => {
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && loginClicked) {
        user.getIdTokenResult()
          .then((idTokenResult) => {
            const isAdmin = !!idTokenResult.claims.admin;
            if (isAdmin) {
              navigate('adminHome');
            } else if (!justCreatedAccount) {
              navigate('authenticatedHome');
            }
          })
          .catch((error) => {
            console.error('Error getting ID token result:', error);
          });
      }
    });

    return () => unsubscribe();
  }, [auth, navigate, justCreatedAccount, loginClicked]);

  return (
    <div className="log-in-container">
      <form onSubmit={signIn}>
        <h1>Log In</h1>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default LogIn;
