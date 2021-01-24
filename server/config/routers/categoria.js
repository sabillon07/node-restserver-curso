const express = require('express')
const app = express();
const Categoria = require('../models/categoria')
const {validarToken, validarAdminRole} = require('../middleware/autenticacion')


app.get('/categoria',[validarToken], (req, res)=>{

    Categoria.find({ })
            .sort('descripcion')
            .populate('usuario', 'nombre email')
            .exec((err,categoriaDB)=>{
        if(err){
            return res.status(400).json({
                ok : false,
                err
            })
        }
        Categoria.count({}, (err, cantidad )=>{
            res.json({
                ok : true,
                categoria : categoriaDB,
                cantidad
            })
        }) 
    })
})

app.get('/categoria/:id', validarToken , (req, res)=>{
    let id = req.params.id
    
    Categoria.find({_id: id})
            
            .populate('usuario', 'nombre email')
            .exec((err,categoriaDB)=>{
                if(err){
                    return res.status(400).json({
                        ok : false,
                        err
                    })
                } 
                res.json({
                    ok : true,
                    categoria : categoriaDB
                })
            })
        })

app.post('/categoria', validarToken , (req,res)=>{

    let body = req.body
    let idUsuario = req.usuario._id

    let categoria = new Categoria({
        descripcion : body.descripcion,
        usuario : idUsuario
    })

    categoria.save((err, categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok : false,
                err
            })
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok : false,
                err
            })
        }
        res.json({
            ok : true,
            categoria : categoriaDB
        })
    })

})

app.put('/categoria/:id', [validarToken],(req,res)=>{
    let id = req.params.id;
    let descripcionCategoria = {
        descripcion :req.body.descripcion
    } 

    Categoria.findByIdAndUpdate( id, descripcionCategoria, { new : true, runValidators : true},((err,categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok : false,
                err
            })
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok : false,
                err : {
                    message : "No existe la categoria con ese ID"
                }
            })
        }
        res.json({
            ok : true,
            categoria : categoriaDB,
            message : "Actualizacion ha sido un exito"
        })
    }) )

})

app.delete('/categoria/:id', [validarToken, validarAdminRole], (req,res)=>{
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err,categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok : false,
                err,
                message: "Erro al borrar categoria"
            })
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok : false,
                err : {
                    message : "No se ha encontrado una categoria con dicho ID"
                }
            })
        }
        res.json({
            ok : true,
            categoriaBorrada : categoriaDB,
            message : "La categoria ha sido borrada con exito"
        })
    })

})

module.exports = app;