import { supabase } from './supabaseClient.js';

async function cargarcursos() {
    let { data: cursos, error } = await supabase.from('cursos').select('*');
    console.log(cursos);

    if (error) {
        console.error("Error al cargar cursos:", error);
        return;
    }
    let listaCursos = document.getElementById('lista');
    listaCursos.innerHTML = '';
    cursos.forEach(curso => {
        let li = document.createElement('li');
        li.textContent = `${curso.codigo}: ${curso.nombre}`;
        lista.appendChild(li);
    });
}

cargarcursos();