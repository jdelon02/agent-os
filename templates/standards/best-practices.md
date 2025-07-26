# {PROJECT_TYPE} Development Best Practices

> Version: 1.0.0
> Last updated: 2025-03-02
> Scope: {PROJECT_TYPE} development standards

## Context

This file contains {PROJECT_TYPE}-specific development best practices. These practices extend the global Agent OS standards with {PROJECT_TYPE}-specific guidance. This file is part of the Agent OS standards system and can be customized for your {PROJECT_TYPE} projects.

## Core Principles

### Keep It Simple
- Implement code in the fewest lines possible
- Avoid over-engineering solutions
- Choose straightforward approaches over clever ones

### Optimize for Readability
- Prioritize code clarity over micro-optimizations
- Write self-documenting code with clear variable names
- Add comments for "why" not "what"

### DRY (Don't Repeat Yourself)
- Extract repeated business logic to private methods
- Extract repeated UI markup to reusable components
- Create utility functions for common operations

## Dependencies

### Choose Libraries Wisely
When adding third-party dependencies:
- Select the most popular and actively maintained option
- Check the library's GitHub repository for:
  - Recent commits (within last 6 months)
  - Active issue resolution
  - Number of stars/downloads
  - Clear documentation

## Code Organization

### File Structure
- Keep files focused on a single responsibility
- Group related functionality together
- Use consistent naming conventions

### Testing
- Write tests for new functionality
- Maintain existing test coverage
- Test edge cases and error conditions

---

*Customize this file with your team's specific practices. These guidelines apply to all code written by humans and AI agents.*
