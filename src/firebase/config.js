import firebase from 'firebase/app';
import 'firebase/functions';
import 'firebase/storage';
import 'firebase/auth';
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAIxMZwPrTBgM2JQz4ZVsGMiwesfWFNx-A",
    authDomain: "sarah-dietetitienne.firebaseapp.com",
    projectId: "sarah-dietetitienne",
    storageBucket: "sarah-dietetitienne.appspot.com",
    messagingSenderId: "196697512870",
    appId: "1:196697512870:web:b999b17eb7458233e2cd67",
    measurementId: "G-D8Z32LLP7Y"
  };

  firebase.initializeApp(firebaseConfig);

  const projectFunctions= firebase.app().functions('europe-west1');
  const projectAuth = firebase.auth();
  const projectStorage = firebase.storage();
  const projectFirestore = firebase.firestore();

  //Timestamp
  const timestamp = firebase.firestore.Timestamp;


  export {projectFunctions,projectStorage,projectFirestore,projectAuth,timestamp}