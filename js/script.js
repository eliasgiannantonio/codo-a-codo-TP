const nav_container = document.querySelector('.nav--container');
const abrir = document.querySelector('#abrir_menu');
const cerrar = document.querySelector('#cerrar_menu');

abrir.addEventListener("click", () => {
    nav_container.classList.add("visible");
})

cerrar.addEventListener("click", () => {
    nav_container.classList.remove("visible");
})