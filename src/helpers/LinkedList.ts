class ListNode<T> {
    value: T;
    next: ListNode<T> | null;

    constructor(node: T) {
        this.value = node;
        this.next = null;
    }
}

interface ILinkedList<T> {
    readonly head: T | undefined;

    add(val: T): void;

    unshift(): T | undefined;
}

export class LinkedList<T> implements ILinkedList<T> {
    constructor(
        private _head: ListNode<T> | null = null,
        private _tail: ListNode<T> | null = null,
    ) {}

    add(val: T) {
        const node = new ListNode<T>(val);

        if (!this._head) {
            this._head = node;
            this._tail = node;
        } else {
            this._tail!.next = node;
            this._tail = node;
        }
    }

    get head(): T | undefined {
        return this._head?.value;
    }

    unshift(): T | undefined {
        if (this._head) {
            const val = this._head?.value;
            this._head = this._head.next;

            return val;
        } else {
            return undefined;
        }
    }
}
