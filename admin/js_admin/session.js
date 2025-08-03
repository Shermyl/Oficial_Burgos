// Manejo de sesiones del usuario
function createSession(username, remember) {
    const sessionData = {
        username: username,
        token: generateToken(), // En producción usa un JWT real
        expires: remember ? 
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : // 30 días
            new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 horas
    };
    
    localStorage.setItem('adminSession', JSON.stringify(sessionData));
    document.cookie = `adminToken=${sessionData.token}; expires=${sessionData.expires.toUTCString()}; path=/admin; Secure; SameSite=Strict`;
}

function generateToken() {
    // En producción usa un sistema real de generación de tokens (JWT)
    return 'simulated-token-' + Math.random().toString(36).substr(2, 16);
}

function checkSession() {
    const sessionData = JSON.parse(localStorage.getItem('adminSession'));
    
    if (!sessionData || new Date(sessionData.expires) < new Date()) {
        return null;
    }
    
    return sessionData;
}

function destroySession() {
    localStorage.removeItem('adminSession');
    document.cookie = 'adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/admin;';
}

// Proteger rutas - añadir al inicio de admin.js
function protectAdminRoutes() {
    const currentPath = window.location.pathname;
    
    // Si está en una ruta de admin y no tiene sesión, redirigir a login
    if (currentPath.includes('/admin/') && !currentPath.endsWith('index.html')) {
        const session = checkSession();
        
        if (!session) {
            window.location.href = 'index.html';
        }
    }
}

// Llamar al cargar el admin.js
protectAdminRoutes();