// test_suite.js
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Interpreter } from './interpreter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runTests() {
    const interpreter = new Interpreter();

    console.log("Running Sheltopusik (SP) test suite...\n");

    // Test basic arithmetic
    console.assert(interpreter.interpret(["+", 1, 2]) === 3, "Basic addition failed");
    console.assert(interpreter.interpret(["-", 5, 3]) === 2, "Basic subtraction failed");
    console.assert(interpreter.interpret(["*", 4, 3]) === 12, "Basic multiplication failed");
    console.assert(interpreter.interpret(["/", 10, 2]) === 5, "Basic division failed");

    // Test variable definition and lookup
    interpreter.interpret(["define", "x", 10]);
    console.assert(interpreter.interpret("x") === 10, "Variable definition and lookup failed");

    // Test conditionals
    console.assert(interpreter.interpret(["if", true, 1, 2]) === 1, "If true condition failed");
    console.assert(interpreter.interpret(["if", false, 1, 2]) === 2, "If false condition failed");

    // Test lambda functions and lexical scoping
    interpreter.interpret(["define", "make-adder", ["lambda", ["x"], ["lambda", ["y"], ["+", "x", "y"]]]]);
    interpreter.interpret(["define", "add5", ["make-adder", 5]]);
    console.assert(interpreter.interpret(["add5", 3]) === 8, "Lambda and lexical scoping test failed");

    // Test recursion (factorial function)
    interpreter.interpret([
        "define", "factorial",
        ["lambda", ["n"],
            ["if", ["=", "n", 0],
                1,
                ["*", "n", ["factorial", ["-", "n", 1]]]
            ]
        ]
    ]);
    console.assert(interpreter.interpret(["factorial", 5]) === 120, "Recursive factorial function failed");

    // Test macro expansion
    interpreter.interpret([
        "define-macro", "unless", ["condition", "consequence", "alternative"],
        ["if", ["=", "condition", false], "consequence", "alternative"]
    ]);
    console.assert(
        interpreter.interpret(["unless", ["<", 5, 3], "correct", "incorrect"]) === "correct",
        "Macro expansion test failed"
    );

    console.log("All tests passed successfully!\n");
}

async function runFile(filename) {
    const filePath = join(__dirname, filename);

    console.log(`Reading ${filename}:`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const jsonProgram = JSON.parse(fileContent);

    console.log(`Running ${filename}:`);
    const interpreter = new Interpreter();
    const result = interpreter.interpret(jsonProgram);
    console.log("Result:", result);
    console.log();
}

async function main() {
    await runTests();
    await runFile('../../examples/fibonacci.sp');
    await runFile('../../examples/quicksort.sp');
}

main().catch(console.error);