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

1. **Installation**:
```bash
# Basic installation
curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/setup.sh | bash

# With Node.js project structure
curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/setup.sh | bash -s -- --dirs "nodejs,src,tests,docs"

# With Python project structure
curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/setup.sh | bash -s -- --dirs "python,src,tests,docs"

# Custom directories and files
curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/setup.sh | bash -s -- --dirs "custom,src,tests" --files "README.md,config.json"
```

2. **Post-Installation**:
- Customize standards in `~/.agent-os/<PROJECT>/standards/`
- Review instructions in `~/.agent-os/<PROJECT>/instructions/`
- Configure project-specific settings as needed

## 🛠 Usage

### System Setup (Required First)

First, install the Agent OS base system using setup.sh. This creates the necessary structure in your home directory:

```bash
# Basic installation of Agent OS system files
curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/setup.sh | bash
```

This will:
- Create the `~/.agent-os/` directory structure
- Install standard templates and configurations
- Set up workflow instructions and guides
- Configure base system settings

### Project Initialization

After system setup, you can initialize individual projects using projectai.sh:

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

The `projectai` command will:
- Create project-specific files in your current directory
- Reference the templates installed in `~/.agent-os/`
- Customize all template files with your project type and directory name
- Set up project-specific configurations that link to your Agent OS installation

### Understanding the Workflow

1. **System Setup** (setup.sh):
   - One-time installation in `~/.agent-os/`
   - Installs global templates and standards
   - Creates base configuration

2. **Project Setup** (projectai.sh):
   - Run for each new project
   - Creates project-specific files
   - Links to your Agent OS installation
   - Customizes templates for your project

The project type (nodejs or python) is automatically determined by including it in the directory name. This will set up appropriate default files for each project type:
- Node.js: README.md, package.json, tsconfig.json
- Python: README.md, requirements.txt, setup.py

### Directory Structure
```
~/.agent-os/
├── standards/        # Coding standards and best practices
├── instructions/     # Workflow instructions and guides
└── [project-dirs]/  # Project-specific directories
```

## 📚 Documentation

### Core Workflows
1. **Analyze Product**: Review and document existing codebase
2. **Plan Product**: Define project structure and requirements
3. **Create Spec**: Generate detailed technical specifications
4. **Execute Tasks**: Implement features and fixes

### Best Practices
- Follow the standards in `~/.agent-os/standards/`
- Use provided templates for consistency
- Document architectural decisions
- Maintain modular separation of concerns

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
