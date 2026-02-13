// Imagen por defecto para vuelos (avión/cielo)
const IMAGEN_VUELO = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80";

export const vuelos = [
    {
        id: 1,
        origen: "Ciudad de México",
        destino: "Cancún",
        fecha: "2024-03-15",
        hora: "08:00",
        aerolinea: "Aeroméxico",
        precio: 3500,
        estado: "Disponible",
        imagen: IMAGEN_VUELO
    },
    {
        id: 2,
        origen: "Guadalajara",
        destino: "Los Cabos",
        fecha: "2024-03-20",
        hora: "10:30",
        aerolinea: "Volaris",
        precio: 2800,
        estado: "Disponible",
        imagen: IMAGEN_VUELO
    },
    {
        id: 3,
        origen: "Monterrey",
        destino: "Puerto Vallarta",
        fecha: "2024-03-25",
        hora: "14:15",
        aerolinea: "Volaris",
        precio: 3200,
        estado: "Últimos lugares",
        imagen: IMAGEN_VUELO
    }
];
