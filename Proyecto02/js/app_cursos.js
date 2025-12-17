let cursos = [];
let editando = false;
let indexEdit = -1;

function guardar() {
  const c = {
    codigo: codigo.value,
    nombre: nombre.value,
    creditos: creditos.value
  };

  if (editando) {
    cursos[indexEdit] = c;
    editando = false;
    indexEdit = -1;
    titulo.textContent = "Registrar Curso";
  } else {
    cursos.push(c);
  }

  limpiar();
  cargar();
}

function cargar() {
  tabla.innerHTML = "";
  cursos.forEach((c, i) => {
    tabla.innerHTML += `
      <tr>
        <td>${c.codigo}</td>
        <td>${c.nombre}</td>
        <td>${c.creditos}</td>
        <td>
          <button onclick="editar(${i})">✏️</button>
          <button onclick="eliminar(${i})">🗑️</button>
        </td>
      </tr>
    `;
  });
}

function editar(i) {
  const c = cursos[i];
  codigo.value = c.codigo;
  nombre.value = c.nombre;
  creditos.value = c.creditos;
  editando = true;
  indexEdit = i;
  titulo.textContent = "Editar Curso";
}

function eliminar(i) {
  if (confirm("¿Eliminar curso?")) {
    cursos.splice(i, 1);
    cargar();
  }
}

function limpiar() {
  codigo.value = "";
  nombre.value = "";
  creditos.value = "";
}

function cancelar() {
  limpiar();
  editando = false;
  titulo.textContent = "Registrar Curso";
}
