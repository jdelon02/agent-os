# {TECHNOLOGY_TYPE} Code Style Guide

> Version: 1.0.0
> Last Updated: 2025-04-24

## Context

This file contains {TECHNOLOGY_TYPE}-specific code style guidelines. These rules extend the global Agent OS code style standards with {TECHNOLOGY_TYPE}-specific formatting and conventions. This file is part of the Agent OS standards system and can be customized for your {TECHNOLOGY_TYPE} projects.

## General Formatting

### Indentation
- Follow {TECHNOLOGY_TYPE} community standards for indentation
- Maintain consistent indentation throughout files
- Align nested structures for readability
- Use your team's preferred indentation style (spaces vs tabs)

### Naming Conventions
- Follow {TECHNOLOGY_TYPE} standard naming conventions
- **Be Consistent**: Use the same naming style throughout the project
- **Be Descriptive**: Choose names that clearly indicate purpose
- **Follow Language Conventions**: Adhere to {TECHNOLOGY_TYPE}'s established patterns

<!-- Examples by language:
- JavaScript: camelCase for variables/functions, PascalCase for classes
- Python: snake_case for variables/functions, PascalCase for classes
- Java: camelCase for variables/methods, PascalCase for classes
- Go: camelCase for unexported, PascalCase for exported
- Rust: snake_case for variables/functions, PascalCase for types
-->

### Code Formatting
- Use {TECHNOLOGY_TYPE}'s standard formatter when available
- Configure your IDE/editor for consistent formatting
- Set up automatic formatting on save when possible
- Follow the official style guide for {TECHNOLOGY_TYPE}

## File Organization

### File Structure
- Follow {TECHNOLOGY_TYPE} standard project structure
- Group related files together logically
- Use consistent file naming conventions
- Keep files focused on a single responsibility

### Import/Module Organization
- Group imports/includes by type (standard library, third-party, local)
- Sort imports alphabetically within each group
- Remove unused imports regularly
- Use absolute imports when appropriate for {TECHNOLOGY_TYPE}

## Code Comments

### When to Comment
- Add brief comments above non-obvious business logic
- Document complex algorithms or calculations
- Explain the "why" behind implementation choices
- Document public APIs and interfaces
- Add context for complex business rules

### Comment Maintenance
- Never remove existing comments unless removing the associated code
- Update comments when modifying code to maintain accuracy
- Keep comments concise and relevant
- Review comments during code reviews

### Comment Style
- Use {TECHNOLOGY_TYPE}'s standard comment syntax
- Write comments in clear, grammatically correct language
- Focus on explaining "why" rather than "what"
- Include examples in complex documentation comments when helpful

<!-- Examples by language:
- Python: Use docstrings for functions/classes, # for inline comments
- JavaScript: Use JSDoc for functions, // for inline comments
- Java: Use Javadoc for public methods, // for inline comments
- Go: Use godoc format for package/function documentation
- Rust: Use /// for documentation, // for inline comments
-->

---

*Customize this file with your team's specific style preferences. These formatting rules apply to all code written by humans and AI agents.*
