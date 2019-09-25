// ========================= importo libreria de express ======================
const express = require('express');
const app = express();
// ========================= importo libreria de encriptación ======================
const bcrypt = require('bcrypt');

// ========================= importo libreria para general el token ======================
const jwt = require('jsonwebtoken');

// ========================= importo modelo de la tabla usuario ======================
const Usuario = require('../models/usuario');

//================= IMPORTO LIBRERIAS DE GOOGLE ===========================
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

//=================== creo el método para iniciar sesión un usuario registrado en la bbdd
app.post('/login', (req, res) => {

    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            //si el usuario no existe entra y no inicia sesion
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrecto'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            //si la pass no es correcta entra y no inicia sesion
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) correcto'
                }
            });

        }

        //GENERO EL TOKEN
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    })


})


// ======= CONFIGURACIONES DE GOOGLE =================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,

    });

    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


// CREO EL MÉTODO PARA INICIAR SESIÓN DESDE GOOGLE
// si no está registrado lo crea automáticamente
// si ya está registrado ese mail no te deja iniciar sesión con ese mail.
app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            })
        })
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (usuarioDB) {
            //si existe el usuario 
            if (usuarioDB.google === false) {
                //si el campo google en tabla usuarios es false no te deja iniciar sesión
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Usuario registrado sin la cuenta de google'
                    }
                });
            } else {
                //genero el token e inicio sesión
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {
            // si el usuario no existe en la bbdd lo crea automáticamente
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            })

        }
    })
})



module.exports = {
    app
}