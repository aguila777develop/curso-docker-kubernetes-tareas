# Administración de Servidores Linux (Básico a Avanzado Inicial)

## Paso 1 ESTRUCTURA DEL PROYECTO
```bash
mi-app-springboot/
├── src/
│   ├── main/
│   │   ├── java/com/ejemplo/demo/
│   │   │   └── DemoApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/
│   └── test/
├── pom.xml

```
## Paso 2 pom.xml (configuración con Maven)
```bash
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>com.ejemplo</groupId>
    <artifactId>demo</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>mi-app-springboot</name>
    <description>Aplicación de ejemplo con Spring Boot</description>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.5</version>
    </parent>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <!-- Dependencias principales -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Dependencia para test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- Plugin para empaquetar como un JAR ejecutable -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>

```
## Paso 3 DemoApplication.java
```bash
package com.ejemplo.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@SpringBootApplication
@RestController
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    // Endpoint 1: Saludo profesional
    @GetMapping("/saludo")
    public ResponseEntity<Map<String, String>> saludo() {
        return ResponseEntity.ok(
                Map.of(
                        "mensaje", "Bienvenido a la API REST con Spring Boot",
                        "estado", "exitoso",
                        "version", "1.0.0"
                )
        );
    }

    // Endpoint 2: Información de la API
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> info() {
        return ResponseEntity.ok(
                Map.of(
                        "nombre", "Demo API",
                        "descripcion", "Esta API de ejemplo ofrece dos endpoints profesionales",
                        "version", "1.0.0",
                        "autor", "Equipo de Desarrollo"
                )
        );
    }
}


```
## Paso 4 application.properties

Archivo ubicado en src/main/resources/application.properties
Aquí definimos el puerto configurable:
```bash
server.port=${PORT:8080}
```
Esto significa:

Si existe una variable de entorno PORT, la usa.

Si no existe, usará el puerto 8080 por defecto.
## Paso 5 Compilar y ejecutar

Primero, compila el proyecto con Maven:
```bash
mvn clean package

```
## Paso Luego, ejecuta la aplicación:
```bash
java -jar target/demo-1.0.0.jar
```
- Por defecto correrá en el puerto 8080.
- Pero puedes cambiarlo al vuelo:
```bash
PORT=9090 java -jar target/demo-1.0.0.jar

```
## Paso Probar los endpoints

Una vez que el servidor esté corriendo, prueba en el navegador o con curl:

GET /saludo
👉 http://localhost:8080/saludo

GET /info
👉 http://localhost:8080/info
