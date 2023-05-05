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



