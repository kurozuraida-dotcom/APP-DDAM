document.addEventListener('DOMContentLoaded', () => {
    const nombreUsuarioHeader = document.getElementById('nombreUsuarioHeader');
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    const btnAbrirCategorias = document.getElementById('btnAbrirCategorias');
    const modalCategorias = document.getElementById('modalCategorias');
    const btnCerrarModalCat = document.getElementById('btnCerrarModalCat');
    const contenedorPortafolio = document.getElementById('contenedorPortafolio');

    const modalDetalle = document.getElementById('modalDetalle');
    const detalleTitulo = document.getElementById('detalleTitulo');
    const detalleContenido = document.getElementById('detalleContenido');
    const btnCerrarModalDetalle = document.getElementById('btnCerrarModalDetalle');
    const btnEliminarRegistro = document.getElementById('btnEliminarRegistro');

    let indiceSeleccionado = null;

    // 1. Verificar sesión activa
    const sesionActiva = JSON.parse(localStorage.getItem('sesionActiva'));
    if (!sesionActiva) {
        window.location.href = 'iniciarSesion.html';
        return;
    }

    // Definir la llave única de almacenamiento basada en el usuario actual
    const userKey = sesionActiva.correo || 'invitado';
    const storageKey = 'portafolioRegistros_' + userKey;

    // Mostrar nombre en la esquina superior derecha
    nombreUsuarioHeader.textContent = sesionActiva.nombre || 'Usuario';

    // 2. Botón cerrar sesión con confirmación estricta
    btnCerrarSesion.addEventListener('click', () => {
        const confirmar = confirm('¿Estás seguro de que deseas cerrar sesión?');
        if (confirmar) {
            localStorage.removeItem('sesionActiva');
            window.location.href = 'iniciarSesion.html';
        }
    });

    // 3. Abrir/cerrar selector de categorías (+)
    btnAbrirCategorias.addEventListener('click', () => {
        modalCategorias.classList.add('active');
    });
    btnCerrarModalCat.addEventListener('click', () => {
        modalCategorias.classList.remove('active');
    });

    // 4. Cargar y renderizar los elementos propios del usuario activo
    function cargarPortafolio() {
        const registros = JSON.parse(localStorage.getItem(storageKey)) || [];
        contenedorPortafolio.innerHTML = '';

        if (registros.length === 0) {
            contenedorPortafolio.innerHTML = `
                <p style="text-align:center; color: var(--texto-secundario); font-size:0.88rem; margin-top:15px;">
                    Aún no has agregado información. Pulsa el botón <strong>+</strong> para comenzar.
                </p>
            `;
            return;
        }

        registros.forEach((item, index) => {
            const card = document.createElement('article');
            card.className = 'portfolio-item-card';
            card.innerHTML = `
                <span class="item-category-tag">${item.categoria}</span>
                <h3 class="item-title">${item.titulo}</h3>
                <p class="item-summary">${item.resumen}</p>
                ${item.archivoNombre ? `<span class="item-file-badge">Archivo: ${item.archivoNombre}</span>` : ''}
            `;

            card.addEventListener('click', () => abrirDetalle(item, index));
            contenedorPortafolio.appendChild(card);
        });
    }

    // 5. Ver detalle del registro
    function abrirDetalle(item, index) {
        indiceSeleccionado = index;
        detalleTitulo.textContent = item.categoria;

        let htmlDetalles = `<p><strong>Título:</strong> ${item.titulo}</p>`;

        for (const [clave, valor] of Object.entries(item.campos)) {
            if (Array.isArray(valor)) {
                htmlDetalles += `<p><strong>${clave}:</strong></p><ul class="detail-bullets">`;
                valor.forEach(punto => {
                    htmlDetalles += `<li>${punto}</li>`;
                });
                htmlDetalles += `</ul>`;
            } else {
                htmlDetalles += `<p><strong>${clave}:</strong> ${valor}</p>`;
            }
        }

        if (item.archivoNombre) {
            htmlDetalles += `<p><strong>Documento comprobante:</strong> ${item.archivoNombre}</p>`;
            if (item.archivoData && item.archivoData.startsWith('data:image')) {
                htmlDetalles += `<img src="${item.archivoData}" alt="Documento" style="width:100%; border-radius:12px; margin-top:8px; border:1px solid #ccc;">`;
            } else if (item.archivoData) {
                htmlDetalles += `<a href="${item.archivoData}" download="${item.archivoNombre}" class="btn-secondary" style="display:inline-block; text-align:center; margin-top:8px; text-decoration:none;">Descargar archivo adjunto</a>`;
            }
        }

        detalleContenido.innerHTML = htmlDetalles;
        modalDetalle.classList.add('active');
    }

    btnCerrarModalDetalle.addEventListener('click', () => {
        modalDetalle.classList.remove('active');
    });

    btnEliminarRegistro.addEventListener('click', () => {
        if (indiceSeleccionado !== null && confirm('¿Eliminar este elemento de tu portafolio?')) {
            const registros = JSON.parse(localStorage.getItem(storageKey)) || [];
            registros.splice(indiceSeleccionado, 1);
            localStorage.setItem(storageKey, JSON.stringify(registros));
            modalDetalle.classList.remove('active');
            cargarPortafolio();
        }
    });

    cargarPortafolio();
});