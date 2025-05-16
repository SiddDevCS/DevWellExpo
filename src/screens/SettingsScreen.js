import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Card from '../components/Card';
import ScreenHeader from '../components/ScreenHeader';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useActivity } from '../contexts/ActivityContext';
import { useAuth } from '../contexts/AuthContext';

const SettingItem = ({ title, subtitle, icon, rightComponent }) => (
  <View style={styles.settingItem}>
    <View style={styles.settingIconContainer}>
      <Ionicons name={icon} size={22} color={COLORS.primary} />
    </View>
    <View style={styles.settingContent}>
      <Text style={styles.settingTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    {rightComponent}
  </View>
);

const SettingsScreen = () => {
  const { resetActivity, isPedometerAvailable } = useActivity();
  const { logout, currentUser } = useAuth();
  
  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [breakRemindersEnabled, setBreakRemindersEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);

  // Handle sign out
  const handleSignOut = async () => {
    console.log('SETTINGS: User requested to sign out');
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => console.log('SETTINGS: Sign out cancelled')
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            console.log('SETTINGS: Signing out user');
            try {
              await logout();
              console.log('SETTINGS: User signed out successfully');
            } catch (error) {
              console.error('SETTINGS ERROR: Failed to sign out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <ScreenHeader title="Settings" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Notifications section */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Card>
          <SettingItem
            title="Notifications"
            subtitle="Receive push notifications"
            icon="notifications-outline"
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: COLORS.inactive, true: COLORS.primary }}
                thumbColor={COLORS.card}
              />
            }
          />
          
          <View style={styles.divider} />
          
          <SettingItem
            title="Break Reminders"
            subtitle="Get reminded to take breaks"
            icon="timer-outline"
            rightComponent={
              <Switch
                value={breakRemindersEnabled}
                onValueChange={setBreakRemindersEnabled}
                trackColor={{ false: COLORS.inactive, true: COLORS.primary }}
                thumbColor={COLORS.card}
                disabled={!notificationsEnabled}
              />
            }
          />
        </Card>
        
        {/* App settings section */}
        <Text style={styles.sectionTitle}>App Settings</Text>
        <Card>
          <SettingItem
            title="Dark Mode"
            subtitle="Use dark theme"
            icon="moon-outline"
            rightComponent={
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: COLORS.inactive, true: COLORS.primary }}
                thumbColor={COLORS.card}
              />
            }
          />
          
          <View style={styles.divider} />
          
          <SettingItem
            title="Auto-start Breaks"
            subtitle="Start break timer automatically"
            icon="play-outline"
            rightComponent={
              <Switch
                value={autoStartBreaks}
                onValueChange={setAutoStartBreaks}
                trackColor={{ false: COLORS.inactive, true: COLORS.primary }}
                thumbColor={COLORS.card}
              />
            }
          />
        </Card>
        
        {/* Device capabilities */}
        <Text style={styles.sectionTitle}>Device Capabilities</Text>
        <Card>
          <SettingItem
            title="Pedometer"
            subtitle={isPedometerAvailable ? "Available" : "Not available on this device"}
            icon="footsteps-outline"
            rightComponent={
              <View style={[
                styles.capabilityIndicator, 
                isPedometerAvailable ? styles.available : styles.unavailable
              ]}>
                <Ionicons 
                  name={isPedometerAvailable ? "checkmark" : "close"} 
                  size={16} 
                  color={COLORS.card} 
                />
              </View>
            }
          />
        </Card>
        
        {/* Account section */}
        <Text style={styles.sectionTitle}>Account</Text>
        <Card>
          {currentUser && (
            <>
              <SettingItem
                title="Account Email"
                subtitle={currentUser.email}
                icon="person-outline"
                rightComponent={null}
              />
              <View style={styles.divider} />
            </>
          )}
          
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={resetActivity}
            activeOpacity={0.7}
          >
            <Text style={styles.resetText}>Reset Activity Data</Text>
          </TouchableOpacity>
          
          {currentUser && (
            <>
              <View style={styles.divider} />
              <TouchableOpacity 
                style={styles.signOutButton}
                onPress={handleSignOut}
                activeOpacity={0.7}
              >
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </>
          )}
        </Card>
        
        {/* About section */}
        <Text style={styles.sectionTitle}>About</Text>
        <Card>
          <Text style={styles.appName}>DevWell</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDescription}>
            A wellness app designed to help developers maintain their health and productivity.
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SIZES.padding.lg,
    paddingBottom: SIZES.padding.xl * 2,
  },
  sectionTitle: {
    ...FONTS.semiBold,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SIZES.margin.lg,
    marginBottom: SIZES.margin.sm,
    marginLeft: SIZES.margin.xs,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.padding.sm,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.margin.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...FONTS.medium,
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  settingSubtitle: {
    ...FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SIZES.margin.xs,
  },
  capabilityIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  available: {
    backgroundColor: COLORS.success,
  },
  unavailable: {
    backgroundColor: COLORS.error,
  },
  resetButton: {
    paddingVertical: SIZES.padding.sm,
    alignItems: 'center',
  },
  resetText: {
    ...FONTS.medium,
    fontSize: SIZES.md,
    color: COLORS.error,
  },
  signOutButton: {
    paddingVertical: SIZES.padding.sm,
    alignItems: 'center',
  },
  signOutText: {
    ...FONTS.medium,
    fontSize: SIZES.md,
    color: COLORS.error,
  },
  appName: {
    ...FONTS.bold,
    fontSize: SIZES.h2,
    color: COLORS.text,
    textAlign: 'center',
  },
  appVersion: {
    ...FONTS.regular,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: SIZES.margin.md,
  },
  appDescription: {
    ...FONTS.regular,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default SettingsScreen; 