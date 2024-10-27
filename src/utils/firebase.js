/*import firebase from "firebase/compat/app";
import { getDatabase, ref, push } from "firebase/database";
import { initializeApp } from "firebase/app";*/

// src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getAuth , signInWithPopup , GoogleAuthProvider , FacebookAuthProvider } from "firebase/auth";
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1nkqyddcdf8poIgYd7PXB96e5bdKuk1I",
  authDomain: "rentbook-14471.firebaseapp.com",
  projectId: "rentbook-14471",
  storageBucket: "rentbook-14471.appspot.com",
  messagingSenderId: "1076847253175",
  appId: "1:1076847253175:web:0ddf60e4321ce841de1f32"
};

// Initialize Firebase
/*const app = initializeApp(firebaseConfig);
const database = getDatabase(app); 
export default firebase;*/

const app = initializeApp(firebaseConfig);

// Initialize and export the Realtime Database
export const database = getDatabase(app);

//Google Authen
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt : "select_account"
});

export const auth = getAuth();

const signInWithGooglePopUp = () => signInWithPopup(auth , provider);
export {signInWithGooglePopUp };

// Facebook Authen
const facebookProvider = new FacebookAuthProvider();
const signInWithFacebook = () => {
  return signInWithPopup(auth, facebookProvider);
};

export { signInWithFacebook };

// Initialize Firestore
const db = getFirestore(app);

export { db };

export const authemail = getAuth(app);

const storage = getStorage(app); // Initialize Firebase Storage
export {storage};
