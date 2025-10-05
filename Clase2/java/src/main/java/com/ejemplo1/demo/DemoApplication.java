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
                        "descripcion", "Esta API de ejemplo ofrece dos endpoints.",
                        "version", "1.0.0",
                        "autor", "Porfirio Ramos"
                )
        );
    }
}
