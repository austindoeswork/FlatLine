package server

import (
	"log"
	"net/http"

	"github.com/austindoeswork/FlatLine/config"
	"github.com/austindoeswork/FlatLine/game"

	"github.com/gorilla/websocket"
)

// Upgrades a regular ResponseWriter to WebSocketResponseWriter
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

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
	game.NewGame()
	// g.PPrint()

	http.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir(s.c.StaticDir))))
	http.HandleFunc("/echo", s.echo)
	err := http.ListenAndServe(s.c.ServerAddress, nil)
	return err
}

func (s *Server) echo(w http.ResponseWriter, r *http.Request) {
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	defer c.Close()
	for {
		mt, message, err := c.ReadMessage()
		if err != nil {
			log.Println("read:", err)
			break
		}
		log.Printf("recv: %s", message)
		err = c.WriteMessage(mt, message)
		if err != nil {
			log.Println("write:", err)
			break
		}
	}
}
