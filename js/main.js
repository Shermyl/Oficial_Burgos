import { getActiveMenu } from './database.js';

async function init() {
    try {
        const menu = await getActiveMenu();
        console.log('Menú cargado:', menu);
        // Aquí puedes renderizar el menú en tu página
    } catch (error) {
        console.error('Error:', error);
    }
}

init();







// Mejorado el JS del menú hamburguesa
document.addEventListener("DOMContentLoaded", () => {
    const hamMenu = document.querySelector(".ham-menu");
    const navLinks = document.querySelector(".nav-links");
    const body = document.body;

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
});






































/*
// Mantener el nav-bar fijo al hacer scroll
document.addEventListener("scroll", () => {
    const navBar = document.querySelector(".nav-bar");
    if (window.scrollY > 0) {
        navBar.style.cssText = `
            position: fixed;
            top: 0;
            z-index: 1000;
            width: 100%;
            background-color: var(--blanco);
            box-shadow: 0 0.4rem 1rem rgba(0, 0, 0, 0.1);
        `;
    } else {
        navBar.style.cssText = `
            position: relative;
            box-shadow: none;
        `;
    }
});

// Hamburger Menu Toggle
document.addEventListener("DOMContentLoaded", () => {
    const hamMenu = document.querySelector(".ham-menu");
    const navLinks = document.querySelector(".nav-links");

    hamMenu.addEventListener("click", () => {
        hamMenu.classList.toggle("active");
        navLinks.classList.toggle("active");
    });
});*/

/*// Mostrar el preloader al cargar la página (esto ya estaba asi xd)
document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.querySelector(".preloader");
    if (preloader) {
        preloader.style.display = "none"; // Ocultar el preloader
    }
});*/

// Ajustar elementos al cargar la página
/*
document.addEventListener("DOMContentLoaded", () => {
    const bubbleImg = document.querySelector(".bubble_img");
    const fondoImg = document.querySelector(".fondo_img");

    if (bubbleImg) {
        bubbleImg.style.transform = "translate(10%, -10%)";
    }

    if (fondoImg) {
        fondoImg.style.opacity = "0.9";
    }
});


//--------------------------------------->contenedor 3_biotienda
// Agregar interacción al botón "COMPRAR"
document.addEventListener("DOMContentLoaded", () => {
    const botonesComprar = document.querySelectorAll(".btn-comprar");

    botonesComprar.forEach((boton) => {
        boton.addEventListener("click", () => {
            const producto = boton.getAttribute("data-producto");
            alert(`Has añadido "${producto}" a tu carrito.`);
        });
    });
});


//--------------------------------------->contenedor 4_biotienda_galeria
// Filtros de galería
document.querySelectorAll('.galeria-filtro').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.galeria-filtro').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filtro = this.getAttribute('data-filter');
        document.querySelectorAll('.galeria-item').forEach(item => {
            if (filtro === 'todos' || item.getAttribute('data-cat') === filtro) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Modal de imagen
const modal = document.getElementById('galeriaModal');
const modalImg = document.getElementById('modalImg');
document.querySelectorAll('.galeria-item img').forEach(img => {
    img.addEventListener('click', function() {
        modal.classList.add('active');
        modalImg.src = this.src;
        modalImg.alt = this.alt;
    });
});
document.getElementById('cerrarModal').onclick = function() {
    modal.classList.remove('active');
};
modal.onclick = function(e) {
    if (e.target === modal) modal.classList.remove('active');
};


//--------------------------------------->contenedor 5_biotienda
//calendario xd 
document.addEventListener("DOMContentLoaded", () => {
    const calendarTable = document.querySelector(".calendar-table tbody");
    const monthYear = document.querySelector(".month-year");
    const prevMonth = document.querySelector(".prev-month");
    const nextMonth = document.querySelector(".next-month");

    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    let currentDate = new Date();

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        monthYear.textContent = `${months[month]} ${year}`;
        calendarTable.innerHTML = "";

        let date = 1;
        let prevDate = daysInPrevMonth - firstDay + 1;

        for (let i = 0; i < 6; i++) {
            const row = document.createElement("tr");
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement("td");

                if (i === 0 && j < firstDay) {
                    // Días del mes anterior
                    cell.textContent = prevDate++;
                    cell.classList.add("other-month");
                } else if (date > daysInMonth) {
                    // Días del mes siguiente
                    cell.textContent = date - daysInMonth;
                    cell.classList.add("other-month");
                    date++;
                } else {
                    // Días del mes actual
                    cell.textContent = date;
                    cell.addEventListener("click", () => {
                        document.querySelectorAll(".calendar-table td").forEach(td => td.classList.remove("selected"));
                        cell.classList.add("selected");
                    });
                    date++;
                }
                row.appendChild(cell);
            }
            calendarTable.appendChild(row);
        }
    }

    prevMonth.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonth.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();
});
*/
