import { MAX_CAPACITY, MIN_CAPACITY, PIERS_COUNT } from '../settings.ts';
import { Application } from 'pixi.js';

export function genPiers() {
    const piers: number[] = [];

    for (let i = 0; i < PIERS_COUNT; i++) {
        piers.push(Math.floor(Math.random() * (MAX_CAPACITY - MIN_CAPACITY + 1)) + MIN_CAPACITY);
    }

    return piers;
}
export function percentsToCoords(app: Application, percents: [x: number, y: number]): [x: number, y: number] {
    return [~~((app.view.width / 100) * percents[0]), ~~((app.view.height / 100) * percents[1])];
}
export function pause(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}