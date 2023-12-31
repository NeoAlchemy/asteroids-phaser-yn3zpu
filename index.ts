import Phaser from 'phaser';

// Import stylesheets
import './style.css';

/* ----------------------------------- START SCENE --------------------------------- */
class BootLevel extends Phaser.Scene {
  constructor() {
    super({ key: 'BootLevel' });
  }

  preload() {
    // CHANGE BASE URL!!!!
    this.load.baseURL =
      'https://neoalchemy.github.io/starting-boilerplate-phaser-zcqxxx/';
    this.load.bitmapFont({
      key: 'Oswald',
      textureURL: 'static/assets/font/OswaldLightRed.png',
      fontDataURL: 'static/assets/font/OswaldLightRed.xml',
    });
    this.load.image('logo', 'static/assets/logo.png');
    this.load.image('splashscreen', 'static/assets/splashscreen.png');
  }

  create() {
    this.scene.start('SplashLevel');
  }
}

/* ----------------------------------- START SCENE --------------------------------- */
class SplashLevel extends Phaser.Scene {
  constructor() {
    super({ key: 'SplashLevel' });
  }

  preload() {
    const splashScreen = this.add.image(200, 200, 'splashscreen');

    const logo = this.add.image(200, 100, 'logo');
    logo.setScale(0.3);
    this.logo = logo;

    const text1 = this.add.bitmapText(-300, 200, 'Oswald', 'NeoAlchemy', 32);
    this.companyLine1 = text1;
    const text2 = this.add.bitmapText(-300, 230, 'Oswald', 'Indie Games', 32);
    this.companyLine2 = text2;

    const loading = this.add.text(180, 300, ['Loading...'], {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: 'black',
      align: 'center',
    });

    /* START PRELOAD ITEMS */

    /* END PRELOAD ITEMS */
  }
  private logo: Phaser.GameObjects.Image;
  private companyLine1: Phaser.GameObjects.BitmapText;
  private companyLine2: Phaser.GameObjects.BitmapText;

  create() {
    this.tweens.add({
      targets: this.logo, //your image that must spin
      rotation: 2 * Math.PI, //rotation value must be radian
      ease: 'Bounce',
      delay: 600,
      duration: 600, //duration is in milliseconds
    });

    this.tweens.add({
      targets: this.companyLine1, //your image that must spin
      x: '140',
      ease: 'Elastic',
      duration: 500, //duration is in milliseconds
    });
    this.tweens.add({
      targets: this.companyLine2, //your image that must spin
      x: '140',
      ease: 'Elastic',
      duration: 500, //duration is in milliseconds
    });

    setTimeout(() => {
      this.scene.start('TitleLevel');
    }, 2000);
  }

  update() {}
}

/* ----------------------------------- TITLE SCENE --------------------------------- */

class TitleLevel extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleLevel' });
  }

  preload() {
    this.load.baseURL = 'https://neoalchemy.github.io/asteroids-phaser-yn3zpu/';
    this.load.image('asteroid', 'static/assets/asteroid.png');
    this.load.image('ship', 'static/assets/ship.png');
    this.load.image('bullet', 'static/assets/bullet-v3.png');
    this.load.bitmapFont({
      key: 'Orbitron',
      textureURL: 'static/assets/font/Orbitron.png',
      fontDataURL: 'static/assets/font/Orbitron.xml',
    });
  }

  create() {
    this.add.bitmapText(110, 100, 'Orbitron', 'Asteroids', 32);
    this.add.bitmapText(105, 200, 'Orbitron', 'Press Space to Start', 16);

    let group = this.add.group();
    for (let i = 0; i < 5; i++) {
      let asteroid = this.add.sprite(10, 10, 'asteroid');
      asteroid.scale = Phaser.Math.Between(1, 3);
      asteroid.angle = Phaser.Math.Between(0, 360);
      asteroid.x = Phaser.Math.Between(0, 400);
      asteroid.y = Phaser.Math.Between(0, 400);
      group.add(asteroid);
    }
    this.asteroids = group;

    this.cursorKeys = this.input.keyboard.createCursorKeys();
  }

  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private asteroids: Phaser.GameObjects.Group;

  update() {
    if (this.cursorKeys.space.isDown) {
      this.scene.start('MainLevel');
    }

    if (this.asteroids.children) {
      this.asteroids
        .getChildren()
        .forEach((asteroid: Phaser.GameObjects.Sprite) => {
          var angleRad = asteroid.angle * (Math.PI / 180); //angle in radians
          asteroid.x = asteroid.x + 1 * Math.cos(angleRad) * 1;
          asteroid.y = asteroid.y + 1 * Math.sin(angleRad) * 1;
          if (asteroid.x > 420) asteroid.x -= 420;
          if (asteroid.y > 420) asteroid.y -= 420;

          if (asteroid.x < 0) asteroid.x += 400;
          if (asteroid.y < 0) asteroid.y += 400;
        });
    }
  }
}

