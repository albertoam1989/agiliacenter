// ========================= importo libreria de express ======================
const express = require('express');
const app = express();


// ========================= Importo middlewares ======================
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autentificacion');
const { crum } = require('../middlewares/crum');

// ========================= importo librerias varias ======================
const _ = require('underscore');

// ========================= Creo la clase para visualizar usuarios ======================
let Categoria = require('../models/categoria');


//=========== MOSTRAR TODAS LAS CATEGORIAS ==============================
app.get('/categoria', [verificaToken, crum], (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias
            })
        })
})



//=========== MOSTRAR CATEGORIA POR ID ==================================
app.get('/categoria/:id', [verificaToken, crum], (req, res) => {
    let id = req.params.id;
    let body = res.body;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
})




//=========== CREO METODO PARA NUEVA CATEGORIA =====================================
app.post('/categoria', [verificaToken, crum], (req, res) => {
    //let id = req.param.id;
    let body = req.body;
    let id_usuario = req.usuario._id;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: id_usuario
    })

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })

})




//=========== CREO METODO PARA ACTUALIZAR CATEGORIA =======================================
app.put('/categoria/:id', [verificaToken, crum], (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['usuario', 'descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

})




//=========== CREO METODO PARA BORRAR CATEGORIA ==========================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role, crum], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: 'Error interno servidor'
                }
            })
        }
        if (categoriaBorrada === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Categoria no encontrada'
                }
            })
        }
        res.json({
            ok: true,
            categoria: categoriaBorrada
        })
    })
})




module.exports = {
    app
}