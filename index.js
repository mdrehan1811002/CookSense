/**
 * @format
 */

import { AppRegistry } from 'react-native';
import notifee, { EventType } from '@notifee/react-native';
import { name as appName } from './app.json';
import App from './src/App';

// --- Background Notification Handler ---
// This must be registered outside of the React lifecycle
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  // Check if the user pressed the notification
  if (type === EventType.PRESS && pressAction.id === 'default') {
    // Perform any background logic here if needed
    console.log('User pressed notification in background');
    
    // Remove the notification
    await notifee.cancelNotification(notification.id);
  }
});

AppRegistry.registerComponent(appName, () => App);
