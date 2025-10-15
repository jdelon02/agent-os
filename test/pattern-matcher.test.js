/**
 * @fileoverview Tests for pattern matching functionality
 */

describe('Pattern Matcher', () => {
  describe('Basic string matching', () => {
    it('should match exact string patterns', () => {
      expect(matchPattern('hello', 'hello')).toBe(true);
      expect(matchPattern('hello', 'world')).toBe(false);
    });

    it('should handle empty strings', () => {
      expect(matchPattern('', '')).toBe(true);
      expect(matchPattern('pattern', '')).toBe(false);
      expect(matchPattern('', 'text')).toBe(false);
    });
  });

  describe('Pattern validation', () => {
    it('should handle invalid inputs', () => {
      expect(() => matchPattern(null, 'text')).toThrow('Pattern cannot be null');
      expect(() => matchPattern('pattern', null)).toThrow('Text cannot be null');
      expect(() => matchPattern(undefined, 'text')).toThrow('Pattern cannot be undefined');
    });
    
    it('should handle non-string inputs', () => {
      expect(() => matchPattern(123, 'text')).toThrow('Pattern must be a string');
      expect(() => matchPattern('pattern', {})).toThrow('Text must be a string');
    });
  });

  describe('Complex pattern matching', () => {
    it('should handle regex special characters', () => {
      expect(matchPattern('.', 'a')).toBe(true); // Any single character
      expect(matchPattern('\\*', '*')).toBe(true); // Escaped wildcard
      expect(matchPattern('\\?', '?')).toBe(true); // Escaped question mark
    });
    
    it('should handle edge cases', () => {
      expect(matchPattern('.*', 'any text')).toBe(true); // Wildcard
      expect(matchPattern('[abc]', 'b')).toBe(true); // Character class
      expect(matchPattern('\\d+', '123')).toBe(true); // Numbers
    });
  });
});