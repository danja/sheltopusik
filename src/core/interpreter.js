// interpreter.js
import { Parser } from './parser.js';
import { Environment } from './environment.js';
import { Evaluator } from './evaluator.js';
import { primitives } from './primitives.js';

export class Interpreter {
    constructor() {
        this.parser = new Parser();
        this.globalEnv = new Environment();
        Object.entries(primitives).forEach(([name, fn]) => {
            this.globalEnv.define(name, fn);
        });
        this.evaluator = new Evaluator(this.globalEnv);
    }

    interpret(jsonProgram) {
        const parsed = this.parser.parse(jsonProgram);
        return this.evaluator.eval(parsed);
    }
}