# Documentación Requerida


## 👉 1.- Nombre de la aplicación.
**Opción 1: Apache HTTP Server (httpd)**
## 👉 2.- Comandos ejecutados.

### 🚀 Comando docker run completo:
> **Terminal**

```bash
docker run -d --name mi-apache -p 8081:80 httpd
```
### 🚀 Comandos de verificación:
> **Terminal**

```bash
docker ps
docker ps -a  # muestra todos
```
### 🚀 Comandos de limpieza:
> **Terminal**

```bash
docker stop e08c     # Detener el contenedor con id e08c
docker rm e08c       # Eliminar el contenedor con id e08c
docker system prune  # Limpiar containers, networks e images no usadas
```
## 👉 3.- Explicación breve.
> <h4> 🛠 Qué hace cada flag del comando docker run que usaste</h4>
```bash
docker run httpd -d --name mi-apache -p 8081:80
```
| Flag             | Descripción                                             | Ejemplo                     |
|----------------  |-----------------------------------                      |-----------------------------|
| run httpd        | Crear y ejecuta container httpd                         | docker run httpd            |
| -d               | Detached (separado) - ejecuta en segundo plano          |  docker run httpd -d        |
| --name mi-apache | Asignar el nombre mi-apache al contenedor               | docker run --name mi-apache |
| -p 8081:80       | Port mapping (mapeo de puertos) - publica puerto en 8081| docker run -p 8081:80       |

## 👉 4.- Evidencia.
> <h4> 🛠 Screenshot de docker ps mostrando el container corriendo</h4>
![docker-run](/Clase1/img/docker-ps.png)
> <h4> 🛠 Screenshot del navegador (si es httpd) o salida de docker logs (si es redis/mysql)</h4>
![docker-run](/Clase1/img/navegador.png)
> <h4> 🛠 Screenshot o salida mostrando que el container fue eliminado correctamente</h4>
![docker-run](/Clase1/img/docker-rm.png)
## 👉 5.- Conclusiones (opcional).
