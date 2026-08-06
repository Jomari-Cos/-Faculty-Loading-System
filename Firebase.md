# Faculty Loading System - Firebase Migration Guide

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Firebase Setup](#firebase-setup)
4. [Database Structure](#database-structure)
5. [Security Rules](#security-rules)
6. [Code Migration](#code-migration)
7. [Testing the Migration](#testing-the-migration)
8. [Rollback Plan](#rollback-plan)

---

## Overview

This guide documents the migration from **Supabase** to **Firebase** for the Faculty Loading System. The migration replaces the Supabase remote sync functionality with Firebase Realtime Database or Firestore while maintaining the same data structure and features.

### What Changes
- **Backend:** Supabase → Firebase (Realtime Database or Firestore)
- **Authentication:** Supabase anon key → Firebase config
- **Data Storage:** PostgreSQL via Supabase REST API → Firebase NoSQL database
- **Sync Mechanism:** REST API polling → Firebase real-time listeners

### What Stays the Same
- Local storage (localStorage) for offline capability
- All application features and UI
- Data structure and field names
- Conflict detection logic
- Import/export functionality

---

## Prerequisites

- Firebase account (https://firebase.google.com)
- Node.js (for Firebase CLI, optional)
- Current Faculty Loading System codebase
- Backup of existing data (export CSV/Excel files)

---

## Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"**
3. Enter project name: `    `
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Choose Database

Select one of the following options:

#### Option A: Firebase Realtime Database (Recommended for simple sync)

1. In Firebase Console, go to **Build → Realtime Database**
2. Click **"Create Database"**
3. Select location (choose closest to your users)
4. Start in **test mode** (we'll secure it later)
5. Click **"Enable"**

#### Option B: Cloud Firestore (Alternative)
    
1. In Firebase Console, go to **Build → Firestore Database**
2. Click **"Create Database"**
3. Select location
4. Start in **test mode**
5. Click **"Enable"**

### Step 3: Your Firebase Configuration

Your Firebase project is already configured with the following details:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBrqaRrm-aRwrY1siF7rgOItvOQxxsYsYU",
  authDomain: "faculty-loading-system.firebaseapp.com",
  databaseURL: "https://faculty-loading-system-default-rtdb.firebaseio.com",
  projectId: "faculty-loading-system",
  storageBucket: "faculty-loading-system.firebasestorage.app",
  messagingSenderId: "539426552220",
  appId: "1:539426552220:web:b74ef07502d03f48637059",
  measurementId: "G-PRJE18C1DN"
};
```

**Important:** Your `databaseURL` is: `https://faculty-loading-system-default-rtdb.firebaseio.com`

### Step 4: Install Firebase SDK

Add the Firebase SDK to your `index.html` file in the `<head>` section, before the custom CSS:

```html
<!-- Firebase SDK -->
<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-analytics.js";
  import { getDatabase } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBrqaRrm-aRwrY1siF7rgOItvOQxxsYsYU",
    authDomain: "faculty-loading-system.firebaseapp.com",
    databaseURL: "https://faculty-loading-system-default-rtdb.firebaseio.com",
    projectId: "faculty-loading-system",
    storageBucket: "faculty-loading-system.firebasestorage.app",
    messagingSenderId: "539426552220",
    appId: "1:539426552220:web:b74ef07502d03f48637059",
    measurementId: "G-PRJE18C1DN"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const database = getDatabase(app);
  
  // Make database globally accessible for script.js
  window.firebaseDatabase = database;
</script>
```

---

## Database Structure

### Realtime Database Structure

Firebase Realtime Database uses a JSON tree structure. The Faculty Loading System data will be stored as follows:

```
faculty_loading_system/
├── metadata/
│   ├── updated_at: "2026-07-15T10:30:00.000Z"
│   └── row_id: "main"
└── state/
    ├── loads: [
    │   {
    │     "faculty": "Prof. Santos",
    │     "section": "BSCpE 1st Year A",
    │     "subject": "Programming 1",
    │     "day": "Monday",
    │     "startTime": "08:00",
    │     "endTime": "09:30",
    │     "room": "Room 101",
    │     "units": "3"
    │   }
    │ ]
    ├── sections: [
    │   {
    │     "program": "BSCpE",
    │     "year": "1st Year",
    │     "name": "A",
    │     "fullName": "BSCpE 1st Year A"
    │   }
    │ ]
    ├── subjects: [
    │   {
    │     "section": "BSCpE 1st Year A",
    │     "code": "CpE 311",
    │     "name": "Programming 1"
    │   }
    │ ]
    └── rooms: [
        {
          "name": "Room 101",
          "capacity": 30
        }
      ]
```

### Firestore Structure (Alternative)

If using Firestore, the structure would be:

```
faculty_loading_system (collection)
└── main (document)
    ├── updated_at: timestamp
    ├── loads: array
    ├── sections: array
    ├── subjects: array
    └── rooms: array
```

---

## Security Rules

### Realtime Database Rules

Go to **Realtime Database → Rules** tab and replace the default rules with:

```json
{
  "rules": {
    "faculty_loading_system": {
      ".read": true,
      ".write": true,
      "metadata": {
        "updated_at": {
          ".read": true,
          ".write": true
        },
        "row_id": {
          ".read": true,
          ".write": true
        }
      },
      "state": {
        ".read": true,
        ".write": true,
        "loads": {
          ".read": true,
          ".write": true
        },
        "sections": {
          ".read": true,
          ".write": true
        },
        "subjects": {
          ".read": true,
          ".write": true
        },
        "rooms": {
          ".read": true,
          ".write": true
        }
      }
    }
  }
}
```

**Note:** These rules allow read/write access to everyone. For production use, implement proper authentication and authorization.

### Firestore Rules (Alternative)

If using Firestore, go to **Firestore → Rules** tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /faculty_loading_system/{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

## Code Migration

### Step 1: Update Configuration

In `index.html`, add the Firebase configuration before the closing `</head>` tag or in a separate config section:

```html
<script>
  // Firebase Configuration
  const FIREBASE_CONFIG = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  
  // Initialize Firebase (add this after Firebase SDK scripts)
  firebase.initializeApp(FIREBASE_CONFIG);
  const database = firebase.database();
</script>
```

### Step 2: Replace Supabase Functions in script.js

Replace the Supabase remote sync functions with Firebase equivalents. Here's the complete replacement code:

#### Replace Supabase Configuration (Lines 23-28)

```javascript
// OLD (Supabase):
// const SUPABASE_CONFIG = window.SUPABASE_CONFIG || {};
// const SUPABASE_URL = (SUPABASE_CONFIG.url || "").replace(/\/$/, "");
// const SUPABASE_ANON_KEY = SUPABASE_CONFIG.anonKey || "";
// const SUPABASE_TABLE = SUPABASE_CONFIG.table || "faculty_loading_state";
// const SUPABASE_ROW_ID = SUPABASE_CONFIG.rowId || "main";
// const REMOTE_POLL_INTERVAL_MS = Number(SUPABASE_CONFIG.pollIntervalMs || 4000);

// NEW (Firebase):
const FIREBASE_ENABLED = Boolean(window.firebaseDatabase);
const FIREBASE_ROW_ID = "main";
const FIREBASE_PATH = `faculty_loading_system/state`;
const FIREBASE_METADATA_PATH = `faculty_loading_system/metadata`;
let remoteSyncListener = null;
let firebaseInitialized = false;
```

#### Replace `isRemoteSyncEnabled()` Function (Lines 35-37)

```javascript
// OLD:
// function isRemoteSyncEnabled() {
//     return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
// }

// NEW:
function isRemoteSyncEnabled() {
    return Boolean(window.firebaseDatabase);
}
```

#### Replace `buildRemoteUrl()` and `getRemoteHeaders()` (Lines 109-119)

```javascript
// REMOVE THESE FUNCTIONS:
// function buildRemoteUrl() { ... }
// function getRemoteHeaders() { ... }
```

#### Replace `fetchRemoteState()` (Lines 121-146)

```javascript
// OLD:
// async function fetchRemoteState() { ... }

// NEW:
async function fetchRemoteState() {
    if (!isRemoteSyncEnabled()) {
        return null;
    }

    return new Promise((resolve, reject) => {
        database.ref(`${FIREBASE_PATH}`).once('value')
            .then((snapshot) => {
                const state = snapshot.val();
                if (!state) {
                    resolve(null);
                    return;
                }
                
                database.ref(`${FIREBASE_METADATA_PATH}/updated_at`).once('value')
                    .then((metaSnapshot) => {
                        resolve({
                            state: state,
                            updated_at: metaSnapshot.val()
                        });
                    })
                    .catch(reject);
            })
            .catch(reject);
    });
}
```

#### Replace `pushRemoteState()` (Lines 148-175)

```javascript
// OLD:
// async function pushRemoteState(state) { ... }

// NEW:
async function pushRemoteState(state) {
    if (!isRemoteSyncEnabled()) {
        return;
    }

    const timestamp = new Date().toISOString();
    
    return new Promise((resolve, reject) => {
        const updates = {};
        updates[`${FIREBASE_PATH}/loads`] = state.loads;
        updates[`${FIREBASE_PATH}/sections`] = state.sections;
        updates[`${FIREBASE_PATH}/subjects`] = state.subjects;
        updates[`${FIREBASE_PATH}/rooms`] = state.rooms;
        updates[`${FIREBASE_METADATA_PATH}/updated_at`] = timestamp;
        updates[`${FIREBASE_METADATA_PATH}/row_id`] = FIREBASE_ROW_ID;

        database.ref().update(updates)
            .then(() => {
                remoteUpdatedAt = timestamp;
                resolve();
            })
            .catch(reject);
    });
}
```

#### Replace `syncFromSupabase()` (Lines 246-270)

```javascript
// OLD:
// async function syncFromSupabase() { ... }

// NEW:
async function syncFromRemote() {
    if (!isRemoteSyncEnabled()) {
        return;
    }

    try {
        const remoteRecord = await fetchRemoteState();

        if (remoteRecord?.state) {
            if (remoteRecord.updated_at && remoteRecord.updated_at === remoteUpdatedAt) {
                return;
            }

            withPersistenceSuppressed(() => {
                applyAppState(remoteRecord.state);
                saveLocalCache();
                renderAllViews();
            });

            remoteUpdatedAt = remoteRecord.updated_at || remoteUpdatedAt;
        }
    } catch (error) {
        console.warn("Remote sync read failed:", error);
    }
}
```

#### Replace `initializeRemoteSync()` (Lines 272-299)

```javascript
// OLD:
// async function initializeRemoteSync() { ... }

// NEW:
async function initializeRemoteSync() {
    if (!isRemoteSyncEnabled() || firebaseInitialized) {
        return;
    }

    try {
        firebaseInitialized = true;
        const remoteRecord = await fetchRemoteState();

        if (remoteRecord?.state) {
            withPersistenceSuppressed(() => {
                applyAppState(remoteRecord.state);
                saveLocalCache();
            });

            remoteUpdatedAt = remoteRecord.updated_at || remoteUpdatedAt;
        } else {
            await pushRemoteState(getAppState());
        }

        // Set up real-time listener for changes
        if (remoteSyncListener) {
            remoteSyncListener.off();
        }
        
        remoteSyncListener = database.ref(FIREBASE_PATH);
        remoteSyncListener.on('value', async (snapshot) => {
            const state = snapshot.val();
            if (!state) return;
            
            const metaSnapshot = await database.ref(`${FIREBASE_METADATA_PATH}/updated_at`).once('value');
            const updatedAt = metaSnapshot.val();
            
            if (updatedAt && updatedAt !== remoteUpdatedAt) {
                withPersistenceSuppressed(() => {
                    applyAppState(state);
                    saveLocalCache();
                    renderAllViews();
                });
                remoteUpdatedAt = updatedAt;
            }
        });
        
    } catch (error) {
        console.warn("Remote sync initialization failed:", error);
        firebaseInitialized = false;
    }
}
```

#### Update `persistAppState()` Error Message (Lines 177-198)

```javascript
// In the persistAppState function, update line 194:
// OLD: showToast("Saved locally, but the Supabase sync failed.", "warning");
// NEW: showToast("Saved locally, but the Firebase sync failed.", "warning");
```

#### Update MANUAL.md References

In `MANUAL.md`, update the "Supabase Sync Setup" section (lines 340-380) to "Firebase Sync Setup":

```markdown
### Firebase Sync Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Set up Realtime Database (or Firestore)
3. Add your Firebase configuration in the `FIREBASE_CONFIG` block inside `index.html`
4. Configure security rules to allow read/write access
5. The app will automatically sync data across devices in real-time

Example Firebase configuration in `index.html`:

```html
<script>
  const FIREBASE_CONFIG = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
</script>
```

**Note:** Keep your Firebase configuration secure. Do not commit sensitive keys to public repositories.
```

---

## Testing the Migration

### Step 1: Local Testing

1. Open `index.html` in your browser
2. Open browser DevTools (F12) → Console tab
3. Add test data:
   - Create a few sections
   - Add some subjects
   - Create faculty loads
4. Verify data appears in Firebase Console:
   - Go to Firebase Console → Realtime Database
   - Check that data is being written
5. Open the same page in an incognito window or different browser
6. Verify data syncs automatically (you should see the same data without manual refresh)

### Step 2: Multi-Device Testing

1. Deploy the updated app to a web server or use Firebase Hosting
2. Access from multiple devices/computers
3. Add data on one device
4. Verify it appears on other devices within seconds (real-time sync)

### Step 3: Conflict Testing

1. Open the app on two different browsers
2. Add a faculty load on Browser A
3. Immediately try to add a conflicting load on Browser B
4. Verify conflict detection still works correctly

---

## Rollback Plan

If you need to revert to Supabase:

### Option 1: Quick Rollback (Keep Both)

Keep the Supabase code in comments and simply comment out the Firebase code:

```javascript
// To use Supabase instead of Firebase:
// 1. Comment out Firebase initialization
// 2. Uncomment Supabase configuration
// 3. Uncomment Supabase functions
```

### Option 2: Git Rollback

```bash
# If using Git:
git revert <commit-hash-where-firebase-was-added>
# or
git checkout <previous-commit-hash>
```

### Option 3: Data Preservation

Your data is safe because:
- Local data remains in browser localStorage
- Firebase data is separate from Supabase data
- You can export data at any time using the Export button

---

## Additional Considerations

### Data Migration from Supabase

If you have existing data in Supabase and want to migrate it to Firebase:

1. Export data from Supabase:
   ```javascript
   // Run this in browser console on your app with Supabase enabled
   const state = getAppState();
   console.log(JSON.stringify(state, null, 2));
   // Copy the output
   ```

2. Import to Firebase:
   ```javascript
   // Run this in browser console on your app with Firebase enabled
   const importedState = {
     loads: [...],
     sections: [...],
     subjects: [...],
     rooms: [...]
   };
   
   database.ref(FIREBASE_PATH).set(importedState)
     .then(() => console.log('Data imported successfully'))
     .catch(err => console.error('Import failed:', err));
   ```

### Performance Optimization

1. **Enable Firebase Offline Persistence:**
   ```javascript
   // Add this after initializing Firebase
   database.ref().keepSynced(true);
   ```

2. **Limit Data Transfer:**
   - The current implementation syncs the entire state object
   - For large datasets (>10MB), consider implementing partial sync

3. **Debounce Rapid Changes:**
   ```javascript
   // Add debouncing to prevent excessive writes
   let saveTimeout;
   function debouncedSave(state) {
       clearTimeout(saveTimeout);
       saveTimeout = setTimeout(() => pushRemoteState(state), 1000);
   }
   ```

### Cost Considerations

Firebase Realtime Database pricing:
- **Free tier:** 1 GB storage, 100 MB/month download
- **Paid tier:** $5/GB storage, $1/GB download

For typical faculty loading use (small data, few users), you'll likely stay within the free tier.

---

## Troubleshooting

### Firebase Not Initializing

**Symptom:** Data doesn't sync, console shows Firebase errors

**Solutions:**
1. Verify `FIREBASE_CONFIG` is correctly set in `index.html`
2. Check that Firebase SDK scripts are loaded before initialization
3. Ensure `databaseURL` is correct in config
4. Check browser console for specific error messages

### Permission Denied Errors

**Symptom:** "Permission denied" in console

**Solutions:**
1. Go to Firebase Console → Database → Rules
2. Temporarily set rules to allow read/write:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
3. For production, implement proper authentication

### Data Not Syncing

**Symptom:** Changes don't appear on other devices

**Solutions:**
1. Verify internet connection
2. Check Firebase Console → Database to see if data is being written
3. Ensure real-time listener is properly attached
4. Check browser console for errors
5. Verify security rules allow read access

### Real-time Updates Not Working

**Symptom:** Manual refresh needed to see changes

**Solutions:**
1. Check that `remoteSyncListener` is properly initialized
2. Verify the listener callback is being triggered
3. Ensure `remoteUpdatedAt` is being updated correctly
4. Check for JavaScript errors in console

---

## Support

For Firebase-specific issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- [Firebase Community](https://firebase.google.com/community)

For Faculty Loading System issues:
- Check the main project documentation
- Review browser console for errors
- Export data before making significant changes

---

*Migration Guide Version 1.0 | Last Updated: July 2026*