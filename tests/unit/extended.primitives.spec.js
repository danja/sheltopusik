// extended-primitives.spec.js
import { Interpreter } from '../../src/core/interpreter.js';

describe('Extended Primitives', () => {
    let interpreter;

    beforeEach(() => {
        interpreter = new Interpreter();
    });

    describe('String Pattern Operations', () => {
        it('should match patterns in strings', () => {
            expect(interpreter.interpret(['str-match', 'hello123', '[0-9]+'])).toBe(true);
            expect(interpreter.interpret(['str-match', 'hello', '[0-9]+'])).toBe(false);
        });

        it('should replace patterns in strings', () => {
            expect(interpreter.interpret(
                ['str-replace', 'hello world', 'world', 'lisp']
            )).toBe('hello lisp');
        });

        it('should extract patterns from strings', () => {
            const result = interpreter.interpret(
                ['str-extract', 'hello123world456', '[0-9]+']
            );
            expect(result.length).toBe(2);
            expect(result[0]).toBe('123');
            expect(result[1]).toBe('456');
        });
    });

    describe('Function Composition', () => {
        it('should compose multiple functions', () => {
            const expr = ['compose-n',
                ['lambda', ['x'], ['*', 'x', 2]],
                ['lambda', ['x'], ['+', 'x', 1]],
                ['lambda', ['x'], ['*', 'x', 3]]
            ];
            const composed = interpreter.interpret(expr);
            // For input 5: ((5 * 3) + 1) * 2 = 32
            expect(interpreter.interpret([composed, 5])).toBe(32);
        });
    });

    describe('Currying Operations', () => {
        it('should curry functions', () => {
            const addThree = interpreter.interpret(
                ['curry',
                    ['lambda', ['x', 'y', 'z'], ['+', ['+', 'x', 'y'], 'z']],
                    3
                ]
            );
            const addOne = interpreter.interpret([addThree, 1]);
            const addOneTwo = interpreter.interpret([addOne, 2]);
            expect(interpreter.interpret([addOneTwo, 3])).toBe(6);
        });

        it('should handle partial application', () => {
            const expr = [
                'partial',
                ['lambda', ['x', 'y'], ['*', 'x', 'y']],
                2
            ];
            const double = interpreter.interpret(expr);
            expect(interpreter.interpret([double, 4])).toBe(8);
        });
    });

    describe('List Comprehension', () => {
        it('should zip multiple lists', () => {
            const result = interpreter.interpret(
                ['zip',
                    ['list', 1, 2, 3],
                    ['list', 'a', 'b', 'c']
                ]
            );
            expect(result.length).toBe(3);
            expect(result[0][0]).toBe(1);
            expect(result[0][1]).toBe('a');
        });

        it('should generate ranges', () => {
            const result = interpreter.interpret(['range', 0, 5, 1]);
            expect(result.length).toBe(5);
            expect([...result].map(x => x.value)).toEqual([0, 1, 2, 3, 4]);
        });

        it('should take and drop elements', () => {
            const list = interpreter.interpret(['list', 1, 2, 3, 4, 5]);
            
            const taken = interpreter.interpret(['take', 3, list]);
            expect(taken.length).toBe(3);
            expect([...taken].map(x => x.value)).toEqual([1, 2, 3]);

            const dropped = interpreter.interpret(['drop', 2, list]);
            expect(dropped.length).toBe(3);
            expect([...dropped].map(x => x.value)).toEqual([3, 4, 5]);
        });
    });
});