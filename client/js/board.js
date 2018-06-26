///////////////////////////////////////////////////////////////////////////////
/////////////////////////            Tiles            /////////////////////////
///////////////////////////////////////////////////////////////////////////////

function Tile (x, y, name, collision, visible=true) {
    this.name = name;
    this.collision = collision;
    this.visible = !!visible;

    this.x = x;
    this.y = y;

    let vars = config['board'].variations[this.name];
    this.var = Math.floor(Math.random()*vars);
}

Tile.seed = 0;

Tile.prototype.Filename = function () {
    let path = config['board'].graphics_path + '/tile/';
    path += this.name + this.var + '.png';

    return path;
}

Tile.prototype.Render = function (ctx) {
    if (!this.visible) {
        return false;
    }

    drawTile(
        this.Filename(),
        this.x*config['board'].tile_size,
        this.y*config['board'].tile_size,
        config['board'].tile_size,
        config['board'].tile_size
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

    this.sz = config['board'].tile_size;

    this.entities = [];
    this.player = null;

    this.keyState = {};
}

Board.prototype.SetPlayer = function (player) {
    // Setup player pointer + movement controls
    this.player = player;

    window.addEventListener('keydown', (function (evt) {
        this.keyState[evt.key] = true;
    }).bind(this));

    window.addEventListener('keyup', (function (evt) {
        this.keyState[evt.key] = false;
    }).bind(this));
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

Board.prototype.SetEntities = function (entities) {
    for (let i = 0; i < entities.length; i++) {
        let entity;
        if (entities[i].isMob) {
            entity = new Mob(
                entities[i].x,
                entities[i].y,
                entities[i].wd,
                entities[i].hg,
                entities[i].collWd,
                entities[i].collHg,
                entities[i].name,
                entities[i].type,
            );

            if (entities[i].type == 'player') {
                this.SetPlayer(entity);
            }
        } else {
            entity = new Entity(
                entities[i].x,
                entities[i].y,
                entities[i].wd,
                entities[i].hg,
                entities[i].collWd,
                entities[i].collHg,
                entities[i].name,
                entities[i].type,
            );
        }

        this.entities.push(entity);
    }
}

Board.prototype.UpdateEntities = function (entities) {
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

    for (let i = 0; i < this.entities.length; i++) {
        this.entities[i].Render();
    }
}

Board.prototype.Update = function () {
    // Read input
    if (this.keyState['a']) {
        this.player.Move(-1);
    } else if (this.keyState['d']) {
        this.player.Move(1);
    } else {
        this.player.Move(0);
    }

    if (this.keyState['Shift']) {
        this.keyState['Shift'] = false;
        this.player.Jump();
    }

    // Run game logic on tiles

    // Run game logic on entities
    for (let i = 0; i < this.entities.length; i++) {
        this.entities[i].Update(this);
    }
}
