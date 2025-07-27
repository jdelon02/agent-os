# Claude Code Configuration for Agent OS

# Import Agent OS instructions and standards
@import: ~/.agent-os/instructions/main.instructions.md
@import: ~/.agent-os/templates/standards/best-practices.md
@import: ~/.agent-os/templates/standards/code-style.md
@import: ~/.agent-os/templates/standards/tech-stack.md

# Project-specific configurations
# For project-specific standards, Claude will also reference:
# ~/.agent-os/{PROJECT_TYPE}/ if it exists

# Commands available
@commands: ~/.agent-os/commands/

# Additional Claude Code specific configuration
This configuration integrates Agent OS standards and practices into Claude Code.
Follow the imported guidelines for consistent development practices.
