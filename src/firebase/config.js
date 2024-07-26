import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    //Config
  };

  firebase.initializeApp(firebaseConfig); // initialize firebase

  const projectFireStore = firebase.firestore();
  const projectAuth = firebase.auth();
  const projectStorage = firebase.storage();

  const timestamp = firebase.firestore.FieldValue.serverTimestamp;


  export{projectFireStore, projectAuth, projectStorage ,timestamp};