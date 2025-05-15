import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { auth, db, handleFirebaseNetworkError } from '../config/firebase';

// Create context
const AuthContext = createContext();

// Custom hook
export const useAuth = () => useContext(AuthContext);

// Auth provider
export const AuthProvider = ({ children }) => {
  // State
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  
  // Set up auth state listener when the component mounts
  useEffect(() => {
    console.log('AUTH: Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log(`AUTH: Auth state changed - User ${user ? 'signed in' : 'signed out'}`);
      if (user) {
        console.log(`AUTH: User ID: ${user.uid}, Email: ${user.email}`);
      }
      
      setCurrentUser(user);
      
      if (user) {
        // Check onboarding status
        try {
          console.log(`AUTH: Checking onboarding status for user: ${user.uid}`);
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const onboardingStatus = userData.onboardingCompleted || false;
            console.log(`AUTH: Onboarding status from Firestore: ${onboardingStatus}`);
            setOnboardingCompleted(onboardingStatus);
          } else {
            console.log('AUTH: User document does not exist, setting onboarding to false');
            setOnboardingCompleted(false);
          }
        } catch (err) {
          console.error('AUTH ERROR: Error checking onboarding status:', err);
          console.log(`AUTH: Error code: ${err.code}, message: ${err.message}`);
          
          // Handle permissions error
          if (err.code === 'permission-denied') {
            console.error('AUTH ERROR: Firebase permissions denied. Check security rules.');
            Alert.alert(
              'Firebase Configuration Issue',
              'There appears to be a permissions issue with your Firebase database. Please check your security rules.',
              [{ text: 'OK' }]
            );
          }
          
          // Specific handling for network errors
          if (err.code === 'unavailable' || err.code === 'failed-precondition' || 
              err.message.includes('offline') || err.message.includes('network')) {
            console.log('AUTH: Device appears to be offline. Using local data if available.');
            setIsOffline(true);
            
            // Show a toast or alert only once to inform the user
            if (!global._hasShownOfflineMessage) {
              Alert.alert(
                'Offline Mode',
                'You appear to be offline. Some features may be limited until you reconnect.',
                [{ text: 'OK' }]
              );
              global._hasShownOfflineMessage = true;
            }
          }
          
          // Assume not completed if we can't verify
          setOnboardingCompleted(false);
        }
      } else {
        console.log('AUTH: No user signed in, setting onboarding to false');
        setOnboardingCompleted(false);
      }
      
      // Initialization complete
      setLoading(false);
      console.log(`AUTH: Authentication loading complete. User: ${user ? 'signed in' : 'signed out'}, Onboarding: ${onboardingCompleted}`);
    });
    
    // Clean up subscription
    return () => {
      console.log('AUTH: Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);
  
  // Sign up function
  const signup = async (email, password, displayName) => {
    console.log(`AUTH: Attempting sign up for email: ${email}`);
    try {
      setLoading(true);
      console.log('AUTH: Creating new user account');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log(`AUTH: User created successfully. ID: ${userCredential.user.uid}`);
      
      // Update display name
      console.log(`AUTH: Updating display name to: ${displayName}`);
      await updateProfile(userCredential.user, { displayName });
      console.log('AUTH: Display name updated successfully');
      
      // Create user document
      console.log(`AUTH: Creating user document in Firestore for user: ${userCredential.user.uid}`);
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
      console.log('AUTH: User document created successfully');
      
      setCurrentUser(userCredential.user);
      setLoading(false);
      return userCredential.user;
    } catch (error) {
      setLoading(false);
      console.error('AUTH ERROR: Signup error:', error);
      console.log(`AUTH: Error code: ${error.code}, message: ${error.message}`);
      Alert.alert('Sign Up Error', error.message);
      throw error;
    }
  };
  
  // Login function
  const login = async (email, password) => {
    console.log(`AUTH: Attempting login for email: ${email}`);
    try {
      setLoading(true);
      console.log('AUTH: Signing in with email and password');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log(`AUTH: User signed in successfully. ID: ${userCredential.user.uid}`);
      
      try {
        // This happens in the useEffect now, but we'll do it here as well for immediate feedback
        console.log(`AUTH: Checking onboarding status after login for user: ${userCredential.user.uid}`);
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (userDoc.exists()) {
          const onboardingStatus = userDoc.data().onboardingCompleted || false;
          console.log(`AUTH: Post-login onboarding status: ${onboardingStatus}`);
          setOnboardingCompleted(onboardingStatus);
        } else {
          console.log('AUTH: User document does not exist after login');
        }
      } catch (err) {
        console.error('AUTH ERROR: Error checking onboarding status after login:', err);
        console.log(`AUTH: Error code: ${err.code}, message: ${err.message}`);
        // Don't update onboardingCompleted here, rely on the auth state change
      }
      
      return userCredential.user;
    } catch (error) {
      setLoading(false);
      console.error('AUTH ERROR: Login error:', error);
      console.log(`AUTH: Error code: ${error.code}, message: ${error.message}`);
      Alert.alert('Login Error', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    console.log('AUTH: Attempting to sign out user');
    try {
      setLoading(true);
      await signOut(auth);
      console.log('AUTH: User signed out successfully');
      // State will be updated by the auth state change listener
    } catch (error) {
      console.error('AUTH ERROR: Logout error:', error);
      console.log(`AUTH: Error code: ${error.code}, message: ${error.message}`);
      Alert.alert('Logout Error', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Reset password
  const resetPassword = async (email) => {
    console.log(`AUTH: Attempting password reset for email: ${email}`);
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      console.log('AUTH: Password reset email sent successfully');
    } catch (error) {
      console.error('AUTH ERROR: Password reset error:', error);
      console.log(`AUTH: Error code: ${error.code}, message: ${error.message}`);
      Alert.alert('Password Reset Error', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Complete onboarding with error handling for offline mode
  const completeOnboarding = async (userId, wellnessGoals) => {
    console.log(`AUTH: Attempting to complete onboarding for user: ${userId}`);
    try {
      setLoading(true);
      
      // Try to save to Firestore
      try {
        console.log('AUTH: Saving onboarding data to Firestore');
        await setDoc(doc(db, 'users', userId), {
          onboardingCompleted: true,
          wellnessGoals
        }, { merge: true });
        
        console.log('AUTH: Successfully saved onboarding data to Firestore');
        
        // Update the state immediately regardless of server communication
        setOnboardingCompleted(true);
        console.log('AUTH: Onboarding state set to completed');
      } catch (error) {
        console.error('AUTH ERROR: Error saving onboarding data:', error);
        console.log(`AUTH: Error code: ${error.code}, message: ${error.message}`);
        
        // Use the improved error handler from firebase.js
        handleFirebaseNetworkError(error);
        
        // Handle permissions error
        if (error.code === 'permission-denied') {
          console.warn('AUTH WARNING: Firebase permissions error in completeOnboarding. Setting state locally anyway.');
          // Still set the state to true locally
          setOnboardingCompleted(true);
          console.log('AUTH: Onboarding state set to completed locally despite permissions error');
          
          Alert.alert(
            'Firebase Configuration Issue',
            'Your preferences were saved locally, but there was an issue with database permissions. Please check your Firebase security rules.',
            [{ text: 'OK' }]
          );
          return;
        }
        
        // Better error checking for network issues
        if (error.code === 'unavailable' || 
            error.code === 'failed-precondition' || 
            error.message.includes('offline') || 
            error.message.includes('network') ||
            error.message.includes('connection')) {
          console.log('AUTH: Device is offline, proceeding with local onboarding completion');
          setIsOffline(true);
          
          // Still set the state to true locally
          setOnboardingCompleted(true);
          console.log('AUTH: Onboarding state set to completed locally despite network error');
          
          // We'll update the local state but warn the user
          Alert.alert(
            'Offline Mode',
            'Your preferences have been saved locally but will sync to your account when your internet connection is restored.'
          );
        } else {
          // For other errors, throw to be caught by the outer try/catch
          throw error;
        }
      }
      
    } catch (error) {
      console.error('AUTH ERROR: General onboarding error:', error);
      console.log(`AUTH: Error code: ${error.code}, message: ${error.message}`);
      Alert.alert('Onboarding Error', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Context value
  const value = {
    currentUser,
    onboardingCompleted,
    loading,
    isOffline,
    signup,
    login,
    logout,
    resetPassword,
    completeOnboarding
  };
  
  console.log(`AUTH: Rendering AuthProvider. User: ${currentUser ? 'signed in' : 'signed out'}, Onboarding: ${onboardingCompleted}, Loading: ${loading}`);
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 