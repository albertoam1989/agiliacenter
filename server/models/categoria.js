//======================= ESQUEMA DE LA TABLA CATEGORIA ======================================

const mongoose = require('mongoose');
let Schema = mongoose.Schema;

//campo usuario es el campo id de la tabla usuario. 
let categoriaSchema = new Schema({
    descripcion: { type: String, require: [true, 'Descripción es obligatorio'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
})

module.exports = mongoose.model('Categoria', categoriaSchema);