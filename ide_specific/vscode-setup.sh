#!/bin/bash

# Agent OS VS Code Setup Script
# This script configures VS Code to use Agent OS files

set -e  # Exit on error

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dirs)
            CUSTOM_DIRS="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "This script configures VS Code to use Agent OS instructions and commands."
            echo "It requires Agent OS base installation (setup.sh) to be run first."
            echo ""
            echo "Options:"
            echo "  --dirs                     Project names to create in ~/.agent-os/ (comma-separated, e.g., 'Drupal10,Laravel9')"
            echo "  -h, --help                 Show this help message"
            echo ""
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

echo "🚀 Agent OS VS Code Setup"
echo "========================="
echo ""

# Check if Agent OS base installation is present
if [ ! -d "$HOME/.agent-os" ]; then
    echo "⚠️  Agent OS base installation not found!"
    echo ""
    echo "Please install the Agent OS base installation first:"
    echo ""
    echo "Option 1 - Automatic installation:"
    echo "  curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/setup.sh | bash"
    echo ""
    echo "Option 2 - Manual installation:"
    echo "  Follow instructions at https://buildermethods.com/agent-os"
    echo ""
    exit 1
fi

# Check for required Agent OS directories
if [ ! -d "$HOME/.agent-os/instructions" ]; then
    echo "⚠️  Agent OS instructions directory not found!"
    echo "Please ensure the base Agent OS installation is complete."
    exit 1
fi

# Create VS Code settings directory if it doesn't exist
echo "📁 Creating VS Code directories..."
mkdir -p "$HOME/.vscode"

# Create VS Code settings that reference Agent OS files
echo ""
echo "📝 Creating VS Code configuration..."

# Create a settings file for VS Code extensions that support custom instructions
cat > "$HOME/.vscode/agent-os-settings.json" << 'EOF'
{
  "agentOS": {
    "instructionsPath": "~/.agent-os/instructions/main.instructions.md",
    "standardsPath": "~/.agent-os/templates/standards/",
    "commandsPath": "~/.agent-os/commands/",
    "description": "Agent OS integration for VS Code - reference these paths in your AI assistant extensions"
  }
}
EOF

echo "  ✓ ~/.vscode/agent-os-settings.json"

# Create a workspace settings template
cat > "$HOME/.vscode/agent-os-workspace-template.json" << 'EOF'
{
  "files.associations": {
    "*.md": "markdown"
  },
  "markdown.preview.linkify": true,
  "ai.instructions": [
    "Follow the comprehensive instructions in ~/.agent-os/instructions/main.instructions.md",
    "Adhere to coding standards in ~/.agent-os/templates/standards/",
    "Reference available commands in ~/.agent-os/commands/",
    "For project-specific standards, check ~/.agent-os/[project-name]/ if it exists"
  ],
  "ai.contextFiles": [
    "~/.agent-os/instructions/main.instructions.md",
    "~/.agent-os/templates/standards/"
  ]
}
EOF

echo "  ✓ ~/.vscode/agent-os-workspace-template.json"

# Create a README for VS Code integration
cat > "$HOME/.vscode/AGENT-OS-README.md" << 'EOF'
# Agent OS VS Code Integration

This directory contains Agent OS configuration files for VS Code.

## Files

- `agent-os-settings.json` - Global settings referencing Agent OS paths
- `agent-os-workspace-template.json` - Template for project workspace settings

## Usage

### For AI Extensions
Most AI extensions for VS Code support custom instructions. Reference these Agent OS paths:

- **Instructions**: `~/.agent-os/instructions/main.instructions.md`
- **Standards**: `~/.agent-os/templates/standards/`
- **Commands**: `~/.agent-os/commands/`

### For Project Workspaces
Copy the workspace template to your project's `.vscode/settings.json`:

```bash
cp ~/.vscode/agent-os-workspace-template.json /path/to/your/project/.vscode/settings.json
```

### Popular AI Extensions
- **GitHub Copilot**: Configure in VS Code settings
- **Codeium**: Set custom instructions in extension settings
- **TabNine**: Configure context in extension settings

## Customization

Edit the template files to match your specific AI extension's configuration format.
EOF

echo "  ✓ ~/.vscode/AGENT-OS-README.md"

# Create custom directories if specified
if [ -n "$CUSTOM_DIRS" ]; then
    echo ""
    echo "📁 Creating custom directories in ~/.agent-os/..."
    
    # Use IFS to split the comma-separated string into an array
    IFS=',' read -r -a dir_names <<< "$CUSTOM_DIRS"
    
    for dir in "${dir_names[@]}"; do
        # Trim whitespace from directory name
        dir=$(echo "$dir" | xargs)
        if [ -z "$dir" ]; then
            echo "  ⚠️  Empty directory name found, skipping"
            continue
        fi
        
        target_dir="$HOME/.agent-os/$dir"
        
        if [ -d "$target_dir" ]; then
            echo "  ⚠️  Directory '$dir' already exists. Skipping creation."
        else
            mkdir -p "$target_dir"
            echo "  ✓ Created directory: $target_dir"
            
            # Copy common files and standards to the new directory
            if [ -d "$HOME/.agent-os/common" ]; then
                cp -r "$HOME/.agent-os/common"/* "$target_dir/" 2>/dev/null || true
                echo "    ✓ Copied common files to $dir"
            fi
            
            if [ -d "$HOME/.agent-os/templates/standards" ]; then
                cp -r "$HOME/.agent-os/templates/standards"/* "$target_dir/" 2>/dev/null || true
                echo "    ✓ Copied standards files to $dir"
            fi
        fi
    done
fi

echo ""
echo "✅ Agent OS VS Code setup complete!"
echo ""
echo "📍 Configuration created:"
echo "   ~/.vscode/agent-os-settings.json           - Global Agent OS settings"
echo "   ~/.vscode/agent-os-workspace-template.json - Template for project workspaces"
echo "   ~/.vscode/AGENT-OS-README.md               - Integration guide"
echo ""
echo "💡 Note: All files reference the shared Agent OS installation at ~/.agent-os/"
echo "   Customize your standards in ~/.agent-os/templates/standards/"
echo "   Add commands to ~/.agent-os/commands/"
echo ""
echo "Next steps:"
echo ""
echo "1. Configure your AI extension to use Agent OS instructions:"
echo "   - Instructions: ~/.agent-os/instructions/main.instructions.md"
echo "   - Standards: ~/.agent-os/templates/standards/"
echo ""
echo "2. For project-specific settings, copy the workspace template:"
echo "   cp ~/.vscode/agent-os-workspace-template.json /path/to/project/.vscode/settings.json"
echo ""
echo "3. Customize your development standards in ~/.agent-os/templates/standards/"
echo ""
echo "4. Read ~/.vscode/AGENT-OS-README.md for detailed integration instructions"
echo ""
echo "Learn more at https://buildermethods.com/agent-os"
echo ""