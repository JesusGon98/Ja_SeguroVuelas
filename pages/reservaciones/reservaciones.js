// Script para la página de reservaciones
console.log('Página de reservaciones cargada');

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const nuevaReservacionBtn = document.getElementById('nuevaReservacionBtn');
    
    if (nuevaReservacionBtn) {
        nuevaReservacionBtn.addEventListener('click', () => {
            alert('Redirigiendo a vuelos disponibles para crear nueva reservación...');
            // Aquí podrías redirigir a la página de vuelos
        });
    }
    
    // Agregar eventos a botones de ver detalles
    const verButtons = document.querySelectorAll('.btn-secondary');
    verButtons.forEach(btn => {
        if (btn.textContent.includes('Ver')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Mostrando detalles de la reservación...');
            });
        }
    });
});
