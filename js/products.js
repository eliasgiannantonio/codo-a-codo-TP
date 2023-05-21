const url = 'https://apimocha.com/runthecode/posts';
const options = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
};

fetch(url, options)
  .then(res =>res.json())
  .then(productList => {
        console.log(productList);
    let card = "";
    productList.forEach(item => {
            card += `
            <div class="card_product">
                <img src="${item.img}" alt="imagen del producto">
                <p class="modelo">${item.name}</p>
                <p class="precio">€ ${item.price}</p>
            </div>`;
    })
    document.querySelector(".product_container").innerHTML = card;
})
    .catch(error => console.log(error))