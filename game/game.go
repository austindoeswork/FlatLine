package game

import (
	"fmt"
	"log"
	"math"
	"strconv"
)

func handleError(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

type Player struct {
	X      float64
	Xvel   float64
	Y      float64
	Yvel   float64
	Height float64
	Width  float64
}

// TODO better hitboxes
func NewPlayer(x, y float64) *Player {
	p := &Player{
		X:      x,
		Y:      y,
		Xvel:   0.0,
		Yvel:   0.0,
		Height: 1.0,
		Width:  1.0,
	}
	return p
}

// TODO collision
type Tile struct {
	Size float64
}

func NewTile() *Tile {
	t := &Tile{
		Size: 1.0,
	}
	return t
}

type Board struct {
	Players map[int]*Player
	Tiles   map[int]map[int]*Tile
}

// TODO rando gen / chunks / spawn
func NewBoard() *Board {
	b := &Board{
		Players: map[int]*Player{},
		Tiles:   map[int]map[int]*Tile{},
	}
	// create tiles
	for i := -5; i < 5; i++ {
		x := i
		y := 0
		t := NewTile()
		err := b.InsertTile(x, y, t)
		handleError(err)
	}
	// create players
	p0 := NewPlayer(-1.0, -1.0)
	p1 := NewPlayer(1.0, -1.0)

	b.Players[0] = p0
	b.Players[1] = p1

	return b
}

func (b *Board) InsertTile(x, y int, t *Tile) error {
	if b.Tiles == nil {
		b.Tiles = map[int]map[int]*Tile{}
	}

	if b.Tiles[x] == nil {
		b.Tiles[x] = map[int]*Tile{}
	}

	b.Tiles[x][y] = t
	return nil
}

func (b *Board) PPrint() {
	dx := 10
	dy := 10
	offset := 5
	stringArr := make([][]string, dy)
	for i := range stringArr {
		stringArr[i] = make([]string, dx)
	}

	for x, yMap := range b.Tiles {
		for y, _ := range yMap {
			stringArr[y+offset][x+offset] = "="
		}
	}

	for p, player := range b.Players {
		stringArr[int(math.Round(player.Y))+offset][int(math.Round(player.X))+offset] = strconv.Itoa(p)
	}

	for _, arr := range stringArr {
		for _, char := range arr {
			if char == "" {
				fmt.Printf(" ")
			}
			fmt.Printf("%s", char)
		}
		fmt.Printf("\n")
	}
}

type Game struct {
	Board *Board
}

func NewGame() *Game {
	g := &Game{}
	g.Board = NewBoard()
	return g
}

func (g *Game) PPrint() {
	g.Board.PPrint()
}
