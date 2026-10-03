package response

import (
	"encoding/json"
	"net/http"
)

type envelope struct {
	Data  any    `json:"data,omitempty"`
	Error *errBody `json:"error,omitempty"`
}

type errBody struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func OK(w http.ResponseWriter, data any) {
	write(w, http.StatusOK, envelope{Data: data})
}

func Error(w http.ResponseWriter, status int, code, message string) {
	write(w, status, envelope{Error: &errBody{Code: code, Message: message}})
}

func write(w http.ResponseWriter, status int, body envelope) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(body)
}
