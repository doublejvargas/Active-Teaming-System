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
      return this.auth.signInWithEmailAndPassword(email, password)
  };

  signOut() {
      return this.auth.signOut()
  };

  passwordReset(email) {
      return this.auth.sendPasswordResetEmail(email);
  };

  setUser(userEmail) {
      return this.db.doc(`users/${userEmail}`);
  }

  setPendingUser(userEmail) {
    return this.db.doc(`pendingUsers/${userEmail}`);
  }

  getPendingUsers() {
    return this.db.collection('pendingUsers');
  }
}
export default Firebase;