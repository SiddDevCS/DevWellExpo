import { useNavigation, useRouter } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import ScreenHeader from '../components/ScreenHeader';
import { COLORS, FONTS, SIZES } from '../constants/theme';

const BreakDetailScreen = ({ route, navigation: navigationProp }) => {
  const defaultNavigation = useNavigation();
  const router = useRouter();
  const navigation = navigationProp || defaultNavigation;
  
  const { breakType } = route?.params || {};
  
  const handleStartBreak = () => {
    if (navigation.navigate) {
      navigation.navigate('OngoingBreak', { breakType });
    } else {
      // Use router for Expo Router
      router.push({
        pathname: '/ongoing-break',
        params: { 
          breakType: JSON.stringify(breakType)
        }
      });
    }
  };
  
  const handleGoBack = () => {
    if (navigation.goBack) {
      navigation.goBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader 
        title="Break Details" 
        showBackButton 
        onBackPress={handleGoBack}
      />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.breakIcon}>{breakType?.icon || '🧘‍♂️'}</Text>
        </View>
        
        <Text style={styles.breakName}>{breakType?.name || 'Quick Break'}</Text>
        
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Duration</Text>
            <Text style={styles.infoValue}>{breakType?.duration || 5} minutes</Text>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>
            {breakType?.description || 'Take a short break to refresh your mind and body.'}
          </Text>
        </Card>
        
        <Text style={styles.benefitsTitle}>Benefits</Text>
        <Card style={styles.benefitsCard}>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>💪</Text>
            <Text style={styles.benefitText}>Reduces physical tension</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🧠</Text>
            <Text style={styles.benefitText}>Improves focus and concentration</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>⚡</Text>
            <Text style={styles.benefitText}>Boosts energy and productivity</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>😌</Text>
            <Text style={styles.benefitText}>Reduces stress and anxiety</Text>
          </View>
        </Card>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Start Break" 
          onPress={handleStartBreak}
          size="large"
          icon="play"
          iconPosition="right"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding.lg,
  },
  iconContainer: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.margin.lg,
    marginBottom: SIZES.margin.md,
  },
  breakIcon: {
    fontSize: 40,
  },
  breakName: {
    ...FONTS.bold,
    fontSize: SIZES.h1,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.margin.lg,
  },
  infoCard: {
    marginBottom: SIZES.margin.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    ...FONTS.medium,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  infoValue: {
    ...FONTS.semiBold,
    fontSize: SIZES.md,
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SIZES.margin.md,
  },
  descriptionTitle: {
    ...FONTS.medium,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SIZES.margin.sm,
  },
  description: {
    ...FONTS.regular,
    fontSize: SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  benefitsTitle: {
    ...FONTS.semiBold,
    fontSize: SIZES.lg,
    color: COLORS.text,
    marginBottom: SIZES.margin.md,
  },
  benefitsCard: {
    marginBottom: SIZES.margin.lg,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.margin.md,
  },
  benefitIcon: {
    fontSize: 20,
    marginRight: SIZES.margin.md,
  },
  benefitText: {
    ...FONTS.medium,
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  buttonContainer: {
    paddingHorizontal: SIZES.padding.lg,
    paddingBottom: SIZES.padding.lg,
  },
});

export default BreakDetailScreen; 