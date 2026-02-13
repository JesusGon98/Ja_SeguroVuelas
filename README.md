# JA Seguro que Vuelas - Frontend

Frontend estático para la agencia de viajes "JA Seguro que Vuelas". Esta aplicación web permite gestionar vuelos, destinos, reservaciones y contactos de clientes.

## Estructura del Proyecto

```
Ja_SeguroVuelas/
├── assets/
│   └── img/              # Imágenes (logo, favicon, etc.)
├── pages/                 # Páginas HTML y scripts
│   ├── dashboard/         # Panel de control
│   ├── vuelos/           # Gestión de vuelos
│   ├── destinos/         # Catálogo de destinos
│   ├── reservaciones/    # Gestión de reservaciones
│   ├── contacto/         # Formulario de contacto
│   └── configuraciones/  # Configuración de la aplicación
├── scripts/              # Scripts principales
│   ├── main.js          # Configuración y funciones de API
│   └── navigation.js    # Sistema de navegación
├── styles/              # Hojas de estilo CSS
│   ├── buttons.css
│   ├── cards.css
│   ├── fields.css
│   ├── header.css
│   ├── modals.css
│   ├── styles.css
│   └── templates.css
└── index.html           # Página principal
```

## Características

- **Barra de navegación superior**: Diseño moderno con barra fija en la parte superior
- **Navegación SPA**: Carga dinámica de páginas sin recargar
- **Integración con API**: Conectado con la API REST de ASP.NET Core
- **Diseño responsive**: Adaptable a diferentes tamaños de pantalla
- **Temas y estilos**: Diseño moderno con gradientes y animaciones

## Páginas Disponibles

1. **Dashboard**: Panel de control con estadísticas y contactos recientes
2. **Vuelos**: Catálogo de vuelos disponibles
3. **Destinos**: Información sobre destinos turísticos
4. **Reservaciones**: Gestión de reservaciones de vuelo
5. **Contacto**: Formulario para solicitudes de contacto
6. **Configuraciones**: Configuración de la aplicación y estado del sistema

## Configuración

### Requisitos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Servidor web local (opcional, para desarrollo)
- API backend corriendo en `http://localhost:5019` (opcional)

### Instalación

1. Clona o descarga el proyecto
2. Abre `index.html` en tu navegador
3. (Opcional) Configura un servidor web local para desarrollo

### Servidor Local (Opcional)

Para desarrollo, puedes usar un servidor HTTP simple:

**Python:**
```bash
python -m http.server 8000
```

**Node.js (http-server):**
```bash
npx http-server -p 8000
```

Luego accede a `http://localhost:8000`

## Integración con la API

La aplicación está configurada para conectarse a la API en:
- URL base: `http://localhost:5019/api`

Puedes cambiar esta configuración en:
- `scripts/main.js` (código)
- Página de Configuraciones (interfaz)

### Endpoints Utilizados

- `GET /api/health` - Verificar estado de la API
- `GET /api/contacto` - Obtener todos los contactos
- `GET /api/contacto/{id}` - Obtener contacto por ID
- `POST /api/contacto` - Crear nuevo contacto

## Personalización

### Cambiar Logo

Reemplaza `assets/img/JaSeguroVuelas.jpg` con tu logo

### Cambiar Colores

Los colores principales están definidos en `styles/header.css`:
- Gradiente principal: `#667eea` a `#764ba2`
- Puedes modificar estos valores para personalizar el tema

### Agregar Páginas

1. Crea una carpeta en `pages/` con el nombre de tu página
2. Crea `nombre.html` y `nombre.js` dentro de la carpeta
3. Agrega la ruta en `scripts/navigation.js`
4. Agrega el botón de navegación en `index.html`

## Tecnologías Utilizadas

- HTML5
- CSS3 (con gradientes y animaciones)
- JavaScript (ES6+ modules)
- Font Awesome (iconos)

## Notas

- Esta es una aplicación estática que funciona sin backend
- Para funcionalidad completa, se requiere la API backend
- Los datos se muestran desde la API cuando está disponible
- Algunas funcionalidades muestran datos de ejemplo cuando la API no está disponible

## Licencia

Proyecto escolar - Uso educativo
