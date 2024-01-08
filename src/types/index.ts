import { Resource, Texture } from 'pixi.js';

export type TPointTupple = [x: number, y: number];
export type TWallSetting = [xPercent: number, yPercent: number, width: number, heightPercent: number];
export enum EColor {
    Red = 'Red',
    Green = 'Green',
}

export type TTexturesMap = {
    [key in Lowercase<EColor> | 'dock']: {
        full: Texture<Resource>;
        empty: Texture<Resource>;
    };
};
