import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDQVPVS__UgYkMUy9HPLSGqFqKQb9tm7gI",
  authDomain: "crud-react-fnf12.firebaseapp.com",
  projectId: "crud-react-fnf12",
  storageBucket: "crud-react-fnf12.appspot.com",
  messagingSenderId: "554921347652",
  appId: "1:554921347652:web:e19644583590bad08c0a11"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export {firebase}