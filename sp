#!/usr/bin/env node
import { readFile } from 'fs/promises'
import { Interpreter } from './src/core/interpreter.js'

async function main() {
    try {
        const filepath = process.argv[2]
        const content = await readFile(filepath, 'utf8')
        const program = JSON.parse(content)
        const interpreter = new Interpreter()
        console.log(interpreter.interpret(program))
    } catch (err) {
        console.error('Error:', err.message)
        process.exit(1)
    }
}

main()
