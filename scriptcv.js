// Elementos principales de las vistas
const mainCvView = document.getElementById('main-cv-view');
const viewProject1 = document.getElementById('view-project-1');
const viewProject2 = document.getElementById('view-project-2');

// Botones de navegación hacia los proyectos
const btnProject1 = document.getElementById('btn-project-1');
const btnProject2 = document.getElementById('btn-project-2');

// Botones de regreso al CV
const backButtons = document.querySelectorAll('.back-to-cv');

// Elementos de los contacto 
const toggleContact = document.getElementById('toggle-contact');
const contactBox = document.getElementById('contact-box');

// --- Navegacion entre los proyectos

// Ir al Proyecto 1
btnProject1.addEventListener('click', () => {
    mainCvView.style.display = 'none';
    viewProject1.style.display = 'block';
});

// Ir al Proyecto 2
btnProject2.addEventListener('click', () => {
    mainCvView.style.display = 'none';
    viewProject2.style.display = 'block';
});

// Regresar al CV desde uno de los proyectos
backButtons.forEach(button => {
    button.addEventListener('click', () => {
        viewProject1.style.display = 'none';
        viewProject2.style.display = 'none';
        mainCvView.style.display = 'block';
    });
});

// --- COMPORTAMIENTO DESPLEGABLE DE CONTACTO ---

toggleContact.addEventListener('click', () => {
    // Si está oculto, lo mostramos; si está visible, lo ocultamos
    if (contactBox.style.display === 'none') {
        contactBox.style.display = 'block';
    } else {
        contactBox.style.display = 'none';
    }
});