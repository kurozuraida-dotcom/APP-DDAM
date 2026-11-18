document.addEventListener('DOMContentLoaded', () => {
    const formIniciarSesion = document.getElementById('formIniciarSesion');
    const inputCorreo = document.getElementById('correo');
    const inputContrasena = document.getElementById('contrasena');
    const mensajeFeedback = document.getElementById('mensajeFeedback');
    const btnInvitado = document.getElementById('btnInvitado');

    function mostrarMensaje(texto, esExito = false) {
        mensajeFeedback.textContent = texto;
        mensajeFeedback.style.color = esExito ? 'var(--exito)' : 'var(--error)';
    }

    formIniciarSesion.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const correo = inputCorreo.value.trim().toLowerCase();
        const contrasena = inputContrasena.value.trim();

        if (!correo || !contrasena) {
            mostrarMensaje('Por favor, completa todos los campos.');
            return;
        }

        // Obtener la lista de usuarios registrados del localStorage
        let usuarios = JSON.parse(localStorage.getItem('portafolioUsuarios')) || [];

        // Buscar coincidencia de correo y contraseña
        const usuarioEncontrado = usuarios.find(u => u.correo === correo && u.contrasena === contrasena);

        if (usuarioEncontrado) {
            // Guardar sesión activa con los datos reales del usuario encontrado
            localStorage.setItem('sesionActiva', JSON.stringify({
                tipo: 'registrado',
                nombre: usuarioEncontrado.nombre,
                correo: usuarioEncontrado.correo
            }));

            mostrarMensaje('¡Acceso exitoso! Entrando...', true);
            setTimeout(() => {
                window.location.href = 'principal.html';
            }, 900);
        } else {
            mostrarMensaje('Correo o contraseña incorrectos, o cuenta no registrada.');
        }
    });

    // Acceso como invitado
    btnInvitado.addEventListener('click', () => {
        localStorage.setItem('sesionActiva', JSON.stringify({
            tipo: 'invitado',
            nombre: 'Invitado',
            correo: 'invitado@sistema.local'
        }));
        mostrarMensaje('Ingresando en modo invitado...', true);
        setTimeout(() => {
            window.location.href = 'principal.html';
        }, 800);
    });
});