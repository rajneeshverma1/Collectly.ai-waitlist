.PHONY: run build clean

run:
	go run main.go

build:
	go build -o waitlist-app main.go

clean:
	rm -f waitlist-app
