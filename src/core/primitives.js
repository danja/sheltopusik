// primitives.js
export const primitives = {
    '+': (a, b) => Number(a) + Number(b),
    '-': (a, b) => Number(a) - Number(b),
    '*': (a, b) => Number(a) * Number(b),
    '/': (a, b) => Number(a) / Number(b),
    '<': (a, b) => Number(a) < Number(b),
    '>': (a, b) => Number(a) > Number(b),
    '=': (a, b) => Number(a) === Number(b),
    'define': Symbol.for('define'),
    'lambda': Symbol.for('lambda'),
    'if': Symbol.for('if'),
    'quote': Symbol.for('quote'),
}