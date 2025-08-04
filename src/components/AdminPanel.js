// src/components/AdminPanel.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

const AdminPanel = () => {
    const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) navigate('/login');
    };
    checkSession();
  }, [navigate]);

    return (
    <div className="admin-panel">
        <h1>Panel de Administración</h1>
        <button onClick={handleLogout}>Cerrar Sesión</button>
    
      {/* Contenido del panel */}
        <div className="admin-sections">
        <section>
            <h2>Gestión de Productos</h2>
          {/* Aquí iría tu formulario de productos */}
        </section>
        
        <section>
        <h2>Pedidos Recientes</h2>
          {/* Listado de pedidos */}
        </section>
        </div>
    </div>
);
};

export default AdminPanel;