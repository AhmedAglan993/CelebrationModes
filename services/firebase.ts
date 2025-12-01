import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { CelebrationData } from "../types";

// ------------------------------------------------------------------
// TODO: REPLACE THIS WITH YOUR FIREBASE CONFIG FROM CONSOLE.FIREBASE.GOOGLE.COM
// ------------------------------------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyDk2vCAZ6pfdcbxAR-gCg8D-mBGPReIhNo",
    authDomain: "celebrationmodes.firebaseapp.com",
    projectId: "celebrationmodes",
    storageBucket: "celebrationmodes.firebasestorage.app",
    messagingSenderId: "729541522594",
    appId: "1:729541522594:web:202120be1fdb9241e693fb"
};
// ------------------------------------------------------------------

// Initialize only if config is valid (prevents crashing in demo mode if keys aren't set)
let database: any;

try {
  const app = initializeApp(firebaseConfig);
  database = getDatabase(app);
} catch (e) {
  console.warn("Firebase not initialized. Ensure valid config in services/firebase.ts");
}

export const updateCelebration = (data: CelebrationData) => {
  if (!database) {
    console.log("Mock Mode: Would send to Firebase", data);
    return;
  }
  // We overwrite the 'current' node so only one celebration shows at a time
  set(ref(database, 'celebrations/current'), data);
};

export const subscribeToCelebration = (callback: (data: CelebrationData | null) => void) => {
  if (!database) return () => {};

  const celebrationRef = ref(database, 'celebrations/current');
  const unsubscribe = onValue(celebrationRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });

  return unsubscribe;
};
