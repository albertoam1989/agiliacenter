// ============ importo fichero de configuracion global y librerias varias======================
require('./config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// ============ parse application/x-www-form-urlencoded ====
app.use(bodyParser.urlencoded({ extended: false }));


// ============ parse application/json======================
app.use(bodyParser.json());


//============= CONFIGURACION GLOBAL DE RUTAS ==============
app.use(require('./routes/index').app);


//============= Habilitar la carpeta public ================
app.use(express.static(path.resolve(__dirname, '../public')));


mongoose.connect(process.env.urlDB, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err;
    console.log('BBDD ONLINE (Port: 27017)');
});

app.listen(process.env.PORT, () => {
    console.log("Node Express RUN (Port: 3000)");
})