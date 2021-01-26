const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const {validarTokenImagen} = require('../middleware/autenticacion')


app.get('/imagen/:tipo/:img',validarTokenImagen,(req,res)=>{
    
    let tipo = req.params.tipo;
    let img = req.params.img;

    let imagenPath = path.resolve(__dirname, `../../../uploads/${tipo}/${img}`)
    if( fs.existsSync(imagenPath)){
        res.sendFile(imagenPath)
    }else{
        
            let noIimagenPath = path.resolve(__dirname,'../../assets/broken-1.png')
            res.sendFile(noIimagenPath)

    }
})

module.exports= app