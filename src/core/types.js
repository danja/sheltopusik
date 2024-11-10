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
