const url = 'https://jaguero.pythonanywhere.com/';

const shopProducts = Vue.createApp({
    data() {
        return {
            productos: [],
            abrirModal: false,
            productoSeleccionado: [],
            categoriasUnicas: [],
            categoriaSeleccionada: [],
            marcasUnicas: [],
            marcaSeleccionada: [],
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
                    // Este es un map solo para generar como prueva un nuevo array solo con los styles de cada objeto
                    const categorias = this.productos.map(producto => ({ style: producto.style }));
                    // este metodo filtra las categorias unicas en funcion a los valores de las prop style
                    this.categoriasUnicas = categorias.filter((item, index) => categorias.findIndex(elemento => elemento.style === item.style) === index);

                    const marcas = this.productos.map(producto => ({ brand: producto.brand }));
                    this.marcasUnicas = marcas.filter((itemB, index) => marcas.findIndex(elemento1 => elemento1.brand === itemB.brand) === index);
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
                    return res.json();
                })
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
        filtarCategoria(categoria, marca) {
            this.categoriaSeleccionada = this.productos.filter(producto => producto.style === categoria.style);

        },
        quitarCategoria() {
            this.categoriaSeleccionada = []
            // this.categoriaSeleccionada = this.categoriaSeleccionada.filter(producto => !this.productos.some(p => p.style === producto.style));
        },
        filtrarMarca(marca) {
            this.categoriaSeleccionada = this.productos.filter(producto => producto.brand === marca.brand);
        },
        // quitarMarca() {
        //     this.categoriaSeleccionada = this.categoriaSeleccionada.filter(producto => !this.productos.some(p => p.brand === producto.brand));
        // },

    },


})
shopProducts.mount('#app')