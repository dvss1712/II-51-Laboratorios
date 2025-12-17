function verificarSesion() {
  if (localStorage.getItem("logueado") !== "true") {
    window.location.href = "login.html";
  }
}

function cerrarSesion() {
  localStorage.removeItem("logueado");
  window.location.href = "login.html";
}
