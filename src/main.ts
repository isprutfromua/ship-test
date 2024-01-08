import { Application, Graphics } from 'pixi.js';
import { Port, TQueueType } from './models/Port.ts';
import { BOAT_GAP, BOAT_GEN_TIME, PIER_GAP, PIER_LOAD_TIME, PIERS_COUNT, pos, WALLS } from './settings.ts';
import { Boat, BoatFactory } from './models/Boat.ts';
import { EColor, TWallSetting } from './types';
import { pause, percentsToCoords } from './helpers';
import { Pier } from './models/Pier.ts';

class Game {
    private _port = new Port();
    private _app: Application = new Application({
        backgroundColor: 0x86b6f6,
        resizeTo: window,
    });
    private _gameLoopInterval: ReturnType<typeof setInterval> | undefined;

    constructor() {
        document.body.appendChild(this._app.view as unknown as Node);

        this.renderPiers();
        this.renderWalls();
        this.startGameLoop();
    }

    startGameLoop() {
        this._gameLoopInterval = setInterval(() => this.play(), BOAT_GEN_TIME);
    }

    stopGameLoop() {
        clearInterval(this._gameLoopInterval);
    }

    play() {
        this.processQueue('load');
        this.processQueue('release');
        this.processNormalBoat();
    }

    generateBoat() {
        const capacity = this.getRandomPierCapacity();
        const boat = Math.random() > 0.5 ? BoatFactory.getRedBoat(capacity) : BoatFactory.getGreenBoat(capacity);
        boat.position.set(...percentsToCoords(this._app, pos['boat']));
        this._app.stage.addChild(boat);

        return boat;
    }

    private getRandomPierCapacity() {
        return this._port.getPiers()[~~(Math.random() * PIERS_COUNT)].capacity;
    }

    renderPiers() {
        const piers = this._port.getPiers();
        const [x, y] = percentsToCoords(this._app, pos['pier']);

        for (let i = 0; i < piers.length; i++) {
            piers[i].position.x = x;
            piers[i].position.y = y - piers[i].height * (i % 2 === 0 ? i + 1 : -(i + 1)) - PIER_GAP;

            this._app.stage.addChild(piers[i]);
        }
    }

    getWallCoordinates(): TWallSetting[] {
        return WALLS.map(([x, y, w, h]) => [
            ...percentsToCoords(this._app, [x, y]),
            w,
            ~~((this._app.view.height / 100) * h),
        ]);
    }

    renderWalls() {
        const wallsMap = this.getWallCoordinates();

        const wallGraphic = new Graphics();
        wallGraphic.beginFill(0x000000);
        wallsMap.forEach(([x, y, w, h]) => {
            wallGraphic.drawRect(x, y, w, h);
        });
        this._app.stage.addChild(wallGraphic);
    }

    private processNormalBoat() {
        const boat = this.generateBoat();
        const boatPier = this._port.findPier(boat);

        if (boatPier) {
            this.moveBoatToTarget(boat, boatPier);
        } else {
            this.moveToQueue(boat);
        }
    }

    private moveBoatToTarget(boat: Boat, boatPier: Pier) {
        boat.setTarget(boatPier.x, boatPier.y);
        boatPier.book();

        const move = async () => {
            const coordinates = this.getWallCoordinates();
            const moved = boat.move(coordinates);

            if (moved) {
                await pause(PIER_LOAD_TIME);
                this.processBoat(boat, boatPier);
            }
        };

        this._app.ticker.add(move);
    }

    private processBoat(boat: Boat, boatPier: Pier) {
        boat.color === EColor.Green ? boatPier.loadBoat(boat) : boatPier.releaseBoat(boat);

        boat.setTarget(...percentsToCoords(this._app, pos['boat']));
        const isFinished = boat.move(this.getWallCoordinates());

        isFinished && this._app.stage.removeChild(boat);
    }

    private moveToQueue(boat: Boat) {
        const type = boat.color === EColor.Green ? 'load' : 'release';
        const queStat = this._port.getStats();
        const [x, y] = percentsToCoords(this._app, pos[type]);
        this._port.bookQueue(type);

        boat.setTarget(x + queStat[type] * BOAT_GAP, y);
        const move = () => {
            const isFinished = boat.move(this.getWallCoordinates());

            if (isFinished) {
                this._port.moveToQueue(boat);
                this._app.ticker.remove(move);
            }
        };
        this._app.ticker.add(move);
    }

    private processQueue(type: TQueueType) {
        const boat = this._port.firstBoatInQueue(type);

        if (!boat) return;

        const boatPier = this._port.findPier(boat);

        if (boatPier) {
            this.moveBoatToTarget(boat, boatPier);
            this._port.removeFirstBoatInQueue(type);
        }
    }
}

new Game()

