import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut 
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAAZMHu-Sb6gfF55lxd3-_STms0qgteLk",
  authDomain: "avzcomicstore.firebaseapp.com",
  projectId: "avzcomicstore",
  storageBucket: "avzcomicstore.appspot.com",
  messagingSenderId: "838388053863",
  appId: "1:838388053863:web:b109f7b5649c88b63e21c2",
  measurementId: "G-YGZ9JVEC5F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Email validation function using AbstractAPI
const validateEmail = async (email: string) => {
  const apiKey = "202560bff1284ff9a609beeaa8d84a1d"; // Replace with your AbstractAPI key
  const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.deliverability === "UNDELIVERABLE" || data.is_valid_format.value === false) {
      throw new Error("Email is invalid or does not exist.");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Sign up function with email validation
export const signUpWithEmailPassword = async (email: string, password: string) => {
  try {
    // Validate email before proceeding
    await validateEmail(email);

    // Create user with Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return "Sign-up successful!";
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Reset password function
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return "Password reset email sent!";
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Login function
export const loginWithEmailPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return "Login successful!";
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Logout function
export const logout = async () => {
  try {
    await signOut(auth);
    return "Logout successful!";
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Save reading progress for a comic
export const saveReadingProgress = async (userId: string, comicId: number, page: number) => {
  try {
    await setDoc(doc(db, "users", userId, "comics", comicId.toString()), {
      currentPage: page,
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get reading progress for a comic
export const getReadingProgress = async (userId: string, comicId: number) => {
  try {
    const docRef = doc(db, "users", userId, "comics", comicId.toString());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().currentPage;
    } else {
      return 1; // Default to page 1 if no progress is found
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Export auth and db for use in other components
export { auth, db, app };