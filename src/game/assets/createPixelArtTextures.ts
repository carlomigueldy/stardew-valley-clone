import Phaser from 'phaser';

const TILE = 32;

type CanvasTexture = ReturnType<Phaser.Textures.TextureManager['createCanvas']>;

function withTexture(
  scene: Phaser.Scene,
  key: string,
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D) => void,
) {
  if (scene.textures.exists(key)) return;
  const texture = scene.textures.createCanvas(key, width, height) as CanvasTexture | null;
  if (!texture) throw new Error(`Unable to create texture ${key}`);
  const context = texture.getContext();
  context.imageSmoothingEnabled = false;
  draw(context);
  texture.refresh();
}

function rect(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawGrass(ctx: CanvasRenderingContext2D, base = '#4f8f45') {
  rect(ctx, base, 0, 0, TILE, TILE);
  rect(ctx, '#6fb65c', 2, 5, 4, 2);
  rect(ctx, '#3f7839', 14, 10, 3, 2);
  rect(ctx, '#78c96a', 24, 21, 5, 2);
  rect(ctx, '#376b34', 7, 26, 4, 2);
}

export function createPixelArtTextures(scene: Phaser.Scene) {
  withTexture(scene, 'tile-grass', TILE, TILE, (ctx) => drawGrass(ctx));

  withTexture(scene, 'tile-path', TILE, TILE, (ctx) => {
    rect(ctx, '#b88955', 0, 0, TILE, TILE);
    rect(ctx, '#d0a06a', 0, 0, TILE, 4);
    rect(ctx, '#8d623f', 0, 28, TILE, 4);
    rect(ctx, '#9b7047', 6, 9, 6, 3);
    rect(ctx, '#e5bb79', 21, 19, 5, 2);
  });

  withTexture(scene, 'tile-water', TILE, TILE, (ctx) => {
    rect(ctx, '#3b82a0', 0, 0, TILE, TILE);
    rect(ctx, '#65b8c6', 3, 7, 12, 3);
    rect(ctx, '#2b607b', 12, 22, 15, 3);
    rect(ctx, '#9ce3e2', 20, 12, 7, 2);
  });

  withTexture(scene, 'plot-wild', TILE, TILE, (ctx) => {
    drawGrass(ctx, '#578d3d');
    rect(ctx, '#7dbd51', 8, 9, 3, 14);
    rect(ctx, '#294e2c', 20, 13, 3, 10);
    rect(ctx, '#d1ad63', 24, 24, 3, 3);
  });

  withTexture(scene, 'plot-tilled', TILE, TILE, (ctx) => {
    rect(ctx, '#7b4f2b', 0, 0, TILE, TILE);
    rect(ctx, '#96633b', 2, 4, 28, 4);
    rect(ctx, '#5a371f', 4, 14, 24, 4);
    rect(ctx, '#a66e42', 3, 24, 25, 3);
  });

  withTexture(scene, 'plot-watered', TILE, TILE, (ctx) => {
    rect(ctx, '#5d442f', 0, 0, TILE, TILE);
    rect(ctx, '#6a553d', 2, 4, 28, 4);
    rect(ctx, '#3c3028', 4, 14, 24, 4);
    rect(ctx, '#496f7a', 8, 23, 12, 2);
  });

  withTexture(scene, 'crop-seeded', TILE, TILE, (ctx) => {
    ctx.clearRect(0, 0, TILE, TILE);
    rect(ctx, '#d8bd79', 14, 17, 4, 4);
    rect(ctx, '#86613a', 13, 21, 6, 2);
  });

  withTexture(scene, 'crop-sprout', TILE, TILE, (ctx) => {
    ctx.clearRect(0, 0, TILE, TILE);
    rect(ctx, '#2f7d37', 15, 16, 3, 9);
    rect(ctx, '#5fc45c', 10, 14, 7, 4);
    rect(ctx, '#8be06e', 17, 12, 7, 4);
  });

  withTexture(scene, 'crop-turnip', TILE, TILE, (ctx) => {
    ctx.clearRect(0, 0, TILE, TILE);
    rect(ctx, '#68bf5b', 8, 6, 6, 6);
    rect(ctx, '#92df75', 15, 5, 8, 7);
    rect(ctx, '#f2e7c9', 11, 13, 12, 11);
    rect(ctx, '#d8b7c1', 13, 21, 8, 4);
    rect(ctx, '#fff7df', 14, 15, 4, 3);
  });

  withTexture(scene, 'crop-strawberry', TILE, TILE, (ctx) => {
    ctx.clearRect(0, 0, TILE, TILE);
    rect(ctx, '#60b954', 10, 7, 12, 5);
    rect(ctx, '#d94852', 11, 13, 11, 10);
    rect(ctx, '#ff7880', 14, 16, 3, 2);
    rect(ctx, '#ffd36d', 18, 19, 2, 2);
  });

  withTexture(scene, 'player', 24, 32, (ctx) => {
    ctx.clearRect(0, 0, 24, 32);
    rect(ctx, '#2d1b16', 8, 3, 8, 4);
    rect(ctx, '#f0b887', 7, 7, 10, 8);
    rect(ctx, '#6d3b2f', 5, 4, 14, 4);
    rect(ctx, '#ffe0ad', 9, 10, 2, 2);
    rect(ctx, '#47312b', 14, 10, 2, 2);
    rect(ctx, '#3d7a5b', 6, 15, 12, 9);
    rect(ctx, '#335844', 4, 17, 4, 8);
    rect(ctx, '#335844', 18, 17, 3, 8);
    rect(ctx, '#27304d', 7, 24, 5, 7);
    rect(ctx, '#27304d', 14, 24, 5, 7);
    rect(ctx, '#1a1620', 6, 30, 6, 2);
    rect(ctx, '#1a1620', 14, 30, 6, 2);
  });

  withTexture(scene, 'rowan', 24, 32, (ctx) => {
    ctx.clearRect(0, 0, 24, 32);
    rect(ctx, '#efe0b4', 7, 5, 10, 9);
    rect(ctx, '#d9d0c1', 5, 3, 14, 5);
    rect(ctx, '#586c83', 5, 15, 14, 10);
    rect(ctx, '#32465a', 3, 18, 4, 7);
    rect(ctx, '#32465a', 18, 18, 4, 7);
    rect(ctx, '#5a3c32', 7, 25, 4, 6);
    rect(ctx, '#5a3c32', 14, 25, 4, 6);
    rect(ctx, '#fff8d1', 9, 9, 2, 2);
    rect(ctx, '#fff8d1', 14, 9, 2, 2);
  });

  withTexture(scene, 'farmhouse', 112, 84, (ctx) => {
    ctx.clearRect(0, 0, 112, 84);
    rect(ctx, '#5d3327', 8, 34, 96, 44);
    rect(ctx, '#7c4431', 16, 26, 80, 14);
    rect(ctx, '#b65a3d', 6, 24, 100, 12);
    rect(ctx, '#e8b35f', 18, 44, 18, 16);
    rect(ctx, '#3f2b21', 50, 52, 18, 26);
    rect(ctx, '#f1d585', 78, 44, 16, 14);
    rect(ctx, '#2f211b', 0, 78, 112, 6);
    rect(ctx, '#f7d87b', 58, 62, 3, 3);
  });

  withTexture(scene, 'tree', 48, 64, (ctx) => {
    ctx.clearRect(0, 0, 48, 64);
    rect(ctx, '#6d4328', 20, 34, 9, 22);
    rect(ctx, '#49301e', 17, 54, 15, 5);
    rect(ctx, '#316d3b', 10, 22, 28, 17);
    rect(ctx, '#3f8c45', 5, 12, 35, 16);
    rect(ctx, '#65ad52', 15, 6, 25, 14);
    rect(ctx, '#2b5d34', 25, 29, 15, 13);
  });

  withTexture(scene, 'tile-cursor', TILE, TILE, (ctx) => {
    ctx.clearRect(0, 0, TILE, TILE);
    rect(ctx, '#fff2a6', 0, 0, TILE, 2);
    rect(ctx, '#fff2a6', 0, TILE - 2, TILE, 2);
    rect(ctx, '#fff2a6', 0, 0, 2, TILE);
    rect(ctx, '#fff2a6', TILE - 2, 0, 2, TILE);
  });

  withTexture(scene, 'rain-drop', 3, 8, (ctx) => {
    ctx.clearRect(0, 0, 3, 8);
    rect(ctx, '#9ad9f5', 1, 0, 2, 8);
  });

  withTexture(scene, 'firefly', 6, 6, (ctx) => {
    ctx.clearRect(0, 0, 6, 6);
    rect(ctx, '#fff6a5', 2, 1, 2, 4);
    rect(ctx, '#ffd36d', 1, 2, 4, 2);
  });
}
