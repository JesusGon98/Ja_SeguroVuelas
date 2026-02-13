import { reservaciones } from "./test-data.js";

export function init() {
    displayListReservaciones();
}

function displayListReservaciones() {
    let reservacionesList = document.getElementById("reservacionesList");
    if (!reservacionesList) return;

    //limpiamos el contenido de la lista
    reservacionesList.innerHTML = "";

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

        let fechaFormato = new Date(reservacion.fecha + "T00:00:00").toLocaleDateString("es-ES");

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
        let editIcon = document.createElement("i");
        editIcon.className = "fas fa-edit";
        editButton.appendChild(editIcon);

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
        cardFooterDiv.appendChild(deleteButton);
        //Fin Seccion de Botones------------------------------------------------------------------------------------------------

        //insertamos cabecera, cuerpo y botones en la card
        cardDiv.appendChild(cardHeaderDiv);
        cardDiv.appendChild(cardBodyDiv);
        cardDiv.appendChild(cardFooterDiv);

        //Insertamos en el DOM
        reservacionesList.appendChild(cardDiv);
    });
}
