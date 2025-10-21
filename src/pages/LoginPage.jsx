// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Recibimos el "interruptor" onLogin desde App.jsx
const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setError(null);
    setIsLoading(true);

    try {
      // Llamamos al "interruptor" que simula la API
      const success = await onLogin(username, password);
      
      if (success) {
        // ¡Éxito! Navegamos a la pantalla de carga
        navigate('/loading');
      } else {
        // La función onLogin nos dijo que hubo un error
        setError('Credenciales incorrectas. Intenta de nuevo.');
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Ocurrió un error. Intenta más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <span className="login-logo">SIAE</span>
        <h1 className="login-title">Ingreso Al Panel General Del Sistema</h1>
        <p className="login-subtitle">Sistema Inteligente de Asistencia Estudiantil</p>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}
          
          <div className="input-group">
            <label htmlFor="username">Usuario</label>
            <input 
              type="text" 
              id="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;