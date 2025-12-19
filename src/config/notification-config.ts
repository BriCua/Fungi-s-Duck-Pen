import React from 'react';
import type { Notification } from '../types/notification';

/**
 * Defines the shape of the configuration for a single notification type.
 * The icon can be a React node (e.g., an imported SVG or an emoji) or null.
 *
 * For instructions on how to add specific icons, see TODO.md.
 */
interface NotificationTypeConfig {
  icon: React.ReactNode | null;
  getPath: (notification: Notification) => string;
}

/**
 * A centralized configuration object for handling different notification types.
 * This structure makes it easy to add new notification types or modify existing ones
 * without changing the core UI components.
 *
 * See TODO.md for instructions on how to add icons.
 */
export const notificationConfig: Record<Notification['type'], NotificationTypeConfig> = {
  chat: {
    icon: null, // Placeholder for a chat icon
    getPath: () => '/chat',
  },
  advice_summary: {
    icon: null, // Placeholder for an advice summary icon
    getPath: (notification) => `/quackzulting/${notification.sessionId || ''}`,
  },
  milestone: {
    icon: null, // Placeholder for a milestone icon
    getPath: () => '/profile',
  },
  nudge: {
    icon: null, // Placeholder for a nudge icon
    getPath: () => '/goals', // Nudge notifications will direct to the goals page
  },
  nudge_response: {
    icon: null, // Placeholder for a nudge response icon
    getPath: () => '/goals', // Nudge response notifications will direct to the goals page
  },
};
