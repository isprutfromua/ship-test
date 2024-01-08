import { LinkedList } from '../helpers/LinkedList.ts';
import { Boat } from './Boat.ts';

export class BoatQueue extends LinkedList<Boat> {
    private _size: number = 0;

    get size() {
        return this._size;
    }

    reserve() {
        this._size += 1;
    }

    unshift(): Boat | undefined {
        const boat = super.unshift();
        this._size -= 1;

        return boat;
    }
}

export type TQueueType = 'load' | 'release';
export type TQueuesMap = {
    [key in TQueueType]: BoatQueue;
};
export type TBoatQueuesStats = {
    [key in TQueueType]: number;
};
