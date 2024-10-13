
// primitives.js
export const primitives = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
    '=': (a, b) => a === b,
    '<': (a, b) => a < b,
    '>': (a, b) => a > b,
    'define': Symbol.for('define'),
    'lambda': Symbol.for('lambda'),
    'if': Symbol.for('if'),
    'quote': Symbol.for('quote'),
    'define-macro': Symbol.for('define-macro'),
    // Additional primitives for quicksort example
    'length': (arr) => arr.length,
    'car': (arr) => arr[0],
    'cdr': (arr) => arr.slice(1),
    'append': (...arrs) => arrs.reduce((acc, arr) => acc.concat(arr), []),
    'filter': (fn, arr) => arr.filter(fn)
};