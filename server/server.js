const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
require('./config/config')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// Configuración global de rutas
app.use(require('./config/routers/index'))

// CAFE ES UN NOMBRE QUE EN CASO DE QUE NO HAYAMOS CREADO ESA DB
// MONGOOSE SE VA A ENCARGAR DE CREARLA Y TODA SU ESTRUCTURA
mongoose.connect(process.env.urlDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true  
},(err)=>{
    if (err) throw err;

    console.log('CONECTAMOS CON EXITO PRRITOOO!!');
});


app.listen(process.env.PORT,()=>{
    console.log(`Escuchando desde el puerto ${process.env.PORT}`);
})