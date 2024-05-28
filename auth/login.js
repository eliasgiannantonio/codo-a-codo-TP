// Manejador del evento de envío del formulario de inicio de sesión
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío del formulario

    // Obtener los valores de nombre de usuario y contraseña del formulario
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const URL = "https://jaguero.pythonanywhere.com/"
    // Realizar una solicitud a la API para autenticar al usuario
    fetch(URL + "runthecode/login", {   
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (response.ok) {
                // Autenticación exitosa, redirigir al inventario.html
                window.location.href = "/inventario.html";
                sessionStorage.setItem('loggedIn', true);
            } else {
                // Autenticación fallida, mostrar mensaje de error
                alert("Credenciales inválidas. Inténtalo de nuevo.");
            }
        })
        .catch(error => {
            console.error("Error en la autenticación:", error);
        });
});