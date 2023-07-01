const url = 'https://jaguero.pythonanywhere.com/runthecode/productos';
const options = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
};

fetch(url, options)
    .then(res => res.json())
    .then(productList => {
        console.log(productList);
        let card = "";
        productList.forEach(item => {
            card += `
            <div class="card_product">
                <img src="${item.img}" alt="imagen del producto">
                <p class="modelo">${item.name}</p>
                <p class="precio">€ ${item.price}</p>
                <div class="contador">
                    <button class="btn-decrement">-</button>
                    <span class="cantidad">0</span>
                    <button class="btn-increment">+</button>
                </div>
                <button class="btn-agregar-carrito">Agregar al carrito</button>
            </div>`;
        })
        document.querySelector(".product_container").innerHTML = card;

        // Incrementar y decrementar cantidad
        const decrementButtons = document.querySelectorAll(".btn-decrement");
        const incrementButtons = document.querySelectorAll(".btn-increment");
        const cantidadElements = document.querySelectorAll(".cantidad");

        decrementButtons.forEach((button, index) => {
            button.addEventListener("click", () => {
                const cantidad = parseInt(cantidadElements[index].textContent);
                if (cantidad > 0) {
                    cantidadElements[index].textContent = cantidad - 1;
                }
            });
        });

        incrementButtons.forEach((button, index) => {
            button.addEventListener("click", () => {
                const cantidad = parseInt(cantidadElements[index].textContent);
                cantidadElements[index].textContent = cantidad + 1;
            });
        });

        // Agregar al carrito
        const agregarCarritoButtons = document.querySelectorAll(".btn-agregar-carrito");

        agregarCarritoButtons.forEach((button, index) => {
            button.addEventListener("click", () => {
                const cantidad = parseInt(cantidadElements[index].textContent);
                const producto = productList[index];

                // Aquí puedes realizar la lógica para agregar el producto al carrito con la cantidad seleccionada
                agregarAlCarrito(producto); // Llamada a la función agregarAlCarrito

                console.log(`Agregado al carrito: ${producto.name}, Cantidad: ${cantidad}`);
            });
        });

        function agregarAlCarrito(producto) {
            const URL = "https://jaguero.pythonanywhere.com/runthecode";
            fetch(URL + '/carrito', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: producto.id,
                    itemsLeft: 1, // Agregamos una unidad al carrito
                }),
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.message)
                    // este metodo renderiza nuevamente dps de realizar la accion
                    this.obtenerProductos()
                })
                .catch(error => {
                    console.error('Error al agregar el producto al carrito:',
                        error)
                    alert('Error al agregar el producto al carrito.')
                })
        }
    })
    .catch(error => console.log(error));