// Firestore Security Rules (paste into Firebase Console)
// Path: Firestore Database > Rules tab

const rules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - each user can read/write their own profile
    match /users/{uid} {
      allow read: if request.auth.uid == uid;
      allow write: if request.auth.uid == uid;
      
      // Prevent partner from accessing user data
      allow read: if false;
    }
    
    // Couples collection
    match /couples/{coupleId} {
      allow read: if request.auth.uid in resource.data.userIds;
      allow write: if request.auth.uid in resource.data.userIds;
    }
    
    // Chat messages - only couple members can access
    match /chats/{coupleId}/messages/{msgId} {
      allow read: if request.auth.uid in get(/databases/$(database)/documents/couples/$(coupleId)).data.userIds;
      allow create: if request.auth.uid in get(/databases/$(database)/documents/couples/$(coupleId)).data.userIds;
      allow update, delete: if request.auth.uid == resource.data.senderUid;
    }
    
    // Quackzulting sessions - private, partner cannot access
    match /quackzulting/{uid}/sessions/{sessionId} {
      allow read, write: if request.auth.uid == uid;
      allow read: if false; // Extra security: no one else can read
    }
    
    // Notifications - user can only read their own
    match /notifications/{uid} {
      allow read: if request.auth.uid == uid;
      allow write: if request.auth.uid == uid;
    }
    
    // Pond Memories - couple can access their memories
    match /pondMemories/{coupleId}/{activityId} {
      allow read, write: if request.auth.uid in get(/databases/$(database)/documents/couples/$(coupleId)).data.userIds;
    }
    
    // Default deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
`

export default rules
