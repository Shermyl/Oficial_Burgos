// Configuración de Supabase
const supabaseUrl = 'https://hplcdirshmszavpfqcyy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwbGNkaXJzaG1zemF2cGZxY3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNTIxODksImV4cCI6MjA2OTgyODE4OX0.PPCsbjn_LO9k_wuHsn0BUQ78EMkGMdC5bGaBGdotYZM';

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Función para cargar los productos del menú
export async function loadMenuItems() {
    const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true);

    if (error) {
    console.error('Error loading menu items:', error);
    return [];
    }

    return data;
}

// Función para manejar pedidos
export async function placeOrder(orderData) {
const { data, error } = await supabase
    .from('orders')
    .insert([orderData]);

    if (error) {
    console.error('Error placing order:', error);
    return null;
}

    return data;
}