// primitives.spec.js
import { Interpreter } from '../../src/core/interpreter.js';

describe('Extended Primitives', () => {
    let interpreter;

    beforeEach(() => {
        interpreter = new Interpreter();
    });

    describe('String Operations', () => {
        it('should handle basic string operations', () => {
            expect(interpreter.interpret(['str-concat', 'hello', ' ', 'world'])).toBe('hello world');
            expect(interpreter.interpret(['str-length', 'hello'])).toBe(5);
            expect(interpreter.interpret(['str-slice', 'hello', 1, 4])).toBe('ell');
        });

        it('should handle string transformations', () => {
            expect(interpreter.interpret(['str-upper', 'hello'])).toBe('HELLO');
            expect(interpreter.interpret(['str-lower', 'WORLD'])).toBe('world');
            expect(interpreter.interpret(['str-trim', ' hello '])).toBe('hello');
        });

        it('should handle string predicates', () => {
            expect(interpreter.interpret(['str=?', 'hello', 'hello'])).toBe(true);
            expect(interpreter.interpret(['str-contains?', 'hello world', 'world'])).toBe(true);
        });
    });

    describe('Logical Operations', () => {
        it('should handle basic logical operations', () => {
            expect(interpreter.interpret(['and', true, true])).toBe(true);
            expect(interpreter.interpret(['and', true, false])).toBe(false);
            expect(interpreter.interpret(['or', false, true])).toBe(true);
            expect(interpreter.interpret(['not', true])).toBe(false);
        });

        it('should handle multiple arguments in logical operations', () => {
            expect(interpreter.interpret(['and', true, true, true])).toBe(true);
            expect(interpreter.interpret(['and', true, true, false])).toBe(false);
            expect(interpreter.interpret(['or', false, false, true])).toBe(true);
        });

        it('should handle xor operation', () => {
            expect(interpreter.interpret(['xor', true, false])).toBe(true);
            expect(interpreter.interpret(['xor', true, true])).toBe(false);
        });
    });

    describe('Functional Operations', () => {
        it('should handle map operation', () => {
            const expr = ['map',
                ['lambda', ['x'], ['*', 'x', 2]],
                ['list', 1, 2, 3]
            ];
            const result = interpreter.interpret(expr);
            expect([...result]).toEqual([2, 4, 6]);
        });

        it('should handle reduce operation', () => {
            const expr = ['reduce',
                ['lambda', ['acc', 'x'], ['+', 'acc', 'x']],
                0,
                ['list', 1, 2, 3]
            ];
            expect(interpreter.interpret(expr)).toBe(6);
        });

        it('should handle fold operations', () => {
            const sumLeft = ['fold-left',
                ['lambda', ['acc', 'x'], ['+', 'acc', 'x']],
                0,
                ['list', 1, 2, 3]
            ];
            expect(interpreter.interpret(sumLeft)).toBe(6);

            const sumRight = ['fold-right',
                ['lambda', ['x', 'acc'], ['+', 'x', 'acc']],
                0,
                ['list', 1, 2, 3]
            ];
            expect(interpreter.interpret(sumRight)).toBe(6);
        });

        it('should handle function composition', () => {
            const expr = ['compose',
                ['lambda', ['x'], ['*', 'x', 2]],
                ['lambda', ['x'], ['+', 'x', 1]]
            ];
            const composed = interpreter.interpret(expr);
            expect(interpreter.interpret([composed, 3])).toBe(8);
        });
    });
});