const fs = require("fs");

const Articulo = require("../modelos/articulo");
const articulo = require("../modelos/articulo");

const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: "Soy una accion de prueba de mi controlador de articulos"
    });
}

const curso = (req, res) => {
    console.log("Se ha ejectuado el endpint probando");
    return res.status(200).send(
        ` <h1>Hola mundo al Desarrollo WEB en UMG</h1>
        `
    )
}   


const crear = async (req, res) => {
    try {

        let parametros = req.body;


        const articulo = new Articulo(parametros);


        const articuloGuardado = await articulo.save();


        return res.status(200).json({
            status: "success",
            articulo: articuloGuardado,
            mensaje: "Articulo creado con exito"
        });

    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "No se pudo crear el artículo"
        });
    }
}

const listar = async (req, res) => {
    try {
        const ultimos = req.params.ultimos || null;

        const consulta = await Articulo.find({})
            .sort({ fecha: -1 })
            .limit(ultimos)

        if (!consulta || consulta.length === 0) {
            return res.status(400).json({
                status: "error",
                mensaje: "No se han encontrado articulos",
            });
        }
        return res.status(200).send({
            status: "success",
            parametro: req.params.ultimos,
            contador: consulta.length,
            consulta,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Ha ocurrido un error al listar",
        });
    }
};


const uno = (req, res) => {
    let id = req.params.id;

    Articulo.findById(id)
        .then((articulo) => {
            if (!articulo) {
                return res.status(400).json({
                    status: "Error",
                    mensaje: "No se ha encontrado el artículo",
                });
            }

            return res.status(200).json({
                status: "Success",
                articulo,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                status: "Error",
                mensaje: "Ha ocurrido un error al buscar el artículo",
            });
        });
};

const borrar = async (req, res) => {
    try {
        const articulo_id = req.params.id;


        if (!articulo_id) {
            return res.status(400).json({
                status: "error",
                mensaje: "No se proporcionó un ID válido"
            });
        }


        const articuloBorrado = await Articulo.findOneAndDelete({ _id: articulo_id });

        if (!articuloBorrado) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontró el artículo para borrar"
            });
        }

        return res.status(200).json({
            status: "success",
            articulo: articuloBorrado,
            mensaje: "Artículo borrado correctamente"
        });
    } catch (error) {
        console.error('Error al borrar:', error);
        return res.status(500).json({
            status: "error",
            mensaje: "Error interno al borrar el artículo"
        });
    }
}



const editar = async (req, res) => {
    try {
        const articuloId = req.params.id;

        const parametros = req.body;

        const articuloActualizado = await Articulo.findOneAndUpdate(
            { _id: articuloId },
            parametros,
            { new: true } 
        );

        if (!articuloActualizado) {
            return res.status(500).json({
                status: "Error",
                mensaje: "Error al actualizar"
            });
        }


        return res.status(200).json({
            status: "success",
            articulo: articuloActualizado
        });

    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos para enviar"
        });
    }
};


const subir = async (req, res) => {
    try {

        if (!req.file && !req.files) {
            return res.status(404).json({
                status: "error",
                mensaje: "Petición invalida"
            });
        }

        let archivo = req.file.originalname;

        let archivo_split = archivo.split(".");
        let archivo_extension = archivo_split[1];

        if (archivo_extension !== "png" && archivo_extension !== "jpg" &&
            archivo_extension !== "jpeg" && archivo_extension !== "gif") {
            await new Promise((resolve, reject) => {
                fs.unlink(req.file.path, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });
            return res.status(400).json({
                status: "error",
                mensaje: "Imagen inválida"
            });
        } else {
            return res.status(200).json({
                status: "success",
                archivo_split,
                files: req.file
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error en el servidor"
        });
    }
};


const rutas = (req, res) => {
    return res.status(200).json({
        mensaje: "Rutas disponibles",
        rutas: {
            crear: "POST /api/crear",
            listar: "GET /api/listar",
            uno: "GET /api/articulo/:id",
            borrar: "DELETE /api/borrar/:id",
            actualizar: "PUT /api/actualizar/:id",
            subir_imagen: "POST /api/subir-imagen/:id"
        }
    });
}


module.exports = {
    prueba,
    curso,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    rutas
}