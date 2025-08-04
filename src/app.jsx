import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { supabase } from './services/supabase';
import Home from './pages/home';
import Login from './components/auth/login';
import Menu from './pages/menu';
import AdminDashboard from './components/admin/js/Dashboard';
import ChefOrders from './components/chef/orders';
import NotFound from './pages/NotFound';

// Componente para rutas protegidas
const RequireAuth = ({ children, allowedRoles }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. Verificar sesión actual
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;

        if (authUser) {
          // 2. Obtener datos adicionales del usuario
          const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .select('id, correo, rol, nombre_completo')
            .eq('id', authUser.id)
            .single();

          if (userError) throw userError;

          setUser({
            ...authUser,
            rol: userData.rol,
            nombre: userData.nombre_completo,
            email: userData.correo
          });
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // 3. Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: userData } = await supabase
          .from('usuarios')
          .select('rol, nombre_completo, correo')
          .eq('id', session.user.id)
          .single();

        setUser({
          ...session.user,
          rol: userData.rol,
          nombre: userData.nombre_completo,
          email: userData.correo
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Verificando autenticación...</p>
      </div>
    );
  }

  // Redirigir si no está autenticado
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirigir si no tiene el rol adecuado
  if (!allowedRoles.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }

  // Pasar los datos del usuario como prop
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        
        {/* Rutas protegidas */}
        <Route
          path="/admin/*"
          element={
            <RequireAuth allowedRoles={['administrador']}>
              <AdminDashboard />
            </RequireAuth>
          }
        />
        
        <Route
          path="/chef/*"
          element={
            <RequireAuth allowedRoles={['administrador', 'chef']}>
              <ChefOrders />
            </RequireAuth>
          }
        />
        
        {/* Ruta para 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;