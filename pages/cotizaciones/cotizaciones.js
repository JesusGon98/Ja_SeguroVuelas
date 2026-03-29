import { API_BASE_URL } from '../../scripts/main.js';

const destinosFotos = new Map();

export function init() {
    const campos = ['origenInput', 'destinoInput', 'fechaInput', 'horaInput',
                    'fechaRegresoInput', 'horaRegresoInput', 'pasajerosInput',
                    'tipoInput', 'escalaInput', 'aerolineaInput', 'precioInput',
                    'whatsappInput', 'facebookInput', 'instagramInput', 'tiktokInput'];

    campos.forEach(id => {
        document.getElementById(id)?.addEventListener('input',  syncPreview);
        document.getElementById(id)?.addEventListener('change', syncPreview);
    });

    document.getElementById('tipoInput')?.addEventListener('change', toggleRegreso);
    document.getElementById('origenInput')?.addEventListener('change', actualizarImagen);
    document.getElementById('destinoInput')?.addEventListener('change', actualizarImagen);

    document.getElementById('downloadBtn')?.addEventListener('click', descargarImagen);
    document.getElementById('copyBtn')?.addEventListener('click', copiarImagen);
    document.getElementById('resetCotBtn')?.addEventListener('click', limpiarFormulario);

    cargarSugerencias();
    syncPreview();
}

function esRedondo() {
    return document.getElementById('tipoInput')?.value === 'Redondo';
}

function toggleRegreso() {
    const grupo = document.getElementById('regresoGroup');
    const previewItem = document.getElementById('preview-hora-regreso-item');
    const previewRegresoItem = document.getElementById('preview-regreso-item');
    const visible = esRedondo();

    if (grupo) grupo.style.display = visible ? '' : 'none';
    if (previewItem) previewItem.style.display = visible ? '' : 'none';
    if (previewRegresoItem) previewRegresoItem.style.display = visible ? '' : 'none';

    if (!visible) {
        const fr = document.getElementById('fechaRegresoInput');
        const hr = document.getElementById('horaRegresoInput');
        if (fr) fr.value = '';
        if (hr) hr.value = '';
    }
    syncPreview();
}

function formatFecha(valor) {
    if (!valor) return '—';
    const [y, m, d] = valor.split('-');
    return new Date(y, m - 1, d).toLocaleDateString('es-MX', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
}

function formatHora(valor) {
    if (!valor) return '—';
    const [h, min] = valor.split(':');
    const date = new Date();
    date.setHours(parseInt(h), parseInt(min));
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function syncPreview() {
    const origen    = document.getElementById('origenInput')?.value.trim()     || '';
    const destino   = document.getElementById('destinoInput')?.value.trim()    || '';
    const fecha     = document.getElementById('fechaInput')?.value              || '';
    const hora      = document.getElementById('horaInput')?.value               || '';
    const regreso   = document.getElementById('fechaRegresoInput')?.value       || '';
    const horaReg   = document.getElementById('horaRegresoInput')?.value        || '';
    const pasajeros = parseInt(document.getElementById('pasajerosInput')?.value) || 1;
    const tipo      = document.getElementById('tipoInput')?.value               || '';
    const escala    = document.getElementById('escalaInput')?.value             || '';
    const aerolinea = document.getElementById('aerolineaInput')?.value.trim()  || '';
    const precioTotal = parseFloat(document.getElementById('precioInput')?.value) || 0;
    const redondo   = esRedondo();

    // Textos de la tarjeta
    setText('preview-origen',    origen    || 'Origen');
    setText('preview-destino',   destino   || 'Destino');
    setText('stub-origen',       origen    || '—');
    setText('stub-destino',      destino   || '—');
    setText('preview-badge-tipo', tipo     || 'COTIZACIÓN');
    setText('preview-fecha',     formatFecha(fecha));
    setText('preview-hora',      formatHora(hora));
    setText('preview-pasajeros', pasajeros > 1 ? `${pasajeros} pasajeros` : '1 pasajero');
    setText('preview-tipo',      tipo      || '—');
    setText('preview-escala',    escala    || '—');
    setText('preview-aerolinea', aerolinea || '—');

    // Fecha y hora regreso en tarjeta
    const regresoItem     = document.getElementById('preview-regreso-item');
    const horaRegresoItem = document.getElementById('preview-hora-regreso-item');
    if (regresoItem)     regresoItem.style.display     = redondo ? '' : 'none';
    if (horaRegresoItem) horaRegresoItem.style.display = redondo ? '' : 'none';
    setText('preview-fecha-regreso', formatFecha(regreso));
    setText('preview-hora-regreso',  formatHora(horaReg));

    // Redes sociales
    syncRed('facebookInput',  'preview-facebook',  'red-facebook-wrap');
    syncRed('instagramInput', 'preview-instagram', 'red-instagram-wrap');
    syncRed('tiktokInput',    'preview-tiktok',    'red-tiktok-wrap');

    const wa       = document.getElementById('whatsappInput')?.value.trim() || '';
    const waWrap   = document.getElementById('cot-whatsapp-wrap');
    const waTexto  = document.getElementById('preview-whatsapp');
    if (waWrap)  waWrap.style.display  = wa ? 'flex' : 'none';
    if (waTexto) waTexto.textContent   = wa;

    // Icono flecha
    const flechaIcon = document.getElementById('preview-flecha-icon');
    if (flechaIcon) {
        flechaIcon.className = redondo
            ? 'fas fa-exchange-alt cot-plane-icon'
            : 'fas fa-plane cot-plane-icon';
    }

    // Precios: el usuario ingresa el TOTAL, calculamos por persona
    const precioTotalEl   = document.getElementById('preview-precio-total');
    const precioPersonaEl = document.getElementById('preview-precio-persona');
    const precioHint      = document.getElementById('precioPersonaHint');
    const precioHintDesc  = document.getElementById('precioHintDesc');
    const precioPersonaValor = document.getElementById('precioPersonaValor');

    if (precioTotal > 0) {
        const porPersona = precioTotal / pasajeros;
        const fmtTotal   = '$ ' + precioTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 });
        const fmtPersona = '$ ' + porPersona.toLocaleString('es-MX', { minimumFractionDigits: 2 });

        if (precioTotalEl)   precioTotalEl.textContent   = fmtTotal;
        if (precioPersonaEl) precioPersonaEl.textContent = fmtPersona + ' MXN';

        // Hint del formulario
        if (precioHint) precioHint.style.display = 'flex';
        if (precioHintDesc) precioHintDesc.textContent =
            pasajeros > 1 ? `${pasajeros} pasajeros` : '1 pasajero';
        if (precioPersonaValor) precioPersonaValor.textContent = fmtPersona + ' MXN';
    } else {
        if (precioTotalEl)   precioTotalEl.textContent   = '$ —';
        if (precioPersonaEl) precioPersonaEl.textContent = '$ —';
        if (precioHint)      precioHint.style.display    = 'none';
    }
}

