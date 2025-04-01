// src/core/primitives.js
import { SPList, SPAtom, NumberType, StringType, ListType, AtomType, FunctionType, AnyType, SPFunctionType, SPUnionType } from './types.js';
import log from 'loglevel';

export const primitives = {
    // Basic Arithmetic
    '+': (a, b) => Number(a) + Number(b),
    '-': (a, b) => Number(a) - Number(b),
    '*': (a, b) => Number(a) * Number(b),
    '/': (a, b) => Number(a) / Number(b),
    'mod': (a, b) => Number(a) % Number(b),
    'pow': Math.pow,
    'sqrt': Math.sqrt,

    // Comparison
    '<': (a, b) => Number(a) < Number(b),
    '>': (a, b) => Number(a) > Number(b),
    '=': (a, b) => Number(a) === Number(b),
    '<=': (a, b) => Number(a) <= Number(b),
    '>=': (a, b) => Number(a) >= Number(b),
    '!=': (a, b) => Number(a) !== Number(b),

    // String Operations
    'str-concat': (...strs) => strs.join(''),
    'str-length': (str) => str.length,
    'str-slice': (str, start, end) => str.slice(start, end),
    'str-upper': (str) => str.toUpperCase(),
    'str-lower': (str) => str.toLowerCase(),
    'str-trim': (str) => str.trim(),
    'str=?': (str1, str2) => str1 === str2,
    'str-contains?': (str, substr) => str.includes(substr),

    // String Pattern Operations
    'str-match': (str, pattern) => new RegExp(pattern).test(str),
    'str-replace': (str, pattern, replacement) => 
        str.replace(new RegExp(pattern, 'g'), replacement),
    'str-split-by-regex': (str, pattern) => 
        new SPList(...str.split(new RegExp(pattern)).map(s => new SPAtom(s))),
    'str-extract': (str, pattern) => {
        const matches = str.match(new RegExp(pattern, 'g'));
        return matches ? new SPList(...matches.map(s => new SPAtom(s))) : new SPList();
    },

    // Logical Operations
    'and': (...args) => args.every(x => x),
    'or': (...args) => args.some(x => x),
    'not': (x) => !x,
    'xor': (a, b) => !!(a ^ b),

    // List Operations
    'list': (...args) => new SPList(...args.map(arg => new SPAtom(arg))),
    'car': (list) => list[0],
    'cdr': (list) => new SPList(...list.slice(1)),
    'cons': (elem, list) => new SPList(new SPAtom(elem), ...list),
    'length': (list) => list.length,
    'append': (list1, list2) => new SPList(...list1, ...list2),

    // List Comprehension
    'zip': (...lists) => {
        const minLength = Math.min(...lists.map(l => l.length));
        return new SPList(...Array(minLength).fill().map((_, i) => 
            new SPList(...lists.map(l => l[i]))));
    },
    'range': (start, end, step = 1) => 
        new SPList(...Array.from(
            {length: Math.floor((end - start) / step)}, 
            (_, i) => new SPAtom(start + i * step)
        )),
    'take': (n, list) => new SPList(...list.slice(0, n)),
    'drop': (n, list) => new SPList(...list.slice(n)),

    // Functional Operations
    'map': (fn, list) => new SPList(...list.map(x => fn(x))),
    'filter': (fn, list) => new SPList(...list.filter(x => fn(x))),
    'reduce': (fn, init, list) => list.reduce((acc, x) => fn(acc, x), init),
    'fold-left': function(fn, init, list) {
        let result = init;
        for (let item of list) {
            result = fn(result, item);
        }
        return result;
    },
    'fold-right': function(fn, init, list) {
        let result = init;
        for (let i = list.length - 1; i >= 0; i--) {
            result = fn(list[i], result);
        }
        return result;
    },

    // Function Composition and Currying
    'compose': (f, g) => (...args) => f(g(...args)),
    'compose-n': (...fns) => (...args) => 
        fns.reduceRight((result, fn) => [fn(...result)], args)[0],
    'curry': (fn, arity = fn.length) => {
        return function curried(...args) {
            if (args.length >= arity) return fn(...args);
            return (...more) => curried(...args, ...more);
        };
    },
    'partial': (fn, ...presetArgs) => 
        (...laterArgs) => fn(...presetArgs, ...laterArgs),

    // Type Operations
    'number?': (x) => typeof x === 'number',
    'string?': (x) => typeof x === 'string',
    'list?': (x) => x instanceof SPList,
    'null?': (x) => x === null || x === undefined,
    'empty?': (x) => x instanceof SPList && x.length === 0,
    'atom?': (x) => x instanceof SPAtom,  // Added atom? primitive
    
    // Type system primitives
    'type-of': (x) => {
        if (typeof x === 'number') return NumberType;
        if (typeof x === 'string') return StringType;
        if (x instanceof SPList) return ListType;
        if (x instanceof SPAtom) return AtomType;
        if (typeof x === 'function') return x.type || FunctionType;
        return AnyType;
    },
    'type?': (x, type) => type.check(x),
    'function-type': (paramTypes, returnType) => new SPFunctionType(paramTypes, returnType),
    'union-type': (types) => new SPUnionType(types),

    // Special Forms
    'define': Symbol.for('define'),
    'lambda': Symbol.for('lambda'),
    'if': Symbol.for('if'),
    'quote': Symbol.for('quote')
};