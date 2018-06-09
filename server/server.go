package server

import (
	"net/http"

	"github.com/austindoeswork/FlatLine/config"
	"github.com/austindoeswork/FlatLine/game"
)

type Server struct {
	c *config.Config
}

func NewServer(c *config.Config) *Server {
	s := &Server{
		c: c, // TODO remove reference to entire config
	}
	return s
}

func (s *Server) Start() error {
	g := game.NewGame()
	g.PPrint()

	http.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir(s.c.StaticDir))))
	err := http.ListenAndServe(s.c.ServerAddress, nil)
	return err
}
