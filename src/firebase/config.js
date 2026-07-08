// Firebase configuration — replace with your actual Firebase project credentials
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get, push, update, remove, onValue, query, orderByChild, equalTo } from 'firebase/database'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, sendPasswordResetEmail } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://YOUR_PROJECT.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000:web:000'
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
export const auth = getAuth(app)

// ── Database helpers ──
export const dbRef = (path) => ref(db, path)

export const dbSet = (path, data) => set(ref(db, path), data)

export const dbPush = (path, data) => {
  const newRef = push(ref(db, path))
  return set(newRef, data).then(() => newRef.key)
}

export const dbUpdate = (path, data) => update(ref(db, path), data)

export const dbRemove = (path) => remove(ref(db, path))

export const dbGet = async (path) => {
  const snapshot = await get(ref(db, path))
  return snapshot.exists() ? snapshot.val() : null
}

export const dbListen = (path, callback) => {
  const unsubscribe = onValue(ref(db, path), (snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : null)
  })
  return unsubscribe
}

export const dbQuery = (path, child, value) =>
  query(ref(db, path), orderByChild(child), equalTo(value))

// ── Auth helpers ──
export const registerUser = async (email, password, displayName) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(cred.user, { displayName })
  // Store user profile in DB
  await dbSet(`users/${cred.user.uid}`, {
    email,
    displayName,
    role: 'customer',
    createdAt: Date.now()
  })
  return cred.user
}

export const loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)

export const resetPassword = (email) =>
  sendPasswordResetEmail(auth, email)

export const logoutUser = () => signOut(auth)

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback)
