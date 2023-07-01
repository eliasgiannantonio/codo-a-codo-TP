
const URL = "https://jaguero.pythonanywhere.com/"
const app = Vue.createApp({
    data() {
        return {
            // productos: [],
            mostrarCarrito: false,
            carrito: [],
        }
    },
    // created() {
    //     this.obtenerProductos();
    // },
    created() {
        this.obtenerCarrito();
        
    },
    methods: {
        // obtenerProductos() {
        //     fetch(URL + 'runthecode/productos')
        //         .then(response => response.json())
        //         .then(data => {
        //             this.productos = data
        //         })
        //         .catch(error => {
        //             console.error(URL + 'runthecode/productos', error)
        //             alert('Error al obtener los productos.')
        //         })
        // },
        agregarAlCarrito(item) {
            fetch(URL + 'runthecode/carrito', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: item.id,
                    itemsLeft: 1, // Agregamos una unidad al carrito
                }),
            })
                .then(function (res){
                    res.json()
                })
                // .then(response => response.json())
                .then(data => {
                    // alert(data.message);
                    // Actualizamos el carrito después de agregar un producto
                    this.obtenerCarrito();
                    // this.obtenerProductos();
                })
                .catch(error => {
                    console.error('Error al agregar el producto al carrito:', error);
                    alert('Error al agregar el producto al carrito.');
                });
        },
        restarDelCarrito(item) {
            fetch(URL + 'runthecode/carrito', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: item.id,
                    itemsLeft: 1, // Restamos una unidad del carrito
                }),
                mode: 'cors',
            })
                .then(response => response.json())
                .then(data => {
                    // alert(data.message);
                    console.log(data.message)
                    // Actualizamos el carrito después de eliminar un producto
                    this.obtenerCarrito();
                    // this.obtenerProductos();
                })
                .catch(error => {
                    console.error('Error al restar el producto del carrito:', error);
                    alert('Error al restar el producto del carrito.');
                });
        },
        obtenerCarrito() {
            fetch(URL + 'runthecode/carrito')
                .then(response => response.json())
                .then(data => {
                    this.carrito = data
                    this.mostrarCarrito = true
                    console.log(this.carrito)
                })
                .catch(error => {
                    console.error('Error al obtener el carrito:', error)
                    alert('Error al obtener el carrito.')
                })
        },
        sumarPrecios() {
            let total = 0;
            for(let item of this.carrito){
                total += item.price 
            }
            return total
        },
    },
})
app.mount('#app')
