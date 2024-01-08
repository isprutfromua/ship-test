import { Point, Resource, Sprite, Texture, Text } from 'pixi.js';
import { EColor } from '../types';
import { BOAT_HEIGHT, BOAT_MARGIN, BOAT_SPEED, BOAT_WIDTH, textures } from '../settings.ts';

export interface IBoat {
    readonly capacity: number;
    full: boolean;
    color: EColor;

    load(): void;

    release(): void;

    move(): void;

    setTarget(x: number, y: number): void;
}

const dir = {
    Left: -1,
    Right: 1,
    Top: 1,
    Bottom: -1,
} as const;

export class Boat extends Sprite implements IBoat {
    private readonly _capacity: number;
    private _full: boolean;
    private _speed: number = BOAT_SPEED;
    private _textures: {
        empty: Texture<Resource>;
        full: Texture<Resource>;
    };
    private _target: Point | null = null;

    readonly color: EColor;

    constructor(color: EColor, capacity: number, full: boolean) {
        super();

        this._capacity = capacity;
        this._full = full;
        this._textures = textures[color.toLowerCase() as Lowercase<EColor>];
        this.color = color;

        this.setupGraphic();
    }

    private setupGraphic() {
        this.width = BOAT_WIDTH;
        this.height = BOAT_HEIGHT;

        this.texture = this._full ? this._textures.full : this._textures.empty;

        const text = new Text(this.capacity, {
            fontSize: 128,
        });
        this.addChild(text);
    }

    get capacity(): number {
        return this._capacity;
    }

    get full(): boolean {
        return this._full;
    }

    load(): void {
        this._full = true;
        this.texture = this._textures.full;
    }

    release(): void {
        this._full = false;
        this.texture = this._textures.empty;
    }

    move() {
        if (!this._target) return false;
        const isCloseEnoughX = this.isCloseEnough(this.position.x, this._target.x);
        const isCloseEnoughY = this.isCloseEnough(this.position.y, this._target.y);

        if (isCloseEnoughX && isCloseEnoughY) {
            this._target = null;
            return true;
        }

        const dirX = this._target.x - this.position.x > 0 ? dir.Right : dir.Left;
        const dirY = this._target.y - this.position.y > 0 ? dir.Top : dir.Bottom;

        // TODO: needs refactor to have better obstacles avoiding logic.
        const updateX = () => {
            this.position.x += dirX * this._speed;
        };

        const updateY = () => {
            this.position.y += dirY * this._speed;
        };

        if (dirY === -1) {
            if (!isCloseEnoughX) {
                updateX();
            } else if (!isCloseEnoughY) {
                updateY();
            }
        } else {
            if (!isCloseEnoughY) {
                updateY();
            } else if (!isCloseEnoughX) {
                updateX();
            }
        }

        return false;
    }

    private isCloseEnough(num1: number, num2: number, distance: number = BOAT_MARGIN) {
        return Math.abs(num1 - num2) <= distance;
    }

    setTarget(x: number, y: number) {
        if (this._target) return;

        this._target = new Point(x, y);
    }
}

export class BoatFactory {
    static getGreenBoat(capacity: number): Boat {
        return new Boat(EColor.Green, capacity, false);
    }

    static getRedBoat(capacity: number): Boat {
        return new Boat(EColor.Red, capacity, true);
    }
}
