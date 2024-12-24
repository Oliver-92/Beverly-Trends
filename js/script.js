const btnTop = document.getElementById('btnTop');

// Mostrar botón al hacer scroll
window.onscroll = function () {
    if (document.documentElement.scrollTop > 300) {
        btnTop.classList.remove('d-none'); // Mostrar botón
    } else {
        btnTop.classList.add('d-none'); // Ocultar botón
    }
};

// Función para regresar al inicio
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Scroll suave
    });
}