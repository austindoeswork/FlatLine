package main

import (
	"log"

	"github.com/austindoeswork/FlatLine/config"
	"github.com/austindoeswork/FlatLine/server"
)

func main() {
	// CONFIG
	c, err := config.Find()
	if err != nil {
		log.Fatalf("Fatal: Config error: %s\nExample:\n%s\n", err.Error(), config.Example())
	}

	s := server.NewServer(c)

	log.Printf("blastoff: %s\n", c.ServerAddress)
	log.Fatal(s.Start())
}
