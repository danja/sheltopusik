// tests/integration/examples.spec.js
import { Interpreter } from '../../src/core/interpreter.js';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Example Programs Integration', () => {
    let interpreter;

    beforeEach(() => {
        interpreter = new Interpreter();
    });

    describe('Function Composition Example', () => {
        it('should transform numbers correctly', async () => {
            const content = await readFile(join(__dirname, '../../examples/compose.sp'), 'utf8');
            const program = JSON.parse(content);
            const result = interpreter.interpret(program);
            
            // For input [1,2,3,4,5]
            // double -> [2,4,6,8,10]
            // add-one -> [3,5,7,9,11]
            // square -> [9,25,49,81,121]
            expect(result).toEqual([9, 25, 49, 81, 121]);
        });
    });

    describe('Pattern Matching Example', () => {
        it('should extract error messages', async () => {
            const content = await readFile(join(__dirname, '../../examples/pattern.sp'), 'utf8');
            const program = JSON.parse(content);
            const result = interpreter.interpret(program);
            
            expect(result.length).toBe(1);
            expect(result[0]).toBe('ERROR Database connection failed');
        });
    });

    describe('Word Count Example', () => {
        it('should count word frequencies', async () => {
            const content = await readFile(join(__dirname, '../../examples/wordcount.sp'), 'utf8');
            const program = JSON.parse(content);
            const result = interpreter.interpret(program);
            
            expect(result.get('the')).toBe(2);
            expect(result.get('dog')).toBe(2);
            expect(result.get('quick')).toBe(1);
        });
    });
});