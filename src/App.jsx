// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Importamos componentes de Layout y Auth
import MainLayout from './components/Layout/MainLayout.jsx';
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx';

// Importamos las Páginas
import LoginPage from './pages/LoginPage.jsx';
import LoadingPage from './pages/LoadingPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AlertasPage from './pages/AlertasPage.jsx';
import GestionUsuariosPage from './pages/GestionUsuariosPage.jsx';
// --- AÑADIDA LA IMPORTACIÓN QUE FALTABA ---
import GestionEstudiantesPage from './pages/GestionEstudiantesPage.jsx';
// ---------------------------------------

// Importamos nuestro CSS
import './Dashboard.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // --- Definición de handleLogout ---
    // (Necesaria para pasarla a MainLayout)
    const handleLogout = () => {
        console.log('Cerrando sesión...');
        setIsLoggedIn(false);
        // localStorage.removeItem('token'); // Si usaras tokens
    };
    // ---------------------------------

    const handleLogin = async (username, password) => {
        console.log(`API Call: Intentando loguear con ${username} / ${password}`);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // --- MOCK LOGIN ---
        if (username === 'director' && password === '123') {
            setIsLoggedIn(true);
            return true;
        } else {
            return false;
        }
    };

    return (
        <div className="app-container">
            <Routes>
                {/* Ruta 1: Login (Pública) */}
                <Route
                    path="/login"
                    element={<LoginPage onLogin={handleLogin} />}
                />

                {/* Ruta 2: Carga (Pública) */}
                <Route path="/loading" element={<LoadingPage />} />

                {/* Ruta 3: Rutas Protegidas (Privadas) */}
                <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
                    {/* Pasamos onLogout a MainLayout */}
                    <Route element={<MainLayout onLogout={handleLogout} />}>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/alertas" element={<AlertasPage />} />
                        <Route path="/usuarios" element={<GestionUsuariosPage />} />
                        {/* Ruta actualizada para usar el componente importado */}
                        <Route path="/estudiantes" element={<GestionEstudiantesPage />} />
                    </Route>
                </Route>

                {/* Ruta 4: Redirección por defecto */}
                <Route path="*" element={<Navigate to={isLoggedIn ? '/' : '/login'} replace />} />

            </Routes>
        </div>
    );
}

export default App;