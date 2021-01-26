
const jwt = require('jsonwebtoken');

// ===========================
//  VERIFICA TOKEN
// ===========================
let validarToken = (req, res, next)=>{

    let token = req.get('token');
   
    jwt.verify( token, process.env.SEED, (err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok : false,
                err,
                message : "El token no es valido"
            });
        }
        decoded.usuario.password = null;
  
        req.usuario = decoded.usuario
        next();
    })
}


// ===========================
//  VERIFICA ADMIN_ROLE
// ===========================

let validarAdminRole = (req, res, next)=>{
    let usuario = req.usuario
    
    if(usuario.role === 'ADMIN_ROLE'){
         return next()
    }

    res.json({
        ok : false,
        message: 'No tienes los permisos de usuario administrador'
    })
    
}

let validarTokenImagen = (req, res,next)=>{

    let token = req.query.token;
 
    jwt.verify( token, process.env.SEED, (err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok : false,
                err,
                message : "El token no es valido"
            });
        }

        decoded.usuario.password = null;
  
        req.usuario = decoded.usuario
        next();
    })


}

module.exports = {
    validarToken,
    validarAdminRole,
    validarTokenImagen
}