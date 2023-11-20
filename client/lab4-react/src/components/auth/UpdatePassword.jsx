/*


IN SHAMBLES CURRENTLY
FIND WAY THAT LETS AUTHENTICATED USERS LOG IN IN HOME PAGE



*/
import React, { useState } from 'react';
import { auth } from '../../authentication';
import { sendPasswordResetEmail, fetchSignInMethodsForEmail } from 'firebase/auth';
          
const UpdatePassword = () => {
        const [email, setEmail] = useState('');

        const updatePassword = (e) => {
            e.preventDefault();
            fetchSignInMethodsForEmail(auth, email)
            .then((methods) => {
                console.log(methods);
                if(methods.length > 0) {
                    return sendPasswordResetEmail(auth, email);
                }else{
                    alert("User does not exist!");
                    return Promise.reject(new Error("User does not exist!"));
                }
            })
            // sendPasswordResetEmail(auth, email)
            .then(() => {
                // const user = userCredential.user;
                alert('Password reset email sent.');
                // console.log('Email sent:', user);
            })
            .catch((error) => {
                console.log(error.code);
                if(error.code === 'auth/email-already-in-use'){
                    alert("Account already exists with that email!");
                }
                if(error.code === "auth/missing-email"){
                    alert("Please enter an email.")
                }
                if(error.code === "auth/missing-password"){
                    alert("Please enter a password.")
                }
                if(error.code === "auth/invalid-email"){
                    alert("Please enter an email.")
                }
            })
        }

        return (
            <div className = 'log-in-container'>
                <form onSubmit={updatePassword}>
                <h1>Change Password</h1>
                <input type = "email" placeholder="Email" value = {email} onChange={(e) => setEmail(e.target.value)}></input>
                <button type = "submit">Change</button>
                </form>
            </div>
        )
};

export default UpdatePassword;