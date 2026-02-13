import { contactos } from "./test-data.js";

export function init() {
    displayListContactos();
}

function displayListContactos() {
    let contactosList = document.getElementById("contactosList");
    if (!contactosList) return;

    //limpiamos el contenido de la lista
    contactosList.innerHTML = "";

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
        contactosList.appendChild(cardDiv);
    });
}
