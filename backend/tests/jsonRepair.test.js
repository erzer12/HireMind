/**
 * Tests for JSON repair functionality in AI responses
 * These tests verify that malformed JSON from LLMs is properly repaired
 */

import { jsonrepair } from 'jsonrepair';

describe('JSON Repair Functionality', () => {
  
  test('should parse valid JSON without modification', () => {
    const validJson = '{"name": "test", "value": 123}';
    const result = JSON.parse(jsonrepair(validJson));
    expect(result).toEqual({ name: 'test', value: 123 });
  });

  test('should repair JSON with trailing commas in arrays', () => {
    const malformed = '{"skills": ["JavaScript", "Python",]}';
    const repaired = jsonrepair(malformed);
    const result = JSON.parse(repaired);
    expect(result.skills).toEqual(['JavaScript', 'Python']);
  });

  test('should repair JSON with trailing commas in objects', () => {
    const malformed = '{"name": "test", "value": 123,}';
    const repaired = jsonrepair(malformed);
    const result = JSON.parse(repaired);
    expect(result).toEqual({ name: 'test', value: 123 });
  });

  test('should repair JSON with missing commas between array elements', () => {
    const malformed = '{"skills": ["JavaScript" "Python" "Go"]}';
    const repaired = jsonrepair(malformed);
    const result = JSON.parse(repaired);
    expect(result.skills).toEqual(['JavaScript', 'Python', 'Go']);
  });

  test('should repair JSON with missing commas between object properties', () => {
    const malformed = '{"name": "test" "value": 123}';
    const repaired = jsonrepair(malformed);
    const result = JSON.parse(repaired);
    expect(result).toEqual({ name: 'test', value: 123 });
  });

  test('should handle JSON with unquoted keys', () => {
    const malformed = '{name: "test", value: 123}';
    const repaired = jsonrepair(malformed);
    const result = JSON.parse(repaired);
    expect(result).toEqual({ name: 'test', value: 123 });
  });

  test('should repair JSON with single quotes instead of double quotes', () => {
    const malformed = "{'name': 'test', 'value': 123}";
    const repaired = jsonrepair(malformed);
    const result = JSON.parse(repaired);
    expect(result).toEqual({ name: 'test', value: 123 });
  });

  test('should handle complex nested structures with multiple issues', () => {
    const malformed = `{
      "matchScore": 85,
      "missingSkills": ["Docker", "Kubernetes",],
      "suggestedSkills": ["AWS" "Azure"],
      strengths: ['Strong backend', 'Good communication',]
    }`;
    const repaired = jsonrepair(malformed);
    const result = JSON.parse(repaired);
    expect(result.matchScore).toBe(85);
    expect(result.missingSkills).toEqual(['Docker', 'Kubernetes']);
    expect(result.suggestedSkills).toEqual(['AWS', 'Azure']);
    expect(result.strengths).toEqual(['Strong backend', 'Good communication']);
  });

  test('should handle JSON with comments (if supported by repair)', () => {
    const malformed = `{
      // This is a comment
      "name": "test",
      /* multi-line
         comment */
      "value": 123
    }`;
    const repaired = jsonrepair(malformed);
    const result = JSON.parse(repaired);
    expect(result).toEqual({ name: 'test', value: 123 });
  });

  test('should handle empty arrays and objects', () => {
    const malformed = '{"empty": [], "null": {}}';
    const repaired = jsonrepair(malformed);
    const result = JSON.parse(repaired);
    expect(result).toEqual({ empty: [], null: {} });
  });

  test('should handle numeric values including decimals', () => {
    const malformed = '{"integer": 42, "decimal": 3.14, "negative": -10}';
    const repaired = jsonrepair(malformed);
    const result = JSON.parse(repaired);
    expect(result).toEqual({ integer: 42, decimal: 3.14, negative: -10 });
  });

  test('should handle boolean values', () => {
    const malformed = '{"isValid": true, "isComplete": false}';
    const repaired = jsonrepair(malformed);
    const result = JSON.parse(repaired);
    expect(result).toEqual({ isValid: true, isComplete: false });
  });

  test('should handle escaped characters in strings', () => {
    const valid = '{"message": "Line 1\\nLine 2\\tTabbed"}';
    const repaired = jsonrepair(valid);
    const result = JSON.parse(repaired);
    expect(result.message).toBe('Line 1\nLine 2\tTabbed');
  });
});

describe('Code Block Stripping', () => {
  
  test('should remove markdown code block markers', () => {
    const withCodeBlock = '```json\n{"name": "test"}\n```';
    const cleaned = withCodeBlock.trim().replace(/^```[a-z]*\n?/i, '').replace(/```$/, '').trim();
    const result = JSON.parse(cleaned);
    expect(result).toEqual({ name: 'test' });
  });

  test('should remove code block without language specification', () => {
    const withCodeBlock = '```\n{"name": "test"}\n```';
    const cleaned = withCodeBlock.trim().replace(/^```[a-z]*\n?/i, '').replace(/```$/, '').trim();
    const result = JSON.parse(cleaned);
    expect(result).toEqual({ name: 'test' });
  });

  test('should handle JSON without code blocks', () => {
    const plain = '{"name": "test"}';
    const cleaned = plain.trim().replace(/^```[a-z]*\n?/i, '').replace(/```$/, '').trim();
    const result = JSON.parse(cleaned);
    expect(result).toEqual({ name: 'test' });
  });
});

describe('Real-world Gemini Response Patterns', () => {
  
  test('should handle typical Gemini JD analysis response with trailing commas', () => {
    const geminiResponse = `{
  "requiredSkills": ["JavaScript", "React", "Node.js",],
  "preferredSkills": ["TypeScript", "GraphQL",],
  "keywords": ["frontend", "backend", "full-stack",],
  "experienceLevel": "mid",
  "responsibilities": ["Develop features", "Write tests",],
  "qualifications": ["Bachelor's degree", "3+ years experience",]
}`;
    const repaired = jsonrepair(geminiResponse);
    const result = JSON.parse(repaired);
    expect(result.requiredSkills).toHaveLength(3);
    expect(result.experienceLevel).toBe('mid');
  });

  test('should handle resume comparison with mixed errors', () => {
    const geminiResponse = `{
  "matchScore": 78,
  "missingSkills": ["Docker" "AWS"],
  "suggestedSkills": ["Cloud computing", "DevOps",],
  "summaryImprovements": "Add more specific achievements",
  "experienceImprovements": ["Quantify results", "Add metrics",],
  "keywordsToAdd": ["agile" "scrum" "CI/CD"],
  "strengths": ["Strong technical skills",],
  "overallFeedback": "Good match overall"
}`;
    const repaired = jsonrepair(geminiResponse);
    const result = JSON.parse(repaired);
    expect(result.matchScore).toBe(78);
    expect(result.missingSkills).toHaveLength(2);
    expect(result.keywordsToAdd).toHaveLength(3);
  });

  test('should handle response with code blocks and trailing commas', () => {
    const geminiResponse = `\`\`\`json
{
  "requiredSkills": ["Python", "Machine Learning",],
  "preferredSkills": ["TensorFlow",]
}
\`\`\``;
    const cleaned = geminiResponse.trim().replace(/^```[a-z]*\n?/i, '').replace(/```$/, '').trim();
    const repaired = jsonrepair(cleaned);
    const result = JSON.parse(repaired);
    expect(result.requiredSkills).toEqual(['Python', 'Machine Learning']);
  });
});
