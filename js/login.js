// Configuración de Supabase
const supabaseUrl = 'https://hplcdirshmszavpfqcyy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwbGNkaXJzaG1zemF2cGZxY3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNTIxODksImV4cCI6MjA2OTgyODE4OX0.PPCsbjn_LO9k_wuHsn0BUQ78EMkGMdC5bGaBGdotYZM';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageEl = document.getElementById('login-message');
    
    messageEl.style.display = 'none';
    
    try {
        const { user, error } = await supabase.auth.signIn({
            email,
            password
        });
        
        if (error) throw error;
        
        // Verificar si es admin
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
            
        if (userError || userData.role !== 'admin') {
            await supabase.auth.signOut();
            throw new Error('Acceso solo para administradores');
        }
        
        // Redireccionar al panel de admin
        window.location.href = 'admin/index.html';
        
    } catch (error) {
        messageEl.textContent = error.message;
        messageEl.className = 'message error';
        messageEl.style.display = 'block';
    }
});