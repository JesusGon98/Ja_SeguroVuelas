import { init as navigationInit } from './navigation.js';

//ejecutar esta funcion una vez cargado el DOM
document.addEventListener('DOMContentLoaded', init);

function init() {
    console.log("Inicializando main.js");
    navigationInit();
}
