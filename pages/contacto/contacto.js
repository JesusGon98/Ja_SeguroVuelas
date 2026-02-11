import { createContacto, checkApiHealth } from '../../scripts/main.js';

// Manejar envío del formulario
document.addEventListener('DOMContentLoaded', () => {
    const contactoForm = document.getElementById('contactoForm');
    const mensajeExito = document.getElementById('mensajeExito');
    const mensajeError = document.getElementById('mensajeError');
    const errorTexto = document.getElementById('errorTexto');
    
    if (contactoForm) {
        contactoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Ocultar mensajes anteriores
            mensajeExito.style.display = 'none';
            mensajeError.style.display = 'none';
            
            // Verificar si la API está disponible
            const apiHealthy = await checkApiHealth();
            if (!apiHealthy) {
                mensajeError.style.display = 'block';
                errorTexto.textContent = 'La API no está disponible. Por favor, verifica que el servidor esté corriendo.';
                return;
            }
            
            // Obtener datos del formulario
            const formData = {
                nombre: document.getElementById('nombre').value.trim(),
                correo: document.getElementById('correo').value.trim(),
                telefono: document.getElementById('telefono').value.trim(),
                origen: document.getElementById('origen').value.trim(),
                destino: document.getElementById('destino').value.trim()
            };
            
            // Validar campos
            if (!formData.nombre || !formData.correo || !formData.telefono || !formData.origen || !formData.destino) {
                mensajeError.style.display = 'block';
                errorTexto.textContent = 'Por favor, completa todos los campos requeridos.';
                return;
            }
            
            // Validar formato de correo
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.correo)) {
                mensajeError.style.display = 'block';
                errorTexto.textContent = 'Por favor, ingresa un correo electrónico válido.';
                return;
            }
            
            try {
                // Enviar solicitud
                const resultado = await createContacto(formData);
                
                // Mostrar mensaje de éxito
                mensajeExito.style.display = 'block';
                contactoForm.reset();
                
                // Scroll al mensaje de éxito
                mensajeExito.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                console.log('Contacto creado exitosamente:', resultado);
            } catch (error) {
                console.error('Error al crear contacto:', error);
                mensajeError.style.display = 'block';
                errorTexto.textContent = 'Error al enviar la solicitud. Por favor, intenta nuevamente.';
            }
        });
    }
});
