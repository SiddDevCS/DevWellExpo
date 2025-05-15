import { useNavigation, useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Animated,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import Logo from '../components/Logo';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup, completeOnboarding } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  
  // Check if onboarding data was passed
  const onboardingData = route.params?.onboardingData;
  
  useEffect(() => {
    // Run entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
    
    // If we have onboarding data, provide a welcome message
    if (onboardingData) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);
  
  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Create user account
      const user = await signup(email, password, name);
      
      // If we have onboarding data, save it to the user profile
      if (onboardingData && user) {
        try {
          await completeOnboarding(user.uid, onboardingData);
        } catch (err) {
          console.error('Error saving onboarding data:', err);
          // We'll continue even if this fails - the auth state listener
          // will redirect to onboarding if needed
          
          // If we're offline, still show a success message
          if (err.code === 'unavailable' || 
              err.code === 'failed-precondition' || 
              err.message.includes('offline') || 
              err.message.includes('network')) {
            Alert.alert(
              'Account Created',
              'Your account was created, but we had trouble saving your preferences. They will be saved when you reconnect.',
              [{ text: 'OK' }]
            );
          }
        }
      }
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Navigation will be handled by App.js based on auth state
    } catch (err) {
      console.error('Signup error:', err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      // Improve error message for offline mode
      if (err.code === 'auth/network-request-failed' || 
          err.message.includes('network') || 
          err.message.includes('offline')) {
        setError('Cannot create account while offline. Please check your internet connection and try again.');
      } else {
        setError('Failed to create an account. ' + (err.message || ''));
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogin = () => {
    Haptics.selectionAsync();
    navigation.navigate('Login');
  };
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      enabled
    >
      <Animated.View style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        width: '100%'
      }}>
        <View style={styles.logoContainer}>
          <Logo size={70} />
          <Text style={styles.appName}>DevWell</Text>
          {onboardingData ? (
            <Text style={styles.tagline}>Create your account to continue</Text>
          ) : (
            <Text style={styles.tagline}>Wellness for Developers</Text>
          )}
        </View>
        
        <Card style={styles.card}>
          <Text style={styles.title}>Sign Up</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={COLORS.textLight}
              autoCapitalize="words"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={text => setPassword(text)}
              placeholder="Create a password"
              placeholderTextColor={COLORS.textLight}
              secureTextEntry={true}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={text => setConfirmPassword(text)}
              placeholder="Confirm your password"
              placeholderTextColor={COLORS.textLight}
              secureTextEntry={true}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
            />
          </View>
          
          <Button
            title="Create Account"
            onPress={handleSignUp}
            loading={loading}
            style={styles.button}
            icon="person-add-outline"
            iconPosition="left"
          />
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </Card>
        
        {onboardingData && (
          <View style={styles.welcomeMessageContainer}>
            <Text style={styles.welcomeMessage}>
              Your preferences have been saved and will be applied to your account.
            </Text>
          </View>
        )}
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: SIZES.padding.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  appName: {
    ...FONTS.bold,
    fontSize: SIZES.h1,
    color: COLORS.text,
    marginTop: 10,
  },
  tagline: {
    ...FONTS.regular,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginTop: 5,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius.lg,
    padding: SIZES.padding.lg,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.h2,
    color: COLORS.text,
    marginBottom: 20,
  },
  errorText: {
    ...FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.error,
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    ...FONTS.medium,
    fontSize: SIZES.md,
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    padding: 15,
    color: COLORS.text,
    fontSize: SIZES.md,
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    ...FONTS.regular,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  loginLink: {
    ...FONTS.semiBold,
    fontSize: SIZES.md,
    color: COLORS.primary,
    marginLeft: 5,
  },
  welcomeMessageContainer: {
    marginTop: 20,
    padding: SIZES.padding.md,
    alignItems: 'center',
  },
  welcomeMessage: {
    ...FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.primary,
    textAlign: 'center',
  },
});

export default SignUpScreen; 