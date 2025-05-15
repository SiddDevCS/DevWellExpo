import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  
  const { login } = useAuth();
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