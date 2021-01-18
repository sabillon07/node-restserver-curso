const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('./config/config')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.get('/',((req,res)=>{
    res.json('get')
}))

app.post('/usuario/:id',((req,res)=>{
    let id = req.params.id
    res.json({
        id
    })
}))


app.put('/usuario',((req,res)=>{
    let body = req.body

    if(body.nombre === undefined){
        res.status(400).json({
            ok : false,
            msj : 'El nombre no se encuentra'
        })
    }else{
        res.json({
            usuario : body
        })
        
    }
}))


app.delete('/',((req,res)=>{
    res.json('delete mundo')
}))


app.listen(process.env.PORT,()=>{
    console.log(`Escuchando desde el puerto ${process.env.PORT}`);
})