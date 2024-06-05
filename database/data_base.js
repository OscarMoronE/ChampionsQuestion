const mysql = require('mysql');
const conectar = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'alomapnewzeland2008',
    database: 'Trivia'
});

conectar.connect(function (error) {
    if (error) {
        console.error('Error en la conexion ' + error.stack)
        return;
    }
    console.log('Conexion exitosa ID: ' + conectar.threadId);
});

module.exports = conectar;
