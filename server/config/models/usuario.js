const mongoose = require('mongoose');

/* uniqueValidator : es un plugin que nos ayuda a enviar un mensaje
en caso de que ya exista un valor repetido en X campo. 
RECORDAR LA IMPORTANCIA DE LOS MENSAJES DE AYUDA
*/ 
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

/* VALIDACION DE ROLES */ 
let rolesValidos = {
    values : ['USER_ROLE','ADMIN_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let usuarioSchema = new Schema({
    nombre : {
        type : String,
        required : [true, 'El nombre es obligatorio']
    },
    email : {
        type : String,
        unique : true,
        required : [true, 'El email es obligatiorio']
    },
    password : {
        type : String,
        required : [true, 'La contraseña es obligatioria']
    },
    img : {
        type : String,
        required : false
    },
    role : {
        type : String,
        default : 'USER_ROLE',
        enum: rolesValidos // LO USAMOS PARA VALIDAR QUE NO ACEPTEN OTRO TIPO DE ROLES
    },
    estado : {
        type : Boolean,
        default : true
    },
    google : {
        type : Boolean,
        default : false
    }
})

usuarioSchema.plugin( uniqueValidator , {message: '{PATH} debe de ser unico'}) // VALIDACION DE VALOR UNICO EN EMAIL

module.exports = mongoose.model('Usuario', usuarioSchema)

/*
EJECUTAR LOS SIGUIENTES CODIGO EN WINDOW PARA PODER ENCRIPTAR LAS CONTRASENIAS

npm install --global --production windows-build-tools

npm install bcrypt --save

*/ 