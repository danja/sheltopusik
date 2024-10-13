// evaluator.js
import { SPAtom, SPList } from './types.js';

export class Evaluator {
    constructor(globalEnv) {
        this.globalEnv = globalEnv;
    }

    eval(expr, env = this.globalEnv) {
        if (expr instanceof SPAtom) {
            if (typeof expr.value === 'string') {
                return env.lookup(expr.value);
            }
            return expr.value;
        } else if (expr instanceof SPList) {
            const [op, ...args] = expr;
            const opValue = this.eval(op, env);

            if (opValue === Symbol.for('define')) {
                env.define(args[0].value, this.eval(args[1], env));
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
            } else if (opValue === Symbol.for('define-macro')) {
                const macroName = args[0].value;
                const macroParams = args[1];
                const macroBody = args[2];
                env.define(macroName, {
                    isMacro: true,
                    params: macroParams,
                    body: macroBody,
                    env: env
                });
                return null;
            } else if (typeof opValue === 'object' && opValue.isMacro) {
                const expandedExpr = this.expandMacro(opValue, args, env);
                return this.eval(expandedExpr, env);
            } else {
                const fn = opValue;
                const evaluatedArgs = args.map(arg => this.eval(arg, env));
                return fn(...evaluatedArgs);
            }
        }
        throw new Error('Unknown expression type');
    }

    expandMacro(macro, args, env) {
        const macroEnv = macro.env.extend(macro.params, args);
        return this.eval(macro.body, macroEnv);
    }
}