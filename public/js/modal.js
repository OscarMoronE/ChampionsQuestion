const urlParams = new URLSearchParams(window.location.search);

const categoria = urlParams.get('categoria');
fetch(`/feedbacks/${categoria}`)
    .then(response => response.json())
    .then(feedbacks => {

        const containerFeedback = document.getElementById("modal_container");
        feedbacks.forEach(feedback => {
            const feedbackContainer = document.createElement("div");
            feedbackContainer.classList.add("feedback");

            const imagenContainer = document.createElement("div");
            imagenContainer.classList.add("imagen");


            const feedbackElemento = document.createElement("p");
            feedbackElemento.textContent = feedback.feedback;
            feedbackContainer.appendChild(feedbackElemento);

        });
    })
    .catch(error => {
        console.error('Error al obtener el Feedback:', error);
    });

const openModal = document.querySelector("#btnRespuestaTrivia");
const modal = document.querySelector(".modal");
const closeModal = document.querySelector(".modal_close");

openModal.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.add('modal--show');
})

closeModal.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.remove('modal--show');
})



