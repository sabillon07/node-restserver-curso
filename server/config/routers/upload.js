const express = require('express')
const app = express();
const fileUpload = require('express-fileupload')
const Usuario = require('../models/usuario')
const Producto = require('../models/producto')
const fs = require('fs')
const path = require('path')


app.use(fileUpload({
    useTempFiles : true,
    // tempFileDir : '/tmp/'
}));


app.put('/upload/:tipo/:id', (req,res)=>{
    if(!req.files){
        return res.status(400).json({
            ok : false,
            err : {
                message : 'No se ha seleccionado nigun archivo'
            }
        })
    }

    let id = req.params.id;
    let tipo = req.params.tipo;
    let tiposValidos = ['usuarios','productos']

    if( tiposValidos.indexOf(tipo) < 0 ){
        return res.status(400).json({
            ok : false,
            err : `"${tipo}" no es un tipo valido`
        })
    }

    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.')
    let extension = nombreArchivo[ nombreArchivo.length -1]

    let extensionesValidas = [ 'jpg' , 'jpeg' , 'gif', 'png']

    if( extensionesValidas.indexOf( extension ) < 0){
        return res.json({
            ok : false,
            err : {
                message: `La extension "${extension}" no es valida`,
                extensionesValidas : `Las extensiones validas son ${extensionesValidas.join(', ')}`
            }
        })
    }

    let nameFile = `${id}-${new Date().getMilliseconds()}.${extension}`

    archivo.mv(`./uploads/${tipo}/${nameFile}`, (err)=>{
        if(err){
            return res.status(500).json({
                ok : false,
                err
            })
        }
        if( tipo === 'usuarios')
            AsociarImagenUsuario( id , res , nameFile)
        if( tipo ==='productos')   
            AsociarImagenProducto(id , res , nameFile)
       return
    })

})

function AsociarImagenUsuario (id , res , nameFile ) {
    
    Usuario.findById( id , (err,usuarioDB)=>{
        if(err){
            borrarImagen('usuarios', nameFile)
            return res.status(500).json({
                ok : false,
                err
            })
         }

        if(!usuarioDB){
            borrarImagen('usuarios', nameFile)
            return res.status(400).json({
                ok : false,
                err : {
                    message : 'El usuario con ese ID no existe'
                }
            })
        }

        // let pathImagen = path.resolve(__dirname, `../../../uploads/usuarios/${usuarioDB.img}`)
        // if( fs.existsSync(pathImagen) ){
        //     fs.unlinkSync(pathImagen)
        // }
        borrarImagen('usuarios',usuarioDB.img)
        usuarioDB.img = nameFile
        usuarioDB.save( ( err,usuarioGrabado)=>{
            if(err){
                return res.status(500).json({
                    ok : false,
                    err
                })
             }
    
            if(!usuarioGrabado){
                return res.status(400).json({
                    ok : false,
                    err
                })
            }
            
            

            usuarioGrabado.password = null;
            res.json({
                ok : true,
                usuario : usuarioGrabado
            })

            // res.json({
            //     ok : true,
            //     message: 'El archivo se ha subido con exito'
            // })
        })
    })

}

function AsociarImagenProducto(id,res,nameFile){    
    Producto.findById( id , (err,productoDB)=>{
        
        if(err){
            borrarImagen('productos', nameFile)
            return res.status(500).json({
                ok : false,
                err
            })
        }
        if(!productoDB){
            borrarImagen('productos', nameFile)
            return res.status(400).json({
                ok : false,
                err: {
                    mesassge: "No existe ese producto"
                }
            })
        }

        borrarImagen('productos', productoDB.img)
        productoDB.img = nameFile;
        productoDB.save((err,productoGuardado)=>{

            return res.json({
                ok : true,
                producto : productoGuardado
            })
        })

    })
}

function borrarImagen(tipo, nombreImagen){
    let pathImagen = path.resolve(__dirname, `../../../uploads/${tipo}/${nombreImagen}`)
    if( fs.existsSync(pathImagen) ){
        fs.unlinkSync(pathImagen)
    }
}

module.exports = app