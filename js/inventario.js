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

buttonAlta.addEventListener('click', function() {
    hideAllSections()
    let element = document.querySelector('.alta__productos--container')
    element.classList.toggle('hidden')
})

buttonModificar.addEventListener('click', function() {
    hideAllSections()
    let element = document.querySelector('.modificar__productos--container')
    element.classList.toggle('hidden')
})
buttonBaja.addEventListener('click', function() {
    hideAllSections()
    let element = document.querySelector('.baja__productos--container')
    element.classList.toggle('hidden')
})
buttonListar.addEventListener('click', function() {
    hideAllSections()
    let element = document.querySelector('.listar__productos--container')
    element.classList.toggle('hidden')
})
