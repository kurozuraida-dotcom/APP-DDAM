document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form[data-categoria]');
    if (!form) return;

    const categoria = form.getAttribute('data-categoria');
    const feedback = document.getElementById('mensajeFeedback');

    // Lógica especial para "Proyecto personal" en Proyectos y Prácticas
    const checkPersonal = document.getElementById('esProyectoPersonal');
    const inputEmpresaProyecto = document.getElementById('empresaProyecto');
    if (checkPersonal && inputEmpresaProyecto) {
        checkPersonal.addEventListener('change', () => {
            if (checkPersonal.checked) {
                inputEmpresaProyecto.value = 'Proyecto personal';
                inputEmpresaProyecto.readOnly = true;
            } else {
                inputEmpresaProyecto.value = '';
                inputEmpresaProyecto.readOnly = false;
            }
        });
    }

    function mostrarError(msg) {
        feedback.textContent = msg;
        feedback.style.color = 'var(--error)';
    }

    // Convierte un archivo subido a Base64 para persistencia local (máx. 2MB para no saturar localStorage)
    function leerArchivo(file) {
        return new Promise((resolve) => {
            if (!file) {
                resolve(null);
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                // Si pesa más de 2MB guardamos solo el nombre para evitar límite de cuota del navegador
                resolve({ nombre: file.name, data: null });
                return;
            }
            const reader = new FileReader();
            reader.onload = () => resolve({ nombre: file.name, data: reader.result });
            reader.onerror = () => resolve({ nombre: file.name, data: null });
            reader.readAsDataURL(file);
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Validar todos los campos marcados como requeridos
        const camposRequeridos = form.querySelectorAll('[required]');
        for (const campo of camposRequeridos) {
            if (campo.type === 'file') {
                if (!campo.files || campo.files.length === 0) {
                    mostrarError('Es obligatorio adjuntar el documento comprobante.');
                    return;
                }
            } else if (!campo.value.trim()) {
                mostrarError('Por favor, llena todos los campos obligatorios.');
                return;
            }
        }

        // 2. Validar archivo si existe en el formulario
        const inputArchivo = form.querySelector('input[type="file"]');
        let archivoInfo = { nombre: '', data: null };
        if (inputArchivo && inputArchivo.files.length > 0) {
            archivoInfo = await leerArchivo(inputArchivo.files[0]);
        }

        // 3. Construir el objeto de datos y resumen según la categoría
        let titulo = '';
        let resumen = '';
        const campos = {};

        const obtenerValor = (id) => {
            const el = document.getElementById(id);
            return el ? el.value.trim() : '';
        };

        switch (categoria) {
            case 'Datos personales':
                titulo = obtenerValor('nombreCompleto');
                campos['Nombre completo'] = obtenerValor('nombreCompleto');
                campos['Fecha de nacimiento'] = obtenerValor('fechaNacimiento');
                campos['Dirección'] = obtenerValor('direccion');
                campos['Correo electrónico'] = obtenerValor('correoElectronico');
                campos['Sexo'] = obtenerValor('sexo');
                campos['CURP'] = obtenerValor('curp').toUpperCase();
                resumen = `CURP: ${campos['CURP']} • ${campos['Correo electrónico']}`;
                break;

            case 'Formación académica':
                titulo = obtenerValor('carrera');
                campos['Institución'] = obtenerValor('institucion');
                campos['Carrera o especialidad'] = obtenerValor('carrera');
                campos['Fecha de inicio'] = obtenerValor('fechaInicio');
                campos['Fecha de finalización'] = obtenerValor('fechaFin');
                resumen = `${campos['Institución']} (${campos['Fecha de inicio']} a ${campos['Fecha de finalización']})`;
                break;

            case 'Cursos':
                titulo = obtenerValor('especialidadCurso');
                campos['Institución que impartió'] = obtenerValor('institucionCurso');
                campos['Especialidad'] = obtenerValor('especialidadCurso');
                campos['Fecha de inicio'] = obtenerValor('fechaInicioCurso');
                campos['Fecha de finalización'] = obtenerValor('fechaFinCurso');
                resumen = `${campos['Institución que impartió']} (${campos['Fecha de inicio']} - ${campos['Fecha de finalización']})`;
                break;

            case 'Congresos':
                titulo = obtenerValor('temaCongreso');
                campos['Tema del congreso'] = obtenerValor('temaCongreso');
                campos['Quién lo brindó'] = obtenerValor('organizadorCongreso');
                campos['Fecha de realización'] = obtenerValor('fechaCongreso');
                resumen = `Impartido por: ${campos['Quién lo brindó']} • ${campos['Fecha de realización']}`;
                break;

            case 'Conferencias':
                titulo = obtenerValor('temaConferencia');
                campos['Institución o ponente'] = obtenerValor('ponenteConferencia');
                campos['Tema de la conferencia'] = obtenerValor('temaConferencia');
                campos['Fecha de realización'] = obtenerValor('fechaConferencia');
                resumen = `${campos['Institución o ponente']} • ${campos['Fecha de realización']}`;
                break;

            case 'Experiencia laboral':
                titulo = `${obtenerValor('rolEmpresa')} en ${obtenerValor('nombreEmpresa')}`;
                campos['Empresa'] = obtenerValor('nombreEmpresa');
                campos['Rol o puesto'] = obtenerValor('rolEmpresa');
                campos['Fecha de entrada'] = obtenerValor('fechaEntrada');
                campos['Fecha de salida'] = obtenerValor('fechaSalida');
                campos['Dirección'] = obtenerValor('direccionEmpresa');
                resumen = `${campos['Fecha de entrada']} a ${campos['Fecha de salida']} • ${campos['Dirección']}`;
                break;

            case 'Proyectos y prácticas':
                titulo = obtenerValor('nombreProyecto');
                campos['Nombre del proyecto'] = obtenerValor('nombreProyecto');
                campos['Empresa o tipo'] = obtenerValor('empresaProyecto');
                campos['Fecha de inicio'] = obtenerValor('fechaInicioProyecto');
                campos['Fecha de finalización'] = obtenerValor('fechaFinProyecto');
                resumen = `${campos['Empresa o tipo']} (${campos['Fecha de inicio']} - ${campos['Fecha de finalización']})`;
                break;

            case 'Habilidades e intereses':
                // Separar cada renglón (Enter) en una lista con puntos
                const listaHabilidades = obtenerValor('listaHabilidades')
                    .split('\n')
                    .map(linea => linea.replace(/^[-•*]\s*/, '').trim())
                    .filter(linea => linea !== '');

                const listaIntereses = obtenerValor('listaIntereses')
                    .split('\n')
                    .map(linea => linea.replace(/^[-•*]\s*/, '').trim())
                    .filter(linea => linea !== '');

                if (listaHabilidades.length === 0 || listaIntereses.length === 0) {
                    mostrarError('Ingresa al menos una habilidad y un interés.');
                    return;
                }

                titulo = 'Perfil de Habilidades e Intereses';
                campos['Habilidades'] = listaHabilidades;
                campos['Intereses'] = listaIntereses;
                resumen = `${listaHabilidades.length} habilidades y ${listaIntereses.length} intereses registrados`;
                break;
        }

// 4. Guardar en localStorage usando la llave específica del usuario activo
        const sesionActiva = JSON.parse(localStorage.getItem('sesionActiva'));
        const userKey = sesionActiva ? (sesionActiva.correo || 'invitado') : 'invitado';
        const storageKey = 'portafolioRegistros_' + userKey;

        const registros = JSON.parse(localStorage.getItem(storageKey)) || [];
        registros.push({
            id: Date.now(),
            categoria,
            titulo,
            resumen,
            campos,
            archivoNombre: archivoInfo.nombre,
            archivoData: archivoInfo.data
        });

        localStorage.setItem(storageKey, JSON.stringify(registros));

        // 5. Redirigir automáticamente a la pantalla principal
        window.location.href = 'principal.html';
    });
});

