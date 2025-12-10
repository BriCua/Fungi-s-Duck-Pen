# Project TODO List

This file tracks pending tasks and future improvements for the Fungi's Duck Pen project.

## Notifications UI

### 1. Add Specific Icons for Notification Types

The current notification system is designed to be extensible. To improve the user experience, we should add unique icons for each notification type.

**File to Edit:** `src/config/notification-config.ts`

**Task:**

1.  Source or create SVG/image icons for the following notification types:
    *   `chat` (e.g., a speech bubble icon)
    *   `advice_summary` (e.g., a lightbulb or brain icon)
    *   `milestone` (e.g., a trophy or a star icon)
2.  Add these icons to the `src/assets/icons` directory.
3.  Import the icons into `src/config/notification-config.ts` and replace the `null` placeholders.

**Example of how to implement in `src/config/notification-config.ts`:**

```typescript
// 1. Import the icons from the assets directory
import ChatIcon from '../assets/icons/chat-icon.svg';
import AdviceIcon from '../assets/icons/advice-icon.svg';
import MilestoneIcon from '../assets/icons/milestone-icon.svg';

// ... other imports

// 2. Update the config object to use the imported icons
export const notificationConfig: Record<Notification['type'], NotificationTypeConfig> = {
  chat: {
    // Before: icon: null,
    // After:
    icon: <img src={ChatIcon} alt="Chat" className="w-6 h-6" />,
    getPath: () => '/chat',
  },
  advice_summary: {
    // Before: icon: null,
    // After:
    icon: <img src={AdviceIcon} alt="Advice" className="w-6 h-6" />,
    getPath: (notification) => `/quackzulting/${notification.sessionId}`,
  },
  milestone: {
    // Before: icon: null,
    // After:
    icon: <img src={MilestoneIcon} alt="Milestone" className="w-6 h-6" />,
    getPath: () => '/profile',
  },
};
```

---
