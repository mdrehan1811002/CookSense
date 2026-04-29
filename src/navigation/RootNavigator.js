import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';
import DetailsScreen from '../screens/main/DetailsScreen';
import SearchScreen from '../screens/main/SearchScreen';
import ExploreScreen from '../screens/main/ExploreScreen';
import NotificationScreen from '../screens/main/NotificationScreen';
import SplashScreen from '../screens/main/SplashScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Splash"
      screenOptions={{ 
        headerShown: false,
        animation: 'fade' // Fade effect between splash and main
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Explore" component={ExploreScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
