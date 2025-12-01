# Backend Implementation Guide - Fungi's Duck Pen

## Current State Summary
- ✅ UI/UX complete: DuckClicker home page with animations, Layout with header/footer/nav, Auth pages
- ✅ Firebase initialized and configured (auth service, Firestore)
- ✅ Authentication UI: Email/password signup, Google login, couple linking UI
- ❌ Backend logic: Couple code validation/storage, Chat real-time sync, Quackzulting AI integration

## Next Priority Tasks

### 1. Couple Linking Backend (P1 - CRITICAL)
**File:** `src/firebase/coupleService.ts` (create new)
**What to implement:**
- `createCouple()` - Generate 6-char uppercase invite code, store in `/couples/{coupleId}` with:
  - `coupleId` (auto-generated Firestore ID)
  - `inviteCode` (6 chars)
  - `createdBy` (user UID)
  - `createdAt` (timestamp)
  - `users` (array of 2 UIDs)
  - `createdDate` (readable date)

- `joinCoupleByCode(inviteCode)` - Validate code exists, add current user to couple
  - Check if code exists in Firestore
  - Verify only 1 user in couple (to add second)
  - Add current user UID to couple.users array
  - Update user profile with coupleId

- `getCoupleData(coupleId)` - Fetch couple info for current user

**Update:** `src/firebase/authService.ts` - After signup, create initial user profile with:
```tsx
{
  uid: user.uid,
  email: user.email,
  displayName: displayName || '',
  coupleId: null, // Set after linking
  createdAt: timestamp,
}
```

**Update:** `src/pages/CoupleLinkingPage.tsx` - Connect UI buttons to these services:
- "Create Code" button → `createCouple()` → Display generated code
- "Join Code" button → `joinCoupleByCode(inputCode)` → Redirect to home
- Display couple status after linking

---

### 2. Firestore Security Rules (P1)
**File:** Update `public/firestore.rules` (or in Firebase Console)
**Rules needed:**
```
match /users/{uid} {
  allow read, write: if request.auth.uid == uid;
}

match /couples/{coupleId} {
  allow read: if request.auth.uid in resource.data.users;
  allow create: if request.auth.uid != null;
  allow update: if request.auth.uid in resource.data.users;
}

match /chats/{coupleId}/messages/{messageId} {
  allow read: if request.auth.uid in get(/databases/$(database)/documents/couples/$(coupleId)).data.users;
  allow create: if request.auth.uid in get(/databases/$(database)/documents/couples/$(coupleId)).data.users;
}

match /quackzulting/{uid}/sessions/{sessionId} {
  allow read, write: if request.auth.uid == uid;
}

match /notifications/{uid} {
  allow read: if request.auth.uid == uid;
}

match /pondMemories/{coupleId}/{memoryId} {
  allow read: if request.auth.uid in get(/databases/$(database)/documents/couples/$(coupleId)).data.users;
  allow create, write: if request.auth.uid in get(/databases/$(database)/documents/couples/$(coupleId)).data.users;
}
```

---

### 3. Chat UI + Real-time Sync (P1)
**Files to create:**
- `src/pages/ChatPage.tsx`
- `src/components/ChatBubble.tsx`
- `src/components/ChatInput.tsx`

**Functionality:**
- Real-time listener on `/chats/{coupleId}/messages` (ordered by timestamp)
- Display messages with:
  - Sender name/avatar
  - Timestamp
  - Message text + emoji support
  - Different styling for self vs partner
- Auto-scroll to latest message
- Input field with send button
- Mode switcher: "Normal Chat" ↔ "Quackzulting Mode"

**Update `src/App.tsx`:**
- After couple linking, show ChatPage instead of DuckClicker home
- Keep DuckClicker accessible via nav (maybe on profile/settings page)

**Update `src/firebase/chatService.ts`:**
- `sendMessage(coupleId, message)` - Add to `/chats/{coupleId}/messages`
- `getMessages(coupleId)` - Real-time listener setup
- Messages schema:
  ```tsx
  {
    uid: string,
    displayName: string,
    text: string,
    timestamp: Timestamp,
    mode: 'normal' | 'quackzulting'
  }
  ```

---

### 4. Quackzulting (AI Consultation) Mode (P2)
**Files to create:**
- `src/pages/QuackzultingPage.tsx`
- `src/services/aiService.ts` (integrate OpenAI/Claude API)

**Functionality:**
- Switch from chat to private consultation mode
- Messages stored under `/quackzulting/{uid}/sessions/{sessionId}` (not visible to partner)
- Dr. Kwuk AI persona responding with relationship advice
- Hint slider (0-100%) to control response depth
- Message bubbles styled differently from normal chat
- Session summary generation after X messages

**Required:**
- OpenAI API key (or Claude API) in `.env.local`
- `VITE_OPENAI_API_KEY` or `VITE_ANTHROPIC_API_KEY`
- Prompt template for Dr. Kwuk persona (see `src/firebase/security-rules.ts` for reference)

---

### 5. App Flow Update (P2)
**Update `src/App.tsx` routing:**
```tsx
if (!user) return <AuthPage />
if (showCoupleLinking) return <CoupleLinkingPage />
if (!user.coupleId) return <CoupleLinkingPage /> // Redirect if not linked

// Show main app with chat/quackzulting
return <ChatPage /> // or <Layout><ChatPage /></Layout>
```

**Navigation from header:**
- 📬 Inbox → Notifications/Partner Inbox
- ⭐ Points → Achievements/Streak view
- 🔥 Streak → Streak history
- 👤 Profile → User settings, couple info, logout

---

## Testing Checklist
- [ ] Create couple code works, generates 6-char code
- [ ] Join couple code works, links two users
- [ ] Firestore rules prevent cross-couple access
- [ ] Chat real-time sync works (test with 2 browsers)
- [ ] Quackzulting sessions private to user
- [ ] AI responses follow Dr. Kwuk persona
- [ ] App flow redirects correctly based on couple status

## Database Schema Reference
```
/users/{uid}
  - email
  - displayName
  - coupleId
  - createdAt

/couples/{coupleId}
  - inviteCode
  - createdBy
  - createdAt
  - users: [uid1, uid2]

/chats/{coupleId}/messages/{messageId}
  - uid
  - displayName
  - text
  - timestamp
  - mode

/quackzulting/{uid}/sessions/{sessionId}/messages/{messageId}
  - text
  - timestamp
  - sender: 'user' | 'dr-kwuk'

/notifications/{uid}/{notificationId}
  - type
  - title
  - message
  - timestamp
  - read

/pondMemories/{coupleId}/{memoryId}
  - title
  - description
  - photoURL
  - timestamp
```

## Files Status
- ✅ Created: authService.ts, chatService.ts, quackzultingService.ts (stubs)
- ❌ Need implementation: coupleService.ts
- ⚠️ Partial: ChatPage.tsx (UI exists, backend integration needed)
- ❌ Not started: QuackzultingPage.tsx, aiService.ts

---

**Start with Task #1 (Couple Linking) - it unblocks everything else!**
