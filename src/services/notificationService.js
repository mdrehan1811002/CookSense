import notifee, { AndroidImportance, EventType, TriggerType, AndroidCategory, AndroidVisibility, AndroidForegroundServiceType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { store } from '../redux/store';
import { addNotification } from '../redux/slices/notificationSlice';

class NotificationService {
  constructor() {
    this.testInterval = null;
    this.createChannel().catch(() => {});
  }

  async initialize() {
    console.log('[NotificationService] Initializing...');
    try {
      await this.createChannel();
      await this.requestPermission();
      
      // For Android 12+, check if we can schedule exact alarms
      const settings = await notifee.getNotificationSettings();
      if (settings.android.alarm === 0) { // 0 means DENIED or NOT_REQUESTED
        // On Android 12+, this usually opens system settings
        await notifee.openAlarmSettings();
      }

      this.setupForegroundHandler();
      this.setupFCMListeners();
      this.startForegroundService().catch(() => {});
      
      this.displayNotification('CookSense', 'Welcome back! Ready to cook? 🍳');

      if (this.testInterval) clearInterval(this.testInterval);
      // Background notifications: using trigger instead of setInterval
      await this.scheduleRepeatingNotification();
      await this.scheduleBatchNotifications();
      this.getFCMToken();
    } catch (error) {
      console.log('[NotificationService] Init Error:', error);
    }
  }

  async scheduleRepeatingNotification() {
    try {
      await notifee.createTriggerNotification(
        {
          id: 'repeating-cook',
          title: "Cooking Time! 🍳",
          body: "Open CookSense to find your next meal.",
          android: {
            channelId: 'high_priority',
            importance: AndroidImportance.HIGH,
            pressAction: { id: 'default' },
          },
        },
        { 
          type: TriggerType.INTERVAL, 
          interval: 15, // 15 minutes (minimum allowed for interval)
          timeUnit: 'MINUTES',
          alarmManager: true 
        }
      );
    } catch (e) {}
  }

  async scheduleBatchNotifications() {
    const now = Date.now();
    for (let i = 1; i <= 12; i++) {
      try {
        const triggerTime = now + (i * 10 * 60 * 1000);
        const { title, body } = this.getTimeOfDayMessage(new Date(triggerTime));
        
        await notifee.createTriggerNotification(
          {
            id: `cook-batch-${i}`,
            title,
            body,
            android: {
              channelId: 'high_priority',
              importance: AndroidImportance.HIGH,
              category: AndroidCategory.ALARM,
              pressAction: { id: 'default' },
            },
          },
          { type: TriggerType.TIMESTAMP, timestamp: triggerTime, alarmManager: true }
        );
      } catch (e) {}
    }
  }

  async startForegroundService() {
    if (Platform.OS === 'android') {
      await notifee.displayNotification({
        id: 'foreground_service',
        title: 'CookSense',
        body: 'Your cooking assistant is active 🍳',
        android: {
          channelId: 'high_priority',
          asForegroundService: true,
          ongoing: true,
          importance: AndroidImportance.LOW,
          pressAction: { id: 'default' },
          // Android 14 requirement:
          foregroundServiceTypes: [AndroidForegroundServiceType.SPECIAL_USE],
        },
      });
    }
  }

  async createChannel() {
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'high_priority',
        name: 'CookSense Notifications',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
      });
    }
  }

  async requestPermission() {
    try {
      await messaging().requestPermission();
      await notifee.requestPermission();
    } catch (e) {}
  }

  async getFCMToken() {
    try {
      const token = await messaging().getToken();
      console.log('[NotificationService] Token:', token);
    } catch (e) {}
  }

  setupFCMListeners() {
    messaging().onMessage(async msg => {
      this.displayNotification(msg.notification?.title, msg.notification?.body);
    });
  }

  getTimeOfDayMessage(date = new Date()) {
    const hour = date.getHours();
    
    if (hour >= 5 && hour < 12) {
      return {
        title: "What's for breakfast today? 🍳",
        body: 'Start your day with a healthy meal! Check our top recipes.'
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        title: "It's lunch time! 🥗",
        body: 'Quick and delicious lunch recipes are waiting for you.'
      };
    } else if (hour >= 17 && hour < 21) {
      return {
        title: 'Ready for some evening snacks? 🌆',
        body: 'Perfect time for a light snack and some tea!'
      };
    } else {
      return {
        title: 'Start preparing for dinner? 🥘',
        body: 'Wrap up your day with a perfect home-cooked meal.'
      };
    }
  }

  async displayTestNotification() {
    const { title, body } = this.getTimeOfDayMessage();
    this.displayNotification(title, body);
  }

  async displayNotification(title, body) {
    try {
      await notifee.displayNotification({
        title: title || 'CookSense',
        body: body || 'Ready to cook?',
        android: {
          channelId: 'high_priority',
          importance: AndroidImportance.HIGH,
          category: AndroidCategory.ALARM,
          pressAction: { id: 'default' },
        },
      });
      store.dispatch(addNotification({ title: title || 'CookSense', body: body || 'Cooking!', read: false }));
    } catch (e) {}
  }

  setupForegroundHandler() {
    notifee.onForegroundEvent(({ type }) => {
      if (type === EventType.PRESS) console.log('Pressed');
    });
  }
}

export const notificationService = new NotificationService();
export default notificationService;
