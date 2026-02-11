import { checkApiHealth } from '../../scripts/main.js';

// Verificar estado de la API
async function checkApiStatus() {
    const apiStatusElement = document.getElementById('apiStatus');
    if (apiStatusElement) {
        const isHealthy = await checkApiHealth();
        if (isHealthy) {
            apiStatusElement.innerHTML = '<span class="badge badge-success">Conectada</span>';
        } else {
            apiStatusElement.innerHTML = '<span class="badge badge-danger">Desconectada</span>';
        }
    }
}

// Guardar configuración
function saveConfig() {
    const config = {
        apiUrl: document.getElementById('apiUrl').value,
        nombreAgencia: document.getElementById('nombreAgencia').value,
        emailContacto: document.getElementById('emailContacto').value,
        telefonoContacto: document.getElementById('telefonoContacto').value
    };
    
    // Guardar en localStorage
    localStorage.setItem('appConfig', JSON.stringify(config));
    
    alert('Configuración guardada exitosamente');
}

// Restaurar valores por defecto
function resetConfig() {
    if (confirm('¿Estás seguro de que deseas restaurar los valores por defecto?')) {
        document.getElementById('apiUrl').value = 'http://localhost:5019/api';
        document.getElementById('nombreAgencia').value = 'JA Seguro que Vuelas';
        document.getElementById('emailContacto').value = 'contacto@jaseguroquevuelas.com';
        document.getElementById('telefonoContacto').value = '555-1234-5678';
        
        localStorage.removeItem('appConfig');
        alert('Valores restaurados');
    }
}

// Cargar configuración guardada
function loadConfig() {
    const savedConfig = localStorage.getItem('appConfig');
    if (savedConfig) {
        try {
            const config = JSON.parse(savedConfig);
            if (config.apiUrl) document.getElementById('apiUrl').value = config.apiUrl;
            if (config.nombreAgencia) document.getElementById('nombreAgencia').value = config.nombreAgencia;
            if (config.emailContacto) document.getElementById('emailContacto').value = config.emailContacto;
            if (config.telefonoContacto) document.getElementById('telefonoContacto').value = config.telefonoContacto;
        } catch (error) {
            console.error('Error al cargar configuración:', error);
        }
    }
}

// Actualizar última actualización
function updateLastUpdate() {
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = new Date().toLocaleString('es-ES');
    }
}

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    checkApiStatus();
    updateLastUpdate();
    
    // Verificar estado de la API cada 30 segundos
    setInterval(checkApiStatus, 30000);
});

// Exportar funciones para uso global
window.saveConfig = saveConfig;
window.resetConfig = resetConfig;
