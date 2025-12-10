import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Button } from '../components/ui/Button';
import NotificationItem from '../components/notifications/NotificationItem'; // Corrected import path
import { Spinner } from '../components/ui/Spinner';

const NotificationsPage: React.FC = () => {
  const { notifications, loading, error, markAllAsRead } = useNotifications();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 pt-20"> {/* pt-20 to account for fixed header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary-900">Your Notifications</h1>
        <Button 
          onClick={markAllAsRead} 
          disabled={notifications.every(notif => notif.read)}
          variant="secondary"
        >
          Mark All as Read
        </Button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center p-8 bg-base-200 rounded-lg">
          <p className="text-lg text-base-content">No new quacks or updates!</p>
          <p className="text-sm text-base-content/70">When your partner does something, you'll see it here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <NotificationItem key={notification.notificationId} notification={notification} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;

