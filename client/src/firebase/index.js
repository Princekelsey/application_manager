import firebase from "firebase/app";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyBMFEY9qHQiT_5HW9C6VC-Dhs8-86KF8tU",
  authDomain: "applicationform-c09d2.firebaseapp.com",
  databaseURL: "https://applicationform-c09d2.firebaseio.com",
  projectId: "applicationform-c09d2",
  storageBucket: "applicationform-c09d2.appspot.com",
  messagingSenderId: "569075028307",
  appId: "1:569075028307:web:db6dd4a0b87dd4cc"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
