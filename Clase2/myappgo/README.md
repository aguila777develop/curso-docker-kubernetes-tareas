# Docker & Kubernetes: Containers (Contenedores) y Orquestación en 

---

## Paso 1 Estructura del proyecto
> Primero, crea un nuevo directorio para tu proyecto y navega a él. Luego, inicializa un proyecto Node.js con:
```bash
myapp/
├── go.mod
├── main.go

```

## Paso 2 go.mod
```bash
module myapp

go 1.21

```
Esto inicializa el módulo. Puedes usar go mod init myapp para generarlo automáticamente.
## Paso  main.go
```bash
package main

import (
	"fmt"
	"log"
	"net/http"
)

// Handler para "/hello"
func helloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hola, Enrique! Bienvenido a la aplicación Go.")
}

// Handler para "/status"
func statusHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintln(w, `{"status":"ok","message":"La aplicación está funcionando correctamente"}`)
}

func main() {
	http.HandleFunc("/hello", helloHandler)
	http.HandleFunc("/status", statusHandler)

	port := ":8080"
	log.Printf("Servidor corriendo en http://localhost%s\n", port)
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatal(err)
	}
}

```
## Paso  Cómo ejecutar
```bash
# Descargar dependencias
go mod tidy

# Ejecutar la app
go run main.go

```
## Paso Luego abre tu navegador en:

http://localhost:8080/hello

http://localhost:8080/status
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 
```bash
PORT=8000
```
## Paso 3 Crear el archivo requirements.txt


```bash
fastapi
uvicorn[standard]
python-dotenv
```
- fastapi: Framework para construir la API.

- uvicorn: Servidor ASGI para ejecutar la app.

- python-dotenv: Para cargar variables de entorno desde .env.
## Paso 4 Crear el archivo app.py
```bash
from fastapi import FastAPI
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

app = FastAPI()

# Endpoint 1: Saludo
@app.get("/saludo")
async def saludo():
    return {"mensaje": "¡Hola, bienvenido a la API!"}

# Endpoint 2: Información de la app
@app.get("/info")
async def info():
    return {
        "mensaje": "Esta es una aplicación de ejemplo con FastAPI",
        "version": "1.0.0"
    }

# Puerto configurable
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)


```
## Paso 5 Instalar dependencias

Dentro de tu entorno virtual (recomendado):
```bash
pip install -r requirements.txt
```
## Paso 6 Ejecutar la aplicación

```bash
python app.py
```
Esto iniciará el servidor en el puerto definido en .env (o 8000 si no se define).
## Paso 7 Probar los endpoints

- GET /saludo
```bash
curl http://localhost:8000/saludo
```
- GET /info
```bash
curl http://localhost:8000/info
```
## Paso 8 Archivo Dockerfile
```bash
# Imagen base de Python
FROM python:3.10

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos necesarios
COPY requirements.txt .

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del proyecto al contenedor
COPY . .

# Exponer el puerto (mismo que usará FastAPI)
EXPOSE 8000

# Comando para ejecutar la aplicación
CMD ["python", "app.py"]

```

```bash

```
## Paso 9 Archivo .env
```bash
PORT=8000
```
(puedes cambiar el puerto si quieres, por ejemplo PORT=5000)
## Paso 10 Archivo requirements.txt
```bash
fastapi
uvicorn[standard]
python-dotenv

```
## Paso Construir y ejecutar el contenedor
- Construir la imagen:
```bash
docker build -t mi-app-fastapi .
```
- Ejecutar el contenedor:
```bash
docker run -p 8000:8000 --env-file .env mi-app-fastapi

```
🔹 -p 8000:8000: Mapea el puerto local con el del contenedor
🔹 --env-file .env: Carga las variables de entorno desde el archivo .env
## Paso Probar la aplicación

Cuando el contenedor esté corriendo, abre en tu navegador:

http://localhost:8000/saludo

http://localhost:8000/info

También puedes entrar al documento interactivo de FastAPI (Swagger UI):

👉 http://localhost:8000/docs

Ahí verás ambos endpoints listos para probar.
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```
## Paso
```bash

```

