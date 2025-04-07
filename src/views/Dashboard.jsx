import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/Dashboard.css';

const Dashboard = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Intentando obtener datos del usuario:", user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          console.log("Datos de usuario obtenidos:", userDoc.data());
          setUserData(userDoc.data());
        } else {
          console.log("No se encontraron datos del usuario en Firestore");
        }
      } catch (err) {
        console.error("Error al obtener datos del usuario:", err);
        setError("Error al cargar los datos del usuario");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user.uid]);

  const handleLogout = async () => {
    try {
      setError(null);
      console.log("Cerrando sesión...");
      await signOut(auth);
      console.log("Sesión cerrada exitosamente");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      setError("Error al cerrar sesión");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h2>Cargando información...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Panel de Control</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="user-profile">
          <h3>Información de Usuario</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>ID de Usuario:</strong> {user.uid}</p>
          
          {userData && (
            <>
              {userData.password && (
                <p><strong>Contraseña:</strong> {userData.password}</p>
              )}
              {userData.createdAt && (
                <p><strong>Cuenta creada:</strong> {userData.createdAt.toDate().toLocaleString()}</p>
              )}
              {userData.lastLogin && (
                <p><strong>Último inicio de sesión:</strong> {userData.lastLogin.toDate().toLocaleString()}</p>
              )}
            </>
          )}
        </div>
        
        <div className="actions">
          <button 
            onClick={handleLogout}
            className="logout-button"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;