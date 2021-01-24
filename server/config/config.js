// VARIABLES GLOBALES 
// PARA MANTENER TRANSPARENCIA EN ENTERNO DE DESARROLLO Y PRODUCCION

// ======================
//  PUERTO
// ======================
// este puerto nos lo ofrece HEROKU
process.env.PORT = process.env.PORT || 3000; 

// ======================
//  TIEMPO DE VIDA DEL TOKEN
// ======================
// 60 segundo * 60 horas * 24 horas * 30 dias
process.env.TIME_TOKEN = '48h';


// ======================
//  PALABRA SECRETA DEL TOKEN
// ======================
process.env.SEED = process.env.SEED  || 'este-es-el-seed-desarrollo'

// ======================
//  ENTORNO
// ======================

//NOV_ENV es una variable que nos proporciona HEROKU
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ======================
//  Base de Datos
// ======================

let urlDB;

if( process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
} else{

    urlDB = process.env.MONGO_URL
}

// Crearemos cualquier envaioment
process.env.urlDB = urlDB


/* 
Nota:
Recuerden los comandos de Heroku para crear las variables de entorno

heroku config:set MONGO_URI="XXXXXXX"
 
    heroku config:get nombre
    heroku config:unset nombre
    heroku config:set nombre="Fernando"

    */