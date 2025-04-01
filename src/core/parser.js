// src/core/parser.js
import { SPAtom, SPList } from './types.js'

export class Parser {
    parse(jsonExpression) {
        if (Array.isArray(jsonExpression)) {
            const list = new SPList()
            jsonExpression.forEach(elem => list.push(this.parse(elem)))
            return list
        }
        
        // Handle string literals
        if (typeof jsonExpression === 'string') {
            // If it's a quoted string (already with quotes), keep it as is
            if (jsonExpression.startsWith('"') && jsonExpression.endsWith('"')) {
                return new SPAtom(jsonExpression);
            }
            
            // If it looks like a number in string form, parse it as a number
            if (/^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/.test(jsonExpression)) {
                return new SPAtom(Number(jsonExpression));
            }
        }
        
        return new SPAtom(jsonExpression)
    }
}