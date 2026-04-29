import React from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { colors } from '../constant/theme';
import NetworkStatus from './NetworkStatus';

/**
 * ScreenContainer - A premium wrapper for all screens.
 * Uses translucent status bar for a modern, full-screen experience.
 * Includes global NetworkStatus monitoring.
 */
const ScreenContainer = ({ 
  children, 
  style, 
  contentContainerStyle,
  header
}) => {
  return (
    <View style={[styles.outerContainer, style]}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={true} 
      />
      {/* Global Offline Banner */}
      <NetworkStatus />
      
      <View style={styles.container}>
        {header}
        <View style={[styles.content, contentContainerStyle]}>
          {children}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default ScreenContainer;
