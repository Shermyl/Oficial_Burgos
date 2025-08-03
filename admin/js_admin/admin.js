
/*//para el login, session y admin.js
// Verificar sesión al cargar el panel
const session = checkSession();
if (!session) {
    window.location.href = 'index.html';
}

// Añadir funcionalidad de logout
document.querySelector('.logout-btn').addEventListener('click', function() {
    destroySession();
    window.location.href = 'index.html';
});
*/


// admin.js - Script principal del panel de administración

document.addEventListener('DOMContentLoaded', function() {
  // =============================================
  // ============ MÓDULO PRINCIPAL ===============
  // =============================================
  
  // Variables globales
  const adminContainer = document.querySelector('.admin-container');
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.admin-sidebar');
  const mainContent = document.querySelector('.admin-main');
  const contentSections = document.querySelectorAll('.content-section');
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  
  // Estado inicial
  let isSidebarOpen = true;
  let currentSection = 'dashboard';
  
  // =============================================
  // ========== MÓDULO DE NAVEGACIÓN =============
  // =============================================
  
  // Función para cambiar de sección
  function changeSection(sectionId) {
    // Ocultar todas las secciones
    contentSections.forEach(section => {
      section.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(`${sectionId}-content`);
    if (targetSection) {
      targetSection.classList.add('active');
      currentSection = sectionId;
      
      // Actualizar breadcrumbs
      updateBreadcrumbs(sectionId);
      
      // Actualizar navegación activa
      updateActiveNav(sectionId);
    }
  }
  
  // Actualizar breadcrumbs
  function updateBreadcrumbs(sectionId) {
    const breadcrumbs = document.querySelector('.breadcrumbs');
    const sectionNames = {
      'dashboard': 'Dashboard',
      'reservaciones': 'Reservaciones',
      'menu': 'Menú',
      'biotienda': 'Biotienda',
      'galeria': 'Galería',
      'usuarios': 'Usuarios',
      'ajustes': 'Ajustes'
    };
    
    breadcrumbs.innerHTML = `<span>${sectionNames[sectionId] || 'Dashboard'}</span>`;
  }
  
  // Actualizar navegación activa
  function updateActiveNav(sectionId) {
    navLinks.forEach(link => {
      link.parentElement.classList.remove('active');
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.parentElement.classList.add('active');
      }
    });
  }
  
  // Event listeners para navegación
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const sectionId = this.getAttribute('href').substring(1);
      changeSection(sectionId);
      
      // En móviles, cerrar el sidebar al seleccionar una opción
      if (window.innerWidth < 992) {
        toggleSidebar();
      }
    });
  });
  
  // =============================================
  // ========== MÓDULO DEL SIDEBAR ===============
  // =============================================
  
  // Función para alternar el sidebar
  function toggleSidebar() {
    isSidebarOpen = !isSidebarOpen;
    
    if (isSidebarOpen) {
      adminContainer.classList.add('sidebar-open');
      sidebar.style.transform = 'translateX(0)';
      mainContent.style.marginLeft = '28rem';
    } else {
      adminContainer.classList.remove('sidebar-open');
      sidebar.style.transform = 'translateX(-100%)';
      mainContent.style.marginLeft = '0';
    }
  }
  
  // Event listener para el botón del menú
  menuToggle.addEventListener('click', toggleSidebar);
  
  // Cerrar sesión
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      // Aquí iría la lógica de logout
      alert('Sesión cerrada correctamente');
      window.location.href = 'login.html';
    });
  }
  
  // =============================================
  // ========== MÓDULO DEL DASHBOARD =============
  // =============================================
  
  // Inicializar gráficos
  function initCharts() {
    // Gráfico de reservaciones semanales
    const reservationsCtx = document.getElementById('reservationsChart').getContext('2d');
    const reservationsChart = new Chart(reservationsCtx, {
      type: 'bar',
      data: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [{
          label: 'Reservaciones',
          data: [12, 19, 8, 15, 22, 18, 25],
          backgroundColor: 'rgba(243, 156, 18, 0.7)',
          borderColor: 'rgba(243, 156, 18, 1)',
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
    
    // Aquí podrías añadir más gráficos según sea necesario
  }
  
  // Filtrar datos del dashboard
  const chartFilter = document.querySelector('.chart-filter');
  if (chartFilter) {
    chartFilter.addEventListener('change', function() {
      // Aquí iría la lógica para actualizar los gráficos según el filtro
      console.log('Filtro seleccionado:', this.value);
    });
  }


  // =============================================
// ========== MÓDULO DE GESTIÓN DE MENÚ ========
// =============================================

function initMenuModule() {
  const addDishBtn = document.getElementById('add-dish-btn');
  const dishModal = document.getElementById('dish-modal');
  const dishForm = document.getElementById('dish-form');
  
  // Cargar datos del menú
  function loadMenuItems() {
    // Simulación de datos - en producción vendría de una API
    const menuItems = [
      {
        id: 1,
        name: "Cecina",
        category: "entradas",
        price: 10.50,
        description: "Deliciosa carne seca típica de la región",
        available: true,
        featured: false,
        image: "cecina.png"
      },
      // Más items...
    ];
    
    const tableBody = document.querySelector('#dishes-table tbody');
    tableBody.innerHTML = '';
    
    menuItems.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${translateCategory(item.category)}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>
          <label class="switch">
            <input type="checkbox" ${item.available ? 'checked' : ''} data-id="${item.id}">
            <span class="slider"></span>
          </label>
        </td>
        <td>
          <label class="switch">
            <input type="checkbox" ${item.featured ? 'checked' : ''} data-id="${item.id}">
            <span class="slider"></span>
          </label>
        </td>
        <td>
          <button class="action-btn edit" data-id="${item.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" data-id="${item.id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });
    
    // Añadir event listeners a los switches
    document.querySelectorAll('.switch input').forEach(switchEl => {
      switchEl.addEventListener('change', function() {
        const dishId = this.getAttribute('data-id');
        const action = this.parentElement.parentElement.previousElementSibling ? 'featured' : 'available';
        updateDishStatus(dishId, action, this.checked);
      });
    });
  }
  
  // Traducir categorías
  function translateCategory(category) {
    const categories = {
      'entradas': 'Entradas',
      'principales': 'Platos Principales',
      'postres': 'Postres',
      'bebidas': 'Bebidas'
    };
    return categories[category] || category;
  }
  
  // Actualizar estado del platillo
  function updateDishStatus(id, action, value) {
    console.log(`Actualizando platillo ${id}: ${action} = ${value}`);
    // Aquí iría la llamada a la API
  }
  
  // Mostrar modal para añadir/editar platillo
  function showDishModal(dishId = null) {
    const modalTitle = document.getElementById('modal-title');
    
    if (dishId) {
      modalTitle.textContent = 'Editar Platillo';
      // Aquí cargaríamos los datos del platillo
    } else {
      modalTitle.textContent = 'Nuevo Platillo';
      dishForm.reset();
      document.getElementById('image-preview').innerHTML = '';
    }
    
    dishModal.style.display = 'block';
  }
  
  // Event listeners
  addDishBtn.addEventListener('click', () => showDishModal());
  
  document.querySelectorAll('.action-btn.edit').forEach(btn => {
    btn.addEventListener('click', function() {
      const dishId = this.getAttribute('data-id');
      showDishModal(dishId);
    });
  });
  
  // Cargar datos iniciales
  loadMenuItems();
}

// =============================================
// ====== MÓDULO DE CONTROL DE RESERVACIONES ====
// =============================================

function initReservationsModule() {
  // Implementación similar para reservaciones
  // Incluiría:
  // - Carga de reservaciones
  // - Gestión del calendario
  // - Filtrado por fecha
  // - CRUD de reservaciones
}

// =============================================
// ====== MÓDULO DE ADMINISTRACIÓN DE BIOTIENDA =
// =============================================

function initBiotiendaModule() {
  // Implementación para biotienda
  // Incluiría:
  // - Gestión de productos
  // - Gestión de categorías
  // - Control de inventario
  // - Procesamiento de pedidos
}

// Inicializar módulos cuando se cargue la sección correspondiente
document.addEventListener('sectionChanged', function(e) {
  switch(e.detail.section) {
    case 'menu':
      initMenuModule();
      break;
    case 'reservaciones':
      initReservationsModule();
      break;
    case 'biotienda':
      initBiotiendaModule();
      break;
  }
});


// =============================================
// ========== MÓDULO DE GESTIÓN DE GALERÍA =====
// =============================================

function initGalleryModule() {
  const addImageBtn = document.getElementById('add-image-btn');
  const createAlbumBtn = document.getElementById('create-album-btn');
  const imageModal = document.getElementById('image-modal');
  const albumModal = document.getElementById('album-modal');
  
  // Cargar imágenes de la galería
  function loadGalleryImages() {
    // Simulación de datos - en producción vendría de una API
    const galleryImages = [
      {
        id: 1,
        title: "Plato especial",
        album: "food",
        date: "15 Jun 2023",
        url: "../Img/gallery/food1.jpg"
      },
      // Más imágenes...
    ];
    
    const imagesGrid = document.getElementById('images-grid');
    imagesGrid.innerHTML = '';
    
    galleryImages.forEach(image => {
      const imageItem = document.createElement('div');
      imageItem.className = 'image-item';
      imageItem.innerHTML = `
        <div class="image-wrapper">
          <img src="${image.url}" alt="${image.title}">
          <div class="image-actions">
            <button class="action-btn edit" data-id="${image.id}"><i class="fas fa-edit"></i></button>
            <button class="action-btn delete" data-id="${image.id}"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        <div class="image-info">
          <h4>${image.title}</h4>
          <p>Álbum: ${translateAlbum(image.album)}</p>
          <span class="image-date">${image.date}</span>
        </div>
      `;
      imagesGrid.appendChild(imageItem);
    });
    
    // Añadir event listeners a los botones
    document.querySelectorAll('.image-actions .edit').forEach(btn => {
      btn.addEventListener('click', function() {
        const imageId = this.getAttribute('data-id');
        editImage(imageId);
      });
    });
    
    document.querySelectorAll('.image-actions .delete').forEach(btn => {
      btn.addEventListener('click', function() {
        const imageId = this.getAttribute('data-id');
        deleteImage(imageId);
      });
    });
  }
  
  // Traducir nombres de álbumes
  function translateAlbum(album) {
    const albums = {
      'food': 'Comida',
      'restaurant': 'Restaurante',
      'events': 'Eventos'
    };
    return albums[album] || album;
  }
  
  // Mostrar modal para añadir/editar imagen
  function showImageModal(imageId = null) {
    const modalTitle = document.getElementById('image-modal-title');
    
    if (imageId) {
      modalTitle.textContent = 'Editar Imagen';
      // Aquí cargaríamos los datos de la imagen
    } else {
      modalTitle.textContent = 'Añadir Nueva Imagen';
      document.getElementById('image-form').reset();
      document.getElementById('gallery-image-preview').innerHTML = '';
    }
    
    imageModal.style.display = 'block';
  }
  
  // Mostrar modal para crear álbum
  function showAlbumModal() {
    document.getElementById('album-form').reset();
    document.getElementById('album-cover-preview').innerHTML = '';
    albumModal.style.display = 'block';
  }
  
  // Editar imagen
  function editImage(id) {
    console.log('Editando imagen:', id);
    showImageModal(id);
  }
  
  // Eliminar imagen
  function deleteImage(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
      console.log('Eliminando imagen:', id);
      // Aquí iría la llamada a la API
    }
  }
  
  // Event listeners
  addImageBtn.addEventListener('click', () => showImageModal());
  createAlbumBtn.addEventListener('click', showAlbumModal);
  
  // Cerrar modales al hacer clic en el botón de cerrar
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', function() {
      this.closest('.modal').style.display = 'none';
    });
  });
  
  // Cargar datos iniciales
  loadGalleryImages();
}

