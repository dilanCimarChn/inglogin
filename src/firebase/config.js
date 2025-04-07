import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCOMxh5LFcFT4RmUi_oGhqCLN5vd1BsZd0",
  authDomain: "inglogin-abd33.firebaseapp.com",
  projectId: "inglogin-abd33",
  storageBucket: "inglogin-abd33.firebasestorage.app",
  messagingSenderId: "48897135028",
  appId: "1:48897135028:web:059ddc22ea75c3d98104b5"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { auth, db };