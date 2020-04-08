import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
const config = {
    apiKey: "AIzaSyB8YOdZddRMB-rm9p8A6COaolDDTP3oEAo",
    authDomain: "csc322e.firebaseapp.com",
    databaseURL: "https://csc322e.firebaseio.com",
    projectId: "csc322e",
    storageBucket: "csc322e.appspot.com",
    messagingSenderId: "451549833356",
};
class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.firestore();
  }

  createUserWithEmailAndPassword = (email, password) =>
  this.auth.createUserWithEmailAndPassword(email, password);

  signInWithEmailAndPassword = (email, password) =>
  this.auth.signInWithEmailAndPassword(email, password);

  signOut = () => this.auth.signOut();

  passwordReset = email => this.auth.sendPasswordResetEmail(email);

  user = userEmail => this.db.doc(`users/${userEmail}`);

  pendingUser = userEmail => this.db.doc(`pendingUsers/${userEmail}`);

  getPendingUsers = () => this.db.collection('pendingUsers')
                          .where("rejected","in",["init", "appeal"]);

  group = () => this.db.collection('groups');

}
export default Firebase;