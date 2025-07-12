import * as Notifications from 'expo-notifications';

export async function scheduleNotification(date: Date, title: string, body: string) {
  if (date.getTime() <= Date.now()) {
    console.warn('Cannot schedule a notification in the past');
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: {
      type: 'date',
      date: date.getTime(),  
    } as Notifications.NotificationTriggerInput,  
  });
}