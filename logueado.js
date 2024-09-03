window.addEventListener("load", function () {

    // Verificación de logueo
    if (localStorage.getItem("loggedIn") !== "true") {
        window.location.href = "index.html";
    }

    //! Seleccionando elementos DOM y configurando almacenamiento de comentarios
    const images = document.querySelectorAll(".grid-container img");
    const popup = document.getElementById("image-popup");
    const popupImg = document.getElementById("popup-img");
    const commentsList = document.getElementById("comments-list");
    const commentForm = document.getElementById("comment-form");
    const commentInput = document.getElementById("comment-input");

    const commentsStorage = JSON.parse(localStorage.getItem("comments")) ?? {};

    //! Seleccionando el enlace de contacto
    const contactoLink = document.querySelector("nav ul li a[href='#contacto#']");

    //! Función asíncrona para mostrar Toastify en el clic de "Contacto"
    contactoLink.addEventListener("click", async (e) => {
        e.preventDefault();

        // Se espera a que se ejecute la funcionalidad Toastify
        await new Promise(resolve => {
            Toastify({
                text: "Contacto Whatsapp",
                duration: -1, // Toastify se mostrará indefinidamente hasta que se cierre manualmente
                close: true,
                gravity: "bottom", // Aparece desde la parte inferior de la pantalla
                position: "right", // Se alinea a la derecha
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)", // Fondo verde
                avatar: "https://cdn-icons-png.flaticon.com/512/733/733585.png", // Ícono de Whatsapp
                onClick: function() {
                    console.log("Toast cerrado manualmente");
                }
            }).showToast();

            // Resolviendo la promesa una vez que el Toastify se ha mostrado
            resolve();
        });
    });


    //! Cargando comentarios de las imágenes desde un archivo JSON usando Fetch
    fetch('./json/coments.json')
        .then(response => response.json())
        .then(data => {
            Object.assign(commentsStorage, data);
            localStorage.setItem("comments", JSON.stringify(commentsStorage));
        })
        .catch(error => console.error('Error al cargar comentarios:', error));

    //! Función para abrir la imagen en ventana emergente
    images.forEach((img, index) => {
        img.addEventListener("click", () => {
            popupImg.src = img.src;
            popup.classList.remove("hidden");
            commentsList.innerHTML = ""; // Limpiar la lista de comentarios
            const comments = commentsStorage[index] ?? [];
            comments.forEach(comment => {
                const li = document.createElement("li");
                li.textContent = comment;
                commentsList.appendChild(li);
            });
        });
    });

    //! Función para cerrar la ventana emergente al hacer clic afuera de la imagen
    popup.addEventListener("click", (e) => {
        if (e.target === popup) {
            popup.classList.add("hidden");
        }
    });

    //! Función para agregar un comentario
    commentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const commentText = commentInput.value.trim();

        if (commentText) {
            const li = document.createElement("li");
            li.textContent = commentText;
            commentsList.appendChild(li);

            const imgIndex = Array.from(images).findIndex(img => img.src === popupImg.src);
            commentsStorage[imgIndex] = [...(commentsStorage[imgIndex] ?? []), commentText];

            //! Guardar el comentario en localStorage
            localStorage.setItem("comments", JSON.stringify(commentsStorage));

            //! Notificación Toastify
            Toastify({
                text: "Comentario agregado",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
            }).showToast();

            commentInput.value = ""; // Limpiar el campo de comentario
        }
    });

});
