import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("App.jsx: Configurando listener de autenticación");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Estado de autenticación cambiado:", user ? `Usuario autenticado: ${user.email}` : "No hay usuario autenticado");
      setCurrentUser(user);
      setLoading(false);
    });

    
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f0f2f5'
      }}>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {currentUser ? <Dashboard user={currentUser} /> : <Login />}
    </div>
  );
}

export default App;