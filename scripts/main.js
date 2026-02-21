import { init as navigationInit } from './navigation.js';

//ejecutar esta funcion una vez cargado el DOM
document.addEventListener('DOMContentLoaded', init);

// Configuración de la API
// Si el backend está corriendo en HTTPS (puerto 7229), usa esta URL:
export const API_BASE_URL = 'https://localhost:7229/api';
// Si el backend está corriendo en HTTP (puerto 5019), usa esta URL:
// export const API_BASE_URL = 'http://localhost:5019/api';

function init() {
    console.log("Inicializando main.js");
    navigationInit();
}
