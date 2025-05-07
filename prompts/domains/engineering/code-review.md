# Thorough Code Review Prompt

## Description
A comprehensive prompt for AI-assisted code reviews that covers code quality, potential bugs, security issues, and performance considerations.

## Tags
- code-review
- engineering
- best-practices
- security
- performance

## Prompt
```
Please review the following code and provide a thorough analysis. Consider:

1. Code quality and readability:
   - Is the code well-structured and easy to understand?
   - Are there any violations of coding standards or best practices?
   - Could naming be improved for clarity?

2. Potential bugs and edge cases:
   - Are there any logical errors or bugs?
   - Are edge cases properly handled?
   - Is there proper error handling?

3. Security considerations:
   - Are there any security vulnerabilities?
   - Is sensitive data properly protected?
   - Are inputs properly validated and sanitized?

4. Performance optimization:
   - Are there any performance bottlenecks?
   - Could any operations be optimized?
   - Are there any memory leaks or inefficient resource usage?

5. Testing:
   - Is the code testable?
   - Are there sufficient tests?
   - Are there any cases not covered by tests?

6. Documentation:
   - Is the code adequately documented?
   - Are complex algorithms or business logic explained?

Please provide specific suggestions for improvement with examples where possible.

Code to review:
```
[PASTE CODE HERE]
```
```

## Example Usage
When reviewing a pull request, copy the code from the PR and paste it into the prompt to get a comprehensive review from the AI assistant.

## Contributed By
@developer-jane - 2023-09-25

## Version History
- v1.0 (2023-09-25): Initial version 