import { supabase } from './supabaseClient.js';

const form = document.getElementById('curso-form');
const inputid = document.getElementById('id');
const inputcodigo = document.getElementById('codigo');
const inputnombre = document.getElementById('nombre');
const inputcreditos = document.getElementById('creditos');
const btnSave = document.getElementById("btn-save");
const btnCancel = document.getElementById("btn-cancel");
const statusDiv = document.getElementById("status");
 
// 
// eventos
//=========================
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const codigo = inputcodigo.value.trim();
    const nombre = inputnombre.value.trim();
    const creditos = parseInt(inputcreditos.value);
    if (editando) {}
    else {await crearcurso(codigo, nombre, creditos);}
   
});

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
        li.textContent = `${curso.codigo} - ${curso.nombre} [${curso.creditos} créditos]`;
        lista.appendChild(li);
    });
}
async function crearcurso(codigo, nombre, creditos) {
    const curso = { codigo, nombre, creditos };
    let { data, error } = await supabase.from('cursos').select('*')
}
cargarcursos();