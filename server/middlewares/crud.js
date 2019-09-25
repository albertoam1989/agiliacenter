//================= CONSOLE.LOG EN LOS CRUM =====================
let crum = (req, res, next) => {
    let metodo = req.method;
    if (!metodo) {
        return res.status(500).json({
            ok: false,
            err: { message: "Error interno del servidor" }
        });
    }
    //console.log(req.route.path);
    switch (metodo) {
        case 'GET':
            console.log('Haciendo SELECT en la tabla ' + req.route.path);
            break;
        case 'POST':
            console.log('Haciendo INSERT en la tabla ' + req.route.path);
            break;
        case 'PUT':
            console.log('Haciendo UPDATE en la tabla ' + req.route.path);
            break;
        case 'DELETE':
            console.log('Haciendo DELETE en la tabla ' + req.route.path);
            break;
    }
    next();

};


module.exports = {
    crum
}