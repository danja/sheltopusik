// src/core/types.js
export class SPAtom {
    constructor(value) {
        this.value = value
    }
    toString() {
        return String(this.value)
    }
}

export class SPList extends Array {
    constructor(...args) {
        super(...args)
    }
    toString() {
        return `(${this.join(' ')})`
    }
}

// Type system classes
export class SPType {
    constructor(name, predicate) {
        this.name = name;
        this.predicate = predicate;
    }

    check(value) {
        return this.predicate(value);
    }

    toString() {
        return this.name;
    }
}

// Basic types
export const NumberType = new SPType('Number', x => typeof x === 'number');
export const StringType = new SPType('String', x => typeof x === 'string');
export const BooleanType = new SPType('Boolean', x => typeof x === 'boolean');
export const ListType = new SPType('List', x => x instanceof SPList);
export const AtomType = new SPType('Atom', x => x instanceof SPAtom);
export const AnyType = new SPType('Any', _ => true);
export const FunctionType = new SPType('Function', x => typeof x === 'function');

// Function type with parameter and return types
export class SPFunctionType extends SPType {
    constructor(paramTypes, returnType) {
        super('Function', x => typeof x === 'function');
        this.paramTypes = Array.isArray(paramTypes) ? paramTypes : [];
        this.returnType = returnType || AnyType;
    }

    checkParams(args) {
        // Edge cases
        if (!args || args.length === 0) return this.paramTypes.length === 0;
        if (!this.paramTypes || this.paramTypes.length === 0) return true;
        
        // If we have fewer param types than args, the last type applies to all remaining args
        if (args.length > this.paramTypes.length && this.paramTypes.length > 0) {
            const fixedParams = this.paramTypes.slice(0, -1);
            const restType = this.paramTypes[this.paramTypes.length - 1];
            
            // Check fixed params
            for (let i = 0; i < fixedParams.length; i++) {
                if (fixedParams[i] && typeof fixedParams[i].check === 'function') {
                    if (!fixedParams[i].check(args[i])) return false;
                }
            }
            
            // Check rest params
            for (let i = fixedParams.length; i < args.length; i++) {
                if (restType && typeof restType.check === 'function') {
                    if (!restType.check(args[i])) return false;
                }
            }
            
            return true;
        }
        
        // Standard case: check each arg against its type
        if (args.length !== this.paramTypes.length) {
            return false;
        }
        
        for (let i = 0; i < args.length; i++) {
            const paramType = this.paramTypes[i];
            if (paramType && typeof paramType.check === 'function') {
                if (!paramType.check(args[i])) return false;
            }
        }
        
        return true;
    }

    toString() {
        const params = this.paramTypes.map(t => t ? t.toString() : 'Any').join(', ');
        return `(${params}) -> ${this.returnType ? this.returnType.toString() : 'Any'}`;
    }
}

// Union type
export class SPUnionType extends SPType {
    constructor(types) {
        super('Union', value => {
            if (!Array.isArray(types)) return false;
            return types.some(t => t && typeof t.check === 'function' && t.check(value));
        });
        this.types = Array.isArray(types) ? types : [];
    }

    toString() {
        return this.types.map(t => t ? t.toString() : 'Unknown').join(' | ');
    }
}