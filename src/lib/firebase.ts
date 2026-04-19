import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  initializeAuth, 
  // @ts-ignore
  getReactNativePersistence 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
// @ts-ignore
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);

// Initialize Auth with platform-specific persistence
const getFirebaseAuth = () => {
  if (Platform.OS === 'web') {
    return getAuth(app);
  } else {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }
};

export const auth = getFirebaseAuth();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export default app;
