// tests/unit/type-system.spec.js
import { Interpreter } from '../../src/core/interpreter.js';
import { Parser } from '../../src/core/parser.js';
import { SPAtom, SPList, NumberType, StringType, ListType } from '../../src/core/types.js';

describe('Type System', () => {
    let interpreter;
    let parser;

    beforeEach(() => {
        interpreter = new Interpreter();
        parser = new Parser();
    });

    describe('Basic type operations', () => {
        it('should determine the type of values', () => {
            // First make the types accessible in the interpreter
            interpreter.env.define('NumberType', NumberType);
            interpreter.env.define('StringType', StringType);
            interpreter.env.define('ListType', ListType);
            
            expect(interpreter.interpret(['type-of', 42])).toBe(NumberType);
            expect(interpreter.interpret(['type-of', '"hello"'])).toBe(StringType);
            expect(interpreter.interpret(['type-of', ['list', 1, 2, 3]])).toBe(ListType);
        });

        it('should check if a value matches a type', () => {
            interpreter.env.define('NumberType', NumberType);
            interpreter.env.define('StringType', StringType);
            
            expect(interpreter.interpret(['type?', 42, 'NumberType'])).toBe(true);
            expect(interpreter.interpret(['type?', '"hello"', 'NumberType'])).toBe(false);
            expect(interpreter.interpret(['type?', '"hello"', 'StringType'])).toBe(true);
        });
    });

    describe('Function types', () => {
        it('should create and use function types', () => {
            // Define typed add function
            interpreter.env.define('NumberType', NumberType);
            
            const typedAddFn = parser.parse([
                'define', 'typed-add',
                ['lambda', [['x', 'NumberType'], ['y', 'NumberType']], 'NumberType',
                    ['+', 'x', 'y']]
            ]);
            interpreter.evaluator.eval(typedAddFn);
            
            // Test that it works with correct types
            expect(interpreter.interpret(['typed-add', 5, 10])).toBe(15);
            
            // Test that it throws with incorrect types
            expect(() => {
                interpreter.interpret(['typed-add', '"hello"', 10]);
            }).toThrow(TypeError);
            
            expect(() => {
                interpreter.interpret(['typed-add', 5, '"world"']);
            }).toThrow(TypeError);
        });

        it('should check function return types', () => {
            // Define a function that should return a number but returns a string
            interpreter.env.define('NumberType', NumberType);
            interpreter.env.define('StringType', StringType);
            
            const invalidReturnFn = parser.parse([
                'define', 'invalid-return',
                ['lambda', [], 'NumberType',
                    '"This is a string, not a number"']
            ]);
            interpreter.evaluator.eval(invalidReturnFn);
            
            // Test that it throws when called due to invalid return type
            expect(() => {
                interpreter.interpret(['invalid-return']);
            }).toThrow(TypeError);
        });
    });

    describe('Union types', () => {
        it('should create and use union types', () => {
            // Define a union type of number or string
            interpreter.env.define('NumberType', NumberType);
            interpreter.env.define('StringType', StringType);
            
            const unionTypeExpr = parser.parse([
                'define', 'NumberOrString',
                ['union-type', ['list', 'NumberType', 'StringType']]
            ]);
            interpreter.evaluator.eval(unionTypeExpr);
            
            // Define a function that accepts either number or string
            const typedFn = parser.parse([
                'define', 'process',
                ['lambda', [['x', 'NumberOrString']], 
                    ['if', ['type?', 'x', 'NumberType'],
                        ['+', 'x', 1],
                        ['str-concat', 'x', '!']]]
            ]);
            interpreter.evaluator.eval(typedFn);
            
            // Test with number
            expect(interpreter.interpret(['process', 42])).toBe(43);
            
            // Test with string
            expect(interpreter.interpret(['process', '"hello"'])).toBe('hello!');
            
            // Test with invalid type (list)
            expect(() => {
                interpreter.interpret(['process', ['list', 1, 2, 3]]);
            }).toThrow(TypeError);
        });
    });
});
