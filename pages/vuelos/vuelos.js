import { vuelos } from "./test-data.js";

export function init() {
    displayListVuelos();
}

function displayListVuelos() {
    let vuelosList = document.getElementById("vuelosList");
    if (!vuelosList) return;

    //limpiamos el contenido de la lista
    vuelosList.innerHTML = "";

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
        fechaP.innerHTML = "<strong>Fecha:</strong> " + new Date(vuelo.fecha + "T00:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
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
}
