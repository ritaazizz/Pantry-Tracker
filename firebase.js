// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrIHYbFCuQOToqF5FmB-6L4lpRxccBca0",
  authDomain: "inventory-management-ad94c.firebaseapp.com",
  projectId: "inventory-management-ad94c",
  storageBucket: "inventory-management-ad94c.appspot.com",
  messagingSenderId: "172376327301",
  appId: "1:172376327301:web:31fd0e6caf41744afc95ec",
  measurementId: "G-CWWGXKKZ1T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export {firestore}