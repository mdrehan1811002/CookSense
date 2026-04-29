import React, { useEffect, useRef } from 'react';
import { StyleSheet, Platform, View, Animated, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

import HomeScreen from '../screens/main/HomeScreen';
import FavoritesScreen from '../screens/main/FavoritesScreen';
import ExploreScreen from '../screens/main/ExploreScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import { colors, s } from '../constant/theme';

const Tab = createBottomTabNavigator();

// --- Animated Tab Button ---
const TabButton = (props) => {
  const { onPress, accessibilityState } = props;
  const focused = accessibilityState?.selected;
  const scale = useRef(new Animated.Value(focused ? 1.05 : 1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.05 : 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.btnContainer}
    >
      <Animated.View style={[{ transform: [{ scale }] }, styles.btnContent]}>
        {props.children}
        {focused && <View style={styles.activeUnderline} />}
      </Animated.View>
    </TouchableOpacity>
  );
};

// --- PREMIUM TAB ICONS ---
const HomeIcon = ({ color, focused }) => (
  <View style={styles.iconBox}>
    <Svg width={s(20)} height={s(20)} viewBox="0 0 24 24" fill="none">
      {/* Premium House with Window & Rounded Roof */}
      <Path 
        d="M3 10L12 3L21 10V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V10Z" 
        stroke={color} strokeWidth="2.5" strokeLinejoin="round" 
        fill={focused ? color + '20' : 'none'} 
      />
      <Path d="M9 21V12H15V21" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  </View>
);

const ExploreIcon = ({ color, focused }) => (
  <View style={styles.iconBox}>
    <Svg width={s(20)} height={s(20)} viewBox="0 0 24 24" fill="none">
      {/* Discovery / Compass Icon with Inner Detail */}
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2.5" />
      <Path 
        d="M15 9L11 11L9 15L13 13L15 9Z" 
        fill={focused ? color : 'none'} 
        stroke={color} strokeWidth="1.5" strokeLinejoin="round" 
      />
      <Circle cx="12" cy="12" r="1.5" fill={focused ? '#fff' : color} />
    </Svg>
  </View>
);

const ProfileIcon = ({ color, focused }) => (
  <View style={styles.iconBox}>
    <Svg width={s(20)} height={s(20)} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2.5" fill={focused ? color + '20' : 'none'} />
      <Path d="M4 21C4 17.5 7.5 15 12 15C16.5 15 20 17.5 20 21" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  </View>
);

const FavIcon = ({ color, focused }) => (
  <View style={styles.iconBox}>
    <Svg width={s(20)} height={s(20)} viewBox="0 0 24 24" fill={focused ? color : 'none'}>
      <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke={color} strokeWidth="2.5" />
    </Svg>
  </View>
);

const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  const BOTTOM_SAFE_AREA = Math.max(insets.bottom, s(12));
  const TAB_BAR_HEIGHT = s(62) + BOTTOM_SAFE_AREA;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          height: TAB_BAR_HEIGHT,
          paddingBottom: BOTTOM_SAFE_AREA,
          paddingTop: s(8),
          elevation: 25,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.12,
          shadowRadius: 15,
        },
        tabBarLabelStyle: {
          fontSize: s(9),
          fontWeight: '900',
          marginTop: s(2),
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ 
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => <HomeIcon color={color} focused={focused} />,
          tabBarButton: (props) => <TabButton {...props} />
        }} 
      />
      <Tab.Screen 
        name="ExploreTab" 
        component={ExploreScreen} 
        options={{ 
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, focused }) => <ExploreIcon color={color} focused={focused} />,
          tabBarButton: (props) => <TabButton {...props} />
        }} 
      />
      <Tab.Screen 
        name="FavoritesTab" 
        component={FavoritesScreen} 
        options={{ 
          tabBarLabel: 'Wishlist',
          tabBarIcon: ({ color, focused }) => <FavIcon color={color} focused={focused} />,
          tabBarButton: (props) => <TabButton {...props} />
        }} 
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{ 
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => <ProfileIcon color={color} focused={focused} />,
          tabBarButton: (props) => <TabButton {...props} />
        }} 
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    flex: 1,
  },
  btnContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: s(2),
  },
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: s(20),
  },
  activeUnderline: {
    position: 'absolute',
    bottom: s(-8), 
    width: s(16),
    height: s(3),
    backgroundColor: colors.primary,
    borderRadius: s(2),
  }
});

export default TabNavigator;
