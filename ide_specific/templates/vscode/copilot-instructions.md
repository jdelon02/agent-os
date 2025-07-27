# Copilot Instructions Template for Agent OS

This file serves as a template for VS Code Copilot integration with Agent OS.

## Project Context
See the following files for specific guidelines:
- `~/.agent-os/instructions/analyze-product.md` - Analyze Current Product & Install Agent OS
- `~/.agent-os/instructions/plan-product.md` - Product Planning Rules for Agent OS
- `~/.agent-os/instructions/create-spec.md` - Spec Creation Rules for Agent OS
- `~/.agent-os/instructions/execute-tasks.md` - Task Execution Rules for Agent OS

## Coding Standards
Follow the coding standards and best practices defined in:
- `~/.agent-os/templates/standards/best-practices.md`
- `~/.agent-os/templates/standards/code-style.md`
- `~/.agent-os/templates/standards/tech-stack.md`

## Project-Specific Instructions
For project-specific customization, check if there are project-specific directories:
- `~/.agent-os/{PROJECT_TYPE}/` - Project-specific standards and guidelines

## Usage
Copy this file to your project's `.vscode/` directory and customize as needed:
```bash
cp ~/.agent-os/ide_specific/templates/vscode/copilot-instructions.md /path/to/your/project/.vscode/copilot-instructions.md
```

Then configure VS Code Copilot to use this file as custom instructions.
