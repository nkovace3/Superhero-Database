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
const auth = getAuth(firebaseApp);
export {auth};
export default firebaseApp;
