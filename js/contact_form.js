const inputs = document.querySelectorAll('.form input');
const labels = document.querySelectorAll('.form label');
const textarea = document.querySelectorAll('.form textarea');
const textareaLabels = document.querySelectorAll('.form textarea ~ label');

inputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        if (input.value.trim().length > 0) {
            labels[index].style.top = '-11px';
        } else {
            labels[index].style.top = '12px';
        }
    });
});


textarea.forEach((textarea, index) => {
    textarea.addEventListener('input', () => {
        if (textarea.value.trim().length > 0) {
            textareaLabels[index].style.top = '-11px';
        } else {
            textareaLabels[index].style.top = '12px';
        }
    });
});


function validarFormulario(event) {
    event.preventDefault();

    var nameInput = document.getElementById('name');
    var emailInput = document.getElementById('email');
    var emailError = document.getElementById('emailError');
    var commentInput = document.getElementById('comment');

    if (nameInput.value === '' || emailInput.value === '' || commentInput.value === '') {
        alert('Por favor, completa todos los campos.');
        return false;
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        emailError.textContent = 'Correo electrónico inválido, asegúrate de escribir uno válido.';
        return false;
    } else {
        emailError.textContent = '';
    }

    alert('Mensaje enviado con éxito');
    return true;
}




