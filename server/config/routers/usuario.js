
const express = require('express');
const app = express();
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')

const eliminarCampos = ( obj, arr=[] )=>{
    let x = 0;
    let newBody = obj
    while ( arr.length > x){
        if(newBody[arr[x]])
            delete newBody[arr[x]]
        x++
    }
    return newBody
}

app.get('/usuario',((req,res)=>{
   
    let limitePorPagina = req.query.limite || 5;
    limitePorPagina = Number(limitePorPagina);

    let saltarPaginas = req.query.skip || 0;
    saltarPaginas = Number(saltarPaginas);

    Usuario.find({estado:true}, 'nombre email role') // Estamos filtandro para que solo nos aparezcan esos campos llenos
            .skip(saltarPaginas)
            .limit(limitePorPagina)
            .exec( (err, usuarios)=>{
                if(err){
                    return res.status(400).json({
                        ok : false,
                        err
                    })
                }
                Usuario.count({estado:true/* Aqui tiene que ir lo mismo que este entre las llaves del Usuario.find({}*/},(err, conteo) =>{
                    res.json({
                        ok : true,
                        usuarios,
                        cantidad: conteo
                    })
                })
               
            })

}))



app.put('/usuario/:id',((req,res)=>{
    
  
     let id = req.params.id
     let body = req.body
    //  console.log(body);    
       let newBody =  eliminarCampos(body,['google','password'])
    //  https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate   
     Usuario.findByIdAndUpdate( id, newBody, { new: true , runValidators : true} ,((err,usuarioDB) =>{
        if(err){                                // El runValidator : true, es obligatorio para que nuestras validaciones sigan funcionando al hacer el PUT
            return res.status(400).json({
                ok : false,
                err
            })
        }
        usuarioDB.password = null;
        res.json({
            ok : true,
            usuario : usuarioDB
        })

     }))

    
}))


app.post('/usuario',((req,res)=>{
  let body = req.body

    let usuario = new Usuario({
        nombre : body.nombre,
        email : body.email,
        password : bcrypt.hashSync( body.password, 10), // Estamos encriptando la contrasena
        role : body.role
    })

    
    usuario.save( (err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok : false,
                err
            })
        
        }
        usuario.password = null
        res.json({
            ok: true,
            usuario : usuarioDB
        })
    } )
    
}))


app.delete('/usuario/:id',((req,res)=>{
    let id = req.params.id

    // Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{
    //     if(err){
    //         return res.status(400).json({
    //             ok : false,
    //             err
    //         })
    //     }
    //     if(!usuarioBorrado){
    //         return res.status(400).json({
    //             ok:false,
    //             err : {
    //                 message : 'No existe un usuario con ese Id para borrar'
    //             }
    //         })
    //     }
    //     res.json({
    //         ok : true,
    //         usuarioBorrado
    //     })
    // })

    Usuario.findByIdAndUpdate( id, { estado:false}, { new: true , runValidators : true} ,((err,usuarioDB) =>{
        if(err){                                // El runValidator : true, es obligatorio para que nuestras validaciones sigan funcionando al hacer el PUT
            return res.status(400).json({
                ok : false,
                err
            })
        }
        usuarioDB.password = null;
        res.json({
            ok : true,
            usuario : usuarioDB
        })

     }))
  
}))

module.exports = app;