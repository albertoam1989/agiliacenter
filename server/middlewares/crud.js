//================= CONSOLE.LOG EN LOS CRUM =====================
let crud = (req, res, next) => {
    let metodo = req.method;
    if (!metodo) {
        return res.status(500).json({
            ok: false,
            err: { message: "Error interno del servidor" }
        });
    }

    let ruta = req.route.path.split("/");

    switch (metodo) {
        case 'GET':
            console.log('Haciendo SELECT en la tabla ' + ruta[1]);
            break;
        case 'POST':
            console.log('Haciendo INSERT en la tabla ' + ruta[1]);
            break;
        case 'PUT':
            console.log('Haciendo UPDATE en la tabla ' + ruta[1]);
            break;
        case 'DELETE':
            console.log('Haciendo DELETE en la tabla ' + ruta[1]);
            break;
    }
    next();

};


module.exports = {
    crud
}