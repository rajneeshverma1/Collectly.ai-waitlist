package main

import (
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"os"
	"sync"
	"time"
)

type WaitlistEntry struct {
	Email     string    `json:"email"`
	Timestamp time.Time `json:"timestamp"`
}

var (
	entries []WaitlistEntry
	mu      sync.Mutex
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Serve static assets
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// Main landing page handler
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		tmpl, err := template.ParseFiles("templates/index.html")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		tmpl.Execute(w, nil)
	})

	// Waitlist join handler
	http.HandleFunc("/join", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		email := r.FormValue("email")
		if email == "" {
			http.Error(w, "Email is required", http.StatusBadRequest)
			return
		}

		mu.Lock()
		entries = append(entries, WaitlistEntry{
			Email:     email,
			Timestamp: time.Now(),
		})
		
		// Save to local file for persistence
		saveEntries()
		mu.Unlock()

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Welcome to the waitlist!"})
	})

	log.Printf("Server starting on port %s...", port)
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatal(err)
	}
}

func saveEntries() {
	data, _ := json.MarshalIndent(entries, "", "  ")
	_ = os.WriteFile("waitlist.json", data, 0644)
}
