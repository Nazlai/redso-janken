import Firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/functions";

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
};

const app = Firebase.initializeApp(config);

export const db = app.firestore();
export const auth = app.auth();

export const functions = app.functions();

export const cloudFunctions = {
  commitMove: functions.httpsCallable("commitMove"),
  newGame: functions.httpsCallable("newGame"),
  leaveGame: functions.httpsCallable("leaveGame"),
  createGame: functions.httpsCallable("createGame"),
  joinGame: functions.httpsCallable("joinGame"),
};
