import { getActiveMenu } from './database.js';

// --------------------------
// Funciones Principales
// --------------------------

/**
 * Carga y muestra el menú desde Supabase
 */
async function loadAndDisplayMenu() {
    try {
        const menu = await getActiveMenu();
        console.log('Menú cargado:', menu);
        renderMenuItems(menu);
    } catch (error) {
        console.error('Error cargando menú:', error);
        showError('Error al cargar el menú');
    }
}

/**
 * Renderiza los items del menú en el DOM
 * @param {Array} menuItems - Array de productos del menú
 */
function renderMenuItems(menuItems) {
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) return;

    menuContainer.innerHTML = menuItems.map(item => `
        <div class="menu-item">
            <img src="${item.image_url || 'img/placeholder.jpg'}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.description || ''}</p>
            <span>S/ ${item.price.toFixed(2)}</span>
            <button class="add-to-cart" data-id="${item.id}">Añadir al Carrito</button>
        </div>
    `).join('');

    // Agregar event listeners a los botones
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', addToCartHandler);
    });
}

// --------------------------
// Manejo del Carrito
// --------------------------

const cart = {
    items: [],
    addItem(item) {
        const existing = this.items.find(i => i.id === item.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.items.push({...item, quantity: 1});
        }
        this.updateCartUI();
    },
    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        
        if (cartCount) {
            cartCount.textContent = this.items.reduce((sum, item) => sum + item.quantity, 0);
        }
        
        if (cartTotal) {
            const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = total.toFixed(2);
        }
    }
};

function addToCartHandler(event) {
    const itemId = event.target.dataset.id;
    const item = getItemDetails(itemId); // Implementar según tu estructura
    if (item) {
        cart.addItem(item);
        showToast(`${item.name} añadido al carrito`);
    }
}

// --------------------------
// Menú Hamburguesa (Mobile)
// --------------------------

function setupMobileMenu() {
    const hamMenu = document.querySelector(".ham-menu");
    const navLinks = document.querySelector(".nav-links");
    const body = document.body;

    if (!hamMenu || !navLinks) return;

    hamMenu.addEventListener("click", () => {
        hamMenu.classList.toggle("active");
        navLinks.classList.toggle("active");
        body.style.overflow = navLinks.classList.contains("active") ? "hidden" : "";
    });

    // Cerrar menú al hacer clic en enlace (solo móvil)
    document.querySelectorAll(".nav-links a").forEach((link, index) => {
        link.style.setProperty("--i", index + 1);
        link.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                hamMenu.classList.remove("active");
                navLinks.classList.remove("active");
                body.style.overflow = "";
            }
        });
    });
}

// --------------------------
// Utilidades
// --------------------------

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }, 100);
}

function showError(message) {
    const errorEl = document.getElementById('error-message');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        setTimeout(() => errorEl.style.display = 'none', 5000);
    }
}

// --------------------------
// Inicialización
// --------------------------

document.addEventListener("DOMContentLoaded", () => {
    loadAndDisplayMenu();
    setupMobileMenu();
    
    // Navbar fijo al hacer scroll
    window.addEventListener('scroll', () => {
        const navBar = document.querySelector('.nav-bar');
        if (navBar) {
            navBar.classList.toggle('fixed', window.scrollY > 0);
        }
    });
});