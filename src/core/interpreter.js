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
        
        // Handle programs with definitions followed by a function call
        if (Array.isArray(jsonProgram) && jsonProgram.length > 2 && 
            jsonProgram[0] === 'define' && Array.isArray(jsonProgram[jsonProgram.length - 1])) {
            
            // Evaluate all definitions first
            for (let i = 0; i < jsonProgram.length - 1; i += 3) {
                if (jsonProgram[i] === 'define') {
                    const defExpr = jsonProgram.slice(i, i + 3);
                    this.evaluator.eval(this.parser.parse(defExpr));
                }
            }
            
            // Then evaluate the final function call
            const callExpr = jsonProgram[jsonProgram.length - 1];
            return this.evaluator.eval(this.parser.parse(callExpr));
        }
        
        // Standard evaluation for other cases
        const result = this.evaluator.eval(parsed);
        
        // If the result is a function, only return it for explicit definitions
        if (typeof result === 'function') {
            if (Array.isArray(jsonProgram) && jsonProgram[0] === 'define' && jsonProgram.length === 3) {
                return result; // Return the function for plain definitions
            } else if (result.expectedTypes) {
                try {
                    // Try to execute the function with proper context
                    return result();
                } catch (error) {
                    // If execution fails, return the function itself
                    return result;
                }
            }
        }
        
        return result;
    }
}