const modal = document.querySelector(".modal");
const btnSelectRuleta = document.querySelector(".modal_ruleta");
const btnSelectorManual = document.querySelector(".modal_manual");
const closeModal = document.querySelector(".modal_close");
document.addEventListener("DOMContentLoaded", function () {
    modal.classList.add("modal--show");
})


//Mostrar y ocultar ruleta

function mostrarRuleta() {
    document.getElementById("container").style.visibility = "visible";
    modal.classList.remove("modal--show");
}

function mostrarManual() {
    document.getElementById("categoria").style.visibility = "visible";
    modal.classList.remove("modal--show");
    document.getElementById("categoria").classList.add("categoria_manual_activa");
}

