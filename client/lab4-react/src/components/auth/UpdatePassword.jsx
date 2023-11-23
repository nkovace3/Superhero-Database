import React, { useState } from 'react';
import { auth } from '../../authentication'
import { updatePassword } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import '../../pages/css/LogInCreateAccountStyle.css';

const UpdateUserPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();
  
    const handleUpdatePassword = async () => {
        try {
        const user = auth.currentUser;
        console.log(user);
        if (user) {
            await updatePassword(user, newPassword);
            alert('Password updated successfully!');
            navigate('../authenticatedHome');
        } else {
          console.error('No user is currently signed in.');
        }
        } catch (error) {
        console.error('Error updating password:', error.message);
        }
    };
  
    return (
      <div className="login-create-account-container">
        <h2>Update Password</h2>
        <div className = "login-container">
            
            <label>New Password:</label>
            <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleUpdatePassword}>Update Password</button>
        </div>
      </div>
    );
  };
  
  export default UpdateUserPassword;

// const UpdatePassword = () => {
//         const [email, setEmail] = useState('');

//         const updatePassword = (e) => {
//             e.preventDefault();
//             fetchSignInMethodsForEmail(auth, email)
//             .then((methods) => {
//                 console.log(methods);
//                 if(methods.length > 0) {
//                     return sendPasswordResetEmail(auth, email);
//                 }else{
//                     alert("User does not exist!");
//                     return Promise.reject(new Error("User does not exist!"));
//                 }
//             })
//             // sendPasswordResetEmail(auth, email)
//             .then(() => {
//                 // const user = userCredential.user;
//                 alert('Password reset email sent.');
//                 // console.log('Email sent:', user);
//             })
//             .catch((error) => {
//                 console.log(error.code);
//                 if(error.code === 'auth/email-already-in-use'){
//                     alert("Account already exists with that email!");
//                 }
//                 if(error.code === "auth/missing-email"){
//                     alert("Please enter an email.")
//                 }
//                 if(error.code === "auth/missing-password"){
//                     alert("Please enter a password.")
//                 }
//                 if(error.code === "auth/invalid-email"){
//                     alert("Please enter an email.")
//                 }
//             })
//         }

//         return (
//             <div className = 'log-in-container'>
//                 <form onSubmit={updatePassword}>
//                 <h1>Change Password</h1>
//                 <input type = "email" placeholder="Email" value = {email} onChange={(e) => setEmail(e.target.value)}></input>
//                 <button type = "submit">Change</button>
//                 </form>
//             </div>
//         )
// };

// export default UpdatePassword;