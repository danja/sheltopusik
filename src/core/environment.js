
// environment.js
export class Environment {
    constructor(parent = null) {
        this.vars = new Map()
        this.parent = parent
    }

    lookup(name) {
        if (this.vars.has(name)) {
            return this.vars.get(name)
        }
        if (this.parent) {
            return this.parent.lookup(name)
        }
        throw new Error(`Undefined variable: ${name}`)
    }

    define(name, value) {
        this.vars.set(name, value)
        return value
    }

    extend(params, args) {
        const env = new Environment(this)
        params.forEach((param, i) => {
            env.define(param.value, args[i])
        })
        return env
    }
}