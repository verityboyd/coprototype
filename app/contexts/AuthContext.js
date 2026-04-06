//authcontext here
//don't forget to wrap in root layout
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "@/app/utils/firebase";
import { doc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signUp(email, password, firstName, lastName) {
    try {
      //create a user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const userid = userCredential.user.uid;
      await setDoc(doc(db, "users", userid), {
        userId: userid,
        firstName,
        lastName,
        email,
        role: "admin",
      });
      //return the user
      return { user: userCredential.user, error: null };
    } catch (error) {
      //if error, return error
      return { user: null, error: error.message };
    }
  }

  async function logout() {
    try {
      await firebaseSignOut(auth);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  }

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return { user: userCredential.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signUp }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(AuthContext);
}
