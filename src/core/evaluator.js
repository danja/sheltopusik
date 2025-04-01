import { SPAtom, SPList } from './types.js';
import { TypeChecker } from './type-checker.js';
import log from 'loglevel';

export class Evaluator {
    constructor(globalEnv) {
        this.globalEnv = globalEnv;
        this.currentEnv = globalEnv;
        this.specialForms = new Map([
            ['define', this.handleDefine.bind(this)],
            ['lambda', this.handleLambda.bind(this)],
            ['if', this.handleIf.bind(this)],
            ['try', this.handleTry.bind(this)]
        ]);
        log.setLevel('info');
    }

    eval(expr, env = this.globalEnv) {
        this.currentEnv = env;
        
        if (expr instanceof SPAtom) {
            if (typeof expr.value === 'number') return expr.value;
            if (typeof expr.value === 'string') {
                // Check if this is a string literal or a variable reference
                if (expr.value.startsWith('"') && expr.value.endsWith('"')) {
                    return expr.value.slice(1, -1); // Remove quotes for string literals
                }
                return env.lookup(expr.value);
            }
            return env.lookup(expr.value);
        }

        if (expr instanceof SPList) {
            if (expr.length === 0) return null;

            const [op, ...args] = expr;
            
            // Handle special forms
            if (op instanceof SPAtom && this.specialForms.has(op.value)) {
                return this.specialForms.get(op.value)(args, env);
            }

            // Handle normal function calls
            const proc = this.eval(op, env);
            TypeChecker.checkFunction(proc, 'Procedure');
            
            // Evaluate all arguments
            const evaledArgs = args.map(arg => this.eval(arg, env));
            
            // Execute the procedure with the evaluated arguments
            return proc(...evaledArgs);
        }

        throw new Error(`Unknown expression type: ${expr}`);
    }

    // For async operations
    async evalAsync(expr, env = this.globalEnv) {
        return this.eval(expr, env);
    }

    handleDefine([symbol, value], env) {
        return env.define(symbol.value, this.eval(value, env));
    }

    handleLambda([params, body], env) {
        const fn = (...args) => {
            TypeChecker.checkArity(fn, params.length, args.length, 'Lambda');
            const newEnv = env.extend(params, args);
            return this.eval(body, newEnv);
        };
        fn.expectedTypes = params.map(() => null); // Placeholder for future type annotations
        fn.isLambda = true; // Mark as a lambda function
        return fn;
    }

    handleIf([test, conseq, alt], env) {
        return this.eval(test, env) ? 
            this.eval(conseq, env) : 
            this.eval(alt, env);
    }

    handleTry([tryExpr, catchExpr], env) {
        try {
            return this.eval(tryExpr, env);
        } catch (error) {
            return this.eval(catchExpr, env)(error);
        }
    }
}