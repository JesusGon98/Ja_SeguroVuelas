// Script principal - Inicialización de la aplicación
console.log('JA Seguro que Vuelas - Aplicación iniciada');

// Configuración de la API (cuando esté disponible)
const API_BASE_URL = 'http://localhost:5019/api';

// Función para hacer peticiones a la API
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en la petición API:', error);
        throw error;
    }
}

// Función para obtener todos los contactos
async function getContactos() {
    try {
        return await apiRequest('/contacto');
    } catch (error) {
        console.error('Error al obtener contactos:', error);
        return [];
    }
}

// Función para crear un contacto
async function createContacto(contactoData) {
    try {
        return await apiRequest('/contacto', {
            method: 'POST',
            body: JSON.stringify(contactoData)
        });
    } catch (error) {
        console.error('Error al crear contacto:', error);
        throw error;
    }
}

// Función para obtener un contacto por ID
async function getContactoById(id) {
    try {
        return await apiRequest(`/contacto/${id}`);
    } catch (error) {
        console.error('Error al obtener contacto:', error);
        throw error;
    }
}

// Función para verificar el estado de la API
async function checkApiHealth() {
    try {
        const response = await apiRequest('/health');
        return response.status === 'healthy';
    } catch (error) {
        console.warn('API no disponible:', error);
        return false;
    }
}

// Exportar funciones para uso en otros módulos
export { 
    apiRequest, 
    getContactos, 
    createContacto, 
    getContactoById, 
    checkApiHealth,
    API_BASE_URL 
};
