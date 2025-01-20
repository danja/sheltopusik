import { SPAtom } from './types.js';
import log from 'loglevel';

class Maybe {
    static just(value) {
        return new Just(value);
    }

    static nothing() {
        return new Nothing();
    }

    static from(value) {
        return value === null || value === undefined ? Maybe.nothing() : Maybe.just(value);
    }
}

class Just extends Maybe {
    constructor(value) {
        super();
        this.value = value;
    }

    map(fn) {
        return Maybe.from(fn(this.value));
    }

    flatMap(fn) {
        return fn(this.value);
    }

    getOrElse(defaultValue) {
        return this.value;
    }
}

class Nothing extends Maybe {
    map(fn) {
        return this;
    }

    flatMap(fn) {
        return this;
    }

    getOrElse(defaultValue) {
        return defaultValue;
    }
}

export const monadPrimitives = {
    'maybe': Maybe.from,
    'just': Maybe.just,
    'nothing': Maybe.nothing,
    'map-maybe': (maybe, fn) => maybe.map(fn),
    'flat-map-maybe': (maybe, fn) => maybe.flatMap(fn),
    'get-or-else': (maybe, defaultValue) => maybe.getOrElse(defaultValue)
};