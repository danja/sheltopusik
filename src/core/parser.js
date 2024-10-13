// parser.js
import { SPAtom, SPList } from './types.js';

export class Parser {
    parse(jsonExpression) {
        if (Array.isArray(jsonExpression)) {
            return new SPList(...jsonExpression.map(elem => this.parse(elem)));
        } else {
            return new SPAtom(jsonExpression);
        }
    }
}