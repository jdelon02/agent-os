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
            echo "  --dirs                     Project names to create in ~/.agent-os/ (comma-separated, directories created in lowercase)"
            echo "                             Example: 'Drupal10,Laravel9' creates ~/.agent-os/drupal10/, ~/.agent-os/laravel9/"
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
echo "📝 Creating VS Code configuration from templates..."

# Get the script directory to find templates
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATES_DIR="$SCRIPT_DIR/templates/vscode"

# Copy workspace settings template
if [ -f "$TEMPLATES_DIR/workspace-settings.json" ]; then
    cp "$TEMPLATES_DIR/workspace-settings.json" "$HOME/.vscode/agent-os-workspace-template.json"
    echo "  ✓ ~/.vscode/agent-os-workspace-template.json (from template)"
else
    echo "  ⚠️  Template not found at $TEMPLATES_DIR/workspace-settings.json"
fi

# Note: Copilot instructions should be in individual project .github/ directories
# The template is available for project-specific use but not copied globally
echo "  ℹ️  Copilot instructions template available at $TEMPLATES_DIR/copilot-instructions.md"
echo "     For individual projects, copy to .github/copilot-instructions.md in each repository"

# Copy README template
if [ -f "$TEMPLATES_DIR/AGENT-OS-README.md" ]; then
    cp "$TEMPLATES_DIR/AGENT-OS-README.md" "$HOME/.vscode/AGENT-OS-README.md"
    echo "  ✓ ~/.vscode/AGENT-OS-README.md (from template)"
else
    echo "  ⚠️  Template not found at $TEMPLATES_DIR/AGENT-OS-README.md"
fi

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
        
        # Convert directory name to lowercase for filesystem, keep original for display
        dir_original="$dir"
        dir_lowercase=$(echo "$dir" | tr '[:upper:]' '[:lower:]')
        
        target_dir="$HOME/.agent-os/$dir_lowercase"
        
        if [ -d "$target_dir" ]; then
            echo "  ⚠️  Directory '$dir_original' already exists. Skipping creation."
        else
            mkdir -p "$target_dir"
            echo "  ✓ Created directory: $target_dir"
            
            # Copy standards to the new directory
            if [ -d "$HOME/.agent-os/templates/standards" ]; then
                cp -r "$HOME/.agent-os/templates/standards"/* "$target_dir/" 2>/dev/null || true
                echo "    ✓ Copied standards files to $dir_original"
            fi
        fi
    done
fi

echo ""
echo "✅ Agent OS VS Code setup complete!"
echo ""
echo "📍 Configuration created:"
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