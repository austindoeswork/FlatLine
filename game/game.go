package game

type player struct {
	X    int
	Xvel float64
	Y    int
	Yvel float64
	size int
}

func NewPlayer(x, y int) *player {
}

type tile struct {
	X    int
	Y    int
	size int
}

func NewTile(x, y, size int) *tile {
}

type board struct {
	players []*player
	tiles   [][]*tile
}

type Game struct {
	board
}
