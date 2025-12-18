import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import NotificationItem from '../components/notifications/NotificationItem';
import { Spinner } from '../components/ui/Spinner';
import { PageHeader } from '../components/ui/PageHeader';

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

  const renderMarkAllButton = () => (
    <button
      onClick={markAllAsRead}
      disabled={notifications.every(notif => notif.read)}
      className="btn-ripple bg-white/30 backdrop-blur-xs rounded-2xl border border-white/40 shadow-lg px-3 py-2 font-semibold text-gray-500 w-12 h-12 flex items-center justify-center text-2xl relative"
      aria-label="Mark all as read"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
  );

  return (
    <div className="font-baloo">
      <PageHeader title="Notifications" rightAction={renderMarkAllButton()} />

      <div className='p-6'>    
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
    </div>
  );
};

export default NotificationsPage;
