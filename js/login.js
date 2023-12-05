document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    // Verificar si la página actual no es la página de inicio de sesión y no hay token almacenado
    if (token) {
        window.location.href = "./admin.html"; // Redirigir a la página de inicio de sesión
    }
})

// Seleccionar elementos del formulario y campos de entrada
const form = document.querySelector('form');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');

// Manejar el envío del formulario
form.addEventListener('submit', e => {
    e.preventDefault();

    // Obtener valores del formulario
    const email = emailInput.value;
    const password = passwordInput.value;

    // Enviar solicitud POST con datos del formulario
    fetch('http://localhost:3005/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(response => {
            if (!response.ok) {
                document.getElementById('errorNotification').style.display = 'block';
                // Ocultar el mensaje de error después de 5 segundos
                setTimeout(() => {
                    document.getElementById('errorNotification').style.display = 'none';
                }, 5000); // 5000 milisegundos = 5 segundos
                throw new Error('Respuesta incorrecta');
            }
            return response.json();
        })
        .then(data => {
            // Manejar respuesta exitosa
            console.log(data.token);
            localStorage.setItem('token', data.token);
            window.location.href = './admin.html';
        })
        .catch(error => console.error('Error:', error));
});