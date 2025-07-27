#!/bin/bash

# Agent OS Cursor Setup Script
# This script configures Cursor IDE to use Agent OS files

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
            echo "This script configures Cursor IDE to use Agent OS instructions and commands."
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

echo "🚀 Agent OS Cursor Setup"
echo "========================"
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

# Create .cursorrules file that references Agent OS files
echo ""
echo "📝 Creating Cursor configuration from template..."

# Get the script directory to find templates
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATES_DIR="$SCRIPT_DIR/templates/cursor"

# Copy Cursor configuration template
if [ -f "$TEMPLATES_DIR/cursor-config.md" ]; then
    cp "$TEMPLATES_DIR/cursor-config.md" "$HOME/.cursorrules"
    echo "  ✓ ~/.cursorrules (from template)"
else
    echo "  ⚠️  Template not found, creating basic configuration..."
    # Fallback to inline generation if template doesn't exist
    cat > "$HOME/.cursorrules" << 'EOF'
# Cursor IDE Rules - Agent OS Integration

You are an expert software developer assistant integrated with Agent OS.

## Instructions
Follow the comprehensive instructions in: ~/.agent-os/instructions/main.instructions.md

## Development Standards  
Adhere to the coding standards and best practices defined in: ~/.agent-os/templates/standards/

## Available Commands
Reference commands available in: ~/.agent-os/commands/

## Project Context
When working on specific projects, also reference any project-specific standards in ~/.agent-os/[project-name]/ if they exist.

Always prioritize code quality, maintainability, and adherence to established patterns.
EOF
    echo "  ✓ ~/.cursorrules"
fi

echo "  ✓ ~/.cursorrules"

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
                echo "    ✓ Copied standards files to $dir"
            fi
        fi
    done
fi

echo ""
echo "✅ Agent OS Cursor setup complete!"
echo ""
echo "📍 Configuration created:"
echo "   ~/.cursorrules                - References Agent OS instructions and standards"
echo ""
echo "💡 Note: All files reference the shared Agent OS installation at ~/.agent-os/"
echo "   Customize your standards in ~/.agent-os/templates/standards/"
echo "   Add commands to ~/.agent-os/commands/"
echo ""
echo "Next steps:"
echo ""
echo "1. Open Cursor IDE in your project directory"
echo "2. Cursor will automatically use the .cursorrules configuration"
echo "3. Reference Agent OS commands and standards as needed"
echo "4. Customize your development standards in ~/.agent-os/templates/standards/"
echo ""
echo "Learn more at https://buildermethods.com/agent-os"
echo ""