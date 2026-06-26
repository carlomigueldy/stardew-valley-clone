import Phaser from 'phaser';
import FarmScene from './scenes/FarmScene';
import { GAME_HEIGHT, GAME_WIDTH } from './constants';

export function createGameConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#1a2d1c',
    pixelArt: true,
    roundPixels: true,
    scene: [FarmScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
      antialias: false,
    },
  };
}
