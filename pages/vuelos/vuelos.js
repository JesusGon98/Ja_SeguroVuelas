// Script para la página de vuelos
console.log('Página de vuelos cargada');

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const addVueloBtn = document.getElementById('addVueloBtn');
    
    if (addVueloBtn) {
        addVueloBtn.addEventListener('click', () => {
            alert('Funcionalidad de agregar vuelo - Próximamente');
        });
    }
    
    // Agregar eventos a botones de reservar
    const reservarButtons = document.querySelectorAll('.btn-primary');
    reservarButtons.forEach(btn => {
        if (btn.textContent.includes('Reservar')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Redirigiendo a reservaciones...');
                // Aquí podrías redirigir a la página de reservaciones
            });
        }
    });
});
