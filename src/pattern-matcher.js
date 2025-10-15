/**
 * Simple pattern matching function that uses JavaScript's built-in pattern matching
 * capabilities while ensuring proper error handling and validation.
 * 
 * @param {string} pattern - The pattern to match against (can include regex syntax)
 * @param {string} text - The text to test for pattern matches
 * @returns {boolean} True if the pattern matches the text, false otherwise
 * @throws {Error} If pattern or text are invalid (null, undefined, or non-string)
 * 
 * @example
 * // Basic string matching
 * matchPattern('hello', 'hello') // returns true
 * matchPattern('hello', 'world') // returns false
 * 
 * @example
 * // Regular expression features
 * matchPattern('.*', 'any text') // returns true
 * matchPattern('[abc]', 'b') // returns true
 * matchPattern('\\d+', '123') // returns true
 */
function matchPattern(pattern, text) {
  // Input validation
  if (pattern === null) throw new Error('Pattern cannot be null');
  if (text === null) throw new Error('Text cannot be null');
  if (pattern === undefined) throw new Error('Pattern cannot be undefined');
  if (text === undefined) throw new Error('Text cannot be undefined');
  if (typeof pattern !== 'string') throw new Error('Pattern must be a string');
  if (typeof text !== 'string') throw new Error('Text must be a string');

  try {
    // For exact empty string match
    if (pattern === '' && text === '') return true;
    if (pattern === '') return false;
    
    // Create RegExp object from pattern
    // This automatically handles regex special characters
    const regex = new RegExp(pattern);
    return regex.test(text);
  } catch (error) {
    // Handle invalid regex pattern errors
    throw new Error(`Invalid pattern: ${error.message}`);
  }
}

module.exports = { matchPattern };