import { Parser } from './parser.js';
import { Environment } from './environment.js';
import { Evaluator } from './evaluator.js';
import { primitives } from './primitives.js';
import { modulePrimitives } from './module-system.js';
import { NumberType, StringType, BooleanType, ListType, AtomType, AnyType, FunctionType } from './types.js';
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
        
        // Register basic types in the environment
        this.env.define('NumberType', NumberType);
        this.env.define('StringType', StringType);
        this.env.define('BooleanType', BooleanType);
        this.env.define('ListType', ListType);
        this.env.define('AtomType', AtomType);
        this.env.define('AnyType', AnyType);
        this.env.define('FunctionType', FunctionType);
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

    // Handle string literals properly in the input program
    preprocessStringLiterals(program) {
        if (typeof program === 'string') {
            // Check if it's a raw string literal without quotes
            if (program.indexOf('"') !== 0 && program.lastIndexOf('"') !== program.length - 1) {
                // It's a variable or symbol, leave as is
                return program;
            }
            // It's already a properly quoted string, leave as is
            return program;
        } else if (Array.isArray(program)) {
            return program.map(item => this.preprocessStringLiterals(item));
        }
        return program;
    }

    interpret(jsonProgram) {
        // Preprocess string literals
        const processedProgram = this.preprocessStringLiterals(jsonProgram);
        const parsed = this.parser.parse(processedProgram);
        
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
            } else if (result.isLambda) {
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