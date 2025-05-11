# Synonym Roll Refactoring Prompts

This directory contains a series of prompts designed to guide the refactoring of the Synonym Roll application to better align with the code quality standards specified in the project's copilot-instructions.md file.

## How to Use These Prompts

These prompts can be used with GitHub Copilot or other AI assistants to help guide the refactoring process. Each prompt focuses on a specific aspect of code quality and provides structured guidance for implementing improvements.

1. Start with the comprehensive code review (08-comprehensive-code-review.md) to identify areas needing improvement
2. Then work through the specific refactoring prompts in order of priority based on the review findings
3. For each refactoring task, refer to the relevant prompt for guidance on best practices and implementation examples

## Prompts Overview

1. **Component Structure Refactoring** (01-component-structure-refactoring.md)
   - Focus on creating small, reusable components with clear responsibilities
   - Ensure proper prop interfaces and component organization

2. **CSS Styling Refactoring** (02-css-styling-refactoring.md)
   - Implement component-scoped CSS using modules or styled-components
   - Apply BEM methodology and leverage CSS variables

3. **Component Hierarchy Refactoring** (03-component-hierarchy-refactoring.md)
   - Categorize components into Container, Presentational, Layout, and UI types
   - Establish clear component relationships and separation of concerns

4. **State Management Refactoring** (04-state-management-refactoring.md)
   - Keep state as local as possible
   - Use context for global state and reducers for complex state logic

5. **Performance Optimization** (05-performance-optimization.md)
   - Implement memoization, prevent unnecessary re-renders
   - Use virtualization for long lists and optimize assets

6. **TypeScript Enhancement** (06-typescript-enhancement.md)
   - Improve type definitions and enforce type safety
   - Leverage TypeScript's advanced features

7. **Accessibility Refactoring** (07-accessibility-refactoring.md)
   - Ensure proper semantic HTML and ARIA attributes
   - Implement keyboard navigation and focus management

8. **Comprehensive Code Review** (08-comprehensive-code-review.md)
   - Identify areas not aligned with code quality standards
   - Prioritize refactoring tasks

## Workflow Recommendations

1. **Analyze First**: Begin by running a comprehensive code review to understand the current state of the codebase
2. **Prioritize Issues**: Determine which issues have the highest impact on code quality and user experience
3. **Create Tasks**: Break down the refactoring work into manageable tasks
4. **Implement Incrementally**: Tackle one aspect at a time to ensure focused improvements
5. **Validate Changes**: Test thoroughly after each refactoring step
6. **Document Updates**: Update documentation to reflect architectural changes

Remember that refactoring should be done incrementally and with careful testing to avoid introducing new issues.
