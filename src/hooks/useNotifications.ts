import { useEffect, useState } from 'react';
import { notificationService } from '../firebase/notificationService';
import type { Notification } from '../types';
import { useAuthContext } from '../context/AuthContext'; // To get the current user's UID

export const useNotifications = () => {
  const { user } = useAuthContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = notificationService.subscribeToNotifications(
      user.uid,
      (fetchedNotifications) => {
        setNotifications(fetchedNotifications);
        setLoading(false);
        setError(null);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const markAsRead = async (notificationId: string) => {
    if (!user?.uid) {
      setError("User not authenticated.");
      return;
    }
    try {
      await notificationService.markNotificationAsRead(notificationId);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const markAllAsRead = async () => {
    if (!user?.uid) {
      setError("User not authenticated.");
      return;
    }
    try {
      await notificationService.markAllNotificationsAsRead(user.uid);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    if (!user?.uid) {
      setError("User not authenticated.");
      return;
    }
    try {
      await notificationService.deleteNotification(notificationId);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};