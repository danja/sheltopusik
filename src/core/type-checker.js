import { SPAtom, SPList } from './types.js';
import log from 'loglevel';

export class TypeChecker {
    static checkNumber(value, name) {
        if (typeof value !== 'number') {
            throw new TypeError(`${name} must be a number, got ${typeof value}`);
        }
        return value;
    }

    static checkString(value, name) {
        if (typeof value !== 'string') {
            throw new TypeError(`${name} must be a string, got ${typeof value}`);
        }
        return value;
    }

    static checkList(value, name) {
        if (!(value instanceof SPList)) {
            throw new TypeError(`${name} must be a list, got ${value?.constructor?.name}`);
        }
        return value;
    }

    static checkFunction(value, name) {
        if (typeof value !== 'function') {
            throw new TypeError(`${name} must be a function, got ${typeof value}`);
        }
        return value;
    }

    static checkArity(fn, expected, received, name) {
        if (expected !== received) {
            throw new TypeError(`${name || 'Function'} expects ${expected} arguments, got ${received}`);
        }
    }
}

// Type-checked primitive wrapper
export function withTypeChecking(fn, types) {
    return (...args) => {
        args.forEach((arg, i) => {
            const type = types[i];
            if (type) {
                TypeChecker[`check${type}`](arg, `Argument ${i + 1}`);
            }
        });
        return fn(...args);
    };
}