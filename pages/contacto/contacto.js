import { API_BASE_URL } from "../../scripts/main.js";

export function init() {
    let addBtn = document.getElementById("addContactoBtn");
    let closeBtn = document.getElementById("closeContactoModalBtn");
    let cancelBtn = document.getElementById("cancelContactoModalBtn");
    let form = document.getElementById("contactoForm");
    let modal = document.getElementById("contactoModal");
    let telefonoTxt = document.getElementById("telefonoTxt");

    if (addBtn) addBtn.addEventListener("click", () => openModal(true));
    if (closeBtn) closeBtn.addEventListener("click", () => openModal(false));
    if (cancelBtn) cancelBtn.addEventListener("click", () => openModal(false));
    if (form) form.addEventListener("submit", submitForm);
    if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) openModal(false); });
    if (telefonoTxt) telefonoTxt.addEventListener("input", (e) => { e.target.value = e.target.value.replace(/\D/g, ""); });

    displayListContactos();
}

let currentContactoId = null;

function openModal(isOpen, contacto = null) {
    let modal = document.getElementById("contactoModal");
    if (!modal) return;
    window.scrollTo(0, 0);
    if (isOpen) {
        if (contacto) {
            // Modo edición: llenar el formulario con los datos del contacto
            currentContactoId = contacto.id;
            document.getElementById("nombreTxt").value = contacto.nombre || "";
            document.getElementById("correoTxt").value = contacto.correo || "";
            document.getElementById("telefonoTxt").value = contacto.telefono || "";
            document.getElementById("origenTxt").value = contacto.origen || "";
            document.getElementById("destinoTxt").value = contacto.destino || "";
            document.getElementById("mensajeTxt").value = contacto.mensaje || "";
            document.querySelector("#contactoModal h2").textContent = "Editar contacto";
        } else {
            // Modo creación: limpiar el formulario
            currentContactoId = null;
            document.getElementById("contactoForm")?.reset();
            document.querySelector("#contactoModal h2").textContent = "Formulario de contacto";
        }
        modal.classList.add("active");
    } else {
        modal.classList.remove("active");
        currentContactoId = null;
    }
}

async function submitForm(e) {
    e.preventDefault();
    let nombre = document.getElementById("nombreTxt")?.value.trim();
    let correo = document.getElementById("correoTxt")?.value.trim();
    let telefono = document.getElementById("telefonoTxt")?.value.trim();
    let origen = document.getElementById("origenTxt")?.value.trim();
    let destino = document.getElementById("destinoTxt")?.value.trim();
    let mensaje = document.getElementById("mensajeTxt")?.value.trim() || "";

    if (!nombre || !correo || !telefono || !origen || !destino) {
        alert("Completa todos los campos obligatorios.");
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        alert("Correo electrónico no válido.");
        return;
    }
    if (!/^[0-9]{10}$/.test(telefono)) {
        alert("El teléfono debe tener 10 dígitos.");
        return;
    }

    try {
        let body = { nombre, correo, telefono, origen, destino, mensaje };
        
        let url = `${API_BASE_URL}/contacto`;
        let method = "POST";
        if (currentContactoId) {
            url = `${API_BASE_URL}/contacto/${currentContactoId}`;
            method = "PUT";
        }

        console.log(`Enviando ${method} a:`, url);
        console.log('Datos:', body);

        let response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        
        console.log('Respuesta recibida:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Error del servidor:', errorData);
            throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
        }
        
        openModal(false);
        document.getElementById("contactoForm").reset();
        displayListContactos();
    } catch (err) {
        console.error('Error completo:', err);
        alert(`No se pudo guardar el contacto: ${err.message}`);
    }
}

async function deleteContacto(id, nombre) {
    if (!confirm(`¿Estás seguro de que deseas eliminar el contacto "${nombre}"?`)) {
        return;
    }
    try {
        const url = `${API_BASE_URL}/contacto/${id}`;
        console.log('Eliminando contacto:', url);
        
        const response = await fetch(url, {
            method: "DELETE"
        });
        
        console.log('Respuesta recibida:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Error del servidor:', errorData);
            throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
        }
        
        displayListContactos();
    } catch (err) {
        console.error('Error completo:', err);
        alert(`No se pudo eliminar el contacto: ${err.message}`);
    }
}

