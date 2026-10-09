function moverCarrusel(carruselId, direccion) {
    const carrusel = document.getElementById(carruselId);
    if (!carrusel) return;

    const imagenes = carrusel.querySelectorAll('.img-slide');
    if (imagenes.length === 0) return;

    let indiceActivo = -1;

    imagenes.forEach((img, index) => {
        if (img.classList.contains('active')) {
            indiceActivo = index;
            img.classList.remove('active');
        }
    });

    let nuevoIndice = indiceActivo + direccion;

    if (nuevoIndice >= imagenes.length) {
        nuevoIndice = 0;
    } else if (nuevoIndice < 0) {
        nuevoIndice = imagenes.length - 1;
    }

    imagenes[nuevoIndice].classList.add('active');
}

function inicializarFormularioWhatsApp() {
    const formConsulta = document.getElementById('form-consulta');
    if (formConsulta) {
        formConsulta.addEventListener('submit', function(event) {
            event.preventDefault();

            const numeroTelefono = "595962125194";
            const tipoTrabajo = document.getElementById('tipo_trabajo').value;
            const detalles = document.getElementById('mensaje_usuario').value;

            let texto = "Hola, quisiera consultar por un trabajo de tapicería.\n\n";
            texto += "Interés: " + tipoTrabajo + "\n";

            if (detalles.trim() !== "") {
                texto += "Detalles/Idea: " + detalles + "\n";
            }

            texto += "\n¿Podrían orientarme sobre los costos y el proceso?";

            const urlWhatsApp = "https://wa.me/" + numeroTelefono + "?text=" + encodeURIComponent(texto);
            window.open(urlWhatsApp, '_blank');
        });
    }
}

let imagenesGrupo = [];
let indiceActual = 0;

function abrirModalImagen(imgSeleccionada) {
    const modal = document.getElementById('modal-imagen');
    if (!modal) return;
    
    const contenedorPadre = imgSeleccionada.closest('.carrusel') || 
                            imgSeleccionada.closest('.tarjeta') || 
                            imgSeleccionada.closest('.contenedor-telas');
    
    if (contenedorPadre) {
        imagenesGrupo = Array.from(contenedorPadre.querySelectorAll('img'));
    } else {
        imagenesGrupo = [imgSeleccionada];
    }

    indiceActual = imagenesGrupo.indexOf(imgSeleccionada);
    if (indiceActual === -1) indiceActual = 0;

    actualizarImagenModal();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function navegarModal(direccion) {
    if (imagenesGrupo.length <= 1) return;
    
    indiceActual += direccion;
    
    if (indiceActual >= imagenesGrupo.length) {
        indiceActual = 0;
    } else if (indiceActual < 0) {
        indiceActual = imagenesGrupo.length - 1;
    }

    actualizarImagenModal();
}

function actualizarImagenModal() {
    const imgAmpliada = document.getElementById('img-ampliada');
    if (imgAmpliada && imagenesGrupo[indiceActual]) {
        imgAmpliada.src = imagenesGrupo[indiceActual].src;
        imgAmpliada.alt = imagenesGrupo[indiceActual].alt || 'Imagen ampliada';
    }
}

function cerrarModalImagen(event) {
    if (!event || event.target.id === 'modal-imagen' || event.target.classList.contains('cerrar-modal')) {
        const modal = document.getElementById('modal-imagen');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
}

function inicializarModoOscuro() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    if (!themeToggleBtn) return;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeIcon) {
            themeIcon.className = 'fa-solid fa-sun';
        }
    }

    themeToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        if (themeIcon) {
            themeIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarModoOscuro();
    inicializarFormularioWhatsApp();

    const imagenes = document.querySelectorAll('.carrusel img, .contenedor-telas img');
    imagenes.forEach(img => {
        img.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                abrirModalImagen(e.target);
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('modal-imagen');
        if (modal && modal.style.display === 'flex') {
            if (e.key === 'ArrowRight') navegarModal(1);
            if (e.key === 'ArrowLeft') navegarModal(-1);
            if (e.key === 'Escape') cerrarModalImagen();
        }
    });
});
