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
        if (!Array.isArray(names)) {
            throw new Error('Import requires a list of names as the first argument');
        }
        
        const module = await modulePrimitives.require(path, interpreter);
        const env = interpreter.evaluator.currentEnv;
        
        // Convert SPList to regular array if needed
        const namesList = names instanceof SPList ? [...names] : names;
        
        namesList.forEach(name => {
            const nameStr = name instanceof SPAtom ? name.value : name;
            if (!(nameStr in module)) {
                throw new Error(`Export '${nameStr}' not found in module ${path}`);
            }
            env.define(nameStr, module[nameStr]);
        });
        
        return null;
    }
};