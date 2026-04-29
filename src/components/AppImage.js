import React, { useState, memo, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { colors, s } from '../constant/theme';

/**
 * AppImage - Optimized image component with built-in Skeleton/Shimmer.
 * Enhanced for faster loading feedback.
 */
const AppImage = ({
  source,
  style,
  resizeMode = 'cover',
  borderRadius = 0,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Reset state when source changes
  useEffect(() => {
    setIsLoaded(false);
    fadeAnim.setValue(0);
  }, [source?.uri]);

  const onLoad = () => {
    setIsLoaded(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300, // Faster fade-in
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={[styles.container, { borderRadius }, style]}>
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        visible={isLoaded}
        style={[styles.skeleton, { borderRadius }]}
        shimmerColors={['#f3f4f6', '#e5e7eb', '#f3f4f6']}
      />
      <Animated.Image
        source={source}
        resizeMode={resizeMode}
        onLoad={onLoad}
        style={[
          styles.image,
          { 
            borderRadius,
            opacity: fadeAnim,
          }
        ]}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3f4f6',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  skeleton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  }
});

export default memo(AppImage);
