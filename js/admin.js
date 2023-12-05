// Función para mostrar el contenido correspondiente al botón del menú seleccionado
function showContent(contentId) {
    // Ocultar todos los contenidos
    document.querySelectorAll(".main-content > div").forEach((content) => {
        content.style.display = "none";
    });

    // Mostrar el contenido correspondiente al botón del menú seleccionado
    document.getElementById(contentId).style.display = "block";

    // Actualizar el estado activo del botón del menú
    const menuItems = document.querySelectorAll(".menu-list li");
    menuItems.forEach((item) => {
        item.classList.remove("is-active");
    });

    // Establecer el botón activo
    const activeMenuItem = document.querySelector(
        `a[href="#"][onclick="showContent('${contentId}')"]`
    );
    activeMenuItem.parentNode.classList.add("is-active");
}

const token = localStorage.getItem("token");
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const currentPage = window.location.pathname;

    // Verificar si la página actual no es la página de inicio de sesión y no hay token almacenado
    if (currentPage !== "./login.html" && !token) {
        window.location.href = "./login.html";
    } else {
        obtenerTodosLosPosts("http://localhost:3005/posts", token, postContainer2);
    }
});

function obtenerTodosLosPosts(url, token, postContainer) {
    fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`, // Agrega el token al encabezado de autorización
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Hubo un problema al obtener los datos.");
            }
            return response.json();
        })
        .then((data) => {
            // Ordenar los posts por fecha (del más viejo al más nuevo)
            data.posts.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

            // Iterar a través de cada post en los datos obtenidos
            data.posts.forEach((post) => {
                // Crear elementos HTML para cada post
                const postBox = document.createElement("div");
                postBox.classList.add("box");

                const title = document.createElement("h2");
                title.classList.add("title", "is-4");
                title.textContent = post.titulo;

                const category = document.createElement("p");
                category.textContent = `Categoría: ${post.categoria}`;

                const author = document.createElement("p");
                author.textContent = `Autor: ${post.autor}`;

                const publicationDate = document.createElement("p");
                const date = new Date(post.fecha);
                const formattedDate = `${date.getDate()}/${date.getMonth() + 1
                    }/${date.getFullYear()}`;
                publicationDate.textContent = `Fecha de publicación: ${formattedDate}`;

                const editButton = document.createElement("button");
                editButton.classList.add("button", "is-primary");
                editButton.textContent = "Editar";

                const deleteButton = document.createElement("button");
                deleteButton.classList.add("button", "is-danger");
                deleteButton.textContent = "Eliminar";

                editButton.addEventListener("click", () => {
                    fillEditForm(post);
                });

                deleteButton.addEventListener("click", () => {
                    eliminarPost(post._id);
                    postContainer.removeChild(postBox);
                });

                const buttonDiv = document.createElement("div");
                buttonDiv.classList.add("buttons");
                buttonDiv.appendChild(editButton);
                buttonDiv.appendChild(deleteButton);

                postBox.appendChild(title);
                postBox.appendChild(category);
                postBox.appendChild(author);
                postBox.appendChild(publicationDate);
                postBox.appendChild(buttonDiv);

                postContainer.appendChild(postBox);
            });

            // Verificar si hay más páginas de posts
            if (data.currentPage < data.totalPages) {
                // Si hay más páginas, obtener la siguiente página de posts
                obtenerTodosLosPosts(
                    `http://localhost:3005/posts?page=${data.currentPage + 1}`,
                    token,
                    postContainer
                );
            }
        })
        .catch((error) => {
            console.error("Error al obtener los datos:", error);
        });
}

const postForm = document.getElementById("postForm");

postForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Obtener los datos del formulario
    const formData = new FormData(event.target);

    // Realizar una solicitud POST a tu API para crear el nuevo post
    crearNuevoPost(formData);
});

