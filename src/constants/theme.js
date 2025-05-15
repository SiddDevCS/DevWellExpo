export const COLORS = {
  // Primary Colors
  primary: '#B8F2C9',
  secondary: '#B8F2C9',
  tertiary: '#B8F2C9',
  
  // UI Colors
  background: '#121212',
  card: '#1E1E1E',
  surface: '#1E1E1E',
  
  // Text Colors
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textLight: '#808080',
  
  // State Colors
  success: '#B8F2C9',
  warning: '#FFC107',
  error: '#F44336',
  info: '#B8F2C9',
  
  // Gradients
  gradientStart: '#121212',
  gradientEnd: '#1E1E1E',
  
  // Misc
  divider: '#333333',
  inactive: '#505050',
  overlay: 'rgba(0, 0, 0, 0.7)',
};

export const FONTS = {
  regular: {
    fontFamily: 'System',
    fontWeight: '400',
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500',
  },
  semiBold: {
    fontFamily: 'System',
    fontWeight: '600',
  },
  bold: {
    fontFamily: 'System',
    fontWeight: '700',
  },
};

export const SIZES = {
  // Font Sizes
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  h1: 26,
  h2: 22,
  h3: 18,
  
  // Spacing
  padding: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  margin: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 20,
    xl: 30,
  },
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const BREAK_TYPES = [
  {
    id: 'quick_stretch',
    name: 'Quick Stretch',
    icon: '🧘‍♂️',
    duration: 5, // minutes
    description: 'A quick stretching session to release tension',
  },
  {
    id: 'walk',
    name: 'Take a Walk',
    icon: '🚶‍♂️',
    duration: 10,
    description: 'Get some fresh air with a short walk',
  },
  {
    id: 'hydrate',
    name: 'Hydration Break',
    icon: '💧',
    duration: 2,
    description: 'Grab a glass of water and hydrate',
  },
  {
    id: 'eye_rest',
    name: 'Eye Rest',
    icon: '👁️',
    duration: 3,
    description: 'Rest your eyes with the 20-20-20 rule',
  },
  {
    id: 'meditation',
    name: 'Quick Meditation',
    icon: '🧠',
    duration: 5,
    description: 'Clear your mind with a short meditation',
  },
  {
    id: 'coffee',
    name: 'Coffee Break',
    icon: '☕',
    duration: 15,
    description: 'Enjoy a cup of coffee or tea',
  },
  {
    id: 'social',
    name: 'Social Break',
    icon: '💬',
    duration: 15,
    description: 'Chat with a colleague or friend',
  },
]; 