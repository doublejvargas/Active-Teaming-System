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

  createUserWithEmailAndPassword(email, password) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  };

  signInWithEmailAndPassword(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  };

  signOut() {
    return app.auth().signOut();
  };

  passwordReset(email) {
    return this.auth.sendPasswordResetEmail(email);
  };

  user(userEmail) {
    return this.db.doc(`users/${userEmail}`);
  }

  pendingUser(userEmail) {
    return this.db.doc(`pendingUsers/${userEmail}`);
  }

  getPendingUsers() {
    return this.db.collection('pendingUsers')
    .where("rejected","in",["init", "appeal"]);
  }
}
export default Firebase;