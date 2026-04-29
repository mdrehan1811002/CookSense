import notifee, { AndroidImportance, EventType, TriggerType, RepeatFrequency } from '@notifee/react-native';
import { Platform } from 'react-native';
import { store } from '../redux/store';
import { addNotification } from '../redux/slices/notificationSlice';

class NotificationService {
  constructor() {
    this.createChannel();
  }

  /**
   * Main Initialization
   */
  async initialize() {
    await this.createChannel();
    this.setupForegroundHandler();
    this.scheduleDailyReminders();
  }

  /**
   * Create Android Channel (Required for Android 8.0+)
   */
  async createChannel() {
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });
    }
  }

  /**
   * Request Permissions (Required for iOS & Android 13+)
   */
  async requestPermission() {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus >= 1;
  }

  /**
   * Display Local Notification
   */
  async displayNotification(title, body, data = {}) {
    await this.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: title || 'CookSense',
      body: body || 'Ready to cook some magic? ✨',
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
      },
      data: data,
    });

    store.dispatch(addNotification({
      title: title || 'CookSense',
      body: body || 'Ready to cook some magic? ✨',
      read: false
    }));
  }

  /**
   * Schedule Daily Reminders (8AM, 2PM, 8PM)
   */
  async scheduleDailyReminders() {
    await this.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'reminders',
      name: 'Daily Reminders',
      importance: AndroidImportance.HIGH,
    });

    const triggerTimes = [
      { hour: 8, minute: 0, title: 'Breakfast Time! 🍳', body: 'Start your morning with a healthy meal!' },
      { hour: 14, minute: 0, title: 'Lunch Time! 🥗', body: 'Ready for some delicious mid-day magic?' },
      { hour: 20, minute: 0, title: 'Dinner Time! 🥘', body: 'Time to wrap up the day with a perfect dinner.' }
    ];

    for (const { hour, minute, title, body } of triggerTimes) {
      const date = new Date(Date.now());
      date.setHours(hour, minute, 0, 0);

      if (date.getTime() <= Date.now()) {
        date.setDate(date.getDate() + 1);
      }

      await notifee.createTriggerNotification(
        {
          id: `reminder-${hour}`,
          title,
          body,
          android: {
            channelId,
            importance: AndroidImportance.HIGH,
            pressAction: { id: 'default' },
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: date.getTime(),
          repeatFrequency: RepeatFrequency.DAILY,
          alarmManager: true,
        },
      );
    }
  }

  /**
   * Setup Foreground Listener
   */
  setupForegroundHandler() {
    return notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }
    });
  }
}

export const notificationService = new NotificationService();
export default notificationService;
