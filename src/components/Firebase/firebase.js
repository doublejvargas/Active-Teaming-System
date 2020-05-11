import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
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
    this.app = app;
    this.auth = app.auth();
    this.db = app.firestore();
  }

  createUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  signInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  signOut = () => this.auth.signOut();

  passwordReset = (email) => this.auth.sendPasswordResetEmail(email);

  user = (userEmail) => this.db.doc(`users/${userEmail}`);

  getTopRankedUsers = () =>
    this.db.collection("users").orderBy("score", "desc").limit(3);

  getAllVIPs = () => this.db.collection("users").where("role", "==", "VIP");
  
  getDemocraticSU = () => this.db.collection('users').where('role', '==', 'DSU');
  
  pendingUser = (userEmail) => this.db.doc(`pendingUsers/${userEmail}`);

  getPendingUsers = () =>
    this.db
      .collection("pendingUsers")
      .where("rejected", "in", ["init", "appeal"]);

  group = () => this.db.collection("groups");

  getTopRankedGroups = () =>
    this.db.collection("groups").orderBy("evaluationScore").limit(3);

  getGroupsNeedEvaluate = () =>
    this.db
      .collection("groups")
      .where("status", "==", "closed")
      .where("vipEvaluated", "==", false);

  complaint = () => this.db.collection("complaint");

  getUnsovledComplaint = () =>
    this.db.collection("complaint").where("solved", "==", false);

  compliment = () => this.db.collection("compliment");

  getUnsovledCompliment = () =>
    this.db.collection("compliment").where("solved", "==", false);

  vote = () => this.db.collection("vote");

  getSUvote = () => this.db.collection('vote').where('type','==','SU').where('achieved','==',false);

  task = (groupId) => this.group().doc(groupId).collection("task");

  evaluation = (groupId, memberId) =>
    this.group().doc(groupId).collection("evaluation").doc(memberId);
}
export default Firebase;
