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
        console.log(`Looking up symbol: ${symbol}`);
        if (this.vars.has(symbol)) {
            return this.vars.get(symbol);
        } else if (this.parent) {
            return this.parent.lookup(symbol);
        }
        throw new Error(`Undefined symbol: ${symbol}. Available symbols: ${[...this.vars.keys()]}`);
    }

    extend(params, args) {
        const newEnv = new Environment(this);
        if (params instanceof Array && args instanceof Array) {
            params.forEach((param, index) => {
                newEnv.define(param.value, args[index]);
            });
        } else {
            console.warn('Params or args is not an array in Environment.extend');
        }
        return newEnv;
    }
}