import { API_BASE_URL } from "../../scripts/main.js";

export function init() {
    let addBtn = document.getElementById("addReservacionBtn");
    let closeBtn = document.getElementById("closeReservacionModalBtn");
    let cancelBtn = document.getElementById("cancelReservacionModalBtn");
    let form = document.getElementById("reservacionForm");
    let modal = document.getElementById("reservacionModal");

    if (addBtn) addBtn.addEventListener("click", () => openModal(true));
    if (closeBtn) closeBtn.addEventListener("click", () => openModal(false));
    if (cancelBtn) cancelBtn.addEventListener("click", () => openModal(false));
    if (form) form.addEventListener("submit", submitForm);
    if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) openModal(false); });

    displayListReservaciones();
}

let currentReservacionId = null;

function openModal(isOpen, reservacion = null) {
    let modal = document.getElementById("reservacionModal");
    if (!modal) return;
    window.scrollTo(0, 0);
    if (isOpen) {
        if (reservacion) {
            // Modo edición: llenar el formulario con los datos de la reservación
            currentReservacionId = reservacion.id;
            document.getElementById("codigoTxt").value = reservacion.codigo || "";
            document.getElementById("origenTxt").value = reservacion.origen || "";
            document.getElementById("destinoTxt").value = reservacion.destino || "";
            if (reservacion.fecha) {
                let fecha = new Date(reservacion.fecha);
                document.getElementById("fechaTxt").value = fecha.toISOString().split('T')[0];
            }
            document.getElementById("pasajerosNum").value = reservacion.pasajeros || "";
            document.getElementById("estadoSelect").value = reservacion.estado || "Pendiente";
            document.querySelector("#reservacionModal h2").textContent = "Editar reservación";
        } else {
            // Modo creación: limpiar el formulario
            currentReservacionId = null;
            document.getElementById("reservacionForm")?.reset();
            document.querySelector("#reservacionModal h2").textContent = "Formulario de reservación";
        }
        modal.classList.add("active");
    } else {
        modal.classList.remove("active");
        currentReservacionId = null;
    }
}

async function submitForm(e) {
    e.preventDefault();
    let codigo = document.getElementById("codigoTxt")?.value.trim();
    let origen = document.getElementById("origenTxt")?.value.trim();
    let destino = document.getElementById("destinoTxt")?.value.trim();
    let fecha = document.getElementById("fechaTxt")?.value;
    let pasajeros = document.getElementById("pasajerosNum")?.value;
    let estado = document.getElementById("estadoSelect")?.value;

    if (!codigo || !origen || !destino || !fecha || !pasajeros || !estado) {
        alert("Completa todos los campos obligatorios.");
        return;
    }
    let p = parseInt(pasajeros, 10);
    if (isNaN(p) || p < 1) {
        alert("Pasajeros debe ser al menos 1.");
        return;
    }

    try {
        let body = { codigo, origen, destino, fecha, pasajeros: p, estado };
        
        let url = `${API_BASE_URL}/reservacion`;
        let method = "POST";
        if (currentReservacionId) {
            url = `${API_BASE_URL}/reservacion/${currentReservacionId}`;
            method = "PUT";
        }

        let response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        if (!response.ok) throw new Error("Error al guardar la reservación");
        openModal(false);
        document.getElementById("reservacionForm").reset();
        displayListReservaciones();
    } catch (err) {
        console.error(err);
        alert("No se pudo guardar la reservación. Verifica que la API esté disponible.");
    }
}

async function deleteReservacion(id, codigo) {
    if (!confirm(`¿Estás seguro de que deseas eliminar la reservación "${codigo}"?`)) {
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/reservacion/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Error al eliminar la reservación");
        displayListReservaciones();
    } catch (err) {
        console.error(err);
        alert("No se pudo eliminar la reservación. Verifica que la API esté disponible.");
    }
}

