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
        
        this.load.spritesheet("characters", "/assets/tilesets/characters_packed.png", {frameWidth: 24, frameHeight: 24})

        this.load.image("tiles", "/assets/tilesets/main_tileset.png");
        this.load.tilemapTiledJSON('level1', '/assets/levels/level1.json');
    }

    public create() {

        const map = this.make.tilemap({ key: 'level1' });
        const tiles = map.addTilesetImage("main", "tiles");
        const layer = map.createLayer('main', tiles);

         // Set colliding tiles before converting the layer to Matter bodies!
        layer.setCollisionByProperty({ collides: true });

        // Convert the layer. Any colliding tiles will be given a Matter body. If a tile has collision
        // shapes from Tiled, these will be loaded. If not, a default rectangle body will be used. The
        // body will be accessible via tile.physics.matterBody.
        this.matter.world.convertTilemapLayer(layer);

        this.matter.world.setBounds(map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        

        const players: Player[] = <Player[]>map.createFromObjects('player', {
            name: 'player',
            classType: Player,
        });
        this.player = players[0];
        this.player.matterSprite.anims.play('walk');
        this.cameras.main.startFollow(this.player.matterSprite);
        
    }

    public update() {
        this.player.update();
    }
}