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
  apiKey: "AIzaSyDihiIHIGQPTcCECorBSPw1aHztV546GFE",
  authDomain: "firstreact-27fdc.firebaseapp.com",
  databaseURL: "https://firstreact-27fdc-default-rtdb.firebaseio.com",
  projectId: "firstreact-27fdc",
  storageBucket: "firstreact-27fdc.appspot.com",
  messagingSenderId: "729274536913",
  appId: "1:729274536913:web:8291cd5f3447ca5d7786f0"
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