async function displayListReservaciones() {
    let reservacionesList = document.getElementById("reservacionesList");
    if (!reservacionesList) return;

    //limpiamos el contenido de la lista
    reservacionesList.innerHTML = "";

    try {
        //obtener las reservaciones desde la API
        console.log('Intentando obtener reservaciones desde:', `${API_BASE_URL}/reservacion`);
        const response = await fetch(`${API_BASE_URL}/reservacion`);
        console.log('Respuesta recibida:', response.status, response.statusText);
        if (!response.ok) {
            throw new Error(`Error al obtener las reservaciones: ${response.status} ${response.statusText}`);
        }
        const reservaciones = await response.json();
        console.log('Reservaciones obtenidas:', reservaciones);

        // Generamos los cards en base a la lista de reservaciones
        reservaciones.forEach((reservacion) => {
        //elemento padre
        let cardDiv = document.createElement("div");
        cardDiv.className = "card card-without-img";

        //Cabecera de la card-------------------------------------------------------------------------------------------------
        let cardHeaderDiv = document.createElement("div");
        cardHeaderDiv.className = "card-header";

        //Codigo de la reservacion
        let titleH3 = document.createElement("h3");
        titleH3.innerText = reservacion.codigo;
        //Fin codigo

        //Estado de la reservacion
        let badgeSpan = document.createElement("span");
        badgeSpan.className = reservacion.estado === "Confirmada" ? "badge badge-success" : reservacion.estado === "Pendiente" ? "badge badge-warning" : "badge badge-danger";
        badgeSpan.innerText = reservacion.estado;
        //Fin estado

        cardHeaderDiv.appendChild(titleH3);
        cardHeaderDiv.appendChild(badgeSpan);
        //Fin cabecera--------------------------------------------------------------------------------------------------------

        //Generar el cuerpo de la card-------------------------------------------------------------------------------------------
        let cardBodyDiv = document.createElement("div");
        cardBodyDiv.className = "card-body";

        let fechaFormato = reservacion.fecha ? new Date(reservacion.fecha).toLocaleDateString("es-ES") : "-";

        //seccion de Origen-------------------------------------------------------------------------------------
        let origenP = document.createElement("p");
        origenP.innerHTML = "<strong>Origen:</strong> " + reservacion.origen;
        cardBodyDiv.appendChild(origenP);
        //Fin de seccion Origen

        //seccion de Destino-------------------------------------------------------------------------------------
        let destinoP = document.createElement("p");
        destinoP.innerHTML = "<strong>Destino:</strong> " + reservacion.destino;
        cardBodyDiv.appendChild(destinoP);
        //Fin de seccion Destino

        //seccion de Fecha-------------------------------------------------------------------------------------
        let fechaP = document.createElement("p");
        fechaP.innerHTML = "<strong>Fecha:</strong> " + fechaFormato;
        cardBodyDiv.appendChild(fechaP);
        //Fin de seccion Fecha

        //seccion de Pasajeros-------------------------------------------------------------------------------------
        let pasajerosP = document.createElement("p");
        pasajerosP.innerHTML = "<strong>Pasajeros:</strong> " + reservacion.pasajeros;
        cardBodyDiv.appendChild(pasajerosP);
        //Fin de seccion Pasajeros

        //Fin del cuerpo de la Card-------------------------------------------------------------------------------------------

        //Seccion de Botones------------------------------------------------------------------------------------------------
        let cardFooterDiv = document.createElement("div");
        cardFooterDiv.className = "card-footer";

        //boton editar
        let editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "btn-icon-only btn-secondary";
        editButton.title = "Editar";
        editButton.addEventListener("click", () => openModal(true, reservacion));
        let editIcon = document.createElement("i");
        editIcon.className = "fas fa-edit";
        editButton.appendChild(editIcon);

        //boton eliminar
        let deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "btn-icon-only btn-danger";
        deleteButton.title = "Eliminar";
        deleteButton.addEventListener("click", () => deleteReservacion(reservacion.id, reservacion.codigo));
        let deleteIcon = document.createElement("i");
        deleteIcon.className = "fas fa-trash";
        deleteButton.appendChild(deleteIcon);

        //insertar los botones en el contenedor de botones
        cardFooterDiv.appendChild(editButton);
        cardFooterDiv.appendChild(deleteButton);
        //Fin Seccion de Botones------------------------------------------------------------------------------------------------

        //insertamos cabecera, cuerpo y botones en la card
        cardDiv.appendChild(cardHeaderDiv);
        cardDiv.appendChild(cardBodyDiv);
        cardDiv.appendChild(cardFooterDiv);

        //Insertamos en el DOM
        reservacionesList.appendChild(cardDiv);
        });
    } catch (error) {
        console.error('Error al cargar reservaciones:', error);
        reservacionesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error al cargar las reservaciones</h3>
                <p>${error.message || 'No se pudo conectar con el servidor'}</p>
                <p style="font-size: 0.8rem; color: #666;">Verifica que el backend esté corriendo en ${API_BASE_URL}</p>
            </div>
        `;
    }
}
