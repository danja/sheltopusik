// tests/unit/evaluator.spec.js
import { Evaluator } from '../../src/core/evaluator.js';
import { Environment } from '../../src/core/environment.js';
import { SPAtom, SPList } from '../../src/core/types.js';

describe('Evaluator', () => {
  let evaluator;
  let env;

  beforeEach(() => {
    env = new Environment();
    env.define('+', (a, b) => a + b);
    env.define('-', (a, b) => a - b);
    env.define('*', (a, b) => a * b);
    env.define('/', (a, b) => a / b);
    env.define('<', (a, b) => a < b);
    evaluator = new Evaluator(env);
  });

  describe('eval', () => {
    it('should evaluate numbers', () => {
      expect(evaluator.eval(new SPAtom(42))).toBe(42);
    });

    it('should evaluate variables', () => {
      env.define('x', 10);
      expect(evaluator.eval(new SPAtom('x'))).toBe(10);
    });

    it('should evaluate primitive operations', () => {
      const expr = new SPList(
        new SPAtom('+'),
        new SPAtom(2),
        new SPAtom(3)
      );
      expect(evaluator.eval(expr)).toBe(5);
    });

    it('should evaluate nested expressions', () => {
      const expr = new SPList(
        new SPAtom('*'),
        new SPList(new SPAtom('+'), new SPAtom(2), new SPAtom(3)),
        new SPAtom(4)
      );
      expect(evaluator.eval(expr)).toBe(20);
    });

    it('should handle if expressions', () => {
      const ifTrue = new SPList(
        new SPAtom('if'),
        new SPList(new SPAtom('<'), new SPAtom(1), new SPAtom(2)),
        new SPAtom('yes'),
        new SPAtom('no')
      );
      const ifFalse = new SPList(
        new SPAtom('if'),
        new SPList(new SPAtom('<'), new SPAtom(2), new SPAtom(1)),
        new SPAtom('yes'),
        new SPAtom('no')
      );
      
      expect(evaluator.eval(ifTrue)).toBe('yes');
      expect(evaluator.eval(ifFalse)).toBe('no');
    });

    it('should handle lambda expressions', () => {
      const lambda = new SPList(
        new SPAtom('lambda'),
        new SPList(new SPAtom('x')),
        new SPList(new SPAtom('*'), new SPAtom('x'), new SPAtom(2))
      );
      const fn = evaluator.eval(lambda);
      expect(fn(5)).toBe(10);
    });

    it('should handle define expressions', () => {
      const def = new SPList(
        new SPAtom('define'),
        new SPAtom('double'),
        new SPList(
          new SPAtom('lambda'),
          new SPList(new SPAtom('x')),
          new SPList(new SPAtom('*'), new SPAtom('x'), new SPAtom(2))
        )
      );
      evaluator.eval(def);
      expect(env.lookup('double')(5)).toBe(10);
    });
  });
});
