import { init as navigationInit, updateAuthButtons } from './navigation.js';

//ejecutar esta funcion una vez cargado el DOM
document.addEventListener('DOMContentLoaded', init);

// Configuración de la API
// Si el backend está corriendo en HTTPS (puerto 7229), usa esta URL:
export const API_BASE_URL = 'https://localhost:7229/api';
// Si el backend está corriendo en HTTP (puerto 5019), usa esta URL:
// export const API_BASE_URL = 'http://localhost:5019/api';

// Función helper para hacer fetch con autenticación (opcional)
export async function fetchWithAuth(url, options = {}) {
    try {
        const { getToken } = await import('./pages/auth/auth.js');
        const token = getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return fetch(url, {
            ...options,
            headers
        });
    } catch (error) {
        // Si no hay módulo de auth, hacer fetch normal
        return fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
    }
}

async function init() {
    try {
        console.log("Inicializando main.js");
        
        // Cargar información del usuario si está autenticado (opcional)
        try {
            const { getUsuario, updateUserUI } = await import('./pages/auth/auth.js');
            const usuario = getUsuario();
            if (usuario) {
                updateUserUI(usuario);
            }
        } catch (error) {
            console.log("Módulo de autenticación no disponible:", error);
        }
        
        // Inicializar navegación (esto es crítico, debe funcionar siempre)
        navigationInit();
        
        // Actualizar botones de auth (opcional)
        try {
            await updateAuthButtons();
        } catch (error) {
            console.log("No se pudieron actualizar botones de auth:", error);
        }
    } catch (error) {
        console.error("Error crítico al inicializar la aplicación:", error);
        alert("Error al cargar la aplicación. Por favor recarga la página.");
    }
}
