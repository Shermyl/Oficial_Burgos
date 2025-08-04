import { CartProvider } from './context/CartContext';

ReactDOM.render(
    <React.StrictMode>
    <CartProvider>
        <App />
    </CartProvider>
    </React.StrictMode>,
    document.getElementById('root')
);