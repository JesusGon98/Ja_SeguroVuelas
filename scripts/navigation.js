import { init as vuelosInit } from '../pages/vuelos/vuelos.js';
import { init as destinosInit } from '../pages/destinos/destinos.js';
import { init as reservacionesInit } from '../pages/reservaciones/reservaciones.js';
import { init as contactoInit } from '../pages/contacto/contacto.js';

//contenido inicial (página de inicio) para restaurar al hacer clic en Inicio
let initialContent = null;

export function init() {
    console.log("Inicializando navigation.js");

    let mainContent = document.getElementById('content');
    if (!mainContent) return;

    //guardamos el contenido inicial (página de inicio que ya está en el index)
    initialContent = mainContent.innerHTML;

    //navegación: botones del menú
    setNavigation();

    //delegación: botones con data-nav dentro de #content (ej. Ver vuelos, Contactar en inicio)
    mainContent.addEventListener('click', (e) => {
        let navBtn = e.target.closest('[data-nav]');
        if (navBtn) {
            e.preventDefault();
            displayContent(navBtn.dataset.nav);
        }
    });
}

function setNavigation() {
    let inicioBtn = document.getElementById('inicioBtn');
    let vuelosBtn = document.getElementById('vuelosBtn');
    let destinosBtn = document.getElementById('destinosBtn');
    let reservacionesBtn = document.getElementById('reservacionesBtn');
    let contactoBtn = document.getElementById('contactoBtn');
    let logoutBtn = document.getElementById('logoutBtn');

    if (inicioBtn) inicioBtn.addEventListener('click', () => displayContent('inicio'));
    if (vuelosBtn) vuelosBtn.addEventListener('click', () => displayContent('vuelos'));
    if (destinosBtn) destinosBtn.addEventListener('click', () => displayContent('destinos'));
    if (reservacionesBtn) reservacionesBtn.addEventListener('click', () => displayContent('reservaciones'));
    if (contactoBtn) contactoBtn.addEventListener('click', () => displayContent('contacto'));

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                alert('Sesión cerrada');
            }
        });
    }
}

async function displayContent(page) {
    let mainContent = document.getElementById('content');
    if (!mainContent) return;

    //página de inicio: solo restauramos el contenido guardado
    if (page === 'inicio') {
        mainContent.innerHTML = initialContent;
        updateActiveNav('inicio');
        window.scrollTo(0, 0);
        return;
    }

    //obtener el contenido de la página
    const response = await fetch(`pages/${page}/${page}.html`);
    if (!response.ok) {
        console.error('Error al cargar la página:', page);
        mainContent.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error al cargar la página</h3>
                <p>No se pudo cargar ${page}</p>
            </div>
        `;
        return;
    }

    const html = await response.text();
    mainContent.innerHTML = html;
    updateActiveNav(page);
    window.scrollTo(0, 0);

    //inicializamos el respectivo init de cada página
    switch (page) {
        case 'vuelos':
            vuelosInit();
            break;
        case 'destinos':
            destinosInit();
            break;
        case 'reservaciones':
            reservacionesInit();
            break;
        case 'contacto':
            contactoInit();
            break;
    }
}

function updateActiveNav(activePage) {
    let navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    let activeBtn = document.getElementById(activePage + 'Btn');
    if (activeBtn) activeBtn.classList.add('active');
}
