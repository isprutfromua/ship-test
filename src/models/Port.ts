import { genPiers } from '../helpers';
import { Pier } from './Pier.ts';
import { Boat } from './Boat.ts';
import { EColor } from '../types';
import { BoatQueue, TBoatQueuesStats, TQueuesMap, TQueueType } from './BoatQueue.ts';

export class Port {
    private _piers = genPiers().map((capacity) => new Pier(capacity));
    private _loadQueue: BoatQueue = new BoatQueue();
    private _releaseQueue: BoatQueue = new BoatQueue();

    getStats(): TBoatQueuesStats {
        return {
            load: this._loadQueue.size,
            release: this._releaseQueue.size,
        };
    }

    getPiers() {
        return this._piers;
    }

    get queues(): TQueuesMap {
        return {
            load: this._loadQueue,
            release: this._releaseQueue,
        };
    }

    findPier(boat: Boat) {
        return this.getPiers().find((p: Pier) => !p.booked && p.full === !boat.full && p.capacity === boat.capacity);
    }

    firstBoatInQueue(queueType: TQueueType) {
        return this.queues[queueType].head;
    }

    removeFirstBoatInQueue(queueType: TQueueType) {
        return this.queues[queueType].unshift();
    }

    addBoatToQueue(queueType: TQueueType, boat: Boat) {
        this.queues[queueType].add(boat);
    }

    bookQueue(queueType: TQueueType) {
        this.queues[queueType].reserve();
    }

    moveToQueue(boat: Boat) {
        if (boat.color === EColor.Green) {
            this.addBoatToQueue('load', boat);
        } else {
            this.addBoatToQueue('release', boat);
        }
    }
}