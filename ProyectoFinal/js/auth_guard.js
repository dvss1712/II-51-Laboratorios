// js/auth_guard.js

document.addEventListener('DOMContentLoaded', () => {
    const usuarioActivo = localStorage.getItem('usuario_activo');
    const rutaActual = window.location.pathname;

    // --- 1. BLOQUEO DE PÁGINAS ---
    // Si NO hay usuario y estamos en páginas protegidas
    if (!usuarioActivo) {
        if (rutaActual.includes('cursos.html') || 
            rutaActual.includes('estudiantes.html') || 
            rutaActual.includes('profesores.html')) {
            
            alert("Debes iniciar sesión para acceder aquí.");
            // Redirigir al login (ajustar ruta según dónde estemos)
            if (rutaActual.includes('Pages')) {
                window.location.href = 'login.html';
            } else {
                window.location.href = 'Pages/login.html';
            }
        }
    }

    // --- 2. GESTIÓN DEL MENÚ (NAVBAR) ---
    const navLinks = document.querySelectorAll('.main-nav a');
    const loginLink = document.querySelector('.main-nav a[href*="login.html"]');

    if (!usuarioActivo) {
        // Si NO está logueado: Ocultar enlaces de gestión
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href.includes('cursos') || href.includes('estudiantes') || href.includes('profesores')) {
                link.parentElement.style.display = 'none'; // Ocultar <li>
            }
        });
    } else {
        // Si SÍ está logueado: Cambiar "Login" por "Cerrar Sesión"
        if (loginLink) {
            loginLink.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Salir';
            loginLink.href = "#";
            loginLink.onclick = (e) => {
                e.preventDefault();
                if(confirm("¿Deseas cerrar sesión?")) {
                    localStorage.removeItem('usuario_activo');
                    window.location.reload(); // Recargar para aplicar cambios
                }
            };
        }
    }
});