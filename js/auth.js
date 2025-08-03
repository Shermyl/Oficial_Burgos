import { supabase } from './database.js';

// Registro de nuevos clientes
export async function signUp(email, password, userData) {
    const { user, error } = await supabase.auth.signUp({
    email,
    password
    });

    if (error) throw error;

  // Guardar datos adicionales
    const { data, error: dbError } = await supabase
    .from('users')
    .insert([{
    id: user.id,
    email,
    role: 'customer',
    ...userData
    }]);

    if (dbError) throw dbError;

return user;
}

// Inicio de sesión
export async function signIn(email, password) {
const { user, error } = await supabase.auth.signIn({
    email,
    password
    });

    if (error) throw error;
    return user;
}

// Cerrar sesión
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}