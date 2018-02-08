import firebase from 'firebase';

var config = {
    apiKey: "AIzaSyDwdRXfTZw1V5MSdsyIF6ojinH7IzpLqaU",
    authDomain: "reciperecommender-5f423.firebaseapp.com",
    databaseURL: "https://reciperecommender-5f423.firebaseio.com",
    projectId: "reciperecommender-5f423",
    storageBucket: "reciperecommender-5f423.appspot.com",
    messagingSenderId: "1027289003445"
  };

 const app = firebase.initializeApp(config);
 const facebookProvider = new firebase.auth.FacebookAuthProvider()
 
 export { app, facebookProvider }