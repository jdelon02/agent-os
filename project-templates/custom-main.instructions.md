# {TECHNOLOGY_TYPE} Project Instructions

## Global Agent OS Instructions
Inherit all global Agent OS workflows and standards:

For complete instructions, see: [Main Instructions](../instructions/main.instructions.md)

## Technology-Specific Guidelines
Additional guidelines specific to {TECHNOLOGY_TYPE} development:

@./best-practices.md
@./code-style.md
@./tech-stack.md

## Documentation References
When planning, analyzing, or implementing features, ALWAYS use Context7 MCP tools with Meilisearch caching to fetch up-to-date documentation:

1. **Check Meilisearch First**
   - Look up the corresponding Meilisearch key from the {TECHNOLOGY_TYPE} mapping in `tech-stack.md`
   - Search Meilisearch for cached documentation using this key
   - Use the specific mapping keys defined for {TECHNOLOGY_TYPE} in your tech stack file

2. **Fallback to Context7 if Needed**
   - If documentation is not found in Meilisearch, fetch it from Context7
   - Resolve the library ID with `mcp__proxmoxmcp__context7-resolve-library-id` for "{TECHNOLOGY_TYPE}" or specific packages
   - Fetch documentation with `mcp__proxmoxmcp__context7-get-library-docs` using the resolved ID

3. **Cache the Documentation**
   - Store retrieved documentation in Meilisearch for future use
   - Use the schema format specified in the main instructions
   - Include appropriate metadata like fetch date, token count, and version

4. **Apply Documentation Insights**
   - Extract key patterns, best practices, and examples from the documentation
   - Follow the official {TECHNOLOGY_TYPE} recommendations and best practices
   - Apply version-specific guidance based on the documentation version
   - Consider governance and performance implications from documentation

Refer to the **Context7 Documentation Mappings** section in `tech-stack.md` for the complete list of {TECHNOLOGY_TYPE}-specific Meilisearch keys and Context7 library IDs.

**IMPORTANT:** This documentation lookup and caching process MUST be performed before starting any implementation of {TECHNOLOGY_TYPE} features to ensure you're following the latest best practices.

## {TECHNOLOGY_TYPE} Development Patterns
Key patterns and practices specific to {TECHNOLOGY_TYPE} development:

### Architecture & Design
- Follow {TECHNOLOGY_TYPE}'s recommended architecture patterns
- Use established design patterns appropriate for {TECHNOLOGY_TYPE}
- Implement proper separation of concerns
- Apply {TECHNOLOGY_TYPE}-specific organizational principles

### Data Handling
- Use {TECHNOLOGY_TYPE}'s standard data management approaches
- Implement proper validation and sanitization
- Follow {TECHNOLOGY_TYPE} conventions for data modeling
- Apply appropriate caching strategies

### Error Handling & Logging
- Implement robust error handling using {TECHNOLOGY_TYPE}'s standard mechanisms
- Use appropriate logging frameworks and practices
- Include sufficient context for debugging
- Follow {TECHNOLOGY_TYPE} conventions for exception handling

### Security Considerations
- Apply {TECHNOLOGY_TYPE}-specific security best practices
- Use established authentication/authorization patterns
- Follow secure coding practices relevant to {TECHNOLOGY_TYPE}
- Implement proper input validation and output encoding

### Testing & Quality Assurance
- Use {TECHNOLOGY_TYPE}'s standard testing frameworks
- Implement appropriate test coverage strategies
- Follow {TECHNOLOGY_TYPE} conventions for test organization
- Include integration and end-to-end testing as appropriate

### Performance & Optimization
- Apply {TECHNOLOGY_TYPE}-specific performance best practices
- Use appropriate caching and optimization techniques
- Monitor and profile performance using {TECHNOLOGY_TYPE} tools
- Follow {TECHNOLOGY_TYPE} conventions for resource management

<!-- Customize this section with specific patterns relevant to your {TECHNOLOGY_TYPE} technology -->

## Project Context
This directory contains {TECHNOLOGY_TYPE}-specific instructions that extend the global Agent OS standards.

## Usage
This {TECHNOLOGY_TYPE} configuration inherits all global Agent OS workflows and adds technology-specific customizations. The local files in this directory take precedence for {TECHNOLOGY_TYPE}-specific guidance.
