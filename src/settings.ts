import {TPointTupple, TTexturesMap, TWallSetting} from "./types";
import {Texture} from "pixi.js";

export const MIN_CAPACITY = 3
export const MAX_CAPACITY = 10
// piers
export const PIERS_COUNT = 4
const PIER_START_POS: TPointTupple = [5, 50]
export const PIER_GAP = 60
export const PIER_LOAD_TIME = 5000;
export const PIER_WIDTH = 60;
export const PIER_HEIGHT = 60;
// wall
export const WALLS: TWallSetting[] = [[20,0,10,40], [20,60,10,40]]
// textures
export const textures: TTexturesMap = {
    red: {
        full: Texture.from('./src/textures/red/full.png'),
        empty: Texture.from('./src/textures/red/empty.png'),
    },
    dock: {
        full: Texture.from('./src/textures/dock/full.png'),
        empty: Texture.from('./src/textures/dock/empty.png'),
    },
    green: {
        full: Texture.from('./src/textures/green/full.png'),
        empty: Texture.from('./src/textures/green/empty.png'),
    }
} as const
// boats
export const BOAT_WIDTH = 64
export const BOAT_HEIGHT = 64
export const BOAT_SPEED = 5
export const BOAT_GAP = 40
export const BOAT_MARGIN = 10
const BOAT_START_POS: TPointTupple = [90, 50]
export const BOAT_GEN_TIME = 8000
// queue
const LOAD_QUEUE_START_POS: TPointTupple = [30, 10]
const RELEASE_QUEUE_START_POS: TPointTupple = [30, 90]
export const pos = {
    load: LOAD_QUEUE_START_POS,
    release: RELEASE_QUEUE_START_POS,
    boat: BOAT_START_POS,
    pier: PIER_START_POS
}