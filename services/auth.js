import { supabase } from '../services/supabase.js';

export const signUp = async (email, password, userData) => {
  const { user, error } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (error) throw error;
  
  // Insertar datos adicionales en tabla usuarios
  const { data, error: dbError } = await supabase
    .from('usuarios')
    .insert([{
      id: user.id,
      correo: email,
      ...userData
    }]);
  
  if (dbError) throw dbError;
  return user;
};

export const signIn = async (email, password) => {
  const { user, error } = await supabase.auth.signIn({
    email,
    password
  });
  
  if (error) throw error;
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const user = supabase.auth.user();
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error) throw error;
  return data;
};














// Configuración de Supabase (usa solo esta)
/*-----------------PPPPPPPPPPPPPPPPconst supabaseUrl = 'https://hplcdirshmszavpfqcyy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwbGNkaXJzaG1zemF2cGZxY3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNTIxODksImV4cCI6MjA2OTgyODE4OX0.PPCsbjn_LO9k_wuHsn0BUQ78EMkGMdC5bGaBGdotYZM';
const supabaseConfig = {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        storage: localStorage
    }
};



import { supabase } from './supabase';



// Crear cliente Supabase
export const supabase = supabase.createClient(supabaseUrl, supabaseKey, supabaseConfig);

// Validación de contraseña segura
const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};
// --------------------------
// Funciones de Autenticación
// --------------------------

/**
 * Login seguro para administradores
 */
/*-------------PPPPPPPPPPPPPexport async function loginAdmin(email, password) {
try {
    // Validación básica
    if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
    }

    // Intento de login
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
      // Registrar intento fallido
        await logSecurityEvent('failed_login_attempt', `Intento fallido para ${email}`);
        throw error;
    }

    // Verificar rol de administrador
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

    if (userError || user?.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('No tienes permisos de administrador');
    }

    // Registrar login exitoso
    await logSecurityEvent('successful_login', `Login exitoso para ${email}`);

    return {
        success: true,
        user: data.user
    };

    } catch (error) {
    console.error('Error en login:', error);
    return {
        success: false,
        error: error.message || 'Error al iniciar sesión'
    };
    }
}

/**
 * Cerrar sesión con registro
 */
/*--------------PPPPPPPPexport async function logoutAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.auth.signOut();
  
  // Registrar logout
  if (user) {
    await logSecurityEvent('logout', `Usuario ${user.email} cerró sesión`);
  }
}

// ==================== FUNCIONES DE SEGURIDAD ====================

/**
 * Registrar eventos de seguridad
 */
/*-------------------PPPPPPPPPPPPPPPasync function logSecurityEvent(eventType, description) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const ip = await fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => data.ip)
      .catch(() => 'unknown');

    await supabase.from('security_logs').insert([{
      event_type: eventType,
      description: description,
      user_id: session?.user?.id,
      ip_address: ip,
      user_agent: navigator.userAgent
    }]);
  } catch (error) {
    console.error('Error registrando evento de seguridad:', error);
  }
}

// ==================== FUNCIONES DE PRODUCTOS ====================

/**
 * Obtener productos con manejo de errores
 */
/*--------------PPPPPPPPPPexport async function getProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;

  } catch (error) {
    await logSecurityEvent('database_error', 'Error al obtener productos');
    console.error('Error obteniendo productos:', error);
    return [];
  }
}

/**
 * Guardar producto con validación
 */
/*--------------PPPPPPPPPPexport async function saveProduct(productData) {
  try {
    // Validación básica
    if (!productData.name || !productData.price) {
      throw new Error('Nombre y precio son requeridos');
    }

    if (productData.id) {
      // Actualizar producto existente
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productData.id)
        .select();

      if (error) throw error;
      return data[0];

    } else {
      // Crear nuevo producto
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();

      if (error) throw error;
      return data[0];
    }

  } catch (error) {
    await logSecurityEvent('database_error', 'Error al guardar producto');
    console.error('Error guardando producto:', error);
    throw error;
  }
}





/**
 * Registro de nuevos usuarios
 * @param {string} email 
 * @param {string} password 
 * @param {object} userData - Datos adicionales (nombre, teléfono, etc)
 */
/*--------------PPPPPPPPPPexport async function signUp(email, password, userData) {
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
/*--------------PPPPPPPPPPexport async function signIn(email, password) {
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
/*--------------PPPPPPPPPPexport async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

/**
 * Verificar sesión activa
 */
/*--------------PPPPPPPPPPexport async function getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
}

/**
 * Obtener usuario actual
 */
/*--------------PPPPPPPPPPexport async function getCurrentUser() {
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
/*--------------PPPPPPPPPPexport function setupLoginForm(formId = 'loginForm') {
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
}*/