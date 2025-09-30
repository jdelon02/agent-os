# n8n Project Instructions

## Global Agent OS Instructions
Inherit all global Agent OS workflows and standards:

For complete instructions, see: [Main Instructions](../instructions/main.instructions.md)

## Project-Specific Guidelines
Additional guidelines specific to n8n development:

@./best-practices.md
@./code-style.md
@./tech-stack.md

## Documentation References
When planning, analyzing, or implementing features, ALWAYS use Context7 MCP tools with Meilisearch caching to fetch up-to-date documentation:

1. **Check Meilisearch First**
   - Look up the corresponding Meilisearch key from the n8n mapping in `tech-stack.md`
   - Search Meilisearch for cached documentation using this key
   - Example mapping keys: `n8n_core`, `n8n_nodes_base`, `n8n_workflow`, etc.

2. **Fallback to Context7 if Needed**
   - If documentation is not found in Meilisearch, fetch it from Context7
   - Resolve the library ID with `mcp__proxmoxmcp__context7-resolve-library-id` for "n8n" or specific packages
   - Fetch documentation with `mcp__proxmoxmcp__context7-get-library-docs` using the resolved ID

3. **Cache the Documentation**
   - Store retrieved documentation in Meilisearch for future use
   - Use the schema format specified in the main instructions
   - Include appropriate metadata like fetch date, token count, and version

4. **Apply Documentation Insights**
   - Extract key patterns, best practices, and examples from the documentation
   - Follow the official n8n recommendations for workflow design
   - Apply version-specific guidance based on the documentation version
   - Consider governance and performance implications from documentation

Refer to the **Context7 Documentation Mappings** section in `tech-stack.md` for the complete list of n8n-specific Meilisearch keys and Context7 library IDs.

**IMPORTANT:** This documentation lookup and caching process MUST be performed before starting any implementation of n8n features to ensure you're following the latest best practices.

## n8n Integration Patterns
When building n8n workflows for the Brookline project:

1. **Webhook Triggers**
   - Use webhook nodes to listen for NeonCRM donation events
   - Implement proper authentication for webhook security
   - Include error handling for webhook payload parsing

2. **Data Transformation**
   - Use Function nodes for complex transformations between NeonCRM and NetSuite
   - Implement JSON mapping for field-to-field relationships
   - Create reusable subworkflows for common transformation patterns

3. **Error Handling**
   - Implement robust error handling at each workflow step
   - Use Error workflow patterns for notification and recovery
   - Log detailed error information for troubleshooting

4. **Authentication**
   - Securely store credentials in the n8n Credential Store
   - Implement OAuth 2.0 for NeonCRM and NetSuite connections
   - Rotate credentials according to security best practices

5. **Testing Strategy**
   - Test workflows with sample payloads before deployment
   - Validate all error handling paths
   - Create monitoring for production workflows

## Project Context
This directory contains n8n-specific instructions that extend the global Agent OS standards.

## Usage
This n8n configuration inherits all global Agent OS workflows and adds project-specific customizations. The local files in this directory take precedence for n8n-specific guidance.