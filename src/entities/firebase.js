// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage, ref as storageRef, getDownloadURL, uploadBytes } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4RHVr-ZNk2LGN4WxkLyXAIl-h9MduvOU",
  authDomain: "ferreteria-omiltemi.firebaseapp.com",
  projectId: "ferreteria-omiltemi",
  storageBucket: "ferreteria-omiltemi.appspot.com",
  messagingSenderId: "608635720083",
  appId: "1:608635720083:web:8975ca35c5f424d85c1866",
  measurementId: "G-LN954HDGXQ"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, storage, storageRef, getDownloadURL, uploadBytes }