// /src/services/authService.ts
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { auth } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const registerWithEmail = async (email: string, password: string, username: string, phoneNumber: string): Promise<User | null> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    // Create a user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      displayname: username,
      email,
      phoneNumber,
      bio: "",
    });
    return user;
  } catch (error) {
    console.error("Error signing up with email: ", error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, password: string): Promise<User | null> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error logging in with email: ", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out: ", error);
    throw error;
  }
};