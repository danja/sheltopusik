#!/usr/bin/env node
import { readFile } from 'fs/promises'
import { Interpreter } from './src/core/interpreter.js'

async function main() {
    try {
        const filepath = process.argv[2]
        if (!filepath) {
            console.error('Error: Please provide a Sheltopusik program file path')
            console.log('Usage: ./sp <program_file.sp>')
            process.exit(1)
        }
        
        const content = await readFile(filepath, 'utf8')
        const program = JSON.parse(content)
        const interpreter = new Interpreter()
        
        const result = interpreter.interpret(program)
        console.log(result)
    } catch (err) {
        console.error('Error:', err.message)
        process.exit(1)
    }
}

main()