// =============================================
// ========== MÓDULO DE GESTIÓN DE USUARIOS ====
// =============================================

function initUsersModule() {
  const addUserBtn = document.getElementById('add-user-btn');
  const userModal = document.getElementById('user-modal');
  const userForm = document.getElementById('user-form');
  
  // Cargar usuarios
  function loadUsers() {
    // Simulación de datos - en producción vendría de una API
    const users = [
      {
        id: 1,
        name: "Admin Burgos's",
        email: "admin@burgos.com",
        role: "admin",
        lastLogin: "Hoy, 10:45 AM",
        status: "active",
        avatar: "../Img/avatar-admin.jpg"
      },
      // Más usuarios...
    ];
    
    const tableBody = document.querySelector('#users-table tbody');
    tableBody.innerHTML = '';
    
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <div class="user-cell">
            <img src="${user.avatar}" alt="${user.name}" class="user-avatar">
            <span>${user.name}</span>
          </div>
        </td>
        <td>${user.email}</td>
        <td><span class="role-badge ${user.role}">${translateRole(user.role)}</span></td>
        <td>${user.lastLogin}</td>
        <td><span class="status-badge ${user.status}">${user.status === 'active' ? 'Activo' : 'Inactivo'}</span></td>
        <td>
          <button class="action-btn edit" data-id="${user.id}"><i class="fas fa-edit"></i></button>
          <button class="action-btn delete" data-id="${user.id}"><i class="fas fa-trash"></i></button>
        </td>
      `;
      tableBody.appendChild(row);
    });
    
    // Añadir event listeners a los botones
    document.querySelectorAll('.action-btn.edit').forEach(btn => {
      btn.addEventListener('click', function() {
        const userId = this.getAttribute('data-id');
        editUser(userId);
      });
    });
    
    document.querySelectorAll('.action-btn.delete').forEach(btn => {
      btn.addEventListener('click', function() {
        const userId = this.getAttribute('data-id');
        deleteUser(userId);
      });
    });
  }
  
  // Traducir roles
  function translateRole(role) {
    const roles = {
      'admin': 'Administrador',
      'editor': 'Editor',
      'staff': 'Personal'
    };
    return roles[role] || role;
  }
  
  // Mostrar modal para añadir/editar usuario
  function showUserModal(userId = null) {
    const modalTitle = document.getElementById('user-modal-title');
    
    if (userId) {
      modalTitle.textContent = 'Editar Usuario';
      // Aquí cargaríamos los datos del usuario
    } else {
      modalTitle.textContent = 'Nuevo Usuario';
      userForm.reset();
      document.getElementById('user-avatar-preview').innerHTML = '';
    }
    
    userModal.style.display = 'block';
  }
  
  // Editar usuario
  function editUser(id) {
    console.log('Editando usuario:', id);
    showUserModal(id);
  }
  
  // Eliminar usuario
  function deleteUser(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      console.log('Eliminando usuario:', id);
      // Aquí iría la llamada a la API
    }
  }
  
  // Event listeners
  addUserBtn.addEventListener('click', () => showUserModal());
  
  // Cargar datos iniciales
  loadUsers();
}

// =============================================
// ========== MÓDULO DE CONFIGURACIÓN ==========
// =============================================

function initSettingsModule() {
  const saveSettingsBtn = document.getElementById('save-settings');
  const settingsTabs = document.querySelectorAll('.settings-tabs .tab-btn');
  
  // Cambiar entre pestañas de configuración
  settingsTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // Desactivar todas las pestañas
      settingsTabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      // Activar la pestaña seleccionada
      this.classList.add('active');
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });
  
  // Guardar configuración
  saveSettingsBtn.addEventListener('click', function() {
    // Aquí iría la lógica para guardar todos los ajustes
    alert('Configuración guardada correctamente');
  });
  
  // Añadir franja horaria
  document.getElementById('add-time-slot')?.addEventListener('click', function() {
    const timeSlots = document.querySelector('.time-slots');
    const newSlot = document.createElement('div');
    newSlot.className = 'time-slot';
    newSlot.innerHTML = `
      <input type="time" value="12:00">
      <span>a</span>
      <input type="time" value="15:00">
      <button class="btn btn-danger btn-sm remove-slot"><i class="fas fa-times"></i></button>
    `;
    timeSlots.insertBefore(newSlot, this);
    
    // Añadir event listener al botón de eliminar
    newSlot.querySelector('.remove-slot').addEventListener('click', function() {
      this.parentElement.remove();
    });
  });
  
  // Eliminar logo
  document.getElementById('remove-logo')?.addEventListener('click', function() {
    document.getElementById('current-logo').src = '';
  });
}

// Actualizar el event listener para inicializar los módulos
document.addEventListener('sectionChanged', function(e) {
  switch(e.detail.section) {
    case 'menu':
      initMenuModule();
      break;
    case 'reservaciones':
      initReservationsModule();
      break;
    case 'biotienda':
      initBiotiendaModule();
      break;
    case 'galeria':
      initGalleryModule();
      break;
    case 'usuarios':
      initUsersModule();
      break;
    case 'ajustes':
      initSettingsModule();
      break;
  }
});















  
  // =============================================
  // ======== MÓDULO DE TABLAS Y DATOS ===========
  // =============================================
  
  // Función para cargar datos de reservaciones
  function loadReservations() {
    // En una implementación real, esto vendría de una API
    const reservationsData = [
      { id: 10025, cliente: 'Juan Pérez', fecha: '15/06/2023', hora: '19:30', personas: 4, estado: 'confirmed' },
      { id: 10024, cliente: 'María García', fecha: '15/06/2023', hora: '20:00', personas: 2, estado: 'confirmed' },
      { id: 10023, cliente: 'Carlos López', fecha: '16/06/2023', hora: '14:00', personas: 6, estado: 'pending' },
      { id: 10022, cliente: 'Ana Martínez', fecha: '16/06/2023', hora: '21:00', personas: 3, estado: 'cancelled' },
      { id: 10021, cliente: 'Luisa Fernández', fecha: '17/06/2023', hora: '13:30', personas: 5, estado: 'confirmed' }
    ];
    
    const tableBody = document.querySelector('.data-table tbody');
    tableBody.innerHTML = '';
    
    reservationsData.forEach(reservation => {
      const row = document.createElement('tr');
      
      // Mapear estados a clases CSS
      const statusClass = {
        'confirmed': 'confirmed',
        'pending': 'pending',
        'cancelled': 'cancelled'
      }[reservation.estado] || '';
      
      const statusText = {
        'confirmed': 'Confirmada',
        'pending': 'Pendiente',
        'cancelled': 'Cancelada'
      }[reservation.estado] || reservation.estado;
      
      row.innerHTML = `
        <td>#${reservation.id}</td>
        <td>${reservation.cliente}</td>
        <td>${reservation.fecha}</td>
        <td>${reservation.hora}</td>
        <td>${reservation.personas}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>
          <button class="action-btn view" data-id="${reservation.id}">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn edit" data-id="${reservation.id}">
            <i class="fas fa-edit"></i>
          </button>
        </td>
      `;
      
      tableBody.appendChild(row);
    });
    
    // Añadir event listeners a los botones de acción
    document.querySelectorAll('.action-btn.view').forEach(btn => {
      btn.addEventListener('click', function() {
        const reservationId = this.getAttribute('data-id');
        viewReservation(reservationId);
      });
    });
    
    document.querySelectorAll('.action-btn.edit').forEach(btn => {
      btn.addEventListener('click', function() {
        const reservationId = this.getAttribute('data-id');
        editReservation(reservationId);
      });
    });
  }
  
  // Función para ver detalles de reservación
  function viewReservation(id) {
    // Aquí iría la lógica para mostrar los detalles
    console.log('Viendo reservación:', id);
    alert(`Mostrando detalles de la reservación #${id}`);
  }
  
  // Función para editar reservación
  function editReservation(id) {
    // Aquí iría la lógica para editar
    console.log('Editando reservación:', id);
    alert(`Editando reservación #${id}`);
  }
  
  // =============================================
  // ============ MÓDULO DE NOTIFICACIONES =======
  // =============================================
  
  // Función para mostrar notificaciones
  function setupNotifications() {
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
      notificationBtn.addEventListener('click', function() {
        // Aquí iría la lógica para mostrar un dropdown de notificaciones
        alert('Mostrando notificaciones');
      });
    }
  }
  
  // =============================================
  // ============ MÓDULO DE PERFIL ===============
  // =============================================
  
  // Función para manejar el dropdown del perfil
  function setupProfileDropdown() {
    const profile = document.querySelector('.user-profile');
    if (profile) {
        profile.addEventListener('click', function() {
        // Aquí iría la lógica para mostrar un dropdown del perfil
        alert('Mostrando opciones de perfil');
        });
    }
    }

  // =============================================
  // ============ INICIALIZACIÓN =================
  // =============================================

  // Inicializar módulos
    function init() {
    // Cargar la sección por defecto (dashboard)
    changeSection(currentSection);
    
    // Inicializar gráficos
    initCharts();
    
    // Cargar datos de reservaciones
    loadReservations();
    
    // Configurar notificaciones
    setupNotifications();
    
    // Configurar perfil de usuario
    setupProfileDropdown();
    
    // Manejar responsive
    handleResponsive();
    }

  // Manejar cambios de tamaño de pantalla
    function handleResponsive() {
    if (window.innerWidth < 992) {
        isSidebarOpen = false;
        adminContainer.classList.remove('sidebar-open');
        sidebar.style.transform = 'translateX(-100%)';
        mainContent.style.marginLeft = '0';
    } else {
        isSidebarOpen = true;
        adminContainer.classList.add('sidebar-open');
        sidebar.style.transform = 'translateX(0)';
        mainContent.style.marginLeft = '28rem';
    }
    }

  // Event listener para cambios de tamaño
    window.addEventListener('resize', handleResponsive);

  // Iniciar la aplicación
    init();
});



















///pruebaaaaaaaaaaaaaaaaaaaaaaaaaaa
