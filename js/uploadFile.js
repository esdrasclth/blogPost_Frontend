// Función para subir un archivo al servidor
function uploadFile() {
  const form = document.getElementById("uploadForm");
  const formData = new FormData(form);

  // Enviar solicitud POST para subir el archivo
  fetch("http://localhost:3005/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        openModal(); // Mostrar modal de éxito si la respuesta es exitosa
      } else {
        // Mostrar mensaje de error si la respuesta no es exitosa
        document.getElementById('errorNotification').style.display = 'block';
        // Ocultar el mensaje de error después de 5 segundos
        setTimeout(() => {
          document.getElementById('errorNotification').style.display = 'none';
        }, 5000); // 5000 milisegundos = 5 segundos
        throw new Error('Respuesta incorrecta');
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error al subir el archivo:", error);
    });
}

// Función para abrir el modal de éxito
function openModal() {
  const modal = document.getElementById("successModal");
  modal.classList.add("is-active");

  clearForm();

  // Cerrar automáticamente el modal después de 5 segundos
  setTimeout(() => {
    closeModal();
  }, 5000)
}

// Función para cerrar el modal de éxito
function closeModal() {
  const modal = document.getElementById("successModal");
  modal.classList.remove("is-active");
}

// Función para limpiar el formulario después de subir el archivo
function clearForm() {
  const form = document.getElementById("uploadForm");
  form.reset(); // Esto limpia todos los campos del formulario
}
