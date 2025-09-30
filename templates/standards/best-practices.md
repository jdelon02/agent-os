# {TECHNOLOGY_TYPE} Development Best Practices

> Version: 1.0.0
> Last updated: 2025-03-02
> Scope: {TECHNOLOGY_TYPE} development standards

## Context

This file contains {TECHNOLOGY_TYPE}-specific development best practices. These practices extend the global Agent OS standards with {TECHNOLOGY_TYPE}-specific guidance. This file is part of the Agent OS standards system and can be customized for your {TECHNOLOGY_TYPE} projects.

## Core Principles

### Use Context7 Documentation
- ALWAYS fetch up-to-date documentation via Context7 MCP before implementing features
- Follow the documented workflow in your `tech-stack.md` file:
  1. Check Meilisearch for cached documentation first
  2. If not found, resolve the library ID with `mcp__proxmoxmcp__context7-resolve-library-id`
  3. Fetch documentation with `mcp__proxmoxmcp__context7-get-library-docs`
  4. Cache the retrieved documentation for future use
- Reference official {TECHNOLOGY_TYPE} documentation for all implementation decisions

### Keep It Simple
- Implement code in the fewest lines possible
- Avoid over-engineering solutions
- Choose straightforward approaches over clever ones

### Optimize for Readability
- Prioritize code clarity over micro-optimizations
- Write self-documenting code with clear variable names
- Add comments for "why" not "what"

### DRY (Don't Repeat Yourself)
- Extract repeated business logic to reusable functions/methods
- Create utility functions for common operations
- Use {TECHNOLOGY_TYPE}'s module/package system to organize shared code
- Abstract common patterns into reusable components or libraries

## Dependencies

### Choose Libraries Wisely
When adding third-party dependencies:
- Select the most popular and actively maintained option
- Check the library's repository for:
  - Recent commits (within last 6 months)
  - Active issue resolution
  - Community size and engagement
  - Clear documentation and examples
  - License compatibility with your project
- Avoid dependencies with dependencies (minimize the dependency tree)
- Consider the long-term maintenance burden

## Code Quality

### Follow {TECHNOLOGY_TYPE} Standards
- Adhere to official {TECHNOLOGY_TYPE} coding standards and conventions
- Use static analysis tools and linters specific to {TECHNOLOGY_TYPE}
- Configure your IDE with {TECHNOLOGY_TYPE} extensions and formatting rules
- Follow community best practices and established patterns

### Error Handling
- Handle errors gracefully with appropriate error messages
- Use {TECHNOLOGY_TYPE}'s standard error handling mechanisms
- Log errors with sufficient context for debugging
- Fail fast when appropriate, but recover gracefully when possible
- Don't ignore or suppress errors without good reason

### Performance Considerations
- Profile before optimizing - measure actual performance bottlenecks
- Follow {TECHNOLOGY_TYPE}'s performance best practices
- Consider memory usage and resource management
- Use appropriate data structures for your use cases
- Cache expensive operations when beneficial

## Code Organization

### File Structure
- Follow {TECHNOLOGY_TYPE}'s standard project structure
- Keep files focused on a single responsibility
- Group related functionality together
- Use consistent naming conventions
- Organize imports/modules logically

### Function/Method Design
- Keep functions small and focused on a single task
- Use descriptive names that clearly indicate purpose
- Limit the number of parameters (consider using objects/structs for many parameters)
- Return early to reduce nesting and improve readability
- Follow {TECHNOLOGY_TYPE} conventions for function/method signatures

### Testing
- Write tests for new functionality before or during implementation
- Maintain existing test coverage and fix failing tests immediately
- Test edge cases, error conditions, and boundary values
- Use {TECHNOLOGY_TYPE}'s standard testing framework
- Structure tests clearly with setup, execution, and assertion phases
- Mock external dependencies appropriately

## Security

### Input Validation
- Validate all user input at application boundaries
- Use {TECHNOLOGY_TYPE}'s built-in validation mechanisms when available
- Sanitize data before processing or storage
- Be especially careful with data that will be executed or rendered

### Authentication & Authorization
- Follow {TECHNOLOGY_TYPE} security best practices
- Use established authentication libraries rather than rolling your own
- Implement proper session management
- Apply principle of least privilege for authorization

---

*Customize this file with your team's specific practices. These guidelines apply to all code written by humans and AI agents.*
