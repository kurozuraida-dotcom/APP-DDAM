document.addEventListener('DOMContentLoaded', () => {
    const formRegistro = document.getElementById('formRegistro');
    const inputNombre = document.getElementById('nombre');
    const inputCorreo = document.getElementById('correo');
    const inputContrasena = document.getElementById('contrasena');
    const inputConfirmar = document.getElementById('confirmarContrasena');
    const mensajeFeedback = document.getElementById('mensajeFeedback');

    function mostrarMensaje(texto, esExito = false) {
        mensajeFeedback.textContent = texto;
        mensajeFeedback.style.color = esExito ? 'var(--exito)' : 'var(--error)';
    }

    formRegistro.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const nombre = inputNombre.value.trim();
        const correo = inputCorreo.value.trim().toLowerCase();
        const contrasena = inputContrasena.value.trim();
        const confirmar = inputConfirmar.value.trim();

        if (!nombre || !correo || !contrasena || !confirmar) {
            mostrarMensaje('Por favor, completa todos los campos.');
            return;
        }

        if (!correo.includes('@') || !correo.includes('.')) {
            mostrarMensaje('Ingresa un correo electrónico válido.');
            return;
        }

        if (contrasena.length < 6) {
            mostrarMensaje('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        if (contrasena !== confirmar) {
            mostrarMensaje('Las contraseñas no coinciden.');
            return;
        }

        // Obtener la base de datos simulada de usuarios (JSON array)
        let usuarios = JSON.parse(localStorage.getItem('portafolioUsuarios')) || [];

        // Verificar si el correo ya existe
        const usuarioExistente = usuarios.find(u => u.correo === correo);
        if (usuarioExistente) {
            mostrarMensaje('Este correo ya está registrado. Inicia sesión.');
            return;
        }

        // Registrar nuevo usuario en el arreglo
        const nuevoUsuario = { nombre, correo, contrasena };
        usuarios.push(nuevoUsuario);
        localStorage.setItem('portafolioUsuarios', JSON.stringify(usuarios));

        // Establecer sesión activa para este usuario
        localStorage.setItem('sesionActiva', JSON.stringify({
            tipo: 'registrado',
            nombre: nombre,
            correo: correo
        }));

        mostrarMensaje('¡Registro exitoso! Entrando a tu portafolio...', true);

        setTimeout(() => {
            window.location.href = 'principal.html';
        }, 1000);
    });
});