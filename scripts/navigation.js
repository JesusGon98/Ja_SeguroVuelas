import { init as vuelosInit } from '../pages/vuelos/vuelos.js';
import { init as destinosInit } from '../pages/destinos/destinos.js';
import { init as reservacionesInit } from '../pages/reservaciones/reservaciones.js';
import { init as contactoInit } from '../pages/contacto/contacto.js';

//contenido inicial (página de inicio) para restaurar al hacer clic en Inicio
let initialContent = null;

export function init() {
    try {
        console.log("Inicializando navigation.js");

        let mainContent = document.getElementById('content');
        if (!mainContent) {
            console.error("No se encontró el elemento #content");
            return;
        }

        //guardamos el contenido inicial (página de inicio que ya está en el index)
        initialContent = mainContent.innerHTML;

        //navegación: botones del menú (SIEMPRE configurar primero)
        setNavigation();

        //delegación: botones con data-nav dentro de #content (ej. Ver vuelos, Contactar en inicio)
        mainContent.addEventListener('click', (e) => {
            let navBtn = e.target.closest('[data-nav]');
            if (navBtn) {
                e.preventDefault();
                displayContent(navBtn.dataset.nav);
            }
        });

        // Verificar si hay hash en la URL para cargar página específica (después de configurar navegación)
        const hash = window.location.hash.replace('#', '');
        if (hash && hash !== 'inicio') {
            displayContent(hash);
        }
    } catch (error) {
        console.error("Error al inicializar navegación:", error);
    }
}

function setNavigation() {
    try {
        let inicioBtn = document.getElementById('inicioBtn');
        let vuelosBtn = document.getElementById('vuelosBtn');
        let destinosBtn = document.getElementById('destinosBtn');
        let reservacionesBtn = document.getElementById('reservacionesBtn');
        let contactoBtn = document.getElementById('contactoBtn');
        let logoutBtn = document.getElementById('logoutBtn');
        let loginBtn = document.getElementById('loginBtn');

        if (inicioBtn) inicioBtn.addEventListener('click', () => displayContent('inicio'));
        if (vuelosBtn) vuelosBtn.addEventListener('click', () => displayContent('vuelos'));
        if (destinosBtn) destinosBtn.addEventListener('click', () => displayContent('destinos'));
        if (reservacionesBtn) reservacionesBtn.addEventListener('click', () => displayContent('reservaciones'));
        if (contactoBtn) contactoBtn.addEventListener('click', () => displayContent('contacto'));

        if (loginBtn) {
            loginBtn.addEventListener('click', () => displayContent('login'));
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                    try {
                        const { logout } = await import('../pages/auth/auth.js');
                        await logout();
                    } catch (error) {
                        console.error("Error al cerrar sesión:", error);
                    }
                }
            });
        }
        
        // Actualizar visibilidad de botones según autenticación (no bloqueante)
        updateAuthButtons().catch(err => console.log("Error al actualizar botones:", err));
    } catch (error) {
        console.error("Error al configurar navegación:", error);
    }
}

export async function updateAuthButtons() {
    try {
        const { getUsuario } = await import('../pages/auth/auth.js');
        const usuario = getUsuario();
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (usuario) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'block';
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    } catch (error) {
        // Si no hay módulo de auth, mostrar botón de login
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        if (loginBtn) loginBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
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

    // Manejar páginas de autenticación
    if (page === 'login' || page === 'register' || page.startsWith('auth/')) {
        const authPage = page === 'login' || page === 'auth/login' ? 'login' : 'register';
        const response = await fetch(`pages/auth/${authPage}.html`);
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
        updateActiveNav('inicio'); // No hay nav activo para auth
        window.scrollTo(0, 0);
        
        // Inicializar auth de forma opcional
        try {
            const { init: authInit } = await import('../pages/auth/auth.js');
            authInit();
        } catch (error) {
            console.error("Error al inicializar auth:", error);
        }
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
