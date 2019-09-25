const jwt = require('jsonwebtoken');



//================= VERIFICAR TOKEN =====================
let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decored) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: { message: "Token no válido" }
            });
        }
        /*
        res.json({
            ok: true,
            decored
        })
        */
        req.usuario = decored.usuario;
        next();
    })
};

//================= VERIFICAR ADMIN_ROLE =====================
let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;
    //res.json({ usuario });

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: true,
            err: {
                message: 'El usuario no es administrador',
                //usuario
            }
        })
    }
};


module.exports = {
    verificaToken,
    verificaAdmin_Role
}