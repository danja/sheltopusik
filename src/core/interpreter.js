import { Parser } from './parser.js';
import { Environment } from './environment.js';
import { Evaluator } from './evaluator.js';
import { primitives } from './primitives.js';
import { modulePrimitives } from './module-system.js';
import log from 'loglevel';

export class Interpreter {
    constructor() {
        this.env = new Environment();
        this.parser = new Parser();
        this.evaluator = new Evaluator(this.env);
        this.moduleSystem = null;

        // Initialize primitives
        Object.entries({
            ...primitives,
            ...modulePrimitives
        }).forEach(([name, fn]) => {
            this.env.define(name, fn);
        });
    }

    async interpretWithModules(jsonProgram) {
        try {
            const parsed = this.parser.parse(jsonProgram);
            return await this.evaluator.evalAsync(parsed);
        } catch (error) {
            log.error('Interpretation error:', error);
            throw error;
        }
    }

    // Keep synchronous version for backward compatibility
    interpret(jsonProgram) {
        const parsed = this.parser.parse(jsonProgram);
        return this.evaluator.eval(parsed);
    }
}