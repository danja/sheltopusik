// tests/unit/parser.spec.js
import { Parser } from '../../src/core/parser.js';
import { SPAtom, SPList } from '../../src/core/types.js';

describe('Parser', () => {
  let parser;

  beforeEach(() => {
    parser = new Parser();
  });

  describe('parse', () => {
    it('should parse atomic values', () => {
      expect(parser.parse(42)).toEqual(new SPAtom(42));
      expect(parser.parse("hello")).toEqual(new SPAtom("hello"));
      expect(parser.parse(true)).toEqual(new SPAtom(true));
    });

    it('should parse empty lists', () => {
      const result = parser.parse([]);
      expect(result).toBeInstanceOf(SPList);
      expect(result.length).toBe(0);
    });

    it('should parse nested lists', () => {
      const input = [1, [2, 3], 4];
      const result = parser.parse(input);
      
      expect(result).toBeInstanceOf(SPList);
      expect(result.length).toBe(3);
      expect(result[0]).toEqual(new SPAtom(1));
      expect(result[1]).toBeInstanceOf(SPList);
      expect(result[1][0]).toEqual(new SPAtom(2));
      expect(result[1][1]).toEqual(new SPAtom(3));
      expect(result[2]).toEqual(new SPAtom(4));
    });

    it('should parse complex expressions', () => {
      const input = ["+", ["*", 2, 3], ["*", 4, 5]];
      const result = parser.parse(input);
      
      expect(result).toBeInstanceOf(SPList);
      expect(result[0]).toEqual(new SPAtom("+"));
      expect(result[1]).toBeInstanceOf(SPList);
      expect(result[2]).toBeInstanceOf(SPList);
    });
  });
});
