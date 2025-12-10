import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import type { Notification } from '../../types';
import { useNotifications } from '../../hooks/useNotifications';
import { Card } from '../ui/Card';
import { notificationConfig } from '../../config/notification-config';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const navigate = useNavigate();
  const { markAsRead } = useNotifications();

  const config = notificationConfig[notification.type];
  const Icon = config ? config.icon : null;
  const path = config ? config.getPath(notification) : '#';

  const handleClick = async () => {
    if (!notification.read) {
      await markAsRead(notification.notificationId);
    }
    navigate(path);
  };

  return (
    <Card
      onClick={handleClick}
      className={`p-4 rounded-lg shadow-md transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-[1.02] ${
        notification.read ? 'bg-base-200 text-base-content' : 'bg-base-100 text-base-content border-l-4 border-primary'
      }`}
    >
      <div className="flex items-start">
        {Icon && <div className="mr-4 pt-1">{Icon}</div>}
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">{notification.title}</h2>
            <p className="text-xs text-base-content/70">
              {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
            </p>
          </div>
          <p className="mt-1 text-sm">{notification.summary}</p>
        </div>
      </div>
    </Card>
  );
};

export default NotificationItem;
