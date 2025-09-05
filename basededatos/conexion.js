const mongoose = require("mongoose")

const conexion = async() => {
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/mi_blog", {
            serverSelectionTimeoutMS: 5000 // Timeout después de 5 segundos
        });
        console.log("Conectado correctamente a la base de datos mi_blog");
    }catch(error){
        console.error("Error de conexión a MongoDB:");
        console.error("Mensaje:", error.message);
        console.error("Código:", error.code);
        console.error("Detalles completos:", error);
        throw error;
    }
}

module.exports = {
    conexion
}