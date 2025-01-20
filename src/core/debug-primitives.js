import { SPList, SPAtom } from './types.js';
import log from 'loglevel';

export const debugPrimitives = {
    'trace': (value, label = '') => {
        log.debug(`TRACE ${label}:`, value);
        return value;
    },

    'inspect': (value) => {
        if (value instanceof SPList) {
            return {
                type: 'SPList',
                length: value.length,
                values: [...value].map(v => v instanceof SPAtom ? v.value : v)
            };
        }
        return {
            type: value?.constructor?.name,
            value: value instanceof SPAtom ? value.value : value
        };
    },

    'time': (fn, label = 'Execution time') => {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        log.debug(`${label}: ${end - start}ms`);
        return result;
    },

    'assert': (condition, message) => {
        if (!condition) {
            throw new Error(`Assertion failed: ${message}`);
        }
        return condition;
    }
};