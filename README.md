<img width="1280" height="640" alt="agent-os-og" src="https://github.com/user-attachments/assets/e897628e-7063-4bab-a69a-7bb6d7ac8403" />

# Agent OS: Spec-Driven Agentic Development

[Agent OS](https://buildermethods.com/agent-os) transforms AI coding agents into productive developers through structured workflows, standardized processes, and intelligent codebase integration.

## 🚀 Features

- **Project Type Support**: Works with any language or framework
- **Flexible Integration**: Compatible with Claude Code, Cursor, and other AI coding tools
- **Standardized Workflows**: Automated directory and file creation based on project types
- **Smart Configuration**: CLI-based setup with project-specific defaults
- **Documentation-Driven**: Built-in standards and best practices

## 📋 Quick Start

### 1. Base Installation
Install the Agent OS foundation that all AI tools will reference:

```bash
# Basic installation
curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/setup.sh | bash

# With custom project directories
curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/setup.sh | bash -s -- --dirs "Laravel,React,Python"

# With overwrite options
curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/setup.sh | bash -s -- --overwrite-standards --dirs "Drupal,NodeJS"
```

### 2. AI Tool Integration
After base installation, set up your preferred AI coding tool:

#### Claude Code
```bash
curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/ide_specific/claude-setup.sh | bash

# With additional project directories
curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/ide_specific/claude-setup.sh | bash -s -- --dirs "NextJS,FastAPI"
```

#### Cursor IDE
```bash
curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/ide_specific/cursor-setup.sh | bash

# With additional project directories
curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/ide_specific/cursor-setup.sh | bash -s -- --dirs "Vue,Django"
```

#### VS Code
```bash
curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/ide_specific/vscode-setup.sh | bash

# With additional project directories
curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/ide_specific/vscode-setup.sh | bash -s -- --dirs "Angular,Flask"
```

### 3. What Gets Installed

**Base Installation** (`setup.sh`):
- `~/.agent-os/instructions/` - Core Agent OS instructions
- `~/.agent-os/templates/standards/` - Development standards
- `~/.agent-os/commands/` - Available commands
- `~/.agent-os/[custom-dirs]/` - Project-specific directories

**AI Tool Integration**:
- **Claude Code**: `~/.claude/CLAUDE.md` + command symlinks
- **Cursor**: `~/.cursorrules` configuration
- **VS Code**: `~/.vscode/agent-os-*` files and templates

## 🛠 Usage

### Available Commands

Once installed, Agent OS provides commands for different AI tools:

#### Claude Code Commands
- `/plan-product` - Analyze and plan new products
- `/analyze-product` - Review existing codebases  
- `/create-spec` - Generate technical specifications
- `/execute-task` - Implement features and fixes

#### Universal Access
All AI tools reference the same shared files in `~/.agent-os/`:
- **Instructions**: Core workflows and methodologies
- **Standards**: Coding standards and best practices  
- **Commands**: Available agent commands
- **Project Directories**: Custom project-specific configurations

### Project Initialization

For local project setup, use the projectai.sh script:

```bash
# Make the script executable and create symlink (one-time setup)
chmod +x projectai.sh && sudo ln -s "$(pwd)/projectai.sh" /usr/local/bin/projectai

# Initialize a new project
cd your-project-directory
projectai <project_type>

# Examples:
projectai nodejs     # Initialize a Node.js project
projectai python     # Initialize a Python project
projectai drupal     # Initialize a Drupal project
```

### Understanding the Architecture

1. **Base Installation** (`setup.sh`):
   - Creates shared `~/.agent-os/` directory
   - Installs universal templates and standards
   - Downloads commands and instructions from GitHub

2. **AI Tool Setup** (IDE-specific scripts):
   - Configures your specific AI tool
   - References shared `~/.agent-os/` files
   - Creates tool-specific configuration files

3. **Project Setup** (`projectai.sh`):
   - Run for each new project
   - Creates project-specific files in current directory
   - Links to your Agent OS installation

### Directory Structure
```
~/.agent-os/                    # Shared Agent OS installation
├── instructions/               # Core Agent OS instructions  
├── templates/standards/        # Development standards
├── commands/                   # Available commands
├── common/                     # Common files for all projects
└── [custom-dirs]/             # Project-specific directories (Laravel, React, etc.)

# AI Tool Configurations (created by IDE-specific scripts)
~/.claude/                     # Claude Code integration
├── CLAUDE.md                  # References ~/.agent-os/ files
└── commands/ -> ~/.agent-os/commands/  # Symlinked commands

~/.cursorrules                 # Cursor IDE integration
~/.vscode/agent-os-*          # VS Code integration files
```

## 📚 Documentation

### Core Workflows
1. **Analyze Product**: Review and document existing codebase
2. **Plan Product**: Define project structure and requirements
3. **Create Spec**: Generate detailed technical specifications
4. **Execute Tasks**: Implement features and fixes

### Best Practices
- Follow the standards in `~/.agent-os/templates/standards/`
- Use provided templates for consistency
- Document architectural decisions
- Maintain modular separation of concerns
- Customize project-specific directories as needed

### Script Options

#### setup.sh Options
```bash
--dirs "Dir1,Dir2,Dir3"         # Create custom project directories
--overwrite-instructions        # Overwrite existing instruction files
--overwrite-standards           # Overwrite existing standards files
--files "file1,file2"          # Additional files to create (future use)
```

#### IDE Setup Script Options
```bash
--dirs "Project1,Project2"      # Create additional project directories
```

### Examples

```bash
# Full setup for a Laravel + React development environment
curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/setup.sh | bash -s -- --dirs "Laravel,React,Vue,API"
curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/ide_specific/claude-setup.sh | bash -s -- --dirs "NextJS,Symfony"

# Overwrite existing standards with latest from GitHub
curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/setup.sh | bash -s -- --overwrite-standards

# VS Code setup for Python data science
curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/setup.sh | bash -s -- --dirs "Python,DataScience,ML"
curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/ide_specific/vscode-setup.sh | bash
```

## 🗺 Roadmap

- [x] Core MVP Functionality
- [ ] Advanced Configuration
- [ ] Template System
- [ ] Enterprise Features
- [ ] Integration APIs

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Follow our coding standards
4. Submit a pull request

## 🔗 Resources

- [Documentation](https://buildermethods.com/agent-os)
- [Builder Methods Blog](https://buildermethods.com)
- [YouTube Channel](https://youtube.com/@briancasel)

## 👤 Created by Brian Casel @ Builder Methods

Brian Casel is the creator of [Builder Methods](https://buildermethods.com), helping professional software developers and teams build with AI.

### Stay Updated
- [Builder Briefing newsletter](https://buildermethods.com)
- [YouTube](https://youtube.com/@briancasel)

## 📄 License

This project is licensed under the terms specified in the LICENSE file.
