import * as Phaser from 'phaser';
import { GameScene } from './scenes/game';
import { PhaserMatterCollisionPlugin } from "phaser-matter-collision-plugin";

const pluginConfig = {
    // The plugin class:
    plugin: PhaserMatterCollisionPlugin,
    // Where to store in Scene.Systems, e.g. scene.sys.matterCollision:
    key: "matterCollision" as "matterCollision",
    // Where to store in the Scene, e.g. scene.matterCollision:
    mapping: "matterCollision" as "matterCollision",
};

export const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Sample',

    type: Phaser.AUTO,

    scale: {
        width: window.innerWidth,
        height: window.innerHeight,
    },
    plugins: {
        scene: [pluginConfig]
    },
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 1
            },
            debug: true,
        },
    },

    parent: 'game',
    backgroundColor: '#000000',
    scene: GameScene,
};


declare module "phaser" {
    interface Scene {
        [pluginConfig.mapping]: PhaserMatterCollisionPlugin;
    }
    namespace Scenes {
        interface Systems {
            [pluginConfig.key]: PhaserMatterCollisionPlugin;
        }
    }
}