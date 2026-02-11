import { getContactos, checkApiHealth } from '../../scripts/main.js';

// Cargar datos del dashboard
async function loadDashboardData() {
    // Verificar estado de la API
    const apiHealthy = await checkApiHealth();
    if (!apiHealthy) {
        document.getElementById('contactosTableBody').innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px;">
                    <div class="empty-state" style="padding: 0;">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>API no disponible. Verifica que el servidor esté corriendo.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // Cargar contactos
    try {
        const contactos = await getContactos();
        document.getElementById('totalContactos').textContent = contactos.length;
        
        const tbody = document.getElementById('contactosTableBody');
        
        if (contactos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px;">
                        <div class="empty-state" style="padding: 0;">
                            <i class="fas fa-inbox"></i>
                            <p>No hay contactos registrados</p>
                        </div>
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = contactos.slice(0, 10).map(contacto => `
                <tr>
                    <td>${contacto.nombre || 'N/A'}</td>
                    <td>${contacto.correo || 'N/A'}</td>
                    <td>${contacto.telefono || 'N/A'}</td>
                    <td>${contacto.origen || 'N/A'}</td>
                    <td>${contacto.destino || 'N/A'}</td>
                    <td>${new Date(contacto.fechaCreacion).toLocaleDateString('es-ES')}</td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error al cargar contactos:', error);
        document.getElementById('contactosTableBody').innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px;">
                    <div class="empty-state" style="padding: 0;">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Error al cargar los contactos</p>
                    </div>
                </td>
            </tr>
        `;
    }
}

// Cargar datos cuando se carga la página
loadDashboardData();
