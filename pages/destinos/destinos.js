import { API_BASE_URL } from "../../scripts/main.js";

export function init() {
    let addBtn = document.getElementById("addDestinoBtn");
    let closeBtn = document.getElementById("closeDestinoModalBtn");
    let cancelBtn = document.getElementById("cancelDestinoModalBtn");
    let form = document.getElementById("destinoForm");
    let modal = document.getElementById("destinoModal");

    if (addBtn) addBtn.addEventListener("click", () => openModal(true));
    if (closeBtn) closeBtn.addEventListener("click", () => openModal(false));
    if (cancelBtn) cancelBtn.addEventListener("click", () => openModal(false));
    if (form) form.addEventListener("submit", submitForm);
    if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) openModal(false); });

    displayListDestinos();
}

let currentDestinoId = null;

function openModal(isOpen, destino = null) {
    let modal = document.getElementById("destinoModal");
    if (!modal) return;
    window.scrollTo(0, 0);
    if (isOpen) {
        if (destino) {
            // Modo edición: llenar el formulario con los datos del destino
            currentDestinoId = destino.id;
            document.getElementById("nombreTxt").value = destino.nombre || "";
            document.getElementById("descripcionTxt").value = destino.descripcion || "";
            document.getElementById("mejorEpocaTxt").value = destino.mejorEpoca || "";
            document.getElementById("precioMinNum").value = destino.precioMin || "";
            document.getElementById("precioMaxNum").value = destino.precioMax || "";
            document.getElementById("etiquetaSelect").value = destino.etiqueta || "Popular";
            document.getElementById("fotoTxt").value = destino.foto || "";
            document.querySelector("#destinoModal h2").textContent = "Editar destino";
        } else {
            // Modo creación: limpiar el formulario
            currentDestinoId = null;
            document.getElementById("destinoForm")?.reset();
            document.querySelector("#destinoModal h2").textContent = "Formulario de destino";
        }
        modal.classList.add("active");
    } else {
        modal.classList.remove("active");
        currentDestinoId = null;
    }
}

async function submitForm(e) {
    e.preventDefault();
    let nombre = document.getElementById("nombreTxt")?.value.trim();
    let descripcion = document.getElementById("descripcionTxt")?.value.trim();
    let mejorEpoca = document.getElementById("mejorEpocaTxt")?.value.trim() || "";
    let precioMin = document.getElementById("precioMinNum")?.value;
    let precioMax = document.getElementById("precioMaxNum")?.value;
    let etiqueta = document.getElementById("etiquetaSelect")?.value;
    let foto = document.getElementById("fotoTxt")?.value.trim() || null;

    if (!nombre || !descripcion || precioMin === "" || precioMax === "") {
        alert("Completa todos los campos obligatorios.");
        return;
    }
    let min = parseFloat(precioMin), max = parseFloat(precioMax);
    if (isNaN(min) || isNaN(max) || min < 0 || max < 0 || min > max) {
        alert("Precios no válidos (mínimo no puede ser mayor que máximo).");
        return;
    }

    try {
        let body = { nombre, descripcion, mejorEpoca, precioMin: min, precioMax: max, etiqueta: etiqueta || "Popular" };
        if (foto) body.foto = foto;

        let url = `${API_BASE_URL}/destino`;
        let method = "POST";
        if (currentDestinoId) {
            url = `${API_BASE_URL}/destino/${currentDestinoId}`;
            method = "PUT";
        }

        let response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        if (!response.ok) throw new Error("Error al guardar el destino");
        openModal(false);
        document.getElementById("destinoForm").reset();
        displayListDestinos();
    } catch (err) {
        console.error(err);
        alert("No se pudo guardar el destino. Verifica que la API esté disponible.");
    }
}

async function deleteDestino(id, nombre) {
    if (!confirm(`¿Estás seguro de que deseas eliminar el destino "${nombre}"?`)) {
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/destino/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Error al eliminar el destino");
        displayListDestinos();
    } catch (err) {
        console.error(err);
        alert("No se pudo eliminar el destino. Verifica que la API esté disponible.");
    }
}

