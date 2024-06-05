let startTime = Date.now();
window.addEventListener('load', function () {
    startTime = Date.now();
})

let endTime = 0;
let acertadas = 0;
function alertTenQuestion() {
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "¡Hoy estas Imparable!.",
        showConfirmButton: false,
        timer: 2500
    });
}
let progreso = 0;
function actualizarProgreso() {
    const barraProgreso = document.querySelector("#barraProgreso progress");
    barraProgreso.value = progreso;
    if (progreso >= 100) {
        alertTenQuestion();
    }
}

let currentQuestionIndex = 0;
let selectedOption = null;
let respuestaCorrecta = null;
const btnRespuestaTrivia = document.getElementById("btnRespuestaTrivia");

function cargarOpciones(opcionCorrecta, opcionUno, opcionDos, opcionTres) {
    respuestaCorrecta = opcionCorrecta;
    let opciones = [];
    // Manejar el caso de la primera pregunta
    if (opcionUno === undefined && opcionDos === undefined && opcionTres === undefined) {
        opciones = [
            opcionCorrecta,
            "<%= preguntas[0].opcion_uno %>",
            "<%= preguntas[0].opcion_dos %>",
            "<%= preguntas[0].opcion_tres %>"
        ];
    } else {
        opciones = [
            opcionCorrecta,
            (opcionUno || '').trim(),
            (opcionDos || '').trim(),
            (opcionTres || '').trim()
        ].filter(opcion => opcion !== '');
    }

    opciones.sort(function () {
        return 0.5 - Math.random();
    });

    let containerOpcionesTrivia = document.getElementById("containerOpcionesTrivia");
    let containerOpcionesTrivia2 = document.getElementById("containerOpcionesTrivia2");

    containerOpcionesTrivia.innerHTML = '';
    containerOpcionesTrivia2.innerHTML = '';

    for (let i = 0; i < opciones.length; i++) {
        let opcionDiv = document.createElement("button");
        opcionDiv.classList.add("btnOpcionTrivia");
        opcionDiv.innerHTML = opciones[i];
        if (i < 2) {
            containerOpcionesTrivia.appendChild(opcionDiv);
        } else {
            containerOpcionesTrivia2.appendChild(opcionDiv);
        }

        opcionDiv.addEventListener("click", handleOptionClick);
    }
}
cargarOpciones("<%= preguntas[0].opcion_correcta %>");

function handleOptionClick(event) {
    const opcionDiv = event.target;
    if (selectedOption) {
        selectedOption.style.backgroundColor = "";
    }
    opcionDiv.style.backgroundColor = "grey";
    selectedOption = opcionDiv;
    btnRespuestaTrivia.disabled = false;
}

function handleSeleccionarClick() {
    if (selectedOption) {
        const isCorrect = selectedOption.textContent === respuestaCorrecta;
        selectedOption.style.backgroundColor = isCorrect ? "green" : "red";

        const opcionesTrivia = document.querySelectorAll('.btnOpcionTrivia');
        opcionesTrivia.forEach(opcion => {
            if (opcion !== selectedOption) {
                opcion.disabled = true;
            }
        });
        let progress = document.querySelector(".porcent");
        let porcentaje = document.querySelector(".porcentaje");
        let porcentaje2 = document.querySelector(".porcentaje2");
        let porcenNumb = parseInt(porcentaje.textContent);
        if (btnRespuestaTrivia) {
            progreso += 10;
            porcenNumb += 1;
            porcentaje.textContent = porcenNumb;
            actualizarProgreso();
            btnRespuestaTrivia.disabled = true;
        }
        if (parseInt(porcentaje.textContent) === 5) {
            porcentaje2.textContent = "/10";
            porcentaje.style.right = "calc(50% + (648px - 535px) / 2)";
        }
        if (isCorrect) {
            acertadas += 1;
        }
        endTime = Date.now();
        if (parseInt(porcentaje.textContent) === 10) {

            const abrirResumen = document.querySelector(".modal_resumen");
            const cerrarModal = document.querySelector(".modalResumen_close");
            abrirResumen.classList.add("modalResumen--show");
            cerrarModal.addEventListener('click', (e) => {
                e.preventDefault();
                abrirResumen.classList.remove("modalResumen--show");
            });
        }

        let verAcertadas = document.querySelector(".modalResumen_para");
        let porcentajeNumero = porcentaje2.textContent.replace('/', '');
        verAcertadas.textContent = "Acertaste " + acertadas + " de " + porcentajeNumero;
        let verTiempo = document.getElementById("timer");
        const tiempoTranscurrido = Math.ceil((endTime - startTime) / 1000);
        verTiempo.textContent = "Tu tiempo de respuesta fue: " + tiempoTranscurrido + " segundos";
    }
}
btnRespuestaTrivia.addEventListener("click", handleSeleccionarClick);
btnRespuestaTrivia.disabled = true;

function nextPage(categoria) {
    fetch(`/trivia/${categoria}/siguiente?index=${currentQuestionIndex}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se encontraron más preguntas para esta categoría.');
            }
            return response.json();
        })
        .then(data => {
            const containerTrivia = document.getElementById('containerTrivia');
            containerTrivia.innerHTML = `
                <div class="pregunta">
                    <h2>${data.pregunta}</h2>
                </div>
            `;

            const modalTitle = document.querySelector('.modal_title');
            const modalImage = document.querySelector('.modal_container .imagen img');
            const modalFeedback = document.querySelector('.modal_container .feedback p');
            const opcCorrecta = document.querySelector(".opcion_correcta");

            modalTitle.textContent = '¿Sabías que?';
            modalImage.src = data.imagen_referencial;
            opcCorrecta.textContent = 'Respuesta correcta: ' + data.opcion_correcta;
            modalFeedback.textContent = data.feedback;

            const containerOpcionesTrivia = document.getElementById('containerOpcionesTrivia');
            const containerOpcionesTrivia2 = document.getElementById('containerOpcionesTrivia2');

            containerOpcionesTrivia.innerHTML = '';
            containerOpcionesTrivia2.innerHTML = '';

            cargarOpciones(data.opcion_correcta, data.opcion_uno, data.opcion_dos, data.opcion_tres);

            currentQuestionIndex++;
        })
        .catch(error => console.error('Error al obtener la próxima pregunta:', error));
}

function continuar() {
    if (btnRespuestaTrivia.textContent === "Continuar") {
        const modal = document.querySelector(".modal");
        modal.style.display = "none";
    }
}
document.querySelector('.hambur').addEventListener('click', function () {
    document.querySelector('.enlaces-menu').classList.toggle('mostrar');
});