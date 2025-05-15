
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Tus credenciales de configuración de Firebase van aquí
// Asegúrate de reemplazarlas con las de tu proyecto real
// NUNCA compartas estas credenciales en un repositorio público si contienen claves sensibles.
// Considera usar variables de entorno para esto.
const firebaseConfig = {
  apiKey: "AIzaSyDPtO6mmiYBRJE0PtrUOr-kQCzU5hHGCqc",
  authDomain: "melosa-77d77.firebaseapp.com",
  projectId: "melosa-77d77",
  storageBucket: "melosa-77d77.firebasestorage.app",
  messagingSenderId: "370872909588",
  appId: "1:370872909588:web:28ded40b8b844dac6bcc01"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

auth = getAuth(app);
db = getFirestore(app);

export { app, auth, db };
