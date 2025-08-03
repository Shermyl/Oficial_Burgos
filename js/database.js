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


/**********************
 * FUNCIONES PÚBLICAS *
 **********************/

// Obtener productos activos del menú
export async function getActiveMenu() {
    const { data, error } = await supabase
    .from('products')
    .select('id, name, description, price, category, image_url')
    .eq('is_active', true)
    .order('category')
    .order('name');

    if (error) {
    console.error('Error cargando menú:', error);
    return [];
    }

    return data;
}

// Enviar nuevo pedido
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

  return data[0]; // Devuelve el pedido creado
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
        const { data, error } = await supabase
            .from('products')
            .insert([productData])
            .select();

        return handleSaveResponse(data, error);
    }
}

// Función auxiliar para respuestas
function handleSaveResponse(data, error) {
    if (error) {
    console.error('Error guardando producto:', error);
    throw error;
    }
    return data[0];
}







//  final del database.js|||

/**
 * Obtiene los productos filtrados por categoría
 * @param {string} category - Categoría a filtrar
 */
export async function getProductsByCategory(category) {
    const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('is_active', true);

    if (error) {
    console.error(`Error cargando productos de ${category}:`, error);
    return [];
    }

    return data;
}

/**
 * Sube una imagen al almacenamiento de Supabase
 * @param {File} imageFile - Archivo de imagen
 * @param {string} path - Ruta donde guardar (ej: 'productos')
 */
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



