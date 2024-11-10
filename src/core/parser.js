// src/core/parser.js
import { SPAtom, SPList } from './types.js'

export class Parser {
    parse(jsonExpression) {
        if (Array.isArray(jsonExpression)) {
            const list = new SPList()
            jsonExpression.forEach(elem => list.push(this.parse(elem)))
            return list
        }
        return new SPAtom(jsonExpression)
    }
}
