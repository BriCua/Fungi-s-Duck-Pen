import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import type { Notification } from '../../types/notification';
import { useNotifications } from '../../hooks/useNotifications';
import { notificationConfig } from '../../config/notification-config';
import NudgeResponseModal from './NudgeResponseModal';
import ConfirmationModal from '../ui/ConfirmationModal'; // Import ConfirmationModal

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const navigate = useNavigate();
  const { markAsRead, deleteNotification } = useNotifications();
  const [isNudgeResponseModalOpen, setIsNudgeResponseModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const wasLongPress = useRef(false);

  const config = notificationConfig[notification.type];
  const Icon = config ? config.icon : null;
  const path = config ? config.getPath(notification) : '#';

  const startPressTimer = () => {
    wasLongPress.current = false;
    timerRef.current = setTimeout(() => {
      wasLongPress.current = true;
      setIsDeleteModalOpen(true);
    }, 750); // 750ms for a long press
  };

  const clearPressTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClick = async () => {
    if (wasLongPress.current) {
      return;
    }
    if (!notification.read) {
      await markAsRead(notification.notificationId);
    }
    
    if (notification.type === 'nudge') {
      setIsNudgeResponseModalOpen(true);
    } else {
      navigate(path);
    }
  };

  const handleDelete = async () => {
    await deleteNotification(notification.notificationId);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div
        onClick={handleClick}
        onMouseDown={startPressTimer}
        onMouseUp={clearPressTimer}
        onMouseLeave={clearPressTimer}
        onTouchStart={startPressTimer}
        onTouchEnd={clearPressTimer}
        className={`p-4 rounded-lg shadow-md transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-[1.02] ${
          notification.read ? 'bg-gray-100 text-gray-800' : 'bg-white text-gray-800 border-l-4 border-primary'
        }`}
      >
        <div className="flex items-start">
          {Icon && <div className="mr-4 pt-1">{Icon}</div>}
          <div className="grow">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">{notification.title}</h2>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
              </p>
            </div>
            {notification.summary && <p className="mt-1 text-sm text-gray-700">{notification.summary}</p>}
          </div>
        </div>
      </div>

      {isNudgeResponseModalOpen && (
        <NudgeResponseModal
          notification={notification}
          onClose={() => setIsNudgeResponseModalOpen(false)}
        />
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Notification"
        message="Are you sure you want to delete this notification? This action cannot be undone."
      />
    </>
  );
};

export default NotificationItem;
