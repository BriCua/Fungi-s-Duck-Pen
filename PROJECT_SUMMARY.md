# Project Summary

This document provides a high-level overview of the Fungi's Duck Pen project, its features, and technical implementation.

## Core Features

*   **Real-time Synchronization:** The application uses Firebase Firestore to keep data synchronized in real-time between partners.
*   **Authentication:** Secure user authentication is handled by Firebase Authentication.
*   **Couple Linking:** Users can link with their partner using a unique, expiring invite code.
*   **Shared Goals ("Duck Quests"):** A collaborative tool for couples to set, track, and achieve goals together.
    *   **Nudges:** Users can gently "nudge" their partner to encourage progress on personal goals.
    *   **Custom Responses:** Partners can reply to nudges with preset or custom text responses.
*   **Profile Page:** Displays user and partner information, relationship stats, and special dates.
*   **Notifications:** A centralized page for all in-app notifications, including nudges and responses.

## Technical Stack

*   **Frontend:** React with TypeScript, Vite for building.
*   **Styling:** Tailwind CSS for utility-first styling.
*   **Backend:** Firebase (Firestore, Firebase Authentication).
*   **Deployment:** Firebase Hosting.

## Recent Updates (as of Monday, December 15, 2025 6:14:52 PM)

*   **Long-Press to Delete Notifications:** Notification items can be deleted with a long-press, which triggers a confirmation modal.
*   **Custom Nudge Responses:** The nudge response modal now includes a textarea for sending custom replies.
*   **UI/UX Overhaul:**
    *   Fixed a major layout bug where the background image and overlay would not extend to the full height of the page on pages with scrolling content.
    *   Created a standardized, reusable `PageHeader` component.
    *   Refactored the Profile, Goals, and Notifications pages to use the new header and a consistent, unified layout.
*   **Firestore Rules:** Corrected a security rule that was preventing notification deletion.
*   **Codebase Cleanup:** Removed the "Duck Quests" PRD from the `TODO.md` file as the feature is now implemented.
