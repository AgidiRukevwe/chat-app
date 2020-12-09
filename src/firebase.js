import firebase from "firebase";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBOk_drrvFmrTb-hrAcFcz7FNUSJ7g0a3M",
    authDomain: "whatsapp-clone-1a0ab.firebaseapp.com",
    databaseURL: "https://whatsapp-clone-1a0ab.firebaseio.com",
    projectId: "whatsapp-clone-1a0ab",
    storageBucket: "whatsapp-clone-1a0ab.appspot.com",
    messagingSenderId: "115500774001",
    appId: "1:115500774001:web:9cfd632a1b5ab346bba1d0",
    measurementId: "G-Y471KXH6Y0"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const dbRef = firebase.database().ref();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export default db;
export { auth, provider, dbRef, firebaseApp };
