import { SPList, SPAtom } from './types.js';
import log from 'loglevel';

export class LazyList {
    constructor(generator) {
        this.generator = generator;
        this.cached = [];
        this.exhausted = false;
    }

    static range(start, end, step = 1) {
        let current = start;
        return new LazyList(() => {
            if (current >= end) return null;
            const value = current;
            current += step;
            return new SPAtom(value);
        });
    }

    static iterate(fn, seed) {
        let current = seed;
        return new LazyList(() => {
            const value = current;
            current = fn(current);
            return new SPAtom(value);
        });
    }

    take(n) {
        const result = new SPList();
        for (let i = 0; i < n; i++) {
            const next = this.next();
            if (!next) break;
            result.push(next);
        }
        return result;
    }

    next() {
        if (this.exhausted) return null;
        if (this.cached.length > 0) return this.cached.shift();
        
        const next = this.generator();
        if (!next) {
            this.exhausted = true;
            return null;
        }
        return next;
    }

    toList() {
        const result = new SPList();
        let next;
        while ((next = this.next())) {
            result.push(next);
        }
        return result;
    }
}

export const lazyPrimitives = {
    'lazy-range': LazyList.range,
    'lazy-iterate': LazyList.iterate,
    'lazy-take': (list, n) => list.take(n),
    'force': (list) => list.toList()
};