import {Sprite, Text} from "pixi.js";
import {IBoat} from "./Boat.ts";
import {PIER_HEIGHT, PIER_WIDTH, textures} from "../settings.ts";

interface IPier {
    readonly capacity: number;
    full: boolean;

    releaseBoat(boat: IBoat): void;

    loadBoat(boat: IBoat): void;
}

export class Pier extends Sprite implements IPier {
    private readonly _capacity: number
    private _full: boolean = false
    private _booked: boolean = false

    constructor(capacity: number) {
        super(textures.dock.empty)

        this._capacity = capacity
        this.setupGraphic();
    }

    private setupGraphic() {
        this.anchor.set(0.5)
        this.width = PIER_WIDTH
        this.height = PIER_HEIGHT

        const text = new Text(this.capacity, {
            fontSize: 64
        })
        this.addChild(text)
    }

    get capacity() {
        return this._capacity
    }

    get full(): boolean {
        return this._full
    }

    get booked(): boolean {
        return this._booked
    }

    book() {
        this._booked = true
    }

    unbook() {
        this._booked = false
    }

    releaseBoat(boat: IBoat) {
        boat.release()
        this._full = true
        this.texture = textures.dock.full
        this.unbook()
    }

    loadBoat(boat: IBoat) {
        boat.load()
        this._full = false
        this.texture = textures.dock.empty
        this.unbook()
    }
}