// TODO: move this to a config file
const config = {
    board: {
        graphics_path: '/res/graphics/game/scene',
        tile_size: 32, // pixels
        variations: {
            dirt: 3,
            grass: 3,
        },
    }
};

///////////////////////////////////////////////////////////////////////////////
/////////////////////////            Tiles            /////////////////////////
///////////////////////////////////////////////////////////////////////////////

function Tile (x, y, name, collision, visible=true) {
    this.name = name;
    this.collision = collision;
    this.visible = !!visible;

    this.x = x;
    this.y = y;

    this.sz = config['board'].tile_size;
}

Tile.prototype.Filename () {
    let path = config['board'].graphics_path + '/tiles/';
    path += this.name;

    let vars = config['board'].variations[]
    if (vars) {
        path += Math.floor(Math.random()*vars);
    }

    path += '.png';

    return path;
}

Tile.prototype.Render (ctx) {
    if (!this.visible) {
        return false;
    }

    // TODO: render
    return true;
}

///////////////////////////////////////////////////////////////////////////////
/////////////////////////            Board            /////////////////////////
///////////////////////////////////////////////////////////////////////////////

function Board () {
    this.__tiles = [];
    this.width = config['board'].width;
    this.height = config['board'].height;
}

board.prototype.SetLegend (legend) {
    for (let key in legend) {
        let data = legend[key];

        // just wait till u see how cool this is
        board.prototype['__createTile' + key] = function (x, y) {
            let t = new Tile(x, y, data.name, data.collision, data.visible);
            this.tiles[x + y*this.width] = t;

            // Any custom behavior for tile (in the future may be necessary)
            return t;
        }
    }
}

board.prototype.SetTiles (tiles) {
    for (let i = 0; i < tiles.length; i++) {
        let row = tiles[i];

        // yooo i told u it was cool dawg
        for (let j = 0; j < tiles[i].length; j++) {
            this['__createTile' + tiles[i][j]](j, i);
        }
    }
}

board.prototype.UpdateTiles () {
    // TODO: in the future we will be getting diffs instead of full states
    //       write a function here to handle that eventually
}

board.prototype.GetTileAt (x, y) {
    return this.__tiles[x + y*this.width];
}

board.prototype.Render () {
    // only loop through the area around the player
    // then render each of those tiles
}

var board = new Board();
