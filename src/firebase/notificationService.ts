import { collection, query, where, onSnapshot, doc, updateDoc, getDocs, deleteDoc, orderBy, writeBatch } from 'firebase/firestore';
import { db } from './init';
import type { Notification } from '../types';

export const notificationService = {
  /**
   * Subscribes to real-time notifications for a given user.
   * @param uid The user ID.
   * @param callback A function to call with the updated list of notifications.
   * @returns An unsubscribe function to stop listening for updates.
   */
  subscribeToNotifications: (uid: string, callback: (notifications: Notification[]) => void) => {
    const notificationsRef = collection(db, 'notifications');
    const q = query(notificationsRef, where('uid', '==', uid), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        notificationId: doc.id,
        ...doc.data(),
      })) as Notification[];
      callback(notifications);
    });

    return unsubscribe;
  },

  /**
   * Marks a specific notification as read.
   * @param uid The user ID.
   * @param notificationId The ID of the notification to mark as read.
   */
  markNotificationAsRead: async (notificationId: string) => {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      read: true,
    });
  },

  /**
   * Marks all unread notifications for a user as read.
   * @param uid The user ID.
   */
  markAllNotificationsAsRead: async (uid: string) => {
    const notificationsRef = collection(db, 'notifications');
    const q = query(notificationsRef, where('uid', '==', uid), where('read', '==', false));
    const querySnapshot = await getDocs(q); // Use getDocs for a one-time fetch for batch update

    const batch = writeBatch(db); // Import writeBatch from 'firebase/firestore'
    querySnapshot.docs.forEach((document) => {
      batch.update(document.ref, { read: true });
    });
    await batch.commit();
  },

  /**
   * Deletes a specific notification.
   * @param uid The user ID.
   * @param notificationId The ID of the notification to delete.
   */
  deleteNotification: async (notificationId: string) => {
    const notificationRef = doc(db, 'notifications', notificationId);
    await deleteDoc(notificationRef);
  },
};
