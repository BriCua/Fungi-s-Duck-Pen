🦆 FUNGI’S DUCK PEN — DEVELOPMENT INSTRUCTIONS


0. PROJECT SETUP
0.1 Vite + React + TS + Tailwind Initialization

Priority: P1

Initialize Vite project (React + TS).

Configure Tailwind.

Add duck-yellow brand color to tailwind.config.

Create base layout with header/footer placeholders.

0.2 Global UI/UX System

Priority: P1

Define all brand colors: Duck Yellow, Pond Blue, Soft White.

Create components: Button, Input, Card, Modal, Spinner.

Define typography scale.

Ensure all components are mobile-first.

1. FIREBASE BACKEND CORE
1.1 Firebase Auth

Priority: P1

Implement Email + Google login.

Auto-generate /users/{uid} profile on first login.

Build couple-linking system (invite link or code).

1.2 Firestore Schema

Priority: P1
Create collections:

/users/{uid}
/couples/{coupleId}
/chats/{coupleId}/messages/{msgId}
/quackzulting/{uid}/sessions/{sessionId}
/notifications/{uid}
/pondMemories/{coupleId}/{activityId}

1.3 Firestore Security Rules

Priority: P1

Prevent partner from accessing Quackzulting sessions.

Prevent any user from accessing chats outside their couple.

Only Dr. Kwuk summaries go to /notifications/{uid}.

No cross-couple reads/writes.

2. COUPLES CHAT (NORMAL MODE)
2.1 Chat UI + Real-time Sync

Priority: P1

Real-time listener for /chats/{coupleId}.

Bubble UI with avatar + timestamp.

Auto-scroll to latest message.

Emoji support.

2.2 Chat Mode Switcher

Priority: P1

Toggle between Normal Chat and Quackzulting Mode.

Add animation (fade + soft quack sound).

Clear visual difference between modes.

3. QUACKZULTING MODE (AI CONSULTATION)
3.1 Private Quackzulting Sessions

Priority: P1

Store messages under /quackzulting/{uid}/sessions/*.

Partner must not see this data.

UI must indicate “Private Consultation Space”.

3.2 Dr. Kwuk AI Prompt Template

Priority: P1

Define persona: cute, wise duck.

Template must include:

user message

emotional reflection

suggested actions

issue classification

Keep temperature mid-low.

3.3 Summary Mode (Send to Partner)

Priority: P1

One-tap “Send Summary”.

AI generates:

Summary of situation

Emotional tone

Hint about desired outcome

1–3 suggested actions

Store in /notifications/{partnerUid}.

3.4 Hint Slider

Priority: P2

Slider with Light → Direct levels.

Adjust AI output based on slider value.

4. PARTNER INBOX (DR. KWUK ADVICE)
4.1 Inbox UI

Priority: P1

List of advice cards.

Each card contains:

Summary

Suggested actions

Mood emoji

Timestamp

4.2 Action Suggestion Engine

Priority: P2
AI produces 3 levels of suggestions.
Use hint slider value as context.

4.3 PDF Export (“Dr. Kwuk’s Prescription”)

Priority: P2

Generate duck-themed PDF containing:

Summary

Advice

Date

Duck watermark

Auto-download on user request.

5. POND MEMORIES (ACTIVITY HISTORY)
5.1 Activity Logging

Priority: P1
Log events such as:

Quackzulting summaries sent

Chat events (high-level only)

Duck clicker milestones

Partner actions
Store logs in /pondMemories/{coupleId}.

5.2 Timeline UI

Priority: P2

Vertical timeline.

Card-based entries.

Duck footprints as separators.

5.3 Photo Support

Priority: P2

Allow photo attachments.

Upload to Firebase Storage.

Use thumbnail transformation.

6. DUCK CLICKER (HOMEPAGE)
6.1 Basic Duck

Priority: P1

Duck spins 360° on click.

Duck quacks with sound.

Local quack counter saved in state.

6.2 Optional Expansion

Priority: P3

Rare quacks.

Duck hats/accessories.

Daily missions.

7. SUPPORT SYSTEMS
7.1 Error States

Priority: P1
Implement error UI for:

Auth failure

Firestore permission denied

Chat load failure

AI request failure

7.2 Loading Skeletons

Priority: P2
Implement skeleton UIs for:

Chat

Inbox

Memories

7.3 Accessibility + Theming

Priority: P2

High-contrast option

Reduced animations mode

Screen-reader labels

8. DEVELOPMENT NOTES (AI AGENT)

Maintain strict separation between Normal Chat and Quackzulting data.

Enforce security rules before feature integrations.

Use clean React component composition.

Follow mobile-first UI.

Keep theme duck-yellow and consistent.

Follow file structure:

/components
/pages
/hooks
/services
/firebase
/types