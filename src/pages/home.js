import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import Header from '../components/Common/Header';
import Footer from '../components/Common/Footer';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('esta_activo', true)
      .limit(4);
    
    if (!error) setFeaturedProducts(data);
  };

  return (
    <div className="home-page">
      <Header />
      
      <section className="hero-section">
        <h1>Bienvenido a Burgos's Restaurant</h1>
        <p>La mejor experiencia gastronómica</p>
      </section>
      
      <section className="featured-products">
        <h2>Nuestros Productos Destacados</h2>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.url_imagen} alt={product.nombre} />
              <h3>{product.nombre}</h3>
              <p>S/ {product.precio.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;