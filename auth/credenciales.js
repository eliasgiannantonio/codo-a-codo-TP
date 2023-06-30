document.addEventListener("DOMContentLoaded", function() {
    // Verificar si el usuario ha iniciado sesión
    if (!sessionStorage.getItem('loggedIn')) {
        // Redirigir a la página de inicio de sesión si no ha iniciado sesión
        window.location.href = 'auth/login.html';
        
    }
    return
});