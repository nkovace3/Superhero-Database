import { auth } from '../../authentication';
import React, { useState } from 'react';
// import { useAuth } from 'your-firebase-auth-library'; // Import the appropriate Firebase Auth hook

const UpdatePassword = () => {
//   const auth = useAuth(); // Use the Firebase Auth hook

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        setMessage('Passwords do not match.');
        return;
      }

      await auth.currentUser.updatePassword(newPassword);
      setMessage('Password updated successfully!');
    } catch (error) {
      setMessage(`Error updating password: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Update Password</h2>
      <div>
        <label htmlFor="newPassword">New Password:</label>
        <input
          type="password"
          name="newPassword"
          value={newPassword}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
        />
      </div>
      <button onClick={handleUpdatePassword}>Update Password</button>
      <p>{message}</p>
    </div>
  );
};

export default UpdatePassword;
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