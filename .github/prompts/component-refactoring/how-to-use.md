# How to Use Component Refactoring Prompts

This guide explains how to use the component refactoring prompts effectively to gradually improve the Synonym Roll codebase.

## Overview

The component refactoring prompts in this directory are designed to break down the refactoring process into manageable, focused tasks. Each prompt focuses on extracting and improving a single component or feature, allowing for incremental improvements to the codebase.

## Workflow

1. **Start with the index file**: Read through the `00-index.md` file to understand the overall refactoring plan and components to be extracted.

2. **Choose a component**: Select a component to work on. The components are roughly ordered by priority, but you can choose based on:
   - Dependency order (some components depend on others)
   - Complexity (you might want to start with simpler components)
   - Personal preference

3. **Read the prompt thoroughly**: Each prompt includes:
   - Objective
   - Component details (location, props interface)
   - Current implementation
   - CSS requirements
   - Storybook and testing requirements
   - Important notes

4. **Implement the component**: Create the component and related files according to the prompt.

5. **Create Storybook stories**: Implement Storybook stories to showcase the component's variations and behavior.

6. **Write tests**: Add appropriate tests to ensure component functionality.

7. **Document your work**: Add comments and documentation as needed.

## Important Guidelines

- **Focus on one component at a time**: Each prompt is designed to be self-contained.
- **Follow the coding standards**: Adhere to the project's coding style guidelines.
- **Don't refactor other parts yet**: Avoid making changes to unrelated components.
- **Commit frequently**: Make small, focused commits for each component.
- **Update the component when ready**: Once a component is fully implemented and tested, it can be integrated into the main application.

## Integration Strategy

When you're ready to integrate the refactored components into the main application:

1. **Start with common UI components**: These have fewer dependencies.
2. **Update layout components next**: These provide structure for feature components.
3. **Implement feature components**: These often depend on UI components.
4. **Update state management**: Custom hooks and reducers can be integrated.
5. **Refactor page components**: Finally, refactor page components to use the new components.

## Testing Your Changes

After refactoring each component:

1. **Run the Storybook**: Verify that components look and behave as expected.
2. **Run component tests**: Ensure tests pass.
3. **Run the application**: Test the integrated components in the actual app.

## Getting Help

If you encounter issues during refactoring:

1. **Review the coding standards**: Check the project guidelines for guidance.
2. **Check existing components**: Look at already refactored components for examples.
3. **Consult documentation**: React, TypeScript, and CSS Modules documentation can help.

By following this approach, you'll gradually transform the codebase into a more maintainable, modular, and robust application.
