// ================== CONFIG PUERTO ========================
process.env.PORT = process.env.PORT || 3000;


// ================== VARIABLE DE ENTORNO ========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ================== VARIABLE DE VENCIMIENTO TOKEN ========================
process.env.CADUCIDAD_TOKEN = '48h';


// ================== VARIABLE DE SEMILLA => SEED AUTENTIFICACION ========================
process.env.SEED = process.env.SEED || 'seed';


// ================== CONFIGURACION DE LA BBDD ========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/agiliacenter';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.urlDB = urlDB;


// ================== GOOGLE CLIENT ID ========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '364926013485-u67thqkcev0rtd025a9h7ahobbfcq1v0.apps.googleusercontent.com';