function syncRed(inputId, previewId, wrapId) {
    const val  = document.getElementById(inputId)?.value.trim() || '';
    const wrap = document.getElementById(wrapId);
    const el   = document.getElementById(previewId);
    if (wrap) wrap.style.display = val ? 'flex' : 'none';
    if (el)   el.textContent     = val;
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function limpiarFormulario() {
    ['origenInput', 'destinoInput', 'fechaInput', 'horaInput',
     'fechaRegresoInput', 'horaRegresoInput', 'tipoInput', 'escalaInput',
     'aerolineaInput', 'precioInput',
     'whatsappInput', 'facebookInput', 'instagramInput', 'tiktokInput'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const pasajeros = document.getElementById('pasajerosInput');
    if (pasajeros) pasajeros.value = 1;

    const regresoGroup = document.getElementById('regresoGroup');
    if (regresoGroup) regresoGroup.style.display = 'none';

    actualizarImagen();
    syncPreview();
}

function actualizarImagen() {
    setImagen(document.getElementById('origenInput')?.value  || '', 'previewImgOrigen',  'cotImgPlaceholderOrigen');
    setImagen(document.getElementById('destinoInput')?.value || '', 'previewImgDestino', 'cotImgPlaceholderDestino');
}

function setImagen(nombre, imgId, placeholderId) {
    const imgEl       = document.getElementById(imgId);
    const placeholder = document.getElementById(placeholderId);
    if (!imgEl) return;

    const foto = destinosFotos.get(nombre);
    if (foto) {
        imgEl.src = foto;
        imgEl.style.display = 'block';
        if (placeholder) placeholder.style.visibility = 'hidden';
    } else {
        imgEl.src = '';
        imgEl.style.display = 'none';
        if (placeholder) placeholder.style.visibility = 'visible';
    }
}

async function cargarSugerencias() {
    try {
        const resDestinos = await fetch(`${API_BASE_URL}/destino`);
        if (resDestinos.ok) {
            const destinos = await resDestinos.json();
            destinos.forEach(d => { if (d.nombre && d.foto) destinosFotos.set(d.nombre, d.foto); });

            const opciones = destinos.map(d => `<option value="${d.nombre}">${d.nombre}</option>`).join('');
            const origenSel  = document.getElementById('origenInput');
            const destinoSel = document.getElementById('destinoInput');
            if (origenSel)  origenSel.innerHTML  = `<option value="">Selecciona origen...</option>${opciones}`;
            if (destinoSel) destinoSel.innerHTML = `<option value="">Selecciona destino...</option>${opciones}`;
        }

        const resVuelos = await fetch(`${API_BASE_URL}/vuelo`);
        if (resVuelos.ok) {
            const vuelos = await resVuelos.json();
            const aerolineas = [...new Set(vuelos.map(v => v.aerolinea).filter(Boolean))];
            fillDatalist('aerolineaList', aerolineas);
        }
    } catch {
        // Si la API no responde, los campos quedan vacíos
    }
}

function fillDatalist(id, values) {
    const dl = document.getElementById(id);
    if (!dl) return;
    dl.innerHTML = values.map(v => `<option value="${v}"></option>`).join('');
}

async function capturarCard() {
    const card = document.getElementById('cotizacionCard');
    return await window.html2canvas(card, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false
    });
}

async function descargarImagen() {
    try {
        const canvas = await capturarCard();
        const link = document.createElement('a');
        link.download = `cotizacion-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (err) {
        console.error('Error al generar imagen:', err);
        alert('No se pudo generar la imagen. Intenta de nuevo.');
    }
}

async function copiarImagen() {
    try {
        const canvas = await capturarCard();
        canvas.toBlob(async (blob) => {
            try {
                await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                const btn = document.getElementById('copyBtn');
                if (!btn) return;
                const original = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
                setTimeout(() => { btn.innerHTML = original; }, 2000);
            } catch {
                alert('Tu navegador no permite copiar imágenes directamente. Usa "Descargar imagen".');
            }
        }, 'image/png');
    } catch (err) {
        console.error('Error al copiar imagen:', err);
        alert('No se pudo copiar la imagen.');
    }
}
