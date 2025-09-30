# {TECHNOLOGY_TYPE} Tech Stack

> Version: 1.0.0
> Last Updated: 2025-08-31

## Context

This file contains {TECHNOLOGY_TYPE}-specific technology stack recommendations. These choices extend the global Agent OS tech stack standards with {TECHNOLOGY_TYPE}-specific tools, frameworks, and libraries. This file is part of the Agent OS standards system and can be customized for your {TECHNOLOGY_TYPE} projects.

## Core Technologies

### Documentation System
- **Documentation System:** Context7 MCP integration with Meilisearch caching
- **Implementation:** Required for all {TECHNOLOGY_TYPE} features
- **Cache System:** Meilisearch
- **Usage:**
  1. Check Meilisearch for cached documentation using mappings below
  2. If not found, resolve library ID: `mcp__proxmoxmcp__context7-resolve-library-id`
  3. Fetch documentation: `mcp__proxmoxmcp__context7-get-library-docs`
  4. Cache in Meilisearch for future use

## Context7 Documentation Mappings

This section maps Meilisearch-compatible keys to Context7 library IDs for {TECHNOLOGY_TYPE} documentation.

### {TECHNOLOGY_TYPE} Core Documentation

| Meilisearch Key | Context7 Library ID | Description | Version |
|-----------------|---------------------|-------------|---------|  
| <!-- Replace with {TECHNOLOGY_TYPE}-specific documentation mappings --> | | | |

<!-- Example entries (customize for your technology):
| framework_main | /{TECHNOLOGY_TYPE_LOWER}/{TECHNOLOGY_TYPE_LOWER} | {TECHNOLOGY_TYPE} Framework Repository | Latest |
| framework_docs | /websites/{TECHNOLOGY_TYPE_LOWER} | {TECHNOLOGY_TYPE} Official Documentation | Latest |
-->

### {TECHNOLOGY_TYPE} Packages & Extensions

| Meilisearch Key | Context7 Library ID | Description | Trust Score |
|-----------------|---------------------|-------------|------------|
| <!-- Add {TECHNOLOGY_TYPE}-specific packages and libraries here --> | | | |

### Development & Testing Tools

| Meilisearch Key | Context7 Library ID | Description | Trust Score |
|-----------------|---------------------|-------------|------------|
| <!-- Add {TECHNOLOGY_TYPE} development and testing tools here --> | | | |

### Framework Integrations

| Meilisearch Key | Context7 Library ID | Description | Trust Score |
|-----------------|---------------------|-------------|------------|
| <!-- Add {TECHNOLOGY_TYPE} framework-specific integrations here --> | | | |

### Recommended Library IDs

For most {TECHNOLOGY_TYPE} documentation needs, use these library IDs:

1. **Primary Documentation**: Use the main documentation library ID from the mappings above
2. **Framework Reference**: Use the core framework repository library ID
3. **Version-Specific Docs**: Use version-specific documentation when available

<!-- Customize the above recommendations with your {TECHNOLOGY_TYPE}-specific library IDs -->

### Documentation Requirements

**REQUIRED WORKFLOW:** The following process MUST be followed when retrieving {TECHNOLOGY_TYPE} documentation:

1. **ALWAYS** check for cached documentation in Meilisearch using the Meilisearch Key first
2. **ONLY IF** not found in cache, fetch from Context7 using the corresponding Library ID
3. **IMMEDIATELY** store newly retrieved documentation in Meilisearch for future use
4. **ALWAYS** use the most specific version when applicable (e.g., version-specific docs for versioned projects)

Failure to follow this workflow will result in unnecessary API calls and reduced performance.

### Metadata

- **Last Updated**: 2025-08-31
- **Primary Technology**: {TECHNOLOGY_TYPE}
- **Meilisearch Index**: context7_docs
- **Update Frequency**: Monthly or with major {TECHNOLOGY_TYPE} releases

## Technology Stack

### Core Technology
- **Technology:** {TECHNOLOGY_TYPE}
- **Primary Use:** [Web Framework / Database / Frontend Library / etc.]
- **Language/Runtime:** [Specify primary language]
- **Version:** [Specify recommended version]

### Key Dependencies
- **Package Manager:** [npm, pip, composer, cargo, etc.]
- **Build Tools:** [Specify if applicable]
- **Testing Framework:** [Specify testing tools]

### Development Environment
- **Local Setup:** [Docker, native installation, etc.]
- **IDE/Editor:** [Recommended development environment]
- **Debugging Tools:** [Specify debugging tools]

### Deployment Considerations
- **Hosting Options:** [Cloud platforms, server requirements]
- **Build Process:** [Compilation, bundling, etc.]
- **Environment Variables:** [Configuration management]
- **Performance:** [Caching, optimization strategies]

### Integration Points
- **Database Compatibility:** [Supported databases]
- **API Integration:** [REST, GraphQL, etc.]
- **Authentication:** [Supported auth methods]
- **Third-party Services:** [Common integrations]

---

*Customize this file with your organization's preferred tech stack. These defaults are used when initializing new projects with Agent OS.*
