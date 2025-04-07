import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegistering) {
        console.log("Intentando registrar usuario:", email);
        // egistrar el usuario en firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log("Usuario registrado exitosamente:", user.uid);
        
        // Guardar información de usuario 
        try {
          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            password: password, 
            createdAt: new Date(),
            lastLogin: new Date()
          });
          console.log("Datos de usuario guardados en Firestore");
        } catch (firestoreError) {
          console.error("Error al guardar en Firestore:", firestoreError);
        }
      } else {
        console.log("Intentando iniciar sesión:", email);
        // para inicio de seseion
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log("Inicio de sesión exitoso:", user.uid);
        
        //fecha de inicio de sesión
        try {
          await setDoc(doc(db, "users", user.uid), {
            lastLogin: new Date()
          }, { merge: true }); 
          console.log("Fecha de último acceso actualizada");
        } catch (firestoreError) {
          console.error("Error al actualizar fecha de acceso:", firestoreError);
    
        }
      }
    } catch (err) {
      console.error("Error de autenticación:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo electrónico ya está registrado. Por favor, inicia sesión.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Correo electrónico inválido.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Correo o contraseña incorrectos.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Ingresa tu correo electrónico"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Ingresa tu contraseña"
              />
              <button 
                type="button" 
                className="toggle-password-button"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Cargando...' : isRegistering ? 'Registrar' : 'Entrar'}
          </button>
        </form>
        
        <div className="toggle-form">
          <button 
            className="toggle-button"
            onClick={() => setIsRegistering(!isRegistering)}
            disabled={loading}
          >
            {isRegistering 
              ? '¿Ya tienes cuenta? Inicia sesión' 
              : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;