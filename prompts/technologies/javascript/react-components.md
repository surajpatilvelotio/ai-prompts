# React Component Generator

## Description
A prompt for generating well-structured, efficient React components following modern best practices.

## Tags
- javascript
- react
- component
- frontend
- typescript

## Prompt
```
Create a {component_type} React component named {component_name} that {component_purpose}.

Technical requirements:
- Use {js_or_ts} (JavaScript/TypeScript)
- State management: {state_management} (e.g., hooks, Redux, Context API, none)
- Styling approach: {styling_approach} (e.g., CSS modules, styled-components, Tailwind CSS)
- Component type: {component_type} (e.g., functional with hooks, class-based)
- Accessibility considerations: {a11y_requirements}

The component should:
1. Be properly typed (if using TypeScript)
2. Include error handling where appropriate
3. Use proper React patterns
4. Be optimized for performance
5. Include basic tests
6. Include JSDoc comments

Additional context:
{additional_context}
```

## Example Usage
```
Create a reusable React component named DataTable that displays tabular data with sorting, filtering, and pagination capabilities.

Technical requirements:
- Use TypeScript
- State management: React hooks (useState, useEffect, useMemo)
- Styling approach: Tailwind CSS
- Component type: functional with hooks
- Accessibility considerations: fully keyboard navigable, proper ARIA attributes, screen reader friendly

The component should:
1. Be properly typed (if using TypeScript)
2. Include error handling where appropriate
3. Use proper React patterns
4. Be optimized for performance
5. Include basic tests
6. Include JSDoc comments

Additional context:
The table should accept an array of objects as data, with configurable columns. It should support client-side sorting, filtering, and pagination by default but also have the ability to delegate these functions to a parent component for server-side operations. The component will be used across multiple projects, so it should be highly customizable.
```

## Contributed By
@react-developer - 2023-10-15

## Version History
- v1.0 (2023-10-15): Initial version 