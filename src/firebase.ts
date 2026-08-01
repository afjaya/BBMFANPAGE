import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Untuk database (Info, Video, Member, Misi)
import { getAuth } from "firebase/auth";        // Untuk sistem Login/Daftar Member

// TODO: Ganti objek di bawah ini dengan konfigurasi asli dari Firebase Console lu ya, bosku!
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor modul agar bisa dipakai di tempat lain
export const db = getFirestore(app);
export const auth = getAuth(app);