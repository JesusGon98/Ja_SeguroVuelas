import { API_BASE_URL } from "../../scripts/main.js";

export function init() {
    let addBtn = document.getElementById("addVueloBtn");
    let closeBtn = document.getElementById("closeVueloModalBtn");
    let cancelBtn = document.getElementById("cancelVueloModalBtn");
    let form = document.getElementById("vueloForm");
    let modal = document.getElementById("vueloModal");

    if (addBtn) addBtn.addEventListener("click", () => openModal(true));
    if (closeBtn) closeBtn.addEventListener("click", () => openModal(false));
    if (cancelBtn) cancelBtn.addEventListener("click", () => openModal(false));
    if (form) form.addEventListener("submit", submitForm);
    if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) openModal(false); });

    displayListVuelos();
}

let currentVueloId = null;

function openModal(isOpen, vuelo = null) {
    let modal = document.getElementById("vueloModal");
    if (!modal) return;
    window.scrollTo(0, 0);
    if (isOpen) {
        if (vuelo) {
            // Modo edición: llenar el formulario con los datos del vuelo
            currentVueloId = vuelo.id;
            document.getElementById("origenTxt").value = vuelo.origen || "";
            document.getElementById("destinoTxt").value = vuelo.destino || "";
            if (vuelo.fecha) {
                let fecha = new Date(vuelo.fecha);
                document.getElementById("fechaTxt").value = fecha.toISOString().split('T')[0];
            }
            document.getElementById("horaTxt").value = vuelo.hora || "";
            document.getElementById("aerolineaTxt").value = vuelo.aerolinea || "";
            document.getElementById("precioNum").value = vuelo.precio || "";
            document.getElementById("estadoSelect").value = vuelo.estado || "Disponible";
            document.getElementById("imagenTxt").value = vuelo.imagen || "";
            document.querySelector("#vueloModal h2").textContent = "Editar vuelo";
        } else {
            // Modo creación: limpiar el formulario
            currentVueloId = null;
            document.getElementById("vueloForm")?.reset();
            document.querySelector("#vueloModal h2").textContent = "Formulario de vuelo";
        }
        modal.classList.add("active");
    } else {
        modal.classList.remove("active");
        currentVueloId = null;
    }
}

async function submitForm(e) {
    e.preventDefault();
    let origen = document.getElementById("origenTxt")?.value.trim();
    let destino = document.getElementById("destinoTxt")?.value.trim();
    let fecha = document.getElementById("fechaTxt")?.value;
    let hora = document.getElementById("horaTxt")?.value;
    let aerolinea = document.getElementById("aerolineaTxt")?.value.trim();
    let precio = document.getElementById("precioNum")?.value;
    let estado = document.getElementById("estadoSelect")?.value;
    let imagen = document.getElementById("imagenTxt")?.value.trim() || null;

    if (!origen || !destino || !fecha || !hora || !aerolinea || !precio || !estado) {
        alert("Completa todos los campos obligatorios.");
        return;
    }

    try {
        let body = { origen, destino, fecha, hora, aerolinea, precio: parseFloat(precio), estado };
        if (imagen) body.imagen = imagen;

        let url = `${API_BASE_URL}/vuelo`;
        let method = "POST";
        if (currentVueloId) {
            url = `${API_BASE_URL}/vuelo/${currentVueloId}`;
            method = "PUT";
        }

        let response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        if (!response.ok) throw new Error("Error al guardar el vuelo");
        openModal(false);
        document.getElementById("vueloForm").reset();
        displayListVuelos();
    } catch (err) {
        console.error(err);
        alert("No se pudo guardar el vuelo. Verifica que la API esté disponible.");
    }
}

async function deleteVuelo(id, ruta) {
    if (!confirm(`¿Estás seguro de que deseas eliminar el vuelo "${ruta}"?`)) {
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/vuelo/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Error al eliminar el vuelo");
        displayListVuelos();
    } catch (err) {
        console.error(err);
        alert("No se pudo eliminar el vuelo. Verifica que la API esté disponible.");
    }
}

