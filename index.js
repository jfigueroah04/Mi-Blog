const { conexion } = require("./basededatos/conexion");
const express = require("express");
const cors = require("cors");

console.log("App de node arrancada");

conexion();

const app = express();
const puerto = 3900;

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const rutas_articulo = require("./rutas/articulo");

app.use("/api", rutas_articulo);

app.get("/", (req, res) => {
    return res.status(200).json({
        mensaje: "Bienvenido a la API",
        estado: "funcionando"
    });
});

//Crear servidor y escuchar peticiones
app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto: " + puerto);
});
