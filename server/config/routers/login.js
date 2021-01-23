const express = require('express');
const app = express();
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


app.post('/login',(req,res)=>{

   let body =  req.body;

   Usuario.findOne({ email : body.email}, (err,usuarioDB)=>{

        if(err){
            
            return res.status(500).json({
                ok : false,
                err
            })
        }
       if( !usuarioDB ){
           return res.status(400).json({
               ok: false,
               err : {
                   message : 'El **usuario o contraseña no es correcto'
               }
           })
       }
       if( !body.password || !usuarioDB.password ){
        return res.status(400).json({
            ok: false,
            err : {
                message : 'El usuario o **contraseña no es correcto. NO ha escrito el passwortd'
            }
        })
       }
       
       if( !bcrypt.compareSync( body.password, usuarioDB.password )){
        return res.status(400).json({
            ok: false,
            err : {
                message : 'El usuario o **contraseña no es correcto'
            }
        })
       }

       let token = jwt.sign({
           usuario : usuarioDB
       },process.env.SEED, { expiresIn: process.env.TIME_TOKEN})

       if(usuarioDB.password){
            usuarioDB.password = null
       }
       
       res.json({
           ok : true,
           usuario : usuarioDB,
           token 
       })

   })

})



module.exports = app;