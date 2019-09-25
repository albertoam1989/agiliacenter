// ========================= importo libreria de express ======================
const express = require('express');
const app = express();

// ========================= importo libreria de encriptación ======================
const bcrypt = require('bcrypt');

// ========================= importo librerias varias ======================
const _ = require('underscore');
const Usuario = require('../models/usuario');

// ========================= Importo middlewares ======================
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autentificacion');
const { crud } = require('../middlewares/crud');

// ========================= Creo la clase para visualizar usuarios ======================
app.get('/usuario', [verificaToken, crud], (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    //saco los todos los usuarios paginados (desde) -> (hasta) |||||  pongo la condición de que tenga que tener el estado: true
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            //req.accion = 'visualizo usuarios';
            //app.use(crum);
            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            })
        })
})

// ========================= Creo la clase para crear usuario ======================
app.post('/usuario', [verificaToken, verificaAdmin_Role, crum], function(req, res) {
    let body = req.body;
    // bcrypt.hashSync() es para encriptar la contraseña
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
})

// ========================= creo el método para actualizar un campo de la tabla usuario ======================
app.put('/usuario/:id', [verificaToken, verificaAdmin_Role, crum], function(req, res) {
    let id = req.params.id
        // uso la libreria underscore para limitar los campos que se pueden editar
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })
})


// ============ Creo el método para cambiar el estado a false ======================================================
//====================== Tambien se puede crear el método para eliminar directamente de la bbdd
///===================== pero para guardar la integridad referencial de los datos prefiero hacerlo por este método de desactivar 
app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role, crum], function(req, res) {

    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { 'estado': false }, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario no encontrado'
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })
})

module.exports = {
    app
}