const ruleta = document.getElementById("ruleta");
let opcionContainer;
let opciones = Array.from(document.getElementsByClassName("opcion"));
const root = document.documentElement;
let ganador = "";
let sorteando = false;
const ganadorTexto = document.getElementById("ganadorTexto");
const formContainer = document.getElementById("formContainer");
document.getElementById("sortear").addEventListener("click", () => sortear());
let escala = screen.width < 550 ? screen.width * 0.7 : 400;

root.style.setProperty("--escala", escala + "px");

const uno = {
    nombre: "Ro",
    probabilidad: 15
}
const dos = {
    nombre: "Pop",
    probabilidad: 15
}
const tres = {
    nombre: "K-pop",
    probabilidad: 15
}
const cuatro = {
    nombre: "Hip-Hop",
    probabilidad: 15
}
const cinco = {
    nombre: "Reggae",
    probabilidad: 15
}
const seis = {
    nombre: "Alondra - Mix",
    probabilidad: 25
}

let conceptos = [uno, dos, tres, cuatro, cinco, seis];

const colores = [
    "#0d6efd", "#6610f2", "#6f42c1", "#d63384", "#dc3545", "#fd7e14", "#ffc107", "#198754", "#20c997", "#0dcaf0", "#1F3438"
];

let categoriaManual = null;

function ajustarRuleta() {
    const opcionesContainer = document.createElement("div");
    opcionesContainer.id = "opcionesContainer"
    ruleta.appendChild(opcionesContainer);
    let pAcumulada = 0;
    conceptos.forEach((concepto, i) => {
        const opcionElement = document.createElement("div");
        opcionElement.classList.add("opcion");


        const nombre = document.createElement("p");
        nombre.classList.add("nombre");
        nombre.textContent = concepto.nombre;
        opcionesContainer.appendChild(opcionElement);
        opcionElement.appendChild(nombre);


        opcionElement.style = `background-color: ${colores[i]};
        transform:rotate(${probabilidadAgrados(pAcumulada)}deg);
        ${getPosicionParaProbabilidad(concepto.probabilidad)}
        `
        pAcumulada += concepto.probabilidad

    })
}
/** Desde una probabilidad en % devuelve un clip-path que forma el ángulo correspondiente a esa probabilidad */

function getPosicionParaProbabilidad(probabilidad) {
    if (probabilidad === 100) {
        return ''
    }
    if (probabilidad >= 87.5) {
        const x5 = Math.tan(probabilidadARadianes(probabilidad)) * 50 + 50;
        return `clip-path: polygon(50% 0%, 100% 0, 100% 100%, 0 100%, 0 0, ${x5}% 0, 50% 50%)`
    }
    if (probabilidad >= 75) {
        const y5 = 100 - (Math.tan(probabilidadARadianes(probabilidad - 75)) * 50 + 50);
        return `clip-path: polygon(50% 0%, 100% 0, 100% 100%, 0 100%, 0% ${y5}%, 50% 50%)`
    }
    if (probabilidad >= 62.5) {
        const y5 = 100 - (0.5 - (0.5 / Math.tan(probabilidadARadianes(probabilidad)))) * 100;
        return `clip-path: polygon(50% 0%, 100% 0, 100% 100%, 0 100%, 0% ${y5}%, 50% 50%)`
    }
    if (probabilidad >= 50) {
        const x4 = 100 - (Math.tan(probabilidadARadianes(probabilidad)) * 50 + 50);
        return `clip-path: polygon(50% 0, 100% 0, 100% 100%, ${x4}% 100%, 50% 50%)`
    }
    if (probabilidad >= 37.5) {
        const x4 = 100 - (Math.tan(probabilidadARadianes(probabilidad)) * 50 + 50);
        return `clip-path: polygon(50% 0, 100% 0, 100% 100%, ${x4}% 100%, 50% 50%)`
    }
    if (probabilidad >= 25) {
        const y3 = Math.tan(probabilidadARadianes(probabilidad - 25)) * 50 + 50;
        return `clip-path: polygon(50% 0, 100% 0, 100% ${y3}%, 50% 50%)`
    }
    if (probabilidad >= 12.5) {
        const y3 = (0.5 - (0.5 / Math.tan(probabilidadARadianes(probabilidad)))) * 100;
        return `clip-path: polygon(50% 0, 100% 0, 100% ${y3}%, 50% 50%)`
    }
    if (probabilidad >= 0) {
        const x2 = Math.tan(probabilidadARadianes(probabilidad)) * 50 + 50;
        return `clip-path: polygon(50% 0, ${x2}% 0, 50% 50%)`
    }
}

function resetearRuleta() {
    ruleta.style.transform = "rotate(0deg)";
    ganador = "";
    ganadorTexto.textContent = "Presiona Girar para el género musical";
}
function sortear() {
    sorteando = true;

    /** Numero del 0 al 1 que contiene al ganador del sorteo */
    const nSorteo = Math.random();

    const giroRuleta = (1 - nSorteo) * 360 + 360 * 8; // vueltas 
    root.style.setProperty('--giroRuleta', giroRuleta + "deg");
    ruleta.classList.toggle("girar", true)
    /** Acumulador de probabilidad para calcular cuando una probabilidad fue ganadora */
    let pAcumulada = 0;
    conceptos.forEach(concepto => {
        if (nSorteo * 100 > pAcumulada && nSorteo * 100 <= pAcumulada + concepto.probabilidad) {
            ganador = concepto.nombre;
        };
        pAcumulada += concepto.probabilidad;
    })

    ruleta.addEventListener("animationend", () => {
        ruleta.style.transform = "rotate(" + getCurrentRotation(ruleta) + "deg)";
        sorteando = false;
        ruleta.classList.toggle("girar", false);
        ganadorTexto.textContent = ganador;
    })

}
document.getElementById("seleccionarCategoria").addEventListener("click", function () {
    let categoriaSeleccionada = categoriaManual || ganador;
    if (categoriaSeleccionada == "Alondra - Mix") {
        const categorias = ["Barcelona", "Pop", "Hip-Hop", "Reggae", "K-pop"];
        categoriaSeleccionada = categorias[Math.floor(Math.random() * categorias.length)];
    }
    if (categoriaSeleccionada) {
        window.location.href = `/trivia/${categoriaSeleccionada}`;
        resetearRuleta();
    }
});

document.getElementById("categoriaSelect").addEventListener("click", function (event) {
    if (event.target.tagName === 'BUTTON') {
        let categoriaSeleccionada = event.target.value;
        if (categoriaSeleccionada == "Alondra - Mix") {
            let categoria = ["Rk", "Pop", "K-pop", "Reggae", "Hip-Hop"];
            categoriaSeleccionada = categoria[Math.floor(Math.random() * categoria.length)];
        }
        categoriaManual = categoriaSeleccionada;
        resetearRuleta();
    }
});
ajustarRuleta();

const hamburguesaBtn = document.querySelector('.hambur');
const menuEnlaces = document.querySelector('.enlaces-menu');
function toggleMenu() {
    menuEnlaces.classList.toggle('mostrar');
}
hamburguesaBtn.addEventListener('click', toggleMenu);