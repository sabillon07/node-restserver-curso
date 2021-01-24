const express = require('express')
const app = express();
const Producto = require('../models/producto');
const {validarToken,  validarAdminRole} = require('../middleware/autenticacion')


app.get('/producto', validarToken, (req,res)=>{

    let limite = req.query.limite || 5
        limite = Number(limite)
    
    let productosPorPagina = req.query.skip || 0
        productosPorPagina = Number(productosPorPagina)

    Producto.find({})
            .skip(productosPorPagina)
            .limit(limite)
            .populate('categoria','descripcion')
            .populate('usuario', 'nombre email')
            .exec((err, producto)=>{
                if(err){
                    return res.status(501).json({
                        ok: false,
                        err
                    })
                }
                if(!producto){
                    return res.status(400).json({
                        ok : false,
                        err
                    })
                }
                Producto.count({}, (err,cantidad)=>{
                    res.json({
                        ok : true,
                        productos : producto,
                        cantidad
                    })
                })
            })
})

app.get('/producto/:id', validarToken, (req, res)=>{
        let id = req.params.id;

        Producto.find({ _id : id })
                .populate('categoria','descripcion')
                .populate('usuario', 'nombre email')
                .exec((err,productoDB)=>{
                    if(err){
                        return res.status(500).json({
                            ok : false,
                            err
                        })
                    }
                    if(!productoDB){
                        return res.status(400).json({
                            ok : false,
                            err
                        })
                    }
                    res.json({
                        ok : true,
                        producto : productoDB
                    })
                })
})

app.get('/producto/buscar/:termino', validarToken , (req,res)=>{
    let termino = req.params.termino;

    let regularExpression = new RegExp( termino , 'i')

    Producto.find({ nombre : regularExpression})
            .populate('categoria', 'descripcion')
            .exec((err,productosDB)=>{
                if(err){
                    return res.status(500).json({
                        ok : false,
                        err
                    })
                }
                if(!productosDB){
                    return res.status(500).json({
                        ok : false,
                        err : {
                            message : 'No existe producto con ese nombre'
                        }
                    })
                }
                res.json({
                    ok : true,
                    productos : productosDB
                })

            })
})

app.post('/producto' , validarToken , (req, res)=>{
    let body = req.body
    let idUsuario = req.usuario._id
    
    let producto = new Producto({
        nombre : body.nombre,
        precioUni : body.precioUni,
        descripcion : body.descripcion,
        categoria : body.categoria,
        usuario : idUsuario
    })

    producto.save((err,producto)=>{
        if(err){
            return res.status(500).json({
                ok : false,
                err
            })
        }
        if(!producto){
            return res.status(400).json({
                ok : false,
                err
            })
        }
        res.json({
            ok : true,
            producto
        })
    })
})
/* 
nombre: { type: String, required: [true, 'El nombre es necesario'] },
    precioUni: { type: Number, required: [true, 'El precio únitario es necesario'] },
    descripcion: { type: String, required: false },
    disponible: { type: Boolean, required: true, default: true },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
*/

app.put('/producto/:id', validarToken , (req,res)=>{
    
    let id= req.params.id;
    let body = req.body;
    
    let producto = {
        nombre : body.nombre,
        precioUni : body.precioUni,
        descripcion : body.descripcion,
        categoria : body.categoria,
        disponible : body.disponible
    }

    Producto.findByIdAndUpdate( id , producto, { new : true, runValidators : true} , ((err, productoDB)=>{
        if(err){
            return res.status(500).json({
                ok : false,
                err
            })
        }
        if(!productoDB){
            return res.status(400).json({
                ok : false,
                err : {
                    message: 'EL ID NO EXISTE'
                }
            })
        }
        res.json({
            ok : true,
            producto : productoDB
        })
    }))

})

app.delete('/producto/:id', validarToken,(req,res)=>{
    let id = req.params.id


    Producto.findById( id , (err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok : false,
                err
            })
        }
        if(!productoDB){
            return res.status(400).json({
                ok : false,
                err : {
                    message: 'EL ID NO EXISTE'
                }
            })
        }
        productoDB.disponible = false
        productoDB.save((err, productoBorrado)=>{
            if(err){
                return res.status(500).json({
                    ok : false,
                    err
                })
            }
            if(!productoBorrado){
                return res.status(400).json({
                    ok : false,
                    err 
                })
            }
            res.json({
                ok:true,
                productoBorrado
            })
        })
    })

})

module.exports = app