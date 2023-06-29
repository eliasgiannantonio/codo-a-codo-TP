// ====  menu hamburguesa ===

const nav_container = document.querySelector('.nav--container');
const abrir = document.querySelector('#abrir_menu');
const cerrar = document.querySelector('#cerrar_menu');

abrir.addEventListener("click", () => {
    nav_container.classList.add("visible");
})

cerrar.addEventListener("click", () => {
    nav_container.classList.remove("visible");
})

// ======== navbar efecto: cambio de color ===


document.addEventListener("scroll", () => {
    const navbar = document.querySelector(".header--container");
    if(window.scrollY > 0) {
        navbar.classList.add("scroll")
    } else {
        navbar.classList.remove("scroll")
    }

})