async function displayListDestinos() {
    let destinosList = document.getElementById("destinosList");
    if (!destinosList) return;

    //limpiamos el contenido de la lista
    destinosList.innerHTML = "";

    try {
        //obtener los destinos desde la API
        console.log('Intentando obtener destinos desde:', `${API_BASE_URL}/destino`);
        const response = await fetch(`${API_BASE_URL}/destino`);
        console.log('Respuesta recibida:', response.status, response.statusText);
        if (!response.ok) {
            throw new Error(`Error al obtener los destinos: ${response.status} ${response.statusText}`);
        }
        const destinos = await response.json();
        console.log('Destinos obtenidos:', destinos);

        // Generamos los cards en base a la lista de destinos
        destinos.forEach((destino) => {
        //elemento padre
        let cardDiv = document.createElement("div");
        cardDiv.className = "card";

        //Contenido de imagen-------------------------------------------------------------------------------------------------
        let imageContainerDiv = document.createElement("div");
        imageContainerDiv.className = "card-img";

        let destinoImg = document.createElement("img");
        destinoImg.src = destino.foto || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80";
        destinoImg.alt = destino.nombre;
        destinoImg.loading = "lazy";

        //insertamos la imagen en el contenedor div de la imagen
        imageContainerDiv.appendChild(destinoImg);
        //Fin de seccion imagen------------------------------------------------------------------------------------------------

        //Cabecera de la card-------------------------------------------------------------------------------------------------
        let cardHeaderDiv = document.createElement("div");
        cardHeaderDiv.className = "card-header";

        //Nombre del destino
        let titleH3 = document.createElement("h3");
        titleH3.innerText = destino.nombre;
        //Fin nombre del destino

        //Etiqueta del destino
        let badgeSpan = document.createElement("span");
        badgeSpan.className = destino.etiqueta === "Recomendado" ? "badge badge-success" : "badge badge-primary";
        badgeSpan.innerText = destino.etiqueta;
        //Fin etiqueta

        cardHeaderDiv.appendChild(titleH3);
        cardHeaderDiv.appendChild(badgeSpan);
        //Fin cabecera--------------------------------------------------------------------------------------------------------

        //Generar el cuerpo de la card-------------------------------------------------------------------------------------------
        let cardBodyDiv = document.createElement("div");
        cardBodyDiv.className = "card-body";

        //seccion de Descripcion-------------------------------------------------------------------------------------
        let descripcionP = document.createElement("p");
        descripcionP.innerText = destino.descripcion;
        cardBodyDiv.appendChild(descripcionP);
        //Fin de seccion Descripcion

        //seccion de Mejor epoca-------------------------------------------------------------------------------------
        let epocaP = document.createElement("p");
        epocaP.innerHTML = "<strong>Mejor época:</strong> " + destino.mejorEpoca;
        cardBodyDiv.appendChild(epocaP);
        //Fin de seccion Mejor epoca

        //seccion de Precio-------------------------------------------------------------------------------------
        let precioP = document.createElement("p");
        precioP.innerHTML = "<strong>Precio promedio:</strong> $" + destino.precioMin.toLocaleString("es-MX") + " - $" + destino.precioMax.toLocaleString("es-MX") + " MXN";
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
        editButton.addEventListener("click", () => openModal(true, destino));
        let editIcon = document.createElement("i");
        editIcon.className = "fas fa-edit";
        editButton.appendChild(editIcon);

        //boton ver vuelos
        let verVuelosButton = document.createElement("button");
        verVuelosButton.type = "button";
        verVuelosButton.className = "btn-icon-only btn-primary";
        verVuelosButton.title = "Ver vuelos";
        let planeIcon = document.createElement("i");
        planeIcon.className = "fas fa-plane";
        verVuelosButton.appendChild(planeIcon);

        //boton eliminar
        let deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "btn-icon-only btn-danger";
        deleteButton.title = "Eliminar";
        deleteButton.addEventListener("click", () => deleteDestino(destino.id, destino.nombre));
        let deleteIcon = document.createElement("i");
        deleteIcon.className = "fas fa-trash";
        deleteButton.appendChild(deleteIcon);

        //insertar los botones en el contenedor de botones
        cardFooterDiv.appendChild(editButton);
        cardFooterDiv.appendChild(verVuelosButton);
        cardFooterDiv.appendChild(deleteButton);
        //Fin Seccion de Botones------------------------------------------------------------------------------------------------

        //insertamos la imagen, cabecera, cuerpo y botones en la card
        cardDiv.appendChild(imageContainerDiv);
        cardDiv.appendChild(cardHeaderDiv);
        cardDiv.appendChild(cardBodyDiv);
        cardDiv.appendChild(cardFooterDiv);

        //Insertamos en el DOM
        destinosList.appendChild(cardDiv);
        });
    } catch (error) {
        console.error('Error al cargar destinos:', error);
        destinosList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error al cargar los destinos</h3>
                <p>${error.message || 'No se pudo conectar con el servidor'}</p>
                <p style="font-size: 0.8rem; color: #666;">Verifica que el backend esté corriendo en ${API_BASE_URL}</p>
            </div>
        `;
    }
}
