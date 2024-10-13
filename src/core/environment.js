// environment.js
export class Environment {
    constructor(parent = null) {
        this.vars = new Map();
        this.parent = parent;
    }

    define(symbol, value) {
        this.vars.set(symbol, value);
    }

    lookup(symbol) {
        if (this.vars.has(symbol)) {
            return this.vars.get(symbol);
        } else if (this.parent) {
            return this.parent.lookup(symbol);
        }
        throw new Error(`Undefined symbol: ${symbol}`);
    }

    extend(params, args) {
        const newEnv = new Environment(this);
        params.forEach((param, index) => {
            newEnv.define(param.value, args[index]);
        });
        return newEnv;
    }
}