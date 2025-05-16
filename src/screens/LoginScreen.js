import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import Logo from '../components/Logo';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  
  const { login, signInWithGitHub } = useAuth();
  const navigation = useNavigation();
  
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Navigation is now handled by App.js based on onboarding status
    } catch (err) {
      console.error('Login error:', err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGitHubLogin = async () => {
    try {
      setError('');
      setGithubLoading(true);
      console.log('LOGIN: Starting GitHub login process');
      await signInWithGitHub();
      console.log('LOGIN: GitHub login successful');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Navigation is handled by App.js based on auth state
    } catch (err) {
      console.error('LOGIN ERROR: GitHub login error:', err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (err.message.includes('cancelled')) {
        // Don't show error for user cancellation
        console.log('LOGIN: GitHub login cancelled by user');
      } else {
        setError('Failed to log in with GitHub. Please try again.');
      }
    } finally {
      setGithubLoading(false);
    }
  };
  
  const handleSignUp = () => {
    Haptics.selectionAsync();
    navigation.navigate('SignUp');
  };
  
  const handleForgotPassword = () => {
    Haptics.selectionAsync();
    navigation.navigate('ForgotPassword');
  };
  
  const handleTestOnboarding = () => {
    Haptics.selectionAsync();
    navigation.navigate('Onboarding');
  };
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      enabled
    >
      <View style={styles.logoContainer}>
        <Logo size={80} />
        <Text style={styles.appName}>DevWell</Text>
        <Text style={styles.tagline}>Wellness for Developers</Text>
      </View>
      
      <Card style={styles.card}>
        <Text style={styles.title}>Login</Text>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
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
            placeholder="Enter your password"
            placeholderTextColor={COLORS.textLight}
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
          />
        </View>
        
        <TouchableOpacity 
          style={styles.forgotPassword}
          onPress={handleForgotPassword}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        
        <Button
          title="Login"
          onPress={handleLogin}
          loading={loading}
          style={styles.button}
        />
        
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>
        
        <TouchableOpacity 
          style={[styles.githubButton, githubLoading && styles.githubButtonLoading]}
          onPress={handleGitHubLogin}
          disabled={githubLoading}
          activeOpacity={0.8}
        >
          {githubLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <View style={styles.githubButtonContent}>
              <Ionicons name="logo-github" size={22} color="#FFFFFF" style={styles.githubIcon} />
              <Text style={styles.githubButtonText}>Continue with GitHub</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </Card>
      
      {/* Temporary test button for quick access to onboarding */}
      <TouchableOpacity 
        style={styles.testOnboardingButton}
        onPress={handleTestOnboarding}
      >
        <Text style={styles.testOnboardingText}>Test Onboarding</Text>
      </TouchableOpacity>
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
  logo: {
    width: 80,
    height: 80,
    tintColor: COLORS.primary,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    ...FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.primary,
  },
  button: {
    marginBottom: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.divider,
  },
  dividerText: {
    ...FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginHorizontal: 10,
  },
  githubButton: {
    backgroundColor: '#24292e', // GitHub's color
    borderRadius: 100, // Make it fully rounded like the main login button
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#1a1d21', // Slightly darker border
  },
  githubButtonLoading: {
    opacity: 0.7,
  },
  githubButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  githubIcon: {
    marginRight: 12,
  },
  githubButtonText: {
    ...FONTS.semiBold, // Use semibold to match the button style
    fontSize: SIZES.md,
    color: COLORS.card,
    letterSpacing: 0.3, // Add a bit of letter spacing for better legibility
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    ...FONTS.regular,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  signupLink: {
    ...FONTS.semiBold,
    fontSize: SIZES.md,
    color: COLORS.primary,
    marginLeft: 5,
  },
  testOnboardingButton: {
    padding: SIZES.padding.md,
    alignItems: 'center',
    marginTop: SIZES.margin.lg,
    backgroundColor: 'rgba(184, 242, 201, 0.2)',
    borderRadius: SIZES.radius.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignSelf: 'center',
  },
  testOnboardingText: {
    ...FONTS.medium,
    fontSize: SIZES.md,
    color: COLORS.primary,
  },
});

export default LoginScreen; 