async function displayListVuelos() {
    let vuelosList = document.getElementById("vuelosList");
    if (!vuelosList) return;

    //limpiamos el contenido de la lista
    vuelosList.innerHTML = "";

    try {
        //obtener los vuelos desde la API
        console.log('Intentando obtener vuelos desde:', `${API_BASE_URL}/vuelo`);
        const response = await fetch(`${API_BASE_URL}/vuelo`);
        console.log('Respuesta recibida:', response.status, response.statusText);
        if (!response.ok) {
            throw new Error(`Error al obtener los vuelos: ${response.status} ${response.statusText}`);
        }
        const vuelos = await response.json();
        console.log('Vuelos obtenidos:', vuelos);

        // Generamos los cards en base a la lista de vuelos
        vuelos.forEach((vuelo) => {
        //elemento padre
        let cardDiv = document.createElement("div");
        cardDiv.className = "card";

        //Contenido de imagen-------------------------------------------------------------------------------------------------
        let imageContainerDiv = document.createElement("div");
        imageContainerDiv.className = "card-img";

        let vueloImg = document.createElement("img");
        vueloImg.src = vuelo.imagen || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80";
        vueloImg.alt = vuelo.origen + " - " + vuelo.destino;
        vueloImg.loading = "lazy";

        //insertamos la imagen en el contenedor div de la imagen
        imageContainerDiv.appendChild(vueloImg);
        //Fin de seccion imagen------------------------------------------------------------------------------------------------

        //Cabecera de la card-------------------------------------------------------------------------------------------------
        let cardHeaderDiv = document.createElement("div");
        cardHeaderDiv.className = "card-header";

        //Ruta del vuelo (origen -> destino)
        let titleH3 = document.createElement("h3");
        titleH3.innerText = vuelo.origen + " → " + vuelo.destino;
        //Fin ruta

        //Estado del vuelo
        let badgeSpan = document.createElement("span");
        badgeSpan.className = vuelo.estado === "Disponible" ? "badge badge-success" : vuelo.estado === "Últimos lugares" ? "badge badge-warning" : "badge badge-danger";
        badgeSpan.innerText = vuelo.estado;
        //Fin estado

        cardHeaderDiv.appendChild(titleH3);
        cardHeaderDiv.appendChild(badgeSpan);
        //Fin cabecera--------------------------------------------------------------------------------------------------------

        //Generar el cuerpo de la card-------------------------------------------------------------------------------------------
        let cardBodyDiv = document.createElement("div");
        cardBodyDiv.className = "card-body";

        //seccion de Fecha-------------------------------------------------------------------------------------
        let fechaP = document.createElement("p");
        let fechaFormato = vuelo.fecha ? new Date(vuelo.fecha).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }) : "-";
        fechaP.innerHTML = "<strong>Fecha:</strong> " + fechaFormato;
        cardBodyDiv.appendChild(fechaP);
        //Fin de seccion Fecha

        //seccion de Hora-------------------------------------------------------------------------------------
        let horaP = document.createElement("p");
        horaP.innerHTML = "<strong>Hora:</strong> " + vuelo.hora;
        cardBodyDiv.appendChild(horaP);
        //Fin de seccion Hora

        //seccion de Aerolinea-------------------------------------------------------------------------------------
        let aerolineaP = document.createElement("p");
        aerolineaP.innerHTML = "<strong>Aerolínea:</strong> " + vuelo.aerolinea;
        cardBodyDiv.appendChild(aerolineaP);
        //Fin de seccion Aerolinea

        //seccion de Precio-------------------------------------------------------------------------------------
        let precioP = document.createElement("p");
        precioP.innerHTML = "<strong>Precio:</strong> $" + vuelo.precio.toLocaleString("es-MX") + " MXN";
        cardBodyDiv.appendChild(precioP);
        //Fin de seccion Precio

        //Fin del cuerpo de la Card-------------------------------------------------------------------------------------------

        //Seccion de Botones------------------------------------------------------------------------------------------------
        let cardFooterDiv = document.createElement("div");
        cardFooterDiv.className = "card-footer";

        //boton editar
        let editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "btn-icon-only btn-secondary";
        editButton.title = "Editar";
        editButton.addEventListener("click", () => openModal(true, vuelo));
        let editIcon = document.createElement("i");
        editIcon.className = "fas fa-edit";
        editButton.appendChild(editIcon);

        //boton reservar
        let reservarButton = document.createElement("button");
        reservarButton.type = "button";
        reservarButton.className = "btn-icon-only btn-primary";
        reservarButton.title = "Reservar";
        let reservarIcon = document.createElement("i");
        reservarIcon.className = "fas fa-calendar-check";
        reservarButton.appendChild(reservarIcon);

        //boton eliminar
        let deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "btn-icon-only btn-danger";
        deleteButton.title = "Eliminar";
        deleteButton.addEventListener("click", () => deleteVuelo(vuelo.id, vuelo.origen + " → " + vuelo.destino));
        let deleteIcon = document.createElement("i");
        deleteIcon.className = "fas fa-trash";
        deleteButton.appendChild(deleteIcon);

        //insertar los botones en el contenedor de botones
        cardFooterDiv.appendChild(editButton);
        cardFooterDiv.appendChild(reservarButton);
        cardFooterDiv.appendChild(deleteButton);
        //Fin Seccion de Botones------------------------------------------------------------------------------------------------

        //insertamos la imagen, cabecera, cuerpo y botones en la card
        cardDiv.appendChild(imageContainerDiv);
        cardDiv.appendChild(cardHeaderDiv);
        cardDiv.appendChild(cardBodyDiv);
        cardDiv.appendChild(cardFooterDiv);

        //Insertamos en el DOM
        vuelosList.appendChild(cardDiv);
        });
    } catch (error) {
        console.error('Error al cargar vuelos:', error);
        vuelosList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error al cargar los vuelos</h3>
                <p>${error.message || 'No se pudo conectar con el servidor'}</p>
                <p style="font-size: 0.8rem; color: #666;">Verifica que el backend esté corriendo en ${API_BASE_URL}</p>
            </div>
        `;
    }
}
