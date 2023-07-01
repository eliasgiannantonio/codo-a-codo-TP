const url = 'https://jaguero.pythonanywhere.com/';

const shopProducts = Vue.createApp({
    data() {
        return {
            productos: [],
            abrirModal: false,
            productoSeleccionado: [],
        }
    },
    created() {
        this.obtenerProductos()
    },

    methods: {
        obtenerProductos() {
            fetch(url + 'runthecode/productos')
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        throw new Error('Error al obtener los productos.')
                    }
                })
                .then(data => {
                    this.productos = data
                })
                .catch(error => {
                    console.log('Error:', error)
                    alert('Error al obtener los productos.')
                })
        },
        agregarAlCarrito(productoSeleccionado) {
            // return console.log(productoSeleccionado)
            fetch(url + 'runthecode/carrito', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: productoSeleccionado.id,
                    itemsLeft: 1, // Agregamos una unidad al carrito
                }),
            })
                .then(function (res) {
                    return res.json();})
                .then(data => {
                        alert(data.message);
                        this.abrirModal = false
                        productoSeleccionado = []
                        location.reload();
                    })
                    .catch(error => {
                        console.error('Error al agregar el producto al carrito:', error);
                        alert('Error al agregar el producto al carrito.');
                    });
        },
        verProducto(producto) {
            this.productoSeleccionado = producto
            this.abrirModal = true
        },
        cerrarModal() {
            this.abrirModal = false
        },

    },


})
shopProducts.mount('.grid_wrapper_products')