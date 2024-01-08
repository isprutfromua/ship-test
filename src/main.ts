import { Game } from './models/Game.ts';
import { GAME_TIME } from './settings.ts';

const game = new Game();
game.start();
setInterval(() => game.stop(), GAME_TIME);
