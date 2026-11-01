import { useState, useCallback, useEffect } from 'react';

export interface SecurityAlertItem {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

export const useSecurityNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default'
  );
  const [recentAlerts, setRecentAlerts] = useState<SecurityAlertItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestDesktopPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied' as NotificationPermission;
    }
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch {
      return permission;
    }
  }, [permission]);

  const sendNotification = useCallback(
    (title: string, body: string, severity: 'info' | 'warning' | 'critical' = 'info') => {
      const item: SecurityAlertItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title,
        body,
        timestamp: new Date().toLocaleTimeString('es-MX', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        severity,
      };

      setRecentAlerts((prev) => [item, ...prev.slice(0, 7)]);

      if (
        typeof window !== 'undefined' &&
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        try {
          new Notification(title, {
            body,
            silent: false,
          });
        } catch {
          // Fallback to in-app alert banner already pushed to recentAlerts
        }
      }
    },
    []
  );

  const dismissAlert = useCallback((id: string) => {
    setRecentAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return {
    permission,
    requestDesktopPermission,
    sendNotification,
    recentAlerts,
    dismissAlert,
  };
};
