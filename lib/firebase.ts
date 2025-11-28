// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDW-yZUM5z7iFYZBKZoQ_ReZLu4tQMPSyQ",
  authDomain: "personal-website-694ec.firebaseapp.com",
  projectId: "personal-website-694ec",
  storageBucket: "personal-website-694ec.appspot.com",
  messagingSenderId: "26617430134",
  appId: "1:26617430134:web:6e1a98d74c1634f3339f57",
  measurementId: "G-0B95RCR920",
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics };
