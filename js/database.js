// Supabase
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    'https://hplcdirshmszavpfqcyy.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwbGNkaXJzaG1zemF2cGZxY3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNTIxODksImV4cCI6MjA2OTgyODE4OX0.PPCsbjn_LO9k_wuHsn0BUQ78EMkGMdC5bGaBGdotYZM'
)


export async function placeOrder(orderData) {
  // Lógica para guardar pedidos
    const { data, error } = await supabase
    .from('pedidos')
    .insert([orderData])
    return { data, error }
}

export { supabase, placeOrder }
/**********************
 * FUNCIONES PÚBLICAS *
 **********************/

// Obtener productos activos del menú (versión mejorada)
export async function getActiveMenu(category = null) {
    let query = supabase
        .from('products')
        .select('id, name, description, price, category, image_url')
        .eq('is_active', true)
        .order('category')
        .order('name');

    if (category) {
        query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error cargando menú:', error);
        return [];
    }

    return data;
}

// Manejo de pedidos (versión unificada)
export async function createOrder(orderData) {
    const { data, error } = await supabase
        .from('orders')
        .insert([{
            customer_name: orderData.name,
            contact_phone: orderData.phone,
            delivery_address: orderData.address,
            payment_method: orderData.payment,
            items: orderData.items,
            total: orderData.total,
            status: 'pending'
        }])
        .select();

    if (error) {
        console.error('Error creando pedido:', error);
        throw error;
    }

    return data[0];
}

// Obtener detalles de un pedido
export async function getOrderDetails(orderId) {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

    if (error) {
        console.error('Error obteniendo pedido:', error);
        return null;
    }

    return data;
}

/****************************
 * FUNCIONES DE ADMINISTRADOR *
 ****************************/

// Obtener todos los productos (admin)
export async function getAllProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error cargando productos:', error);
        throw error;
    }

    return data;
}

// Crear/actualizar producto (admin)
export async function saveProduct(productData) {
    if (productData.id) {
        // Actualizar producto existente
        const { data, error } = await supabase
            .from('products')
            .update(productData)
            .eq('id', productData.id)
            .select();

        return handleSaveResponse(data, error);
    } else {
        // Crear nuevo producto
        productData.created_at = new Date().toISOString();
        const { data, error } = await supabase
            .from('products')
            .insert([productData])
            .select();

        return handleSaveResponse(data, error);
    }
}

// Subir imagen a Supabase Storage
export async function uploadImage(imageFile, path = 'productos') {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const fullPath = `${path}/${fileName}`;

    const { data, error } = await supabase.storage
        .from('images')
        .upload(fullPath, imageFile);

    if (error) {
        console.error('Error subiendo imagen:', error);
        throw error;
    }

    return supabase.storage
        .from('images')
        .getPublicUrl(data.path);
}

// Función auxiliar para respuestas
function handleSaveResponse(data, error) {
    if (error) {
        console.error('Error guardando producto:', error);
        throw error;
    }
    return data[0];
}