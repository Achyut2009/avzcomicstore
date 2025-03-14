import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut,
  UserCredential,
  FirebaseError // Import FirebaseError for proper error typing
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
const validateEmail = async (email: string): Promise<void> => {
  const apiKey = "202560bff1284ff9a609beeaa8d84a1d"; // Replace with your AbstractAPI key
  const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.deliverability === "UNDELIVERABLE" || data.is_valid_format.value === false) {
      throw new Error("Email is invalid or does not exist.");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred during email validation.");
    }
  }
};

// Sign up function with email validation
export const signUpWithEmailPassword = async (email: string, password: string): Promise<string> => {
  try {
    // Validate email before proceeding
    await validateEmail(email);

    // Create user with Firebase
    await createUserWithEmailAndPassword(auth, email, password);
    return "Sign-up successful!";
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred during sign-up.");
    }
  }
};

// Reset password function
export const resetPassword = async (email: string): Promise<string> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return "Password reset email sent!";
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred during password reset.");
    }
  }
};

// Login function
export const loginWithEmailPassword = async (email: string, password: string): Promise<string> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return "Login successful!";
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred during login.");
    }
  }
};

// Logout function
export const logout = async (): Promise<string> => {
  try {
    await signOut(auth);
    return "Logout successful!";
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred during logout.");
    }
  }
};

// Save reading progress for a comic
export const saveReadingProgress = async (userId: string, comicId: number, page: number): Promise<void> => {
  try {
    await setDoc(doc(db, "users", userId, "comics", comicId.toString()), {
      currentPage: page,
    });
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred while saving reading progress.");
    }
  }
};

// Get reading progress for a comic
export const getReadingProgress = async (userId: string, comicId: number): Promise<number> => {
  try {
    const docRef = doc(db, "users", userId, "comics", comicId.toString());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().currentPage;
    } else {
      return 1; // Default to page 1 if no progress is found
    }
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred while fetching reading progress.");
    }
  }
};

// Export auth and db for use in other components
export { auth, db, app };
