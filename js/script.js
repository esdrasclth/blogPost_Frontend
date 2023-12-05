// Variables globales para el número de página actual y el total de páginas
let currentPage = 1;
let totalPages = 1;

// Función para actualizar la paginación en el navegador
const updatePagination = () => {
    // Obtener el elemento de la lista de paginación
    const paginationList = document.querySelector('.pagination-list');
    paginationList.innerHTML = '';

    // Generar elementos de la paginación para cada página
    for (let i = 1; i <= totalPages; i++) {
        const listItem = document.createElement('li');
        const pageLink = document.createElement('a');
        pageLink.classList.add('pagination-link');
        pageLink.textContent = i;
        pageLink.setAttribute('aria-label', `Goto page ${i}`);
        // Actualizar la tabla al hacer clic en el número de página
        pageLink.addEventListener('click', () => updateTable(i));

        // Resaltar la página actual
        if (i === currentPage) {
            pageLink.classList.add('is-current');
            pageLink.setAttribute('aria-current', 'page');
        }

        listItem.appendChild(pageLink);
        paginationList.appendChild(listItem);
    }
};

// Función para actualizar la tabla de posts
const updateTable = (page) => {
    const postContainer = document.getElementById('postContainer');
    // Limpiar el contenedor antes de agregar nuevos posts
    postContainer.innerHTML = '';

    // Obtener datos de posts de la API
    fetch(`http://localhost:3005/posts?page=${page}`)
        .then(response => response.json())
        .then(data => {
            // Renderizar posts obtenidos
            data.posts.forEach(entry => {
                const column = document.createElement('div');
                column.classList.add('column', 'is-one-third');

                const postCard = document.createElement('div');
                postCard.classList.add('card');

                const postCardContent = document.createElement('div');
                postCardContent.classList.add('card-content');

                // Crear elementos de cada post
                const postTitle = document.createElement('p');
                postTitle.classList.add('title');
                postTitle.textContent = entry.titulo;

                const postCategory = document.createElement('p');
                postCategory.classList.add('subtitle');
                postCategory.textContent = entry.categoria;

                const postAuthor = document.createElement('p');
                postAuthor.textContent = `Autor: ${entry.autor}`;

                const postDate = document.createElement('p');
                const date = new Date(entry.fecha);
                postDate.textContent = `Fecha de publicación: ${date.toLocaleDateString()}`;

                // Crear un enlace para cada post que redirija a la página de detalle del post
                const postLink = document.createElement('a');
                postLink.setAttribute('href', `./pages/post.html?id=${entry._id}`);

                // Agregar elementos al DOM
                postCardContent.appendChild(postTitle);
                postCardContent.appendChild(postCategory);
                postCardContent.appendChild(postAuthor);
                postCardContent.appendChild(postDate);

                postLink.appendChild(postCardContent);
                postCard.appendChild(postLink);
                column.appendChild(postCard);
                postContainer.appendChild(column);
            });

            // Actualizar número de página actual y total de páginas
            currentPage = page;
            totalPages = data.totalPages;

            // Actualizar la paginación después de obtener los datos
            updatePagination();

            // Habilitar/deshabilitar botones de navegación
            const previousButton = document.getElementById("previousPage");
            const nextButton = document.getElementById("nextPage");
            previousButton.disabled = currentPage <= 1;
            nextButton.disabled = currentPage >= totalPages;
        })
        .catch(error => {
            console.error('Hubo un problema al obtener los datos:', error);
        });
};

// Event listener para la página anterior
document.getElementById("previousPage").addEventListener("click", () => {
    if (currentPage > 1) {
        updateTable(currentPage - 1);
    }
});

// Event listener para la siguiente página
document.getElementById("nextPage").addEventListener("click", () => {
    if (currentPage < totalPages) {
        updateTable(currentPage + 1);
    }
});

// Cargar la primera página al cargar la página inicialmente
updateTable(currentPage);