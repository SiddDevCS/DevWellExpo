import * as FileSystem from 'expo-file-system';
import React from 'react';
import { Circle, Path, Rect, Svg } from 'react-native-svg';

// This is a helper function to create placeholder SVG images
// In a real app, you would replace these with actual design assets

// Create a simple logo SVG
export const createLogoSVG = () => {
  return (
    <Svg height="200" width="200" viewBox="0 0 200 200">
      <Circle cx="100" cy="100" r="80" fill="#B8F2C9" />
      <Path
        d="M65,130 L135,130 C145,130 150,125 150,115 L150,85 C150,75 145,70 135,70 L65,70 C55,70 50,75 50,85 L50,115 C50,125 55,130 65,130 Z"
        fill="#121212"
      />
      <Rect x="70" y="85" width="20" height="30" rx="2" fill="#B8F2C9" />
      <Rect x="110" y="85" width="20" height="30" rx="2" fill="#B8F2C9" />
    </Svg>
  );
};

// Create onboarding SVGs
export const createOnboardingSVG = (type) => {
  switch (type) {
    case 'welcome':
      return (
        <Svg height="200" width="200" viewBox="0 0 200 200">
          <Circle cx="100" cy="100" r="80" fill="#B8F2C9" />
          <Circle cx="100" cy="70" r="30" fill="#121212" />
          <Path
            d="M50,140 C50,110 150,110 150,140 C150,170 50,170 50,140 Z"
            fill="#121212"
          />
        </Svg>
      );
    case 'activity':
      return (
        <Svg height="200" width="200" viewBox="0 0 200 200">
          <Rect x="40" y="40" width="120" height="120" rx="10" fill="#B8F2C9" />
          <Path
            d="M60,100 L80,120 L140,60"
            stroke="#121212"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      );
    case 'breaks':
      return (
        <Svg height="200" width="200" viewBox="0 0 200 200">
          <Circle cx="100" cy="100" r="80" fill="#B8F2C9" />
          <Path
            d="M100,50 L100,100 L130,120"
            stroke="#121212"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      );
    case 'goals':
      return (
        <Svg height="200" width="200" viewBox="0 0 200 200">
          <Circle cx="100" cy="100" r="30" fill="#B8F2C9" />
          <Circle cx="100" cy="100" r="50" fill="none" stroke="#B8F2C9" strokeWidth="5" />
          <Circle cx="100" cy="100" r="70" fill="none" stroke="#B8F2C9" strokeWidth="5" />
        </Svg>
      );
    default:
      return (
        <Svg height="200" width="200" viewBox="0 0 200 200">
          <Circle cx="100" cy="100" r="80" fill="#B8F2C9" />
        </Svg>
      );
  }
};

// Helper to save SVG as PNG if needed
export const saveSVGAsPNG = async (svgComponent, filename) => {
  try {
    // Create a React element from the SVG component
    const element = React.createElement(svgComponent);
    
    // Convert SVG to a base64-encoded string
    const svgString = ''; // In a real implementation, you would render the SVG to a string
    
    // Save the SVG as a file
    const fileUri = `${FileSystem.documentDirectory}${filename}.png`;
    await FileSystem.writeAsStringAsync(fileUri, svgString, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    // Return the file URI
    return fileUri;
  } catch (error) {
    console.error('Error saving SVG as PNG:', error);
    return null;
  }
}; 