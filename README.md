# Fungi's Duck Pen

Welcome to Fungi's Duck Pen, a whimsical and engaging application designed to help couples connect, grow, and have fun together. Inspired by the idea of nurturing a digital "duck," this app provides a suite of tools for couples to track shared goals, communicate, and celebrate their relationship milestones.

## About The Project

This application is built as a Progressive Web App (PWA) with a focus on a mobile-first, engaging user experience. It leverages a modern tech stack centered around React and Firebase to deliver real-time features and a reactive interface.

## Key Features (Implemented)

The project has made significant progress, with a robust set of features already in place:

*   **Secure Authentication:** Users can create accounts and log in securely using Firebase Authentication.
*   **Couple Linking:** A seamless process allows users to link their account with their partner's by sharing a unique code, creating a shared "couple" space.
*   **Shared Goal Tracking (Duck Quests):** Couples can create, track, and complete shared goals and checklists together. Progress is updated in real-time, allowing both partners to stay synchronized on their objectives.
*   **Redesigned Profile Page:**
    *   A completely new layout featuring circular avatars, dynamic user and partner names, and a three-column statistics section for "Quacks," "Days Together," and "Streak."
    *   Custom fonts and unique styling for a more personalized feel.
    *   Refactored into modular components for better maintainability.
*   **Special Dates Management:**
    *   Users can add, edit, and delete custom "Special Dates" to commemorate important moments.
    *   The anniversary is a fixed, recurring date.
    *   The system displays flexible relative time descriptions (e.g., "Upcoming - 5 days," "2 months ago").
*   **Inline Editing for Couple Info:**
    *   "Relationship Status" and "Our Story" sections can be edited directly on the profile page via a modal, providing a smooth UX.
*   **Robust Navigation:**
    *   `react-router-dom` is implemented for client-side routing, including protected routes that require authentication.
*   **Core Bug Fixes & Improvements:**
    *   Resolved critical bugs related to couple data synchronization in the `AuthContext`.
    *   Corrected Firebase security rules to allow partners to view each other's data.
    *   Refined component styling and fixed layout/scrolling issues.

## Tech Stack

*   **Frontend:** React, TypeScript, Vite
*   **Backend & Database:** Firebase (Firestore, Authentication)
*   **Styling:** CSS Modules, Custom CSS properties (no major framework)
*   **Routing:** React Router DOM
*   **Linting:** ESLint

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js and npm installed.
*   A Firebase project.

### Installation

1.  **Clone the repo:**
    ```sh
    git clone https://github.com/your_username/fungi-s-duck-pen.git
    ```
2.  **Install NPM packages:**
    ```sh
    npm install
    ```
3.  **Set up environment variables:**
    *   Create a `.env` file in the root of the project.
    *   Copy the contents of `.env.example` into your new `.env` file.
    *   Fill in the values with your actual Firebase project credentials.
      ```env
      VITE_FIREBASE_API_KEY=your_api_key_here
      VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
      VITE_FIREBASE_PROJECT_ID=your_project_id
      VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
      VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
      VITE_FIREBASE_APP_ID=your_app_id
      ```
4.  **Run the development server:**
    ```sh
    npm run dev
    ```

## Future Roadmap

While much has been accomplished, there are several exciting features planned for the future:

*   **Complete the Notifications Page:**
    *   Build out the Firebase service (`notificationService.ts`) to manage notification data.
*   Create a `useNotifications` hook for application-wide state management.
    *   Develop the `NotificationsPage.tsx` component to display, manage, and interact with notifications.
    *   Integrate real-time unread counts into the header.
*   **Profile Photo Uploads:**
    *   Allow users to upload and update their profile pictures, which will require setting up Firebase Storage.
*   **Gamification & Duck Coin Store:**
    *   Expand the "Quack" system and introduce a virtual currency ("Duck Coins") that can be earned and spent in a store for cosmetic items.
*   **UI/UX Polish:**
    *   Continuously refine animations, transitions, and overall visual appeal.
    *   Improve accessibility and mobile responsiveness across all pages.