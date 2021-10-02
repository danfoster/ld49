import * as Phaser from 'phaser';

// @ts-ignore
var M = Phaser.Physics.Matter.Matter;

export class Player extends Phaser.GameObjects.GameObject {
    body: Phaser.Physics.Arcade.Body;
    matterSprite: Phaser.Physics.Matter.Sprite;
    // @ts-ignore
    sensors: { [key: string]: Phaser.Physics.Matter.Matter.Bodies }; 
    speed: { [key: string]: integer } = {
        run: 2,
        jump: 5
    }
    width: integer;
    height: integer;
    scene: Phaser.Scene;
    keyboard: { [key: string]: Phaser.Input.Keyboard.Key };
    touching: { [key: string]: boolean } = {
        left: false,
        right: false,
        bottom: false
    };

    constructor(scene: Phaser.Scene) {

        
        super(scene, "player");

        this.scene = scene;

        this.scene.anims.create({
            key: 'walk',
            frames: scene.anims.generateFrameNumbers('characters', { frames: [0, 1]}),
            frameRate: 5,
            repeat: -1
        })

        this.createBody();
        this.setupInput();

        // Before matter's update, reset our record of which surfaces the player is touching.
        scene.matter.world.on("beforeupdate", this.resetTouching, this);
        scene.matterCollision.addOnCollideStart({
            objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
            callback: this.onSensorCollide,
            context: this,
        });
        scene.matterCollision.addOnCollideActive({
            objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
            callback: this.onSensorCollide,
            context: this,
        });


        this.matterSprite.anims.play('walk');

    }

    createBody() {
        this.matterSprite =  this.scene.matter.add.sprite(200, 0, 'characters', 9);
        this.sensors = {
            bottom: null,
            left: null,
            right: null
        }
 
     
        this.width = this.matterSprite.width;
        this.height = this.matterSprite.height;

       

        // The player's body is going to be a compound body.
        var playerBody = M.Bodies.rectangle(0, 0, this.width * 0.6, this.height, { chamfer: { radius: 10 } });
        this.sensors.bottom = M.Bodies.rectangle(0, this.height * 0.5, this.width * 0.25, 2, { isSensor: true });
        this.sensors.left = M.Bodies.rectangle(-this.width * 0.35, 0, 2, this.height * 0.5, { isSensor: true });
        this.sensors.right = M.Bodies.rectangle(this.width * 0.35, 0, 2, this.height * 0.5, { isSensor: true });
        var compoundBody = M.Body.create({
            parts: [
                playerBody,
                this.sensors.bottom,
                this.sensors.left,
                this.sensors.right
            ],
            frictionStatic: 0,
            frictionAir: 0.02,
            friction: 0.1,
            // The offset here allows us to control where the sprite is placed relative to the
            // matter body's x and y - here we want the sprite centered over the matter body.
            render: { sprite: { xOffset: 0.5, yOffset: 0.5 } },
        });
        this.matterSprite.setExistingBody(compoundBody);
        this.matterSprite.setFixedRotation();
        
    }

    

    setupInput() {
        this.keyboard = {}
        this.keyboard["left"] = this.scene.input.keyboard.addKey("A");
        this.keyboard["right"] = this.scene.input.keyboard.addKey("D");
        this.keyboard["jump"] = this.scene.input.keyboard.addKey("W");
    }

    onSensorCollide({ bodyA, bodyB, pair }) {
        if (bodyB.isSensor) return; // We only care about collisions with physical objects
        if (bodyA === this.sensors.left) {
            console.log("bonk-left");
            this.touching.left = true;
            if (pair.separation > 0.5) this.matterSprite.x += pair.separation - 0.22;
        } else if (bodyA === this.sensors.right) {
            console.log("bonk-right");
            this.touching.right = true;
            if (pair.separation > 0.5) this.matterSprite.x -= pair.separation - 0.22;
        } else if (bodyA === this.sensors.bottom) {
            this.touching.bottom = true;
        }
    }

    resetTouching() {
        this.touching.left = false;
        this.touching.right = false;
        this.touching.bottom = false;
    }

    public setPosition(x,y) {
        this.matterSprite.setPosition(x, y);
    }

    public setTexture(texture) {
        
    }

    public setFlip() {
        
    }

    public update() {
        
        if ( this.keyboard["left"].isDown ) {
            this.matterSprite.setVelocityX(-this.speed.run);
        }
        if ( this.keyboard["right"].isDown ) {
            this.matterSprite.setVelocityX(this.speed.run);
        }
        if ( this.keyboard["jump"].isDown && this.touching.bottom ) {
            this.matterSprite.setVelocityY(-this.speed.jump);
        }

    }
}