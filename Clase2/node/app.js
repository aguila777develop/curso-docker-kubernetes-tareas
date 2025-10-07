// app.js
const express = require("express");
require("dotenv").config(); // Carga las variables del archivo .env

const app = express();
const port = process.env.PORT || 3000; // Puerto configurable con valor por defecto

// Middleware para que la app reciba JSON
app.use(express.json());

// Endpoint prinicpal: pagina bienvenido
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Porfirio Ramos</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          text-align: center;
          padding: 20px;
        }
        h1 {
          color: #0044cc;
          font-size: 2.5em;
        }
        p {
          font-size: 1.2em;
        }
        img {
          max-width: 200px;
          border-radius: 10px;
          margin-top: 20px;
        }
        .links {
          margin-top: 30px;
        }
        .links a {
          text-decoration: none;
          color: #007bff;
          font-size: 1.2em;
          margin: 10px;
        }
        .links a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <h1>¡Bienvenido a mi API!</h1>
      <p>Mi nombre es Porfirio Ramos y esta es mi API.</p>
      <h3>Curso de Docker y Kubernetes en:</h3>

      <img src="https://iquattrogroup.com/pluginfile.php/1/theme_adaptable/adaptablemarkettingimages/0/iQ-Capacitacion-200x200-fondoBL.jpg" alt="Imagen de saludo" />
      <div class="links">
        <p>Visita los siguientes endpoints:</p>
        <a href="/api/saludo"> /api/saludo</a> | 
        <a href="/api/info">/api/info</a>
      </div>
    </body>
    </html>
  `);
  //
});
// Endpoint 1: Saludo
app.get("/api/saludo", (req, res) => {
  res.json({
    success: true,
    status: 200,
    mensaje:
      "¡Hola, bienvenido a la API! Del curso de Docker y Kubernetes en I-QUATRO"
  });
});

// Endpoint 2: Info sobre la app
app.get("/api/info", (req, res) => {
  res.json({
    success: true,
    status: 200,
    mensaje:
      "Esta es una aplicación de ejemplo con Node.js y Express, del Curso de DOCKER",
    version: "1.0.0"
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
