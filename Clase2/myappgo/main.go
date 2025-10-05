package main

import (
	"encoding/json"
	"log"
	"net/http"
)

// Response estándar para la API
type ApiResponse struct {
	Status  string      `json:"status"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// Función auxiliar para enviar JSON
func respondJSON(w http.ResponseWriter, code int, payload ApiResponse) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		http.Error(w, `{"status":"error","error":"Error al generar la respuesta JSON"}`, http.StatusInternalServerError)
	}
}

// Handler para "/saludo"
func helloHandler(w http.ResponseWriter, r *http.Request) {
	response := ApiResponse{
		Status:  "success",
		Message: "Hola, Enrique! Bienvenido a la aplicación Go.",
	}
	respondJSON(w, http.StatusOK, response)
}

// Handler para "/status"
func statusHandler(w http.ResponseWriter, r *http.Request) {
	response := ApiResponse{
		Status:  "success",
		Message: "La aplicación está funcionando correctamente",
		Data: map[string]string{
			"version": "1.0.0",
			"uptime":  "24h", // Ejemplo de dato adicional
		},
	}
	respondJSON(w, http.StatusOK, response)
}

func main() {
	http.HandleFunc("/saludo", helloHandler)
	http.HandleFunc("/status", statusHandler)

	port := ":8083"
	log.Printf("Servidor corriendo en http://localhost%s\n", port)
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatal(err)
	}
}