// Función para enviar la solicitud de creación del nuevo post
function crearNuevoPost(formData) {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3005/posts", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
    })
        .then((response) => {
            if (response.ok) {
                console.log("El nuevo post ha sido creado correctamente.");
            } else {
                console.error("Error al crear el nuevo post.");
            }
        })
        .catch((error) => {
            console.error("Error al crear el nuevo post:", error);
        });

    cleanForm();
    window.location.reload();
}

// Función para eliminar el post mediante una solicitud DELETE a la API
function eliminarPost(postId) {
    const token = localStorage.getItem("token"); // Obtener el token almacenado

    fetch(`http://localhost:3005/posts/${postId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (response.ok) {
                console.log(
                    `El post con ID ${postId} ha sido eliminado correctamente.`
                );
            } else {
                console.error(`Error al eliminar el post con ID ${postId}.`);
            }
        })
        .catch((error) => {
            console.error("Error al eliminar el post:", error);
        });
}

// Función para enviar la solicitud de edición del post
function editarPost(formData) {
    const postId = formData.get("postId"); // Obtener el ID del post a editar
    const token = localStorage.getItem("token");

    let url = "http://localhost:3005/posts";

    // Verificar si hay un postId, si existe, se trata de una edición
    if (postId) {
        url += `/${postId}`;
    }

    fetch(url, {
        method: postId ? "PUT" : "POST", // Si hay postId, es una edición; de lo contrario, es una creación
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
    })
        .then((response) => {
            if (response.ok) {
                if (postId) {
                    console.log(
                        `El post con ID ${postId} ha sido editado correctamente.`
                    );
                } else {
                    console.log("El nuevo post ha sido creado correctamente.");
                }
            } else {
                console.error(`Error al ${postId ? "editar" : "crear"} el post.`);
            }
        })
        .catch((error) => {
            console.error(`Error al ${postId ? "editar" : "crear"} el post:`, error);
        });
}

// Función para llenar el formulario con los datos del post seleccionado para editar
function fillEditForm(post) {
    // Obtener elementos del formulario
    const titleInput = document.querySelector('input[name="titulo"]');
    // const categorySelect = document.querySelector('select[name="categoria"]');
    const authorInput = document.querySelector('input[name="autor"]');
    const contentTextarea = document.querySelector('textarea[name="contenido"]');
    const postIdInput = document.getElementById("postId");

    // Llenar los campos con los datos del post seleccionado
    titleInput.value = post.titulo;
    // categorySelect.value = post.categoria;
    authorInput.value = post.autor;
    contentTextarea.value = post.contenido;
    postIdInput.value = post._id; // Almacena el ID del post para la edición

    // Mostrar automáticamente el contenido del menú "Nuevo Post"
    showContent("nuevo-post");

    // Cambiar el texto y comportamiento del botón
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.textContent = "Guardar cambios";

    // Cambiar el evento de envío del formulario para manejar la edición
    postForm.removeEventListener("submit", crearNuevoPost); // Remover el evento de creación
    postForm.addEventListener("submit", editarPost); // Agregar el evento de edición
}

// Función para limpiar el formulario
function cleanForm() {
    const titleInput = document.querySelector('input[name="titulo"]');
    // const categorySelect = document.querySelector('select[name="categoria"]');
    const authorInput = document.querySelector('input[name="autor"]');
    const contentTextarea = document.querySelector('textarea[name="contenido"]');
    const postIdInput = document.getElementById("postId");

    titleInput.value = "";
    // categorySelect.value = "";
    authorInput.value = "";
    contentTextarea.value = "";
    postIdInput.value = "";

    window.location.reload();
}

// Seleccionar el botón de cerrar sesión
const logoutButton = document.querySelector('.signoff');

// Agregar un evento de clic al botón de cerrar sesión
logoutButton.addEventListener('click', () => {
    // Remover el token del localStorage al hacer clic en el botón
    localStorage.removeItem('token');
    // Redirigir al usuario a la página de inicio de sesión
    window.location.href = './login.html';
});
