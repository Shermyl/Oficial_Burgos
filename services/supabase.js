// supabase.js
import { createClient } from '@supabase/supabase-js'

// 1. Credenciales (¡verifica que sean exactamente las de tu proyecto!)
const SUPABASE_URL = 'https://hplcdirshmszavpfqcyy.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwbGNkaXJzaG1zemF2cGZxY3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNTIxODksImV4cCI6MjA2OTgyODE4OX0.PPCsbjn_LO9k_wuHsn0BUQ78EMkGMdC5bGaBGdotYZM' // Clave "anon/public"

// 2. Configuración óptima para autenticación
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
    persistSession: true, // Almacena la sesión en localStorage
    autoRefreshToken: true, // Renueva tokens automáticamente
    detectSessionInUrl: false // Evita que Supabase lea tokens desde la URL
    }
})