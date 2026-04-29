import React, { useEffect, useState } from 'react';
import { StatusBar, LogBox, View, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';

import ReduxStore from './redux/store'; 
import RootNavigator from './navigation/RootNavigator';
import { TimeProvider } from './context/TimeContext';
import notificationService from './services/notificationService';
import AppText from './components/AppText';
import { colors, s } from './constant/theme';

// Ignore specific warnings
LogBox.ignoreAllLogs();

const OfflineBanner = () => (
  <View style={styles.offlineBanner}>
    <AppText variant="caption" color={colors.white} style={styles.offlineText}>
      You are offline. Showing cached recipes. 📶
    </AppText>
  </View>
);

const App = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // 1. Monitor Internet Connection
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    // 2. Init notification
    if (notificationService && typeof notificationService.initialize === 'function') {
      notificationService.initialize();
    }

    return () => {
      unsubscribe();
    };
  }, []);

  if (!ReduxStore || !ReduxStore.store) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={ReduxStore.store}>
        <PersistGate loading={null} persistor={ReduxStore.persistor}>
          <TimeProvider>
            <NavigationContainer>
              <StatusBar barStyle="dark-content" backgroundColor="white" />
              {isOffline && <OfflineBanner />}
              <RootNavigator />
            </NavigationContainer>
          </TimeProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  offlineBanner: {
    backgroundColor: colors.dark,
    paddingVertical: s(4),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  offlineText: {
    fontSize: s(10),
    fontWeight: '700',
    letterSpacing: 0.5,
  }
});

export default App;