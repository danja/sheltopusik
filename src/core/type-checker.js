import { SPAtom, SPList, SPType, NumberType, StringType, ListType, FunctionType, AnyType, SPFunctionType } from './types.js';
import log from 'loglevel';

export class TypeChecker {
    static checkType(value, type, name) {
        if (!type) return value; // If no type is specified, skip check
        
        if (type instanceof SPType) {
            if (!type.check(value)) {
                throw new TypeError(`${name} must be of type ${type.toString()}, got ${typeof value}`);
            }
        } else if (typeof type === 'string') {
            // String type names for backward compatibility
            if (typeof value !== type) {
                throw new TypeError(`${name} must be a ${type}, got ${typeof value}`);
            }
        }
        return value;
    }

    static checkNumber(value, name) {
        if (typeof value !== 'number') {
            throw new TypeError(`${name} must be a number, got ${typeof value}`);
        }
        return value;
    }

    static checkString(value, name) {
        if (typeof value !== 'string') {
            throw new TypeError(`${name} must be a string, got ${typeof value}`);
        }
        return value;
    }

    static checkList(value, name) {
        if (!(value instanceof SPList)) {
            throw new TypeError(`${name} must be a list, got ${value?.constructor?.name}`);
        }
        return value;
    }

    static checkFunction(value, name) {
        if (typeof value !== 'function') {
            throw new TypeError(`${name} must be a function, got ${typeof value}`);
        }
        return value;
    }

    static checkArity(fn, expected, received, name) {
        if (expected !== received) {
            throw new TypeError(`${name || 'Function'} expects ${expected} arguments, got ${received}`);
        }
    }

    static checkFunctionParams(fn, args, name) {
        if (!fn || !fn.type) return; // Skip if no type information
        
        if (fn.type instanceof SPFunctionType && typeof fn.type.checkParams === 'function') {
            if (!fn.type.checkParams(args)) {
                throw new TypeError(`${name || 'Function'} received invalid argument types`);
            }
        }
    }
    
    static inferReturnType(fn, args) {
        // If the function has a known return type, use it
        if (fn && fn.type && fn.type.returnType) {
            return fn.type.returnType;
        }
        
        // Otherwise, default to AnyType
        return AnyType;
    }
}

// Type-checked primitive wrapper
export function withTypeChecking(fn, paramTypes, returnType) {
    const wrappedFn = (...args) => {
        // Check parameter types if provided
        if (Array.isArray(paramTypes)) {
            args.forEach((arg, i) => {
                if (i < paramTypes.length && paramTypes[i]) {
                    TypeChecker.checkType(arg, paramTypes[i], `Argument ${i + 1}`);
                }
            });
        }
        
        // Call the function
        const result = fn(...args);
        
        // Check return type if provided
        if (returnType) {
            TypeChecker.checkType(result, returnType, 'Return value');
        }
        
        return result;
    };
    
    // Set type information on the function for later use
    if (Array.isArray(paramTypes) || returnType) {
        wrappedFn.type = new SPFunctionType(
            Array.isArray(paramTypes) ? paramTypes : [], 
            returnType || AnyType
        );
    }
    
    return wrappedFn;
}