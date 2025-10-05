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
