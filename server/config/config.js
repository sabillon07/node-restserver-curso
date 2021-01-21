// VARIABLES GLOBALES 
// PARA MANTENER TRANSPARENCIA EN ENTERNO DE DESARROLLO Y PRODUCCION

// ======================
//  PUERTO
// ======================
// este puerto nos lo ofrece HEROKU
process.env.PORT = process.env.PORT || 3000; 




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