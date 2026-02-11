// Script para la página de destinos
console.log('Página de destinos cargada');

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Agregar eventos a botones "Ver Vuelos"
    const verVuelosButtons = document.querySelectorAll('.btn-primary');
    verVuelosButtons.forEach(btn => {
        if (btn.textContent.includes('Ver Vuelos')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Aquí podrías redirigir a la página de vuelos con filtro
                alert('Redirigiendo a vuelos disponibles para este destino...');
            });
        }
    });
});
