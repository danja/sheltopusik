import { TypeChecker } from './type-checker.js';
import log from 'loglevel';

export class Environment {
    constructor(parent = null) {
        this.vars = new Map();
        this.parent = parent;
    }

    lookup(name) {
        // Allow non-string keys for function lookup
        if (typeof name !== 'string') {
            if (this.vars.has(name)) {
                return this.vars.get(name);
            }
            if (this.parent) {
                return this.parent.lookup(name);
            }
            throw new Error(`Undefined variable: ${name}`);
        }
        
        // Regular string variable lookup
        if (this.vars.has(name)) {
            return this.vars.get(name);
        }
        if (this.parent) {
            return this.parent.lookup(name);
        }
        throw new Error(`Undefined variable: ${name}`);
    }

    define(name, value) {
        // Allow non-string keys for function storage
        this.vars.set(name, value);
        return value;
    }

    extend(params, args) {
        const env = new Environment(this);
        
        // Handle array of raw parameter names
        if (Array.isArray(params) && !params instanceof SPList) {
            params.forEach((param, i) => {
                env.define(param, args[i]);
            });
            return env;
        }
        
        // Handle typed parameters in SPList form
        for (let i = 0; i < params.length; i++) {
            const param = params[i];
            
            if (param && param.value !== undefined) {
                // Regular parameter
                env.define(param.value, args[i]);
            } else if (param && param instanceof SPList && param.length === 2) {
                // Typed parameter [name :type]
                env.define(param[0].value, args[i]);
            } else {
                // Handle other cases
                env.define(param, args[i]);
            }
        }
        
        return env;
    }
}