document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    // Mostrar/ocultar contraseña
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });
    
    // Manejar el envío del formulario
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.querySelector('input[name="remember"]').checked;
        
        // Validación simple del lado del cliente
        if (!username || !password) {
            showError('Por favor completa todos los campos');
            return;
        }
        
        // Simulación de autenticación (en producción sería una llamada a tu API)
        authenticateUser(username, password, remember);
    });
    
    // Función de autenticación
    function authenticateUser(username, password, remember) {
        // Aquí normalmente harías una petición a tu backend
        // Esto es solo un ejemplo con credenciales hardcodeadas
        const validCredentials = {
            username: 'admin',
            password: 'admin123' // En producción NUNCA hagas esto
        };
        
        // Simular retraso de red
        setTimeout(() => {
            if (username === validCredentials.username && password === validCredentials.password) {
                // Credenciales correctas
                createSession(username, remember);
                window.location.href = 'dashboard.html';
            } else {
                // Credenciales incorrectas
                showError('Usuario o contraseña incorrectos');
            }
        }, 800);
    }
    
    // Mostrar mensaje de error
    function showError(message) {
        // Aquí podrías implementar un sistema de notificaciones más elegante
        alert(message); // Temporal - reemplazar con UI adecuada
    }
});



// auth.js - Módulo de autenticación y seguridad

class AuthService {
    constructor() {
    this.tokenKey = 'burgos_admin_token';
    this.userKey = 'burgos_admin_user';
    }

  // Verificar autenticación al cargar la página
    checkAuth() {
        const token = this.getToken();
        if (!token && !window.location.href.includes('login.html')) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
    }

  // Guardar credenciales al iniciar sesión
    login(token, userData) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(userData));
    }

  // Cerrar sesión
    logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    window.location.href = 'login.html';
    }

  // Obtener token almacenado
    getToken() {
    return localStorage.getItem(this.tokenKey);
    }

  // Obtener datos del usuario
    getUser() {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
    }

  // Verificar permisos
    hasPermission(requiredPermission) {
    const user = this.getUser();
    if (!user || !user.role) return false;
    
    const rolePermissions = {
        'admin': ['manage_all'],
        'editor': ['manage_content', 'manage_reservations'],
        'staff': ['view_reports']
    };

    return rolePermissions[user.role]?.includes('manage_all') || 
            rolePermissions[user.role]?.includes(requiredPermission);
    }
}

const authService = new AuthService();
export default authService;