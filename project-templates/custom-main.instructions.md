# {PROJECT_TYPE} Project Instructions

## Global Agent OS Instructions
Inherit all global Agent OS workflows and standards:

For complete instructions, see: [Main Instructions](../instructions/main.instructions.md)

## Project-Specific Guidelines
Additional guidelines specific to {PROJECT_TYPE} development:

@./best-practices.md
@./code-style.md
@./tech-stack.md

## Documentation References
When planning, analying, or implementing features, ALWAYS use Context7 MCP tools to fetch up-to-date documentation:

1. First check Meilisearch for cached documentation using the mappings in `tech-stack.md`
2. If not found, resolve the library ID with `mcp__proxmoxmcp__context7-resolve-library-id` for "{PROJECT_TYPE}" or specific packages
3. Then fetch documentation with `mcp__proxmoxmcp__context7-get-library-docs` using the resolved ID
4. Cache the retrieved documentation in Meilisearch for future use
5. This must be done before starting implementation of any {PROJECT_TYPE} feature

Refer to the **Context7 Documentation Mappings** section in `tech-stack.md` for the complete list of {PROJECT_TYPE} documentation references.


## Project Context
This directory contains {PROJECT_TYPE}-specific instructions that extend the global Agent OS standards.

## Usage
This {PROJECT_TYPE} configuration inherits all global Agent OS workflows and adds project-specific customizations. The local files in this directory take precedence for {PROJECT_TYPE}-specific guidance.