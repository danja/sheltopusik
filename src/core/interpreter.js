// src/core/interpreter.js
import { Parser } from './parser.js'
import { Environment } from './environment.js'
import { Evaluator } from './evaluator.js'

export class Interpreter {
    constructor() {
        this.env = new Environment()
        this.parser = new Parser()
        this.evaluator = new Evaluator(this.env)

        // Add primitives
        this.env.define('+', (a, b) => a + b)
        this.env.define('-', (a, b) => a - b)
        this.env.define('*', (a, b) => a * b)
        this.env.define('/', (a, b) => a / b)
        this.env.define('<', (a, b) => a < b)
        this.env.define('>', (a, b) => a > b)
        this.env.define('=', (a, b) => a === b)
    }

    interpret(jsonProgram) {
        const parsed = this.parser.parse(jsonProgram)
        return this.evaluator.eval(parsed)
    }
}

export { SPAtom, SPList } from './types.js'
export { Parser } from './parser.js'
export { Environment } from './environment.js'
export { Evaluator } from './evaluator.js'