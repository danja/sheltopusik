// tests/integration/interpreter.spec.js
import { Interpreter } from '../../src/core/interpreter.js';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Interpreter Integration', () => {
  let interpreter;

  beforeEach(() => {
    interpreter = new Interpreter();
  });

  it('should evaluate basic arithmetic expressions', () => {
    expect(interpreter.interpret(['+', 1, 2])).toBe(3);
    expect(interpreter.interpret(['*', 3, 4])).toBe(12);
    expect(interpreter.interpret(['/', 10, 2])).toBe(5);
    expect(interpreter.interpret(['-', 7, 3])).toBe(4);
  });

  it('should handle nested arithmetic expressions', () => {
    expect(interpreter.interpret(['+', ['*', 2, 3], ['/', 8, 2]])).toBe(10);
  });

  it('should handle variable definitions and lookups', () => {
    interpreter.interpret(['define', 'x', 10]);
    expect(interpreter.interpret('x')).toBe(10);
    
    interpreter.interpret(['define', 'y', ['*', 2, 'x']]);
    expect(interpreter.interpret('y')).toBe(20);
  });

  it('should handle lambda functions', () => {
    interpreter.interpret([
      'define', 'double',
      ['lambda', ['x'], ['*', 'x', 2]]
    ]);
    expect(interpreter.interpret(['double', 5])).toBe(10);
  });

  it('should handle conditionals', () => {
    interpreter.interpret([
      'define', 'abs',
      ['lambda', ['x'],
        ['if', ['<', 'x', 0],
          ['*', 'x', -1],
          'x']]
    ]);
    expect(interpreter.interpret(['abs', -5])).toBe(5);
    expect(interpreter.interpret(['abs', 3])).toBe(3);
  });

  it('should handle lexical scoping', () => {
    interpreter.interpret([
      'define', 'make-adder',
      ['lambda', ['x'],
        ['lambda', ['y'],
          ['+', 'x', 'y']]]
    ]);
    interpreter.interpret(['define', 'add5', ['make-adder', 5]]);
    expect(interpreter.interpret(['add5', 3])).toBe(8);
  });

  describe('Example Programs', () => {
    it('should evaluate fibonacci.sp correctly', async () => {
      const fibContent = await readFile(join(__dirname, '../../examples/fibonacci.sp'), 'utf8');
      const fibProgram = JSON.parse(fibContent);
      expect(interpreter.interpret(fibProgram)).toBe(55); // fib(10) = 55
    });

    it('should evaluate quicksort.sp correctly', async () => {
      const sortContent = await readFile(join(__dirname, '../../examples/quicksort.sp'), 'utf8');
      const sortProgram = JSON.parse(sortContent);
      expect(interpreter.interpret(sortProgram)).toEqual([1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9]);
    });
  });

  describe('Error Handling', () => {
    it('should throw on undefined variables', () => {
      expect(() => interpreter.interpret('undefined_var')).toThrow();
    });

    it('should throw on invalid function calls', () => {
      expect(() => interpreter.interpret(['nonexistent_function', 1, 2])).toThrow();
    });

    it('should throw on type errors', () => {
      expect(() => interpreter.interpret(['+', 'not_a_number', 2])).toThrow();
    });
  });
});
