import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';

const ChefOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
    setupRealtime();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*, items_pedido(*, productos(*))')
      .in('estado', ['pendiente', 'en_preparacion']);
    
    if (!error) setOrders(data);
  };

  const setupRealtime = () => {
    const subscription = supabase
      .from('pedidos')
      .on('*', payload => {
        fetchOrders();
      })
      .subscribe();
    
    return () => supabase.removeSubscription(subscription);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const { error } = await supabase
      .from('pedidos')
      .update({ estado: newStatus })
      .eq('id', orderId);
    
    if (!error) fetchOrders();
  };

  return (
    <div className="chef-orders">
      <h1>Pedidos en Cocina</h1>
      
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <h3>Pedido #{order.id.slice(0, 8)}</h3>
            <p>Estado: {order.estado.replace('_', ' ')}</p>
            
            <ul>
              {order.items_pedido.map(item => (
                <li key={item.id}>
                  {item.cantidad}x {item.productos.nombre}
                  {item.notas && <span> - {item.notas}</span>}
                </li>
              ))}
            </ul>
            
            <div className="order-actions">
              {order.estado === 'pendiente' && (
                <button onClick={() => updateOrderStatus(order.id, 'en_preparacion')}>
                  Comenzar Preparación
                </button>
              )}
              
              {order.estado === 'en_preparacion' && (
                <button onClick={() => updateOrderStatus(order.id, 'listo')}>
                  Marcar como Listo
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChefOrders;