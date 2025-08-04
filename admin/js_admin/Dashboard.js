import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    reservations: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const productsCount = await supabase
      .from('productos')
      .select('*', { count: 'exact' });
    
    const ordersCount = await supabase
      .from('pedidos')
      .select('*', { count: 'exact' });
    
    const reservationsCount = await supabase
      .from('reservas')
      .select('*', { count: 'exact' });
    
    setStats({
      products: productsCount.count,
      orders: ordersCount.count,
      reservations: reservationsCount.count
    });
  };

  return (
    <div className="admin-dashboard">
      <h1>Panel de Administración</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Productos</h3>
          <p>{stats.products}</p>
        </div>
        <div className="stat-card">
          <h3>Pedidos</h3>
          <p>{stats.orders}</p>
        </div>
        <div className="stat-card">
          <h3>Reservas</h3>
          <p>{stats.reservations}</p>
        </div>
      </div>
      
      <div className="quick-actions">
        <button>Gestionar Productos</button>
        <button>Ver Pedidos</button>
        <button>Ver Reservas</button>
      </div>
    </div>
  );
};

export default AdminDashboard;