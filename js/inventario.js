// ===========================================
// ================  toggle function =========
const buttonAlta = document.querySelector('#alta-productos')
const buttonModificar = document.querySelector('#modificar-productos')
const buttonBaja = document.querySelector('#baja-productos')
const buttonListar = document.querySelector('#listar-productos')

function hideAllSections() {
    const sections = document.querySelectorAll('section')
    sections.forEach((section) => {
        if (!section.classList.contains('hidden'))
            section.classList.add('hidden')
    })
}

buttonAlta.addEventListener('click', function () {
    hideAllSections()
    let element = document.querySelector('.alta__productos--container')
    element.classList.toggle('hidden')
})

buttonModificar.addEventListener('click', function () {
    hideAllSections()
    let element = document.querySelector('.modificar__productos--container')
    element.classList.toggle('hidden')
})
buttonBaja.addEventListener('click', function () {
    hideAllSections()
    let element = document.querySelector('.baja__productos--container')
    element.classList.toggle('hidden')
})

let productosListados = false;
buttonListar.addEventListener('click', function () {
    hideAllSections()
    let element = document.querySelector('.listar__productos--container')
    element.classList.toggle('hidden')
    if (!productosListados) {
        listarProductos(); // Llamar a la función solo la primera vez
        productosListados = true; // Actualizar la variable para indicar que los productos ya se cargaron
    }
})

// =======================================================================
// ============= ALTAS ==============0
// =======================================================================

const URL = "https://jaguero.pythonanywhere.com/"
// Capturamos el evento de envío del formulario
document.getElementById('formulario').addEventListener('submit',
    function (event) {
        event.preventDefault() // Evitamos que se recargue la página
        // Obtenemos los valores del formulario
        var id = document.getElementById('id').value
        var name = document.getElementById('name').value
        var brand = document.getElementById('brand').value
        var style = document.getElementById('style').value
        var price = document.getElementById('price').value
        var itemsLeft = document.getElementById('itemsLeft').value
        var img = document.getElementById('img').value
        var description = document.getElementById('description').value
        // Creamos un objeto con los datos del producto
        var producto = {
            id: id,
            name: name,
            brand: brand,
            style: style,
            price: price,
            itemsLeft: itemsLeft,
            img: img,
            description: description
        }
        console.log(producto)
        // Realizamos la solicitud POST al servidor
        fetch(URL + 'runthecode/productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json() // Parseamos la respuesta JSON
                } else {
                    throw new Error('Error al agregar el producto.')
                }
            })
            .then(function (data) {
                alert('Producto agregado correctamente.')
                document.getElementById('id').value = ""
                document.getElementById('name').value = ""
                document.getElementById('brand').value = ""
                document.getElementById('style').value = ""
                document.getElementById('price').value = ""
                document.getElementById('itemsLeft').value = ""
                document.getElementById('img').value = ""
                document.getElementById('description').value = ""
            })
            .catch(function (error) {
                console.log('Error:', error)
                alert('Error al agregar el producto.')
            })
    })

// =======================================================================
// ============================= MODIFICAR ===========
// =======================================================================
const modify = Vue.createApp({
    data() {
        return {
            id: '',
            name: '',
            brand: '',
            style: '',
            price: '',
            itemsLeft: '',
            img: '',
            description: '',
            mostrarDatosProducto: false,
        }
    },
    methods: {
        obtenerProducto() {
            fetch(URL + 'runthecode/productos/' + this.id)
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        throw new Error('Error al obtener los datos del producto.')
                    }
                })
                .then(data => {
                    this.name = data.name
                    this.brand = data.brand
                    this.style = data.style
                    this.price = data.price
                    this.itemsLeft = data.itemsLeft
                    this.img = data.img
                    this.description = data.description
                    this.mostrarDatosProducto = true
                }
                )
                .catch(error => {
                    alert('Error al obtener los datos del producto.')
                })
        },
        guardarCambios() {
            const producto = {
                id: this.id,
                name: this.name,
                brand: this.brand,
                style: this.style,
                price: this.price,
                itemsLeft: this.itemsLeft,
                img: this.img,
                description: this.description
            }
            fetch(URL + 'runthecode/productos/' + this.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(producto)
            })
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        throw new Error('Error al guardar los cambios del producto.')
                    }
                })
                .then(data => {
                    alert('Cambios guardados correctamente.')
                    location.reload()
                })
                .catch(error => {
                    alert('Error al guardar los cambios del producto.')
                })
        }
    }
})
modify.mount('.modificar__productos--container')


// =======================================================================
// ============================  BAJA ================
// =======================================================================

const app = Vue.createApp({
    data() {
        return {
            productos: []
        }
    },

    methods: {
        obtenerProductos() {
            const URL = "https://jaguero.pythonanywhere.com/"
            fetch(URL + 'runthecode/productos')
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
        eliminarProducto(id) {
            const URL = "https://jaguero.pythonanywhere.com/"
            if (confirm("Esta seguro que desea eliminar este producto del inventario?")) {
                fetch(URL + `runthecode/productos/${id}`, { method: 'DELETE' })
                    .then(response => {
                        if (response.ok) {
                            // Eliminar el producto de la lista después de eliminarlo en el servidor
                            this.productos =
                                this.productos.filter(producto => producto.id !== id)
                            alert('Producto eliminado correctamente.')
                        }
                    })
                    .catch(error => {
                        console.log('Error:', error)
                        alert('Error al eliminar el producto.')
                    })
            }
        },
    },
})
app.mount('.baja__productos--container')




// =======================================================================
//   =============== LISTAR PRODUCTOS ==================
// =======================================================================

// Realizamos la solicitud GET al servidor para obtener todos los productos

function getProducts() {
    const sectionIsShowed = document.querySelector('.listar__productos--container')
    if (!sectionIsShowed.classList.contains('hidden')) {
        listarProductos()
    };
}

function listarProductos() {
    fetch(URL + 'runthecode/productos')
        .then(function (response) {
            if (response.ok) {
                return response.json() // Parseamos la respuesta JSON
            } else {
                throw new Error('Error al obtener los productos.')
            }
        })
        .then(function (data) {
            var tablaProductos =
                document.getElementById('tablaProductos')
            // Iteramos sobre los productos y agregamos filas a la tabla
            data.forEach(function (producto) {
                var fila = document.createElement('tr')
                fila.innerHTML = '<td>' + producto.id + '</td>' +     //IMPORTANTE!! QUITAR EL STYLE DE IMG
                    `<td><img src="${producto.img}" alt="Imagen del producto ${producto.name}" style="width: 5em;"></td>` +
                    '<td>' + producto.name + '</td>' +
                    '<td align="right">' + producto.brand + '</td>' +
                    '<td align="right">' + producto.style + '</td>' +
                    '<td align="right">' + producto.price + '</td>' +
                    '<td align="right">' + producto.itemsLeft + '</td>' +
                    '<td align="left">' + producto.description + '</td>';
                tablaProductos.appendChild(fila)
            })
        })
        .catch(function (error) {
            console.log('Error:', error)
            alert('Error al obtener los productos.')
        })
}