export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  return await Notification.requestPermission();
};

export const sendLocalNotification = (
  title: string,
  body: string,
  icon = '/favicon.svg'
): void => {
  if (Notification.permission !== 'granted') return;

  // Use service worker if available for richer notifications
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SHOW_NOTIFICATION',
      title,
      body,
      icon,
    });
  } else {
    new Notification(title, { body, icon });
  }
};

export const schedulePeriodicNotification = (
  title: string,
  body: string,
  intervalMs: number
): () => void => {
  const id = setInterval(() => sendLocalNotification(title, body), intervalMs);
  return () => clearInterval(id);
};
