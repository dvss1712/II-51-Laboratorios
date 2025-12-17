import { supabase } from "./supabaseClient.js";

const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('usuario').value; // Usamos el ID 'usuario' para el email
        const password = document.getElementById('clave').value;

        try {
            // Consulta a la tabla 'usuarios'
            const { data, error } = await supabase
                .from('usuarios')
                .select('*')
                .eq('email', email)
                .eq('password', password)
                .single();

            if (error || !data) {
                alert('Credenciales incorrectas');
                return;
            }

            // Guardar sesión simulada en LocalStorage
            localStorage.setItem('usuario_activo', JSON.stringify(data));
            
            alert('¡Bienvenido!');
            // Redirigir al inicio (ajusta la ruta si es necesario)
            window.location.href = '../index.html';

        } catch (err) {
            console.error("Error inesperado:", err);
            alert("Ocurrió un error al intentar iniciar sesión.");
        }
    });
}