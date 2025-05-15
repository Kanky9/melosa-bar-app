
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Tus credenciales de configuración de Firebase van aquí
// Asegúrate de reemplazarlas con las de tu proyecto real
// NUNCA compartas estas credenciales en un repositorio público si contienen claves sensibles.
// Considera usar variables de entorno para esto.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Reemplaza con tu API Key
  authDomain: "YOUR_AUTH_DOMAIN", // Reemplaza con tu Auth Domain
  projectId: "YOUR_PROJECT_ID", // Reemplaza con tu Project ID
  storageBucket: "YOUR_STORAGE_BUCKET", // Reemplaza con tu Storage Bucket
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Reemplaza con tu Messaging Sender ID
  appId: "YOUR_APP_ID" // Reemplaza con tu App ID
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
