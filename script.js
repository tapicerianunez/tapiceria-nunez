// --- LÓGICA DE NAVEGACIÓN DE CARRUSELES EN LA PÁGINA ---
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

// --- REDIRECCIÓN DIRECTA A WHATSAPP ---
const formConsulta = document.getElementById('form-consulta');
if (formConsulta) {
    formConsulta.addEventListener('submit', function(event) {
        event.preventDefault();

        const numeroTelefono = "595962125194";
        const tipoTrabajo = document.getElementById('tipo_trabajo').value;
        const detalles = document.getElementById('mensaje_usuario').value;

        // Construcción limpia del mensaje sin asteriscos conflictivos al inicio
        let texto = "Hola, quisiera consultar por un trabajo de tapicería.\n\n";
        texto += "Interés: " + tipoTrabajo + "\n";

        if (detalles.trim() !== "") {
            texto += "Detalles/Idea: " + detalles + "\n";
        }

        texto += "\n¿Podrían orientarme sobre los costos y el proceso?";

        // Codificación correcta de la URL
        const urlWhatsApp = "https://wa.me/" + numeroTelefono + "?text=" + encodeURIComponent(texto);
        
        window.open(urlWhatsApp, '_blank');
    });
}


// --- LÓGICA DEL VISOR EN PANTALLA COMPLETA (MODAL) ---
let imagenesGrupo = [];
let indiceActual = 0;

// Abrir imagen en pantalla completa detectando las imágenes del mismo bloque
function abrirModalImagen(imgSeleccionada) {
    const modal = document.getElementById('modal-imagen');
    if (!modal) return;
    
    // Identificar el grupo de imágenes (carrusel, tarjeta o contenedor)
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
    document.body.style.overflow = 'hidden'; // Evita el scroll del fondo
}

// Cambiar a la siguiente / anterior imagen dentro del modal
function navegarModal(direccion) {
    if (imagenesGrupo.length <= 1) return;
    
    indiceActual += direccion;
    
    if (indiceActual >= imagenesGrupo.length) {
        indiceActual = 0; // Vuelve a la primera
    } else if (indiceActual < 0) {
        indiceActual = imagenesGrupo.length - 1; // Va a la última
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

// Cerrar el visor
function cerrarModalImagen(event) {
    // Se cierra al hacer clic en el fondo o en la 'X' (pero no en la propia imagen ni botones)
    if (!event || event.target.id === 'modal-imagen' || event.target.classList.contains('cerrar-modal')) {
        const modal = document.getElementById('modal-imagen');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restablece el scroll
        }
    }
}

// --- LÓGICA DE MODO OSCURO / MODO CLARO ---
function inicializarModoOscuro() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    // Cargar preferencia previa del usuario desde localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    // Evento al hacer clic en el botón de alternar tema
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            let isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');

            if (themeIcon) {
                if (isDark) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                } else {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
            }
        });
    }
}

// --- ASIGNAR EVENTOS GLOBALES AL CARGAR LA PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la funcionalidad del modo oscuro
    inicializarModoOscuro();

    // Asignar clic a las imágenes de los carruseles y muestrarios
    const imagenes = document.querySelectorAll('.carrusel img, .contenedor-telas img');
    imagenes.forEach(img => {
        img.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                abrirModalImagen(e.target);
            }
        });
    });

    // Control por Teclado: Flecha Izquierda (←), Flecha Derecha (→) y Escape (Esc)
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('modal-imagen');
        if (modal && modal.style.display === 'flex') {
            if (e.key === 'ArrowRight') navegarModal(1);
            if (e.key === 'ArrowLeft') navegarModal(-1);
            if (e.key === 'Escape') cerrarModalImagen();
        }
    });
});
