// app.js
const express = require("express");
require("dotenv").config(); // Carga las variables del archivo .env

const app = express();
const port = process.env.PORT || 3000; // Puerto configurable con valor por defecto

// Middleware para que la app reciba JSON
app.use(express.json());

// Endpoint 1: Saludo
app.get("/saludo", (req, res) => {
  res.send("¡Hola, bienvenido a la API!");
});

// Endpoint 2: Info sobre la app
app.get("/info", (req, res) => {
  res.json({
    mensaje: "Esta es una aplicación de ejemplo con Node.js y Express",
    version: "1.0.0"
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
