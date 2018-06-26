////////////////////////////////////////////////////////////////////////////////
/////////////////////////            Entity            /////////////////////////
////////////////////////////////////////////////////////////////////////////////

function Entity (x, y, wd, hg, cwd, chg, name, type='other') {
    // Position
    this.x = x;
    this.y = y;
    this.wd = wd;
    this.hg = hg;

    // Collision width and height
    if (!cwd) {
        this.cwd = wd;
    } else {
        this.cwd = cwd;
    }

    if (!chg) {
        this.chg = hg;
    } else {
        this.chg = chg;
    }

    // Movement (velocity, acceleration)
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0.05;

    // Sprite
    this.name = name;
    this.filename = config['entities'].graphics_path + '/' + type + '/' + name + '.png';
}

Entity.isCollidingWithTile = function (board, x, y, wd, hg) {
    // Find all overlapping tiles with player's position
    let x1 = Math.floor(x);
    let x2 = Math.ceil(x );
    let y1 = Math.floor(y);
    let y2 = Math.ceil(y);

    let collidingSides = {
        up: false,
        down: false,
        left: false,
        right: false,
    }

    let tl = true;
    let tr = true;
    let bl = true;
    let br = true;

    try {
        tl = board.GetTileAt(x1, y1).collision == 'block';
    } catch (e) {}

    try {
        tr = board.GetTileAt(x2, y1).collision == 'block';
    } catch (e) {}

    try {
        bl = board.GetTileAt(x1, y2).collision == 'block';
    } catch (e) {}

    try {
        br = board.GetTileAt(x2, y2).collision == 'block';
    } catch (e) {}

    // Only things that should happen
    if (tl && tr) { collidingSides.top = true; }
    if (tr && br) { collidingSides.right = true; }
    if (br && bl) { collidingSides.bottom = true; }
    if (bl && tl) { collidingSides.left = true; }

    return collidingSides;
}

Entity.prototype.Update = function (board) {
    this.vx += this.ax;
    this.vy += this.ay;

    // new x, new y
    let nx = this.x + this.vx;
    let ny = this.y + this.vy;

    let sanity = 160;

    while (true) {
        let collidingSides = Entity.isCollidingWithTile(board, nx, ny, this.cwd, this.chg);

        if (collidingSides.bottom) {
            ny -= 0.01;
            this.vy = 0;
        } else if (collidingSides.top) {
            ny += 0.01;
            this.vy = 0;
        }

        if (collidingSides.left) {
            nx += 0.01;
            this.vx = 0;
        } else if (collidingSides.right) {
            nx -= 0.01;
            this.vx = 0;
        }

        sanity -= 1;
        if (sanity <= 0
            || (!collidingSides.top
                && !collidingSides.bottom
                && !collidingSides.left
                && !collidingSides.right
            )
        ) {
            this.x = nx;
            this.y = ny;
            break;
        }
    }
}

Entity.prototype.Render = function () {
    drawTile(
        this.filename,
        this.x*config['board'].tile_size,
        this.y*config['board'].tile_size,
        this.wd,
        this.hg
    );

    return true;
}


////////////////////////////////////////////////////////////////////////////////
//////////////////////////            Mobs            //////////////////////////
////////////////////////////////////////////////////////////////////////////////

function Mob (x, y, wd, hg, cwd, chg, name, type='mob') {
    Entity.call(this, x, y, wd, hg, cwd, chg, name, type);
    this.filename = config['entities'].graphics_path + '/mob/' + type + '/' + name + '.png';
}

// Javascript is a great language
Mob.prototype = Object.create(Entity.prototype);
Mob.prototype.constructor = Mob;

Mob.prototype.Render = function () {
    // TODO: animation

    drawTile(
        this.filename,
        this.x*config['board'].tile_size,
        this.y*config['board'].tile_size - this.hg + config['board'].tile_size,
        24,
        24
    );

    return true;
}

// dir should be 1 for right, -1 for left, 0 for stop
Mob.prototype.Move = function (dir) {
    this.vx = dir * 0.3;
}

Mob.prototype.Jump = function () {
    this.vy = -0.5;
}
