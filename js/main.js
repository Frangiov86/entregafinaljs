window.addEventListener("load", function () {
    // Selección de elementos del DOM por ID
    const formularioLogin = document.getElementById("login-form"); 
    const estadoLogin = document.getElementById("login-status"); 
    const entradaUsuario = document.getElementById("username"); 
    const entradaContraseña = document.getElementById("password"); 

    // Selección del ícono de ojo
    const togglePassword = document.querySelector("#toggle-password");

    // Evento de clic para mostrar/ocultar la contraseña
    togglePassword.addEventListener("click", function () {
        const tipo = entradaContraseña.getAttribute("type") === "password" ? "text" : "password";
        entradaContraseña.setAttribute("type", tipo);

        // Cambiar la forma del ícono según el tipo de entrada
        this.classList.toggle("fa-eye-slash");
    });

    // Función de validación de usuario
    async function validarUsuario(usuario, contraseña) {
        try {
            const respuesta = await fetch('./json/usuarios.json');
            const datos = await respuesta.text();
            const usuarios = JSON.parse(datos);
            console.log([...usuarios]);

            return usuarios.some(({ username: nombreUsuario, password: clave }) =>
                nombreUsuario === usuario && clave === contraseña
            );
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            return false;
        }
    }

    // Evento de envío del formulario de inicio de sesión
    document.getElementById("login").addEventListener("submit", async function (evento) {
        evento.preventDefault(); 

        const usuario = entradaUsuario.value; 
        const contraseña = entradaContraseña.value; 
        
        (usuario && contraseña) && 
        (await validarUsuario(usuario, contraseña) ? 
            (localStorage.setItem("loggedIn", "true"),
             localStorage.setItem("username", usuario),
             Swal.fire({
                icon: 'success',
                title: 'Logueo exitoso',
                showConfirmButton: false,
                timer: 2000
             }).then(() => {
                window.location.href = "./pages/logueado.html"; 
             })) : 
            estadoLogin.textContent = "Nombre de usuario o contraseña incorrectos."
        ) 
    });
});

