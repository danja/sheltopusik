import { SPList, SPAtom } from './types.js';
import { Environment } from './environment.js';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import log from 'loglevel';

export class ModuleSystem {
    constructor() {
        this.modules = new Map();
        this.loadedPaths = new Set();
    }

    async loadModule(path, interpreter) {
        if (this.loadedPaths.has(path)) {
            return this.modules.get(path);
        }

        try {
            const content = await readFile(path, 'utf8');
            const moduleData = JSON.parse(content);
            
            // Create isolated environment for module
            const moduleEnv = new Environment(interpreter.env);
            
            // Add export collection mechanism
            const exports = {};
            moduleEnv.define('export', (name, value) => {
                exports[name] = value;
                return value;
            });

            // Evaluate module in isolated environment
            interpreter.evaluator.eval(interpreter.parser.parse(moduleData), moduleEnv);
            
            this.modules.set(path, exports);
            this.loadedPaths.add(path);
            return exports;

        } catch (error) {
            log.error(`Failed to load module ${path}:`, error);
            throw new Error(`Module load failed: ${path}`);
        }
    }
}

export const modulePrimitives = {
    'require': async (path, interpreter) => {
        if (!interpreter.moduleSystem) {
            interpreter.moduleSystem = new ModuleSystem();
        }
        return await interpreter.moduleSystem.loadModule(path, interpreter);
    },

    'import': async (names, path, interpreter) => {
        const module = await modulePrimitives.require(path, interpreter);
        const env = interpreter.evaluator.currentEnv;
        
        names.forEach(name => {
            if (!(name in module)) {
                throw new Error(`Export '${name}' not found in module ${path}`);
            }
            env.define(name, module[name]);
        });
        
        return null;
    }
};