/* ----------------------------------- MAIN SCENE --------------------------------- */

class MainLevel extends Phaser.Scene {
  constructor() {
    super({ key: 'MainLevel' });
  }

  preload() {}

  create() {
    let group = this.add.group();
    for (let i = 0; i < 3; i++) {
      let asteroid = this.physics.add.sprite(10, 10, 'asteroid');
      asteroid.scale = 2;
      asteroid.angle = Phaser.Math.Between(0, 360);
      asteroid.x = Phaser.Math.Between(0, 400);
      asteroid.y = Phaser.Math.Between(0, 400);
      group.add(asteroid);
    }
    this.asteroids = group;

    const ship = this.physics.add.sprite(200, 200, 'ship');
    this.ship = ship;

    const bullet = this.physics.add.sprite(-10, -10, 'bullet');
    this.bullet = bullet;

    this.cursorKeys = this.input.keyboard.createCursorKeys();
  }

  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private asteroids: Phaser.GameObjects.Group;
  private ship: Phaser.GameObjects.Sprite;
  private bullet: Phaser.GameObjects.Sprite;
  private fire: boolean = false;

  update() {
    if (this.asteroids.children) {
      this.asteroids
        .getChildren()
        .forEach((asteroid: Phaser.GameObjects.Sprite) => {
          this.moveForward(asteroid);
        });
    }

    this.moveShip();
  }

  moveShip() {
    if (this.cursorKeys.up.isDown) {
      this.moveForward(this.ship);
    }
    if (this.cursorKeys.left.isDown) {
      this.ship.angle -= 5;
    }
    if (this.cursorKeys.right.isDown) {
      this.ship.angle += 5;
    }
    if (this.cursorKeys.space.isDown) {
      this.fire = true;
      this.bullet.active = true;
      this.bullet.visible = true;
      this.bullet.x = this.ship.x;
      this.bullet.y = this.ship.y;
      this.bullet.angle = this.ship.angle;
    }
    if (this.fire) {
      this.moveForward(this.bullet, 4);
      setTimeout(() => {
        this.fire = false;
        this.bullet.active = false;
        this.bullet.visible = false;
      }, 1000);
    }
  }

  moveForward(gameObject: Phaser.GameObjects.Sprite, speed: number = 1) {
    var angleRad = (gameObject.angle - 90) * (Math.PI / 180); //angle in radians
    gameObject.x = gameObject.x + 1 * Math.cos(angleRad) * speed;
    gameObject.y = gameObject.y + 1 * Math.sin(angleRad) * speed;
    if (gameObject.x > 420) gameObject.x -= 420;
    if (gameObject.y > 420) gameObject.y -= 420;

    if (gameObject.x < 0) gameObject.x += 400;
    if (gameObject.y < 0) gameObject.y += 400;
  }
}

/* -------------------------------------------------------------------------- */
/*                                RUN GAME.                                   */
/* -------------------------------------------------------------------------- */

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 400,
  backgroundColor: '0x000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [BootLevel, SplashLevel, TitleLevel, MainLevel],
};

const game = new Phaser.Game(config);
