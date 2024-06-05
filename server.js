const express = require('express');
const app = express();
const conectar = require('./database/data_base');
let currentQuestionIndex = 0;
const preguntasMostradas = [];
app.set("view engine", "ejs");
app.get("/", function (req, res) {
    res.render("index");
});

// Ruta para manejar la selección de categoría y redireccionar a la página trivia con la categoría seleccionada
app.get("/trivia/:categoria", function (req, res) {
    const categoria = req.params.categoria;
    const index = parseInt(req.query.index) || 0;
    const indicesToExcluir = preguntasMostradas.map(idx => `id != ${idx}`).join(' AND ');
    const consulta = `SELECT * FROM Trivia WHERE categoria = ? AND (${indicesToExcluir || '1'}) ORDER BY RAND() LIMIT 1`;

    conectar.query(consulta, [categoria], function (error, results, fields) {
        if (error) {
            console.error("Error al ejecutar la consulta:", error);
            res.status(500).send("Error interno del servidor: " + error.message);
            return;
        }

        if (results.length > 0) {
            const pregunta = results[0];
            preguntasMostradas.push(pregunta.id); // Agregar el índice de la pregunta mostrada
            console.log("Pregunta encontrada:", pregunta);
            res.render("trivia", { preguntas: results, feedbacks: results, opcion_correctas: results, imagenReferencial: results, categoria: categoria });
        } else {
            console.log("No se encontraron más preguntas para esta categoría.");
            res.status(404).render('404');
        }
    });
});

app.get('/trivia/:categoria/siguiente', function (req, res) {
    const categoria = req.params.categoria;
    const index = parseInt(req.query.index) || 0;
    const indicesToExcluir = preguntasMostradas.map(idx => `id != ${idx}`).join(' AND ');
    const consulta = `SELECT * FROM Trivia WHERE categoria = ? AND (${indicesToExcluir || '1'}) ORDER BY RAND() LIMIT 1`;

    conectar.query(consulta, [categoria], function (error, results, fields) {
        if (error) {
            console.error("Error al ejecutar la consulta:", error);
            res.status(500).send("Error interno del servidor: " + error.message);
            return;
        }
        if (results.length > 0) {
            const pregunta = results[0];
            preguntasMostradas.push(pregunta.id); // Agregar el índice de la pregunta mostrada
            res.json(pregunta);
        } else {
            console.log("No se encontraron más preguntas para esta categoría.");
            res.status(404).render('404');
        }
    });
});
app.use(express.static("public"));
app.listen(3000, function () {
    console.log("El servidor está funcionando en http://localhost:3000");
});
//D5Lj6JJYsape2HV
// nombre de usario bbdd trivia cepanel u297961_user_trivia


