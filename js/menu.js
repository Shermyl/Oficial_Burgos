document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const menuItems = document.querySelectorAll('.menu-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.querySelector('.cart-count');
    
    let cartItems = [];
    
    // Filtrar por categoría
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Añadir clase active al botón clickeado
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            
            menuItems.forEach(item => {
                const itemCategory = item.dataset.category;
                
                if (filter === 'all' || itemCategory === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Mostrar la sección correspondiente
            if (filter !== 'all') {
                document.querySelector(`#${filter}`).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Buscar platillos
    function searchItems() {
        const searchTerm = searchInput.value.toLowerCase();
        
        menuItems.forEach(item => {
            const title = item.querySelector('.menu-title').textContent.toLowerCase();
            const description = item.querySelector('.menu-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    searchButton.addEventListener('click', searchItems);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchItems();
        }
    });
    
    // Añadir al carrito
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-card');
            const itemName = menuItem.querySelector('.menu-title').textContent;
            const itemPrice = menuItem.querySelector('.menu-price').textContent;
            
            // Animación
            this.textContent = '✓ Añadido';
            this.style.backgroundColor = '#2ECC71';
            
            setTimeout(() => {
                this.textContent = '+ Añadir';
                this.style.backgroundColor = '';
            }, 1500);
            
            // Añadir al carrito
            const existingItem = cartItems.find(item => item.name === itemName);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartItems.push({
                    name: itemName,
                    price: itemPrice,
                    quantity: 1
                });
            }
            
            // Actualizar contador
            updateCartCount();
        });
    });
    
    // Actualizar contador del carrito
    function updateCartCount() {
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Animación
        cartCount.style.transform = 'scale(1.5)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 300);
    }
    
    // Carrito flotante
    const floatingCart = document.querySelector('.floating-cart');
    floatingCart.addEventListener('click', function() {
        alert(`Tienes ${cartItems.length} items en tu carrito.`); 
        // En una implementación real, mostrarías un modal con el carrito
    });
});