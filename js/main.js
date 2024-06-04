const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let obstacles;
let groundHazards;
let gameOver = false;
let obstacleTimer;
let hazardTimer;

function preload() {
    this.load.setBaseURL('https://labs.phaser.io');
    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('ground', 'assets/platforms/platform.png');
    this.load.image('obstacle', 'assets/sprites/block.png');
    this.load.image('hazard', 'assets/sprites/bomb.png');
    this.load.spritesheet('dude', 'assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    // Fondo
    this.add.image(config.width / 2, config.height / 2, 'sky').setScale(2);

    // Suelo
    let ground = this.physics.add.staticGroup();
    ground.create(config.width / 2, config.height, 'ground').setScale(2).refreshBody();

    // Jugador
    player = this.physics.add.sprite(config.width / 2, config.height - 150, 'dude');
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.UP,
        down: Phaser.Input.Keyboard.KeyCodes.DOWN,
        left: Phaser.Input.Keyboard.KeyCodes.LEFT,
        right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        w: Phaser.Input.Keyboard.KeyCodes.W,
        a: Phaser.Input.Keyboard.KeyCodes.A,
        s: Phaser.Input.Keyboard.KeyCodes.S,
        d: Phaser.Input.Keyboard.KeyCodes.D
    });

    // Obstáculos
    obstacles = this.physics.add.group({
        removeCallback: (obstacle) => obstacle.scene.obstacles.remove(obstacle)
    });
    obstacleTimer = this.time.addEvent({
        delay: 1000,
        callback: createObstacle,
        callbackScope: this,
        loop: true
    });

    // Peligros en el suelo
    groundHazards = this.physics.add.group({
        removeCallback: (hazard) => hazard.scene.groundHazards.remove(hazard)
    });
    hazardTimer = this.time.addEvent({
        delay: 1500,
        callback: createGroundHazard,
        callbackScope: this,
        loop: true
    });

    this.physics.add.collider(player, ground);
    this.physics.add.collider(player, obstacles, hitObstacle, null, this);
    this.physics.add.collider(player, groundHazards, hitHazard, null, this);
}

function update() {
    if (gameOver) {
        return;
    }

    player.setVelocityX(0);

    if (cursors.left.isDown || cursors.a.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown || cursors.d.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.anims.play('turn');
    }

    if ((cursors.up.isDown || cursors.w.isDown) && player.body.touching.down) {
        player.setVelocityY(-330);
    }

    // Eliminar los obstáculos que han llegado al suelo
    obstacles.children.iterate(function(obstacle) {
        if (obstacle.y > config.height) {
            obstacles.remove(obstacle, true, true);
        }
    });

    // Eliminar los peligros en el suelo que han sido tocados
    groundHazards.children.iterate(function(hazard) {
        if (hazard.y < config.height - 32) {
            groundHazards.remove(hazard, true, true);
        }
    });
}

function createObstacle() {
    let x = Phaser.Math.Between(0, config.width);
    let obstacle = obstacles.create(x, 0, 'obstacle');
    obstacle.setVelocityY(200);
    obstacle.setCollideWorldBounds(true);
    obstacle.setBounce(1);
}

function createGroundHazard() {
    let x = Phaser.Math.Between(0, config.width);
    let hazard = groundHazards.create(x, config.height - 32, 'hazard');
    hazard.setCollideWorldBounds(true);
}

function hitObstacle(player, obstacle) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
    obstacleTimer.remove();
    hazardTimer.remove();
}

function hitHazard(player, hazard) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
    obstacleTimer.remove();
    hazardTimer.remove();
}

// Ajustar el tamaño del juego cuando se cambie el tamaño de la ventana
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
