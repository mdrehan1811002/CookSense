import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

// Handle FCM background messages
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('[FCM Background] Message handled!', remoteMessage);
});

// Handle Notifee background events (interactions only)
notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log('[Notifee Background] Event:', type);
  // We keep it simple to prevent crashes. 
  // Batch scheduling in notificationService.js handles the timing now.
});

AppRegistry.registerComponent(appName, () => App);
