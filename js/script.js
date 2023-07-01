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

// ============= CONTADOR CARRITO NAVBAR ===========

const URL_CARRITO_NAVBAR = "https://jaguero.pythonanywhere.com/"
const itemsCarrito = Vue.createApp({
    data() {
        return {
            mostrarContador: false,
            carrito: [],
        }
    },
    mounted() {
        this.obtenerCarrito();
        
    },
    methods: {
        obtenerCarrito() {
            fetch(URL_CARRITO_NAVBAR + 'runthecode/carrito')
                .then(response => response.json())
                .then(data => {
                    this.carrito = data
                    this.mostrarContador = true
                })
                .catch(error => {
                    console.error('Error al obtener el carrito:', error)
                    alert('Error al obtener el carrito.')
                })
        },
        sumarItems() {
            let total = 0;
            for(let item of this.carrito){
                total += item.itemsLeft 
            }
            return total
        },
    },
})
itemsCarrito.mount('#contador-carrito')

