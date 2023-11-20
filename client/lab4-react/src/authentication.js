import {initializeApp} from 'firebase/app';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
    apiKey: "AIzaSyDsSB2vPm47jL37OHvukl-h4aiyAzHvFkc",
    authDomain: "lab4-firebase-2da11.firebaseapp.com",
    projectId: "lab4-firebase-2da11",
    storageBucket: "lab4-firebase-2da11.appspot.com",
    messagingSenderId: "970376129777",
    appId: "1:970376129777:web:32c9ea865973577286cd50",
    measurementId: "G-9YBCGMDB19"
  };

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
// async function createUserAndSendEmailVerification(email, password) {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       console.log('User created:', user);
//       await sendEmailVerification(user);
//       return user;
//     } catch (error) {
//       console.error('Error creating user:', error.message);
//       throw error;
//     }
//   }

// async function signInAndSendEmailVerification(email, password) {
//     try{

//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;
//         const userRecord = await getUser(auth, user.uid);
//         if(userRecord.disabled){
//             await auth.signOut();
//             alert('User account is disabled. Cannot sign in.');
//             return null;
//         }
//         if (!user.emailVerified) {
//         await sendEmailVerification(user);
//         console.log('Verification email sent to:', user.email);
//         }
//         console.log('User signed in:', user.email);
//         return user;
//     }
//     catch(error) {
//         console.log(error.message);
//     }
// }

// window.addEventListener('beforeunload', async (event) => {
//     try {
//       // Sign the user out before the page is unloaded
//       await signOut(auth);
//     } catch (error) {
//       // Handle sign-out errors
//       console.error('Error signing out:', error.message);
//     }
//   });
  
//module.exports = { createUserAndSendEmailVerification, signInAndSendEmailVerification };