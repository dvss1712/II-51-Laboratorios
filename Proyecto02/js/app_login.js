// js/app_login.js
const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const usuario = document.getElementById("usuario").value;
    const clave = document.getElementById("clave").value;

    // Validación básica simulada
    if (usuario === "admin" && clave === "123") {
      alert("¡Acceso concedido!");
      window.location.href = "estudiantes.html"; 
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  });
}