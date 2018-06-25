// TODO: move this to a config file
const config = {
    board: {
        graphics_path: '/res/graphics/game/scene',
        tile_size: 16, // pixels
        variations: {
            dirt: 8,
            grass: 3,
        },
        width: 25,
        height: 14,
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


    let vars = config['board'].variations[this.name];
    this.var = Math.floor(Math.random()*vars);
}

Tile.seed = 0;

Tile.prototype.Filename = function () {
    let path = config['board'].graphics_path + '/tiles/';
    path += this.name + this.var + '.png';

    return path;
}

Tile.prototype.Render = function (ctx) {
    if (!this.visible) {
        return false;
    }

    // TODO: render
    drawTile(
        this.Filename(),
        this.x*this.sz,
        this.y*this.sz,
        this.sz,
        this.sz
    );

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

Board.prototype.SetLegend = function (legend) {
    for (let key in legend) {
        let data = legend[key];

        // just wait till u see how cool this is
        this['__createTile' + key] = function (x, y) {
            let t = new Tile(x, y, data.name, data.collision, data.visible);
            this.__tiles[x + y*this.width] = t;

            // Any custom behavior for tile (in the future may be necessary)
            return t;
        }
    }
}

Board.prototype.SetTiles = function (tiles) {
    for (let i = 0; i < tiles.length; i++) {
        let row = tiles[i];

        // yooo i told u it was cool dawg
        for (let j = 0; j < tiles[i].length; j++) {
            this['__createTile' + tiles[i][j]](j, i);
        }
    }
}

Board.prototype.UpdateTiles = function () {
    // TODO: in the future we will be getting diffs instead of full states
    //       write a function here to handle that eventually
}

Board.prototype.GetTileAt = function (x, y) {
    return this.__tiles[x + y*this.width];
}

Board.prototype.Render = function (ctx) {
    // only loop through the area around the player
    for (let i = 0; i < this.width; i++) {
        for (let j = 0; j < this.height; j++) {
            // then render each of those tiles
            this.GetTileAt(i, j).Render(ctx);
        }
    }
}
