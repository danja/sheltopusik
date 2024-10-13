// evaluator.js
import { SPAtom, SPList } from './types.js';

export class Evaluator {
    constructor(globalEnv) {
        this.globalEnv = globalEnv;
        this.macros = new Map();
    }

    eval(expr, env = this.globalEnv) {
        try {
            console.log(`Evaluating expression:`, this.safeStringify(expr));

            // Macro expansion
            expr = this.macroExpand(expr, env);

            if (expr instanceof SPAtom) {
                if (typeof expr.value === 'string') {
                    return env.lookup(expr.value);
                }
                return expr.value;
            } else if (expr instanceof SPList) {
                const [op, ...args] = expr;
                const opValue = this.eval(op, env);

                console.log(`Operator:`, this.safeStringify(opValue));
                console.log(`Arguments:`, args.map(arg => this.safeStringify(arg)));

                if (opValue === Symbol.for('define')) {
                    env.define(args[0].value, this.eval(args[1], env));
                    return null;
                } else if (opValue === Symbol.for('define-macro')) {
                    this.defineMacro(args[0].value, args.slice(1));
                    return null;
                } else if (opValue === Symbol.for('lambda')) {
                    return (...params) => {
                        const newEnv = env.extend(args[0], params);
                        return this.eval(args[1], newEnv);
                    };
                } else if (opValue === Symbol.for('if')) {
                    return this.eval(args[0], env) ? this.eval(args[1], env) : this.eval(args[2], env);
                } else if (opValue === Symbol.for('quote')) {
                    return args[0];
                } else if (typeof opValue === 'function') {
                    const evaluatedArgs = args.map(arg => this.eval(arg, env));
                    return opValue(...evaluatedArgs);
                } else if (opValue instanceof SPAtom) {
                    // If opValue is an SPAtom, it's likely a symbol that should be returned as-is
                    return opValue;
                }
                throw new Error(`Unsupported operation: ${this.safeStringify(opValue)}`);
            }
            throw new Error(`Unknown expression type: ${this.safeStringify(expr)}`);
        } catch (error) {
            console.error(`Evaluation error:`, error);
            throw error;
        }
    }
    defineMacro(name, expr) {
        this.macros.set(name, expr);
    }

    macroExpand(expr, env) {
        if (expr instanceof SPList) {
            const [op, ...args] = expr;
            if (op instanceof SPAtom && this.macros.has(op.value)) {
                const macro = this.macros.get(op.value);
                const expanded = this.applyMacro(macro, args);
                return this.macroExpand(expanded, env);
            }
            return new SPList(...expr.map(e => this.macroExpand(e, env)));
        }
        return expr;
    }

    applyMacro(macro, args) {
        if (macro instanceof Array && macro.length > 1) {
            const [params, ...body] = macro;
            const macroEnv = this.globalEnv.extend(params, args);
            return this.eval(new SPList(...body), macroEnv);
        }
        throw new Error('Invalid macro definition');
    }

    safeStringify(value) {
        if (typeof value === 'symbol') {
            return value.toString();
        }
        return JSON.stringify(value);
    }
}