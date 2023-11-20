import React, { useState } from 'react';
import { auth } from '../../authentication';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

        const LogIn = () => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');

        const signIn = (e) => {
            e.preventDefault();
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user.email);
                if (!user.emailVerified) {
                    sendEmailVerification(user);
                    alert('Account is not yet validated. Verification email sent to: ' + user.email);
                }else{
                    alert("Log-in successful!")
                }
                //const userRecord = getUser(auth, user.uid);

            }).catch((error) => {
                console.log(error.code);
                if(error.code === "auth/missing-password"){
                    alert("Please enter a password.")
                }
                if(error.code === "auth/invalid-email"){
                    alert("Please enter an email.")
                }
                if(error.code === "auth/invalid-login-credentials"){
                    alert("Log-in unsuccessful.")
                }
            })
        }

        return (
            <div className = 'log-in-container'>
                <form onSubmit={signIn}>
                <h1>Log In</h1>
                <input type = "email" placeholder="Email" value = {email} onChange={(e) => setEmail(e.target.value)}></input>
                <input type = "password" placeholder="Password" value = {password} onChange={(e) => setPassword(e.target.value)}></input>
                <button type = "submit">Log In</button>
                </form>
            </div>
        )
};

export default LogIn