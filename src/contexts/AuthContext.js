import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';
import { auth, db } from '../config/firebase';

// Create context
const AuthContext = createContext();

// Custom hook
export const useAuth = () => useContext(AuthContext);

// Auth provider
export const AuthProvider = ({ children }) => {
  // State
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  
  // Sign up function
  const signup = async (email, password, displayName) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await updateProfile(userCredential.user, { displayName });
      
      // Create user document
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        displayName,
        email,
        createdAt: new Date(),
        onboardingCompleted: false,
        wellnessData: {
          stepCount: 0,
          sedentaryTime: 0,
          focusTime: 0,
          stressLevel: 0,
          wellnessScore: 75
        }
      });
      
      setCurrentUser(userCredential.user);
      setLoading(false);
      return userCredential.user;
    } catch (error) {
      setLoading(false);
      console.error('Signup error:', error);
      Alert.alert('Sign Up Error', error.message);
      throw error;
    }
  };
  
  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);
      
      // Check onboarding status
      try {
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (userDoc.exists()) {
          setOnboardingCompleted(userDoc.data().onboardingCompleted || false);
        }
      } catch (err) {
        console.error('Error checking onboarding status:', err);
      }
      
      setLoading(false);
      return userCredential.user;
    } catch (error) {
      setLoading(false);
      console.error('Login error:', error);
      Alert.alert('Login Error', error.message);
      throw error;
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setCurrentUser(null);
      setOnboardingCompleted(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Logout error:', error);
      Alert.alert('Logout Error', error.message);
      throw error;
    }
  };
  
  // Reset password
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Password reset error:', error);
      Alert.alert('Password Reset Error', error.message);
      throw error;
    }
  };
  
  // Complete onboarding
  const completeOnboarding = async (userId, wellnessGoals) => {
    try {
      setLoading(true);
      await setDoc(doc(db, 'users', userId), {
        onboardingCompleted: true,
        wellnessGoals
      }, { merge: true });
      
      setOnboardingCompleted(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Onboarding error:', error);
      Alert.alert('Onboarding Error', error.message);
      throw error;
    }
  };
  
  // Context value
  const value = {
    currentUser,
    onboardingCompleted,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    completeOnboarding
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 