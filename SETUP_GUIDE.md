# Fungi's Duck Pen - Setup Guide

## ✅ Completed

### 0. Project Setup
- ✅ Vite + React + TypeScript initialized
- ✅ Tailwind CSS v4 configured with brand colors
- ✅ Base layout with header/footer
- ✅ Global UI/UX System (Button, Input, Card, Modal, Spinner components)
- ✅ Tailwind color tokens: Duck Yellow, Pond Blue, Soft White

### 1. Firebase Backend Core
- ✅ Firebase project structure created
- ✅ Firebase initialization (`src/firebase/init.ts`)
- ✅ Firestore security rules template
- ✅ Auth service (Email + Google login ready)
- ✅ Chat service (real-time messaging)
- ✅ Quackzulting service (private consultation)

### 2. Project Structure
```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Spinner.tsx
│   │   └── index.ts
│   ├── Layout.tsx             # Main layout wrapper
│   ├── DuckClicker.tsx        # Duck homepage game
├── firebase/
│   ├── config.ts              # Firebase config
│   ├── init.ts                # Firebase initialization
│   ├── authService.ts         # Authentication
│   ├── chatService.ts         # Chat messaging
│   ├── quackzultingService.ts # AI consultation
│   └── security-rules.ts      # Firestore rules
├── hooks/
│   ├── useAuth.ts             # Auth hook (TODO)
│   └── useChat.ts             # Chat hook (TODO)
├── services/                  # Business logic services
├── pages/                     # Page components
└── types/
    └── index.ts               # TypeScript types
```

## 🚀 Next Steps

### 1. Set up Firebase Project
1. Go to https://console.firebase.google.com
2. Create a new project
3. Enable Authentication (Email + Google)
4. Create Firestore database
5. Copy credentials to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
6. Fill in your Firebase credentials

### 2. Deploy Firestore Security Rules
1. Copy rules from `src/firebase/security-rules.ts`
2. Go to Firebase Console → Firestore → Rules
3. Paste and publish the rules

### 3. Implement Authentication UI
- [ ] Create login/signup page in `src/pages/Auth.tsx`
- [ ] Create couple-linking system (invite code/link)
- [ ] Test Email + Google authentication

### 4. Implement Couples Chat
- [ ] Create chat page in `src/pages/Chat.tsx`
- [ ] Implement real-time message display
- [ ] Add message bubble component
- [ ] Add emoji support
- [ ] Implement mode switcher (Normal/Quackzulting)

### 5. Implement Quackzulting Mode
- [ ] Create private session UI
- [ ] Integrate AI API (OpenAI/Claude)
- [ ] Implement Dr. Kwuk persona
- [ ] Create summary generation
- [ ] Implement hint slider (Light → Direct)

### 6. Implement Partner Inbox
- [ ] Create inbox page
- [ ] Display advice summaries
- [ ] Add PDF export functionality
- [ ] Add action suggestion engine

### 7. Implement Pond Memories
- [ ] Create timeline UI
- [ ] Log activities
- [ ] Add photo support
- [ ] Create duck footprint separators

## 📦 Installation & Running

```bash
# Install dependencies
npm install

# Create .env.local with Firebase credentials
cp .env.example .env.local

# Start dev server
npm run dev

# Build for production
npm run build
```

## 🎨 Design System

### Colors
- **Duck Yellow**: `#FFD700` (primary, joy)
- **Pond Blue**: `#4A90E2` (secondary, trust)
- **Soft White**: `#F8F9FA` (background)

### Components
All components support responsive design and are mobile-first.

## 🔐 Security

Firestore rules prevent:
- Partners seeing each other's Quackzulting sessions
- Cross-couple data access
- Unauthorized reads/writes

## 📝 Notes

- All Firebase services are initialized but need .env.local setup
- UI components are reusable and customizable
- Follow mobile-first approach for all new features
- Keep duck theme consistent throughout
