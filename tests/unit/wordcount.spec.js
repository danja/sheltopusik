import { Interpreter } from '../../src/core/interpreter.js';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Word Count Example', () => {
    let interpreter;

    beforeEach(() => {
        interpreter = new Interpreter();
    });

    it('should count word frequencies correctly', async () => {
        const content = await readFile(join(__dirname, '../../examples/wordcount.sp'), 'utf8');
        const program = JSON.parse(content);
        const result = interpreter.interpret(program);

        // Convert result to object for easier testing
        const frequencies = Object.fromEntries(
            result.map(entry => [entry[0], entry[1]])
        );

        expect(frequencies['the']).toBe(2);
        expect(frequencies['dog']).toBe(2);
        expect(frequencies['quick']).toBe(1);
        expect(frequencies['lazy']).toBe(1);
        expect(frequencies['sleeps']).toBe(1);
    });
});