async function displayListContactos() {
    let contactosList = document.getElementById("contactosList");
    if (!contactosList) return;

    //limpiamos el contenido de la lista
    contactosList.innerHTML = "";

    try {
        //obtener los contactos desde la API
        console.log('Intentando obtener contactos desde:', `${API_BASE_URL}/contacto`);
        const response = await fetch(`${API_BASE_URL}/contacto`);
        console.log('Respuesta recibida:', response.status, response.statusText);
        if (!response.ok) {
            throw new Error(`Error al obtener los contactos: ${response.status} ${response.statusText}`);
        }
        const contactos = await response.json();
        console.log('Contactos obtenidos:', contactos);

        // Generamos los cards en base a la lista de contactos
        contactos.forEach((contacto) => {
        //elemento padre
        let cardDiv = document.createElement("div");
        cardDiv.className = "card card-without-img";

        //Cabecera de la card-------------------------------------------------------------------------------------------------
        let cardHeaderDiv = document.createElement("div");
        cardHeaderDiv.className = "card-header";

        //Nombre del contacto
        let titleH3 = document.createElement("h3");
        titleH3.innerText = contacto.nombre;
        //Fin nombre del contacto

        cardHeaderDiv.appendChild(titleH3);
        //Fin cabecera--------------------------------------------------------------------------------------------------------

        //Generar el cuerpo de la card-------------------------------------------------------------------------------------------
        let cardBodyDiv = document.createElement("div");
        cardBodyDiv.className = "card-body";

        //seccion de Correo-------------------------------------------------------------------------------------
        let correoP = document.createElement("p");
        let correoIcon = document.createElement("i");
        correoIcon.className = "fas fa-envelope";
        correoP.appendChild(correoIcon);
        correoP.appendChild(document.createTextNode(" " + contacto.correo));
        cardBodyDiv.appendChild(correoP);
        //Fin de seccion Correo

        //seccion de Telefono-------------------------------------------------------------------------------------
        let telefonoP = document.createElement("p");
        let telefonoIcon = document.createElement("i");
        telefonoIcon.className = "fas fa-phone-alt";
        telefonoP.appendChild(telefonoIcon);
        telefonoP.appendChild(document.createTextNode(" " + contacto.telefono));
        cardBodyDiv.appendChild(telefonoP);
        //Fin de seccion Telefono

        //seccion de Origen-------------------------------------------------------------------------------------
        let origenP = document.createElement("p");
        origenP.innerHTML = "<strong>Origen:</strong> " + contacto.origen;
        cardBodyDiv.appendChild(origenP);
        //Fin de seccion Origen

        //seccion de Destino-------------------------------------------------------------------------------------
        let destinoP = document.createElement("p");
        destinoP.innerHTML = "<strong>Destino:</strong> " + contacto.destino;
        cardBodyDiv.appendChild(destinoP);
        //Fin de seccion Destino

        //seccion de Mensaje (opcional)-------------------------------------------------------------------------------------
        if (contacto.mensaje) {
            let mensajeP = document.createElement("p");
            mensajeP.innerHTML = "<strong>Mensaje:</strong> " + contacto.mensaje;
            cardBodyDiv.appendChild(mensajeP);
        }
        //Fin de seccion Mensaje

        //seccion de Fecha-------------------------------------------------------------------------------------
        let fechaFormato = contacto.fechaCreacion
            ? new Date(contacto.fechaCreacion).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
            : "-";
        let fechaP = document.createElement("p");
        fechaP.style.color = "#999";
        fechaP.style.fontSize = "0.85rem";
        fechaP.innerText = fechaFormato;
        cardBodyDiv.appendChild(fechaP);
        //Fin de seccion Fecha

        //Fin del cuerpo de la Card-------------------------------------------------------------------------------------------

        //Seccion de Botones------------------------------------------------------------------------------------------------
        let cardFooterDiv = document.createElement("div");
        cardFooterDiv.className = "card-footer";

        //boton editar
        let editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "btn-icon-only btn-secondary";
        editButton.title = "Editar";
        editButton.addEventListener("click", () => openModal(true, contacto));
        let editIcon = document.createElement("i");
        editIcon.className = "fas fa-edit";
        editButton.appendChild(editIcon);

        //boton eliminar
        let deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "btn-icon-only btn-danger";
        deleteButton.title = "Eliminar";
        deleteButton.addEventListener("click", () => deleteContacto(contacto.id, contacto.nombre));
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
        contactosList.appendChild(cardDiv);
        });
    } catch (error) {
        console.error('Error al cargar contactos:', error);
        contactosList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error al cargar los contactos</h3>
                <p>${error.message || 'No se pudo conectar con el servidor'}</p>
                <p style="font-size: 0.8rem; color: #666;">Verifica que el backend esté corriendo en ${API_BASE_URL}</p>
            </div>
        `;
    }
}
