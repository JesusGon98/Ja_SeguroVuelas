import { destinos } from "./test-data.js";

export function init() {
    displayListDestinos();
}

function displayListDestinos() {
    let destinosList = document.getElementById("destinosList");
    if (!destinosList) return;

    //limpiamos el contenido de la lista
    destinosList.innerHTML = "";

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
}
