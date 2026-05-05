import notifee, { AndroidImportance, EventType, TriggerType, AndroidCategory, AndroidVisibility } from '@notifee/react-native';
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
      
      this.setupForegroundHandler();
      this.setupFCMListeners();
      this.startForegroundService().catch(() => {});
      
      this.displayNotification('CookSense Active', 'Automatic 10-min system ready! 🚀');

      if (this.testInterval) clearInterval(this.testInterval);
      this.testInterval = setInterval(() => {
        this.displayTestNotification();
      }, 10 * 60 * 1000);

      await this.scheduleBatchNotifications();
      this.getFCMToken();
      console.log('[NotificationService] Init Success');
    } catch (error) {
      console.error('[NotificationService] Init Error:', error);
    }
  }

  async scheduleBatchNotifications() {
    console.log('[NotificationService] Scheduling dynamic batch...');
    const now = Date.now();
    for (let i = 1; i <= 6; i++) {
      try {
        const triggerTime = now + (i * 10 * 60 * 1000);
        const futureDate = new Date(triggerTime);
        const { title, body } = this.getTimeOfDayMessage(futureDate); // Dynamic based on future time
        
        await notifee.createTriggerNotification(
          {
            id: `batch-10min-${i}`,
            title: title,
            body: body,
            android: {
              channelId: 'high_priority',
              importance: AndroidImportance.HIGH,
              category: AndroidCategory.ALARM,
              pressAction: { id: 'default' },
            },
          },
          {
            type: TriggerType.TIMESTAMP,
            timestamp: triggerTime,
            alarmManager: true,
          }
        );
      } catch (e) {}
    }
  }

  getTimeOfDayMessage(date = new Date()) {
    const hour = date.getHours();
    let timeOfDay = 'Day';
    let emoji = '✨';

    if (hour >= 5 && hour < 12) { timeOfDay = 'Morning'; emoji = '🌅'; }
    else if (hour >= 12 && hour < 17) { timeOfDay = 'Afternoon'; emoji = '☀️'; }
    else if (hour >= 17 && hour < 21) { timeOfDay = 'Evening'; emoji = '🌆'; }
    else { timeOfDay = 'Night'; emoji = '🌙'; }

    return {
      title: `CookSense: Good ${timeOfDay}! ${emoji}`,
      body: `Time for a ${timeOfDay.toLowerCase()} check. Ready to cook something special?`
    };
  }

  async startForegroundService() {
    if (Platform.OS === 'android') {
      await notifee.displayNotification({
        id: 'foreground_service',
        title: 'CookSense Active',
        body: 'Monitoring meal reminders...',
        android: {
          channelId: 'high_priority',
          asForegroundService: true,
          ongoing: true,
          importance: AndroidImportance.LOW,
          pressAction: { id: 'default' },
        },
      });
    }
  }

  async createChannel() {
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'high_priority',
        name: 'Alerts',
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

  async displayTestNotification() {
    const { title, body } = this.getTimeOfDayMessage();
    this.displayNotification(title, body);
  }

  async displayNotification(title, body) {
    try {
      await notifee.displayNotification({
        title: title || 'CookSense',
        body: body || 'Meal time!',
        android: {
          channelId: 'high_priority',
          importance: AndroidImportance.HIGH,
          category: AndroidCategory.ALARM,
          pressAction: { id: 'default' },
        },
      });
      store.dispatch(addNotification({ title, body, read: false }));
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
