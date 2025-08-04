// Configuración de Supabase (usa solo esta)
const supabaseUrl = 'https://hplcdirshmszavpfqcyy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwbGNkaXJzaG1zemF2cGZxY3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNTIxODksImV4cCI6MjA2OTgyODE4OX0.PPCsbjn_LO9k_wuHsn0BUQ78EMkGMdC5bGaBGdotYZM';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// --------------------------
// Funciones de Autenticación
// --------------------------

/**
 * Registro de nuevos usuarios
 * @param {string} email 
 * @param {string} password 
 * @param {object} userData - Datos adicionales (nombre, teléfono, etc)
 */
export async function signUp(email, password, userData) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: userData?.name || '',
                phone: userData?.phone || ''
            }
        }
    });

    if (error) throw error;
    
    // Guardar en tabla users si es necesario
    const { error: dbError } = await supabase
        .from('users')
        .insert([{
            id: data.user.id,
            email,
            role: 'customer',
            ...userData
        }]);

    if (dbError) throw dbError;
    return data.user;
}

/**
 * Inicio de sesión
 * @param {string} email 
 * @param {string} password 
 */
export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) throw error;
    return data.user;
}

/**
 * Cerrar sesión
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

/**
 * Verificar sesión activa
 */
export async function getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
}

/**
 * Obtener usuario actual
 */
export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
}

// --------------------------
// Funciones de UI (opcional)
// --------------------------

/**
 * Configura el formulario de login
 * @param {string} formId - ID del formulario HTML
 */
export function setupLoginForm(formId = 'loginForm') {
    const form = document.getElementById(formId);
    if (!form) return;

    // Toggle password visibility
    const togglePassword = form.querySelector('.toggle-password');
    const passwordInput = form.querySelector('input[type="password"]');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            togglePassword.querySelector('i')?.classList.toggle('fa-eye-slash');
        });
    }

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = form.querySelector('input[type="email"]')?.value.trim();
        const password = form.querySelector('input[type="password"]')?.value;

        if (!email || !password) {
            alert('Por favor completa todos los campos');
            return;
        }

        try {
            await signIn(email, password);
            window.location.href = 'admin/index.html'; // Redirigir al panel
        } catch (error) {
            console.error('Login error:', error);
            alert(error.message);
        }
    });
}