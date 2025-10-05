# Docker & Kubernetes: Containers (Contenedores) y Orquestación en la Práctica

Repositorio oficial del curso de **i-Quattro** enfocado en el uso profesional de containers (contenedores) con Docker y su orquestación con Kubernetes.

**[Información del curso](https://www.i-quattro.com/product-page/dok-kub-001)**

---

## Paso 1 Inicializar el proyecto
> Primero, crea un nuevo directorio para tu proyecto y navega a él. Luego, inicializa un proyecto Node.js con:
```bash
mkdir mi-app-express
cd mi-app-express
npm init -y
```
Esto creará un package.json con la configuración predeterminada.
## Paso 2 Instalar dependencias
Instalamos las dependencias necesarias para la aplicación:
```bash
npm install express dotenv
```
- express: El framework de Node.js para construir el servidor.

- dotenv: Para cargar las variables de entorno desde un archivo .env.

## Paso 3 Estructura del proyecto

La estructura del proyecto será simple:
```bash
mi-app-express/
├── .env
├── app.js
├── package.json
├── Dockerfile
└── node_modules/

```
## Paso 4 Crear el archivo .env

En el archivo .env, definimos el puerto configurable para el servidor:
```bash
PORT=3000

```
## Paso 5 Crear el archivo app.js

Este será el archivo principal de nuestra aplicación. Aquí definimos los endpoints y configuramos el servidor:
```bash
// app.js
const express = require('express');
require('dotenv').config(); // Carga las variables del archivo .env

const app = express();
const port = process.env.PORT || 3000; // Puerto configurable con valor por defecto

// Middleware para que la app reciba JSON
app.use(express.json());

// Endpoint 1: Saludo
app.get('/saludo', (req, res) => {
    res.send('¡Hola, bienvenido a la API!');
});

// Endpoint 2: Info sobre la app
app.get('/info', (req, res) => {
    res.json({
        mensaje: 'Esta es una aplicación de ejemplo con Node.js y Express',
        version: '1.0.0'
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

```
## Paso 6 Modificar el archivo package.json

Asegúrate de que en tu archivo package.json estén las dependencias correctas, y agrega un script para iniciar la aplicación. El archivo package.json debería verse algo así:
```bash
{
  "name": "mi-app-express",
  "version": "1.0.0",
  "description": "Aplicación Node.js con Express",
  "main": "app.js",
  "scripts": {
    "dev": "node app.js"
  },
  "dependencies": {
    "dotenv": "^10.0.0",
    "express": "^4.17.1"
  },
  "author": "",
  "license": "ISC"
}

```
## Paso 7 Iniciar la aplicación

Para iniciar el servidor, simplemente ejecuta:
```bash
npm run dev
```
Esto iniciará el servidor en el puerto definido en el archivo .env o en el puerto 3000 si no se define en .env.
## Paso 8 Probar los endpoints

- GET /saludo: Responde con un saludo simple.
```bash
curl http://localhost:3000/saludo
```
- GET /info: Devuelve un JSON con información sobre la aplicación.
```bash
curl http://localhost:3000/info
```
## Paso 9 Resultado

Cuando todo esté configurado y funcionando, deberías ver en la terminal algo como:
```bash
```
- Si navegas a http://localhost:3000/saludo en tu navegador o haces una solicitud GET, deberías obtener:

- Y si accedes a http://localhost:3000/info, recibirás un JSON como:
## Paso 10 Construir y ejecutar la imagen Docker

Ahora que tienes el Dockerfile, puedes construir la imagen Docker y ejecutar el contenedor. Abre una terminal en la carpeta raíz de tu proyecto y sigue estos pasos:

Construir la imagen:
```bash
docker build -t mi-app-express .
```
Esto construirá la imagen y la etiquetará como mi-app-express.
## Paso 11 Ejecutar el contenedor:
```bash
docker run -p 3000:3000 --env-file .env mi-app-express
```
El comando anterior hace lo siguiente:

- -p 3000:3000: Mapea el puerto 3000 del contenedor al puerto 3000 de tu máquina local.

- --env-file .env: Carga las variables de entorno desde el archivo .env que creamos previamente (para configurar el puerto).

- mi-app-express: Es el nombre de la imagen que hemos construido.
## Paso 12 Probar la aplicación

Ahora, al igual que cuando ejecutabas la aplicación sin Docker, puedes probarla:

> Accede a http://localhost:3000/saludo en tu navegador.

> Accede a http://localhost:3000/info para ver la información sobre la app.
```bash
```
## Paso 2
```bash
```
## Paso 2
```bash
```
## Paso 2
```bash
```
## Paso 2
```bash
```
## Paso 2
```bash
```
## Paso 2
```bash
```
## Paso 2
```bash
```
## Paso 2
```bash
```
## Paso 2
```bash
```
## Paso 2
```bash
```
## Paso 2
```bash
```
## Paso 2
```bash
```
## Paso 2
```bash
```
## Paso 2
```bash
```
## Paso 2
```bash
```
## Paso 2
```bash
```
## Paso 2
```bash
```
## Paso 2
```bash
```
## Paso 2
```bash
```
## Paso 2
```bash
```
## Paso 2
```bash
```
## Paso 2
```bash
```
