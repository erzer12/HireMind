# JSON Parsing Error Handling

## Overview

HireMind implements robust error handling for JSON responses from AI providers (particularly Gemini) that may return malformed JSON. This document describes the error handling strategy and how it works.

## Problem

AI providers, especially when used as fallbacks, sometimes return JSON responses with syntax errors such as:
- Trailing commas in arrays or objects
- Missing commas between array elements or object properties
- JSON wrapped in code blocks (```json ... ```)
- Unquoted object keys
- Single quotes instead of double quotes
- Comments in JSON

These issues cause parsing failures like:
```
SyntaxError: Expected ',' or ']' after array element in JSON at position ...
```

## Solution

### 1. JSON Repair Library

We use the `jsonrepair` library to automatically fix common JSON syntax errors before parsing.

### 2. Robust Parsing Function

The `parseAIJsonResponse()` helper function implements a three-step approach:

```javascript
function parseAIJsonResponse(response, context = 'AI response') {
  // Step 1: Strip code blocks
  const cleaned = stripCodeBlock(response);
  
  try {
    // Step 2: Try direct parsing (most efficient)
    return JSON.parse(cleaned);
  } catch (firstError) {
    // Step 3: Log raw response for debugging
    console.error(`⚠️  JSON parsing failed for ${context}. Raw response:`, response);
    
    try {
      // Step 4: Attempt to repair malformed JSON
      const repaired = jsonrepair(cleaned);
      return JSON.parse(repaired);
    } catch (repairError) {
      // Step 5: Log repair failure with details
      console.error(`❌ JSON repair failed for ${context}:`, repairError.message);
      throw new ApiError(500, `Failed to parse ${context}: Invalid JSON format from AI provider.`);
    }
  }
}
```

### 3. Enhanced Prompts

All prompts that expect JSON responses include explicit instructions:

```
IMPORTANT: Return ONLY valid, minified JSON. No code blocks, no comments, no trailing commas, no additional text.
```

### 4. System Messages

System messages reinforce JSON formatting requirements:

```
Always respond with valid, minified JSON only, no code blocks or additional text.
```

## Logging Strategy

### Success Path
When JSON parses successfully on first attempt, no extra logging occurs (clean logs for normal operation).

### Repair Path
When JSON parsing fails but repair succeeds:
```
⚠️  JSON parsing failed for job description analysis. Raw response: {...}
First parse error: Unexpected token...
🔧 Attempting to repair malformed JSON for job description analysis...
✅ Successfully repaired and parsed JSON for job description analysis
```

### Failure Path
When both parsing and repair fail:
```
⚠️  JSON parsing failed for resume comparison. Raw response: {...}
First parse error: Unexpected token...
🔧 Attempting to repair malformed JSON for resume comparison...
❌ JSON repair failed for resume comparison: Cannot repair...
Cleaned response: {...}
Error: Failed to parse resume comparison: Invalid JSON format from AI provider.
```

## Coverage

The robust JSON parsing is applied to all functions that parse JSON from AI:

1. **`analyzeJobDescription()`** - Analyzes job descriptions and returns structured data
2. **`compareResumeWithJD()`** - Compares resumes with job descriptions

Any future functions that need to parse JSON from AI responses should use `parseAIJsonResponse()`.

## Testing

Comprehensive tests verify the repair functionality handles:

- Valid JSON (no modification needed)
- Trailing commas in arrays and objects
- Missing commas between elements
- Unquoted object keys
- Single quotes instead of double quotes
- Comments in JSON
- Code block wrappers
- Complex nested structures with multiple issues
- Real-world Gemini response patterns

Run tests with:
```bash
cd backend
npm test
```

## Example: Handling a Malformed Gemini Response

### Input (from Gemini)
```json
```json
{
  "requiredSkills": ["JavaScript", "React", "Node.js",],
  "preferredSkills": ["TypeScript", "GraphQL",],
  "experienceLevel": "mid",
}
```
```

### Processing Steps
1. Strip code blocks → Remove ` ```json` and ` ``` `
2. Try direct parse → Fails due to trailing commas
3. Apply jsonrepair → Removes trailing commas
4. Parse repaired JSON → Success!

### Output
```javascript
{
  requiredSkills: ["JavaScript", "React", "Node.js"],
  preferredSkills: ["TypeScript", "GraphQL"],
  experienceLevel: "mid"
}
```

## Best Practices

### For Developers

1. **Always use `parseAIJsonResponse()`** when parsing JSON from AI providers
2. **Provide context** in the second parameter for better debugging logs
3. **Update prompts** to explicitly request valid JSON format
4. **Add system messages** that reinforce JSON formatting requirements

### For Debugging

1. Check backend logs for raw AI responses when parsing fails
2. Look for the ⚠️ and 🔧 emoji indicators
3. Review the "Cleaned response" in error logs
4. Test repairs locally with the jsonrepair library

## Dependencies

- `jsonrepair` - NPM package for repairing malformed JSON
  - Repository: https://github.com/josdejong/jsonrepair
  - Version: Latest (see package.json)

## Future Improvements

Potential enhancements to consider:

1. **Metrics** - Track repair success/failure rates per provider
2. **Fallback strategies** - Retry with different prompts if repair fails
3. **Custom repair rules** - Add domain-specific repair patterns
4. **Validation** - Add schema validation after successful parsing
5. **Caching** - Cache repaired responses to avoid re-repair

## Related Documentation

- [AI_FALLBACK.md](./AI_FALLBACK.md) - AI provider fallback system
- [README.md](./README.md) - General project documentation
