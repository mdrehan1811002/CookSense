import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import SplashScreenNative from 'react-native-splash-screen';
import AppText from '../../components/AppText';
import { colors, s, spacing } from '../../constant/theme';

const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    // 1. Hide Native Splash Screen
    const hideTimer = setTimeout(() => {
      try {
        SplashScreenNative.hide();
      } catch (e) {}
    }, 300);

    // 2. Entrance Animation
    opacity.value = withTiming(1, { duration: 1000 });
    scale.value = withTiming(1, { 
      duration: 1000, 
      easing: Easing.out(Easing.back(1.5)) 
    });

    // 3. Navigate to Main after 3 seconds
    const navTimer = setTimeout(() => {
      navigation.replace('Main');
    }, 3000);

    return () => {
      clearTimeout(navTimer);
      clearTimeout(hideTimer);
    };
  }, [navigation]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <View style={styles.lottieWrapper}>
          <LottieView
            source={require('../../assets/lottie/FoodCarousel.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
        <AppText variant="title" style={styles.title}>CookSense</AppText>
        <AppText variant="caption" color={colors.gray} style={styles.subtitle}>
          Smart Recipe Discovery 🥗
        </AppText>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  lottieWrapper: {
    width: width * 0.7,
    height: width * 0.7,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: s(32),
    ...spacing.mt(20),
    color: colors.primary,
    fontWeight: '900',
  },
  subtitle: {
    letterSpacing: s(2),
    ...spacing.mt(5),
    fontWeight: '700',
  }
});

export default SplashScreen;
