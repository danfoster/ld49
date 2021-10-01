import * as Phaser from 'phaser';
import { Player } from '../objects/player';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class GameScene extends Phaser.Scene {
    private player: Player;

    constructor() {
        super(sceneConfig);
    }

    public preload() {
        this.load.image("tiles", "/assets/tilesets/tiles_packed.png");
        this.load.spritesheet("characters", "/assets/tilesets/characters_packed.png", {frameWidth: 24, frameHeight: 24})

        this.load.tilemapTiledJSON('level1', '/assets/levels/level1.json');
    }

    public create() {

        const map = this.make.tilemap({ key: 'level1' });
        const tiles = map.addTilesetImage("tiles");
        const layer = map.createLayer('main', tiles);

         // Set colliding tiles before converting the layer to Matter bodies!
        layer.setCollisionByProperty({ collides: true });

        // Convert the layer. Any colliding tiles will be given a Matter body. If a tile has collision
        // shapes from Tiled, these will be loaded. If not, a default rectangle body will be used. The
        // body will be accessible via tile.physics.matterBody.
        this.matter.world.convertTilemapLayer(layer);

        this.matter.world.setBounds(map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // this.cameras.main.setZoom(4);

        const players: Player[] = <Player[]>map.createFromObjects('chars', {
            name: 'player',
            classType: Player,
        });
        this.player = players[0];
        this.player.matterSprite.anims.play('walk');
        
    }

    public update() {
        this.player.update();

        
    }
}