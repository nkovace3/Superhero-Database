import React, { useState } from 'react';
import { auth } from '../../authentication';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
          
const CreateAccount = () => {
        const [email, setEmail] = useState('');
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');

        const createUserAndSendEmailVerification = (e) => {
            e.preventDefault();
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                alert('Please verify your account. Verification email sent to: ' + user.email);
                console.log('User created:', user);
                sendEmailVerification(user)
                .then(() => {
                    updateProfile(user, {displayName: username})
                });
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
                <form onSubmit={createUserAndSendEmailVerification}>
                <h1>Sign Up</h1>
                <input type = "email" placeholder="Email" value = {email} onChange={(e) => setEmail(e.target.value)}></input>
                <input type = "username" placeholder="Username" value = {username} onChange={(e) => setUsername(e.target.value)}></input>
                <input type = "password" placeholder="Password" value = {password} onChange={(e) => setPassword(e.target.value)}></input>
                <button type = "submit">Sign Up</button>
                </form>
            </div>
        )
};

export default CreateAccount;