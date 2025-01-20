import { SPAtom, SPList } from './types.js';
import { TypeChecker } from './type-checker.js';
import log from 'loglevel';

export class Evaluator {
    constructor(globalEnv) {
        this.globalEnv = globalEnv;
        this.specialForms = new Map([
            ['define', this.handleDefine.bind(this)],
            ['lambda', this.handleLambda.bind(this)],
            ['if', this.handleIf.bind(this)],
            ['try', this.handleTry.bind(this)]
        ]);
        log.setLevel('info');
    }

    eval(expr, env = this.globalEnv) {
        if (expr instanceof SPAtom) {
            if (typeof expr.value === 'number') return expr.value;
            if (typeof expr.value === 'string') return expr.value;
            return env.lookup(expr.value);
        }

        if (expr instanceof SPList) {
            if (expr.length === 0) return null;

            const [op, ...args] = expr;
            if (op instanceof SPAtom && this.specialForms.has(op.value)) {
                return this.specialForms.get(op.value)(args, env);
            }

            const proc = this.eval(op, env);
            TypeChecker.checkFunction(proc, 'Procedure');
            const evaledArgs = args.map(arg => this.eval(arg, env));
            
            return proc(...evaledArgs);
        }

        throw new Error(`Unknown expression type: ${expr}`);
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