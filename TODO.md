# Shared Goal List ("Duck Quests") - Product Requirements Document (PRD)

---

### 1. Feature Name
Shared Goal List (Internal Codename: "Duck Quests")

### 2. Objective
To provide couples with a fun, collaborative, and encouraging tool to set, track, and achieve both personal and shared goals. This feature aims to improve communication, teamwork, and mutual support, strengthening the couple's bond.

### 3. User Stories
- **As a user, I want to create goals for myself** so I can track my personal progress and my partner can see what I'm working on.
- **As a user, I want to create goals for my partner and me** so we can work on shared objectives together.
- **As a user, I want to break down large goals into smaller, manageable checklist items** to make progress feel more achievable.
- **As a partner, I want to gently 'nudge' my partner about their personal goals** to show my support and encouragement without having to ask directly.
- **As a user, I want to quickly update my partner on the status of a goal** they nudged me about, closing the communication loop.

### 4. Key Functional Requirements
- **Goal Management:** Users can create, edit, and delete goals.
- **Goal Attributes:** Each goal must have a Title, Type (Personal/Us), and a Due Date. It can optionally have a Description, a Priority, and a Checklist of sub-items.
- **Progress Visualization:** A progress bar on each goal card will visually track the completion of its checklist.
- **'Us' Goals:** Have a shared checklist where either partner can mark items as complete.
- **'Personal' Goals & Nudges:**
    - Have a private checklist that only the creator can modify.
    - The partner can send a "nudge" linked to either the goal in general or a specific checklist item.
    - The creator receives the nudge and can respond with a pre-defined status.
    - If the creator responds with "Done," the corresponding checklist item(s) are automatically marked as complete.
- **Notifications:** A notification is sent for new goals, incoming nudges, and responses to nudges.

### 5. Out of Scope (for V1)
- Recurring goals.
- Advanced dependency management (e.g., sub-tasks of sub-tasks).
- Direct integration with external calendars (e.g., Google Calendar).
- Points, badges, or other explicit gamification rewards.

---
---

# Technical Implementation Plan

This document outlines the implementation plan for the Shared Goal List feature.

### Phase 1: Backend - Firestore Data Model

1.  **Create new Firestore collection:** `goals`.
2.  **Define Goal Document Structure:** Each document in the `goals` collection will represent a single goal and have the following structure:
    ```json
    {
      "goalId": "string",          // Auto-generated ID
      "coupleId": "string",        // ID linking to the couple
      "createdBy": "string",       // User ID of the creator
      "title": "string",           // Mandatory
      "type": "string",            // 'personal' or 'us' (Mandatory)
      "dueDate": "Timestamp",      // Mandatory Firestore Timestamp
      "details": "string",         // Optional
      "priority": "string",        // Optional: 'urgentAndImportant', 'importantNotUrgent', etc.
      "checklist": [               // Optional array of checklist items
        {
          "id": "string",          // Auto-generated ID for the step
          "text": "string",
          "completed": "boolean"
        }
      ],
      "createdAt": "Timestamp",
      "updatedAt": "Timestamp"
    }
    ```
3.  **Define Nudge Data in Notifications:** To handle nudges, we will add structured data to the notification object sent to the user. The notification `data` payload will include:
    ```json
    {
      //... existing notification fields
      "type": "nudge",
      "goalId": "string",
      "checklistItemId": "string | null", // The specific item being nudged, or null for general
      "nudgeMessage": "string"
    }
    ```
4.  **Update Firestore Security Rules (`firestore.rules`):**
    *   Allow `create`, `read`, `update` on the `goals` collection for users whose `uid` is in the `couple.members` array.
    *   Ensure a user can only edit goals belonging to their `coupleId`.

---

### Phase 2: Core Service Logic (`goalService.ts`)

1.  **Create `src/firebase/goalService.ts`**.
2.  **Implement Functions:**
    *   `createGoal(coupleId, goalData)`: Adds a new goal document to Firestore.
    *   `updateGoal(goalId, updatedData)`: Edits an existing goal document.
    *   `deleteGoal(goalId)`: Deletes a goal document.
    *   `subscribeToGoals(coupleId, callback)`: Sets up a real-time listener (`onSnapshot`) to fetch all goals for a couple.
    *   `sendNudgeNotification(recipientId, goalId, checklistItemId, message)`: Creates a new notification document for the recipient with the nudge data.
    *   `sendNudgeResponseNotification(recipientId, originalNudge, responseStatus)`: Creates a notification for the original nudger with the response.
    *   `updateChecklistFromNudge(goalId, checklistItemId)`: The core logic for handling a "Done!" response from a nudge. Finds the goal and specific checklist item (or all of them) and updates its `completed` status.

---

### Phase 3: Frontend State Management (`useGoals.ts`)

1.  **Create `src/hooks/useGoals.ts`**.
2.  **Functionality:**
    *   This hook will provide application-wide access to the goals.
    *   It will use `goalService.subscribeToGoals` to get real-time goal data.
    *   It will expose the goals array (`personalGoals`, `coupleGoals`) and the service functions (`createGoal`, `updateGoal`, etc.) to the UI components.

---

### Phase 4: UI - Pages & Core Components

1.  **Create `src/pages/GoalsPage.tsx`:**
    *   This will be the main page for the feature.
    *   Use the `useGoals` hook to get and display the goals.
    *   Implement Tabs to switch between "Our Goals" and "Personal Goals".
    *   Include a Floating Action Button to open the `AddGoalModal`.
2.  **Create `src/components/goals/AddGoalModal.tsx` and `EditGoalModal.tsx`:**
    *   Build the form for creating/editing goals with all the specified fields.
    *   Use a Toggle Switch for the `type`.
    *   Use a Date Picker for the `dueDate`.
    *   Implement the dynamic "Add Step" functionality for the checklist.
3.  **Create `src/components/goals/GoalCard.tsx`:**
    *   The main "post-it note" component.
    *   It will display the compact view by default and expand on click.
    *   It will render the `ProgressBar`.
    *   It will conditionally render either an interactive `Checklist` or the `Nudge` UI based on the goal `type` and the current user.
4.  **Create `src/components/goals/ProgressBar.tsx`:**
    *   A simple component that takes a `percentage` prop and renders a visual bar.

---

### Phase 5: UI - Interaction Components

1.  **Create `src/components/goals/Checklist.tsx`:**
    *   Renders the list of checklist items.
    *   Handles the `onCheck` event to update the goal's state.
    *   For the partner's view of a personal goal, the checkboxes will be disabled.
2.  **Create `src/components/goals/Nudge.tsx`:**
    *   This component will render the "Nudge" button(s).
    *   When viewing a personal goal as a partner, each checklist item will have a small "Nudge" button next to it. A general "Nudge" button will be at the bottom of the card.
    *   Clicking a button will open an inline form or small modal to send the nudge message.
3.  **Create `src/components/notifications/NudgeResponseModal.tsx`:**
    *   When a user clicks a nudge notification, this modal opens.
    *   It will display the nudge message and the four preset response buttons.
    *   It will call the appropriate service function on a selection.

---

### Phase 6: Routing & Navigation

1.  **Update `src/App.tsx`:**
    *   Add a new `ProtectedRoute` for the `/goals` path, rendering `GoalsPage`.
2.  **Update `src/components/Footer.tsx`:**
    *   Add a new icon/button to the footer that navigates to the `/goals` page. I will find a suitable placeholder SVG icon for this (e.g., a checklist or target icon).