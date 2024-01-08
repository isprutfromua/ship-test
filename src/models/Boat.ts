import {Point, Resource, Sprite, Texture, Text} from "pixi.js";
import {EColor, TWallSetting} from "../types";
import {BOAT_HEIGHT, BOAT_MARGIN, BOAT_SPEED, BOAT_WIDTH, textures} from "../settings.ts";

export interface IBoat {
    readonly capacity: number
    full: boolean
    color: EColor

    load(): void

    release(): void
}

export class Boat extends Sprite implements IBoat {
    private readonly _capacity: number;
    private _full: boolean;
    private _speed: number = BOAT_SPEED;
    private _textures: {
        empty: Texture<Resource>,
        full: Texture<Resource>
    }
    private _target: Point | null = null

    readonly color: EColor

    constructor(color: EColor, capacity: number, full: boolean) {
        super();

        this._capacity = capacity
        this._full = full
        this._textures = textures[color.toLowerCase() as Lowercase<EColor>]
        this.color = color

        this.setupGraphic();
    }

    private setupGraphic() {
        this.width = BOAT_WIDTH
        this.height = BOAT_HEIGHT

        this.texture = this._full ? this._textures.full : this._textures.empty

        const text = new Text(this.capacity, {
            fontSize: 128
        })
        this.addChild(text)
    }

    get capacity(): number {
        return this._capacity
    }

    get full(): boolean {
        return this._full
    }

    load(): void {
        this._full = true
        this.texture = this._textures.full
    }

    release(): void {
        this._full = false
        this.texture = this._textures.empty
    }

    move(obstacles: TWallSetting[]) {
        if (!this._target) return;

        const isCloseEnoughX = this.isCloseEnough(this.position.x, this._target.x);
        const isCloseEnoughY = this.isCloseEnough(this.position.y, this._target.y);

        if (isCloseEnoughX && isCloseEnoughY) {
            this._target = null;
            return true;
        }

        const directionX = this._target.x - this.position.x;
        const directionY = this._target.y - this.position.y;

        if (!isCloseEnoughX) {
            this.position.x = this.position.x + (directionX > 0 ? this._speed : -this._speed);
        } else if (!isCloseEnoughY) {
            this.position.y = this.position.y + (directionY > 0 ? this._speed : -this._speed);
        }
    }

    // simple X collision detection
    canMoveHorizontally(obstacles: TWallSetting[]): boolean {
        for (const obstacle of obstacles) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_, obstacleY, __, height] = obstacle;

            if (obstacleY - this.height <=this.position.y &&
                this.position.y <= obstacleY + height + this.height) {
                return false;
            }
        }

        return true;
    }

    private isCloseEnough(num1: number, num2: number) {
        return Math.abs(num1 - num2) <= BOAT_MARGIN
    }

    // simple Y collision detection
    canMoveVertically(obstacles: TWallSetting[]) {
        for (const obstacle of obstacles) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [obstacleX, _, width] = obstacle;

            if (obstacleX - this.width <=this.position.x &&
                this.position.x <= obstacleX + width + this.width) {
                return false;
            }
        }

        return true;
    }

    setTarget(x: number, y: number) {
        if (this._target) return

        this._target = new Point(x, y)
    }
}

export class BoatFactory {
    static getGreenBoat(capacity: number): Boat {
        return new Boat(EColor.Green, capacity, false)
    }

    static getRedBoat(capacity: number): Boat {
        return new Boat(EColor.Red, capacity, true)
    }
}