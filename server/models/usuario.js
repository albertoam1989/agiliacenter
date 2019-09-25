//======================= ESQUEMA DE LA TABLA USUARIO ======================================

const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

// TIPO DE USUARIO POR DEFECTO USER_ROLE; SOLO HAY DISPONIBLE 2 TIPOS DE USUARIO 
//SI QUEREMOS PONER UN USUARIO COMO ADMIN_ROLE TENEMOS QUE EJECUTAR EL METODO PUT()
let usuarioSchema = new Schema({
    nombre: { type: String, require: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es obligario'] },
    password: { type: String, required: [true, 'El correo es obligario'] },
    img: { type: String, required: false },
    role: { type: String, default: 'USER_ROLE', enum: rolesValidos },
    estado: { type: Boolean, default: true },
    google: { type: Boolean, default: false }
})

// DEVUELVO TODOS LOS DATOS DEL USUARIO MENOS LA CONTRASEÑA
// SE PUEDE CAMBIAR LA CONTRASEÑA CREANDO OTRO METODO PERO NO LO HE HECHO POR NO ALARGAR EL PROCESO DE LA PRUEBA
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);