import { useState, useEffect } from 'react';
import { getToken } from 'firebase/messaging';
import { messaging } from '../lib/firebase';

export const usePushNotifications = () => {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      if (permission === 'granted') {
        const currentToken = await getToken(messaging, {
          vapidKey: 'YOUR_VAPID_KEY_HERE' // You need to set your VAPID key from Firebase Console
        });
        setToken(currentToken);
      }
    } catch (error) {
      console.error('Error requesting permission', error);
    }
  };

  return { token, permission, requestPermission };
};
