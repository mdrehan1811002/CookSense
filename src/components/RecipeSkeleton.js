import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { s, colors } from '../constant/theme';

const { width } = Dimensions.get('window');

const RecipeSkeleton = ({ style }) => (
  <View style={[styles.container, style]}>
    <ShimmerPlaceholder 
      LinearGradient={LinearGradient} 
      style={styles.image} 
      shimmerColors={['#F1F5F9', '#E2E8F0', '#F1F5F9']}
    />
    <View style={styles.info}>
      <ShimmerPlaceholder 
        LinearGradient={LinearGradient} 
        style={styles.title}
        shimmerColors={['#F1F5F9', '#E2E8F0', '#F1F5F9']}
      />
      <ShimmerPlaceholder 
        LinearGradient={LinearGradient} 
        style={styles.subtitle}
        shimmerColors={['#F1F5F9', '#E2E8F0', '#F1F5F9']}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { 
    backgroundColor: colors.white, 
    borderRadius: s(20), 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: s(15)
  },
  image: { width: '100%', height: s(130) },
  info: { padding: s(12) },
  title: { width: '80%', height: s(12), borderRadius: s(4), marginBottom: s(8) },
  subtitle: { width: '40%', height: s(8), borderRadius: s(4) }
});

export default RecipeSkeleton;
