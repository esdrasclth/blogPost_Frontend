// Obtener el parámetro de la URL para el ID del post
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

// Obtener el post con el ID específico
fetch(`http://localhost:3005/posts/${postId}`)
    .then(response => response.json())
    .then(data => {
        const post = data.post;

        // Obtener elementos del DOM para mostrar el post
        const postTitleElement = document.getElementById('postTitle');
        const postContentElement = document.getElementById('postContent');
        const postMetaElement = document.getElementById('postMeta');

        // Mostrar los detalles del post en los elementos correspondientes
        postTitleElement.textContent = post.titulo;
        postContentElement.innerHTML = post.contenido;
        postMetaElement.innerHTML = `<strong>Categoría:</strong> ${post.categoria} | <strong>Autor:</strong> ${post.autor} | <strong>Fecha:</strong> ${new Date(post.fecha).toLocaleDateString()}`;
    })
    .catch(error => {
        console.error('Hubo un problema al obtener el post:', error);
    });