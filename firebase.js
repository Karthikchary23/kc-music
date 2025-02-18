import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ Use environment variables
const firebaseConfig = {
    apiKey: "AIzaSyDXXfevelqEDAPxE4138lhtQvGiYKnpMis",
    authDomain: "music-1bccf.firebaseapp.com",
    projectId: "music-1bccf",
    storageBucket: "music-1bccf.firebasestorage.app",
    messagingSenderId: "991695374046",
    appId: "1:991695374046:web:8e9f80af7ad4eb2176644f",
    measurementId: "G-RPQGGYY6L9"
  };

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Enable Analytics only on the client side
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    getAnalytics(app);
  });
}

export { auth, provider, db, storage };
