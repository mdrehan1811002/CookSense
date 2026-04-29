import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { colors, s } from '../constant/theme';
import AppText from './AppText';

/**
 * NetworkStatus - A premium banner that appears when the user is offline.
 * Uses NetInfo to monitor real-time network connectivity.
 */
const NetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      
      Animated.spring(translateY, {
        toValue: state.isConnected ? -100 : 0,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();
    });

    return () => unsubscribe();
  }, []);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <View style={styles.content}>
        <View style={styles.dot} />
        <AppText style={styles.text}>You are currently offline. Showing cached data.</AppText>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? s(40) : s(10),
    left: s(20),
    right: s(20),
    backgroundColor: '#334155',
    borderRadius: s(12),
    paddingVertical: s(12),
    paddingHorizontal: s(15),
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: s(8),
    height: s(8),
    borderRadius: s(4),
    backgroundColor: '#EF4444', // Red dot for offline
    marginRight: s(10),
  },
  text: {
    color: '#F8FAFC',
    fontSize: s(11),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default NetworkStatus;
