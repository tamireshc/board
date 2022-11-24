// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUua-JkkwoiDoMaFfgQX_v3Wj_9rUjNJI",
  authDomain: "boardapp-880a1.firebaseapp.com",
  projectId: "boardapp-880a1",
  storageBucket: "boardapp-880a1.appspot.com",
  messagingSenderId: "171930224987",
  appId: "1:171930224987:web:2f4ff9cdba7c4aa49fb27e"
};


const app = initializeApp(firebaseConfig);

// Initialize Firebase

// const app = initializeApp(firebaseConfig);
// const firestore = getFirestore(app);

export const db = getFirestore(app);
