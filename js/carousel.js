const slider = document.querySelector('.carousel__track'); // o probar .carousel__track
let sliderSection = document.querySelectorAll('.carousel__slide');
let sliderSectionLast = sliderSection[sliderSection.length -1];

const bntLeft = document.querySelector('.carousel__button--left');
const bntRight = document.querySelector('.carousel__button--right');

slider.insertAdjacentElement('afterbegin', sliderSectionLast);

function Next() {
    let sliderSectionFirst = document.querySelectorAll('.carousel__slide')[0];
    slider.style.marginLeft ='-200%';
    slider.style.transition ='all 0.8s';
    setTimeout(function(){
        slider.style.transition  = 'none';
        slider.insertAdjacentElement('beforeend', sliderSectionFirst);
        slider.style.marginLeft = '-100%';
    }, 800);
}

function Prev() {
    let sliderSection = document.querySelectorAll('.carousel__slide');
    let sliderSectionLast = sliderSection[sliderSection.length -1];
    slider.style.marginLeft ='0';
    slider.style.transition ='all 0.8s';
    setTimeout(function(){
        slider.style.transition  = 'none';
        slider.insertAdjacentElement('afterbegin', sliderSectionLast);
        slider.style.marginLeft = '-100%';
    }, 800);
}

bntRight.addEventListener('click', function(){
    Next();
});

bntLeft.addEventListener('click', function(){
    Prev();
});

setInterval(function(){
    Next();
}, 8000);
