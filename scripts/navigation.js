// Navegación entre páginas
const content = document.getElementById('content');

// Rutas de las páginas
const routes = {
    dashboard: 'pages/dashboard/dashboard.html',
    vuelos: 'pages/vuelos/vuelos.html',
    destinos: 'pages/destinos/destinos.html',
    reservaciones: 'pages/reservaciones/reservaciones.html',
    contacto: 'pages/contacto/contacto.html',
    configuraciones: 'pages/configuraciones/configuraciones.html'
};

// Cargar página
async function loadPage(page) {
    try {
        const response = await fetch(routes[page]);
        if (!response.ok) {
            throw new Error(`Error al cargar la página: ${page}`);
        }
        const html = await response.text();
        content.innerHTML = html;
        
        // Cargar el script correspondiente si existe
        const scriptPath = routes[page].replace('.html', '.js');
        await loadScript(scriptPath);
        
        // Actualizar estado activo en navegación
        updateActiveNav(page);
        
        // Scroll al inicio
        window.scrollTo(0, 0);
    } catch (error) {
        console.error('Error:', error);
        content.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error al cargar la página</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Cargar script de la página
async function loadScript(scriptPath) {
    try {
        // Remover scripts anteriores
        const existingScripts = document.querySelectorAll('script[data-page-script]');
        existingScripts.forEach(script => script.remove());
        
        // Verificar si el archivo existe
        const response = await fetch(scriptPath);
        if (response.ok) {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = scriptPath;
            script.setAttribute('data-page-script', 'true');
            document.body.appendChild(script);
        }
    } catch (error) {
        console.warn(`No se pudo cargar el script: ${scriptPath}`, error);
    }
}

// Actualizar estado activo en navegación
function updateActiveNav(activePage) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const activeBtn = document.getElementById(`${activePage}Btn`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Event listeners para navegación
document.addEventListener('DOMContentLoaded', () => {
    // Botones de navegación
    const dashboardBtn = document.getElementById('dashboardBtn');
    const vuelosBtn = document.getElementById('vuelosBtn');
    const destinosBtn = document.getElementById('destinosBtn');
    const reservacionesBtn = document.getElementById('reservacionesBtn');
    const contactoBtn = document.getElementById('contactoBtn');
    const configurationsBtn = document.getElementById('configurationsBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Asignar eventos
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', () => loadPage('dashboard'));
    }
    
    if (vuelosBtn) {
        vuelosBtn.addEventListener('click', () => loadPage('vuelos'));
    }
    
    if (destinosBtn) {
        destinosBtn.addEventListener('click', () => loadPage('destinos'));
    }
    
    if (reservacionesBtn) {
        reservacionesBtn.addEventListener('click', () => loadPage('reservaciones'));
    }
    
    if (contactoBtn) {
        contactoBtn.addEventListener('click', () => loadPage('contacto'));
    }
    
    if (configurationsBtn) {
        configurationsBtn.addEventListener('click', () => loadPage('configuraciones'));
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                alert('Sesión cerrada');
                // Aquí puedes agregar lógica de logout
            }
        });
    }
    
    // Cargar dashboard por defecto
    loadPage('dashboard');
});

// Exportar funciones para uso en otros módulos
export { loadPage, updateActiveNav };
