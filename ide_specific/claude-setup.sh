#!/bin/bash

# Agent OS Claude Code Setup Script
# This script configures Claude Code to use Agent OS files

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
            echo "This script configures Claude Code to use Agent OS instructions and commands."
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

echo "🚀 Agent OS Claude Code Setup"
echo "============================="
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

if [ ! -d "$HOME/.agent-os/commands" ]; then
    echo "⚠️  Agent OS commands directory not found!"
    echo "Please ensure the base Agent OS installation includes commands."
    exit 1
fi

# Create Claude directories
echo "📁 Creating Claude Code directories..."
mkdir -p "$HOME/.claude"
mkdir -p "$HOME/.claude/commands"

# Create CLAUDE.md that references Agent OS files
echo ""
echo "📝 Creating CLAUDE.md configuration from template..."

# Get the script directory to find templates
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATES_DIR="$SCRIPT_DIR/templates/claude"

# Copy Claude configuration template
if [ -f "$TEMPLATES_DIR/claude-config.md" ]; then
    cp "$TEMPLATES_DIR/claude-config.md" "$HOME/.claude/CLAUDE.md"
    echo "  ✓ ~/.claude/CLAUDE.md (from template)"
else
    echo "  ⚠️  Template not found, creating basic configuration..."
    # Fallback to inline generation if template doesn't exist
    cat > "$HOME/.claude/CLAUDE.md" << 'EOF'
# Claude Code Configuration

# Import Agent OS instructions and standards
@~/.agent-os/instructions/main.instructions.md
@~/.agent-os/templates/standards/

# Additional Claude Code specific configuration can be added here
EOF
    echo "  ✓ ~/.claude/CLAUDE.md"
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
                echo "    ✓ Copied standards files to $dir"
            fi
        fi
    done
fi

# Create symlinks for commands (only thing that must be in ~/.claude/)
echo ""
echo "🔗 Creating command symlinks..."

# Remove existing symlinks/files in commands directory to avoid conflicts
rm -rf "$HOME/.claude/commands"/*

# Create symlinks for each command file in ~/.agent-os/commands/
if [ -d "$HOME/.agent-os/commands" ]; then
    for cmd_file in "$HOME/.agent-os/commands"/*.md; do
        if [ -f "$cmd_file" ]; then
            cmd_name=$(basename "$cmd_file")
            ln -sf "$cmd_file" "$HOME/.claude/commands/$cmd_name"
            echo "  ✓ Linked $cmd_name"
        fi
    done
else
    echo "  ⚠️  No commands found in ~/.agent-os/commands/"
fi

echo ""
echo "✅ Agent OS Claude Code setup complete!"
echo ""
echo "📍 Configuration created:"
echo "   ~/.claude/CLAUDE.md           - References Agent OS instructions and standards"
echo "   ~/.claude/commands/           - Symlinks to Agent OS commands"
echo ""
echo "💡 Note: All files reference the shared Agent OS installation at ~/.agent-os/"
echo "   Customize your standards in ~/.agent-os/templates/standards/"
echo "   Add commands to ~/.agent-os/commands/"
echo ""
echo "Next steps:"
echo ""
echo "1. Start using Agent OS commands in Claude Code:"
echo ""
echo "   - Initiate Agent OS in a new product's codebase with:"
echo "     /plan-product"
echo ""
echo "   - Initiate Agent OS in an existing product's codebase with:"
echo "     /analyze-product"
echo ""
echo "   - Initiate a new feature with:"
echo "     /create-spec (or simply ask 'what's next?')"
echo ""
echo "   - Build and ship code with:"
echo "     /execute-task"
echo ""
echo "2. Customize your development standards in ~/.agent-os/templates/standards/"
echo ""
echo "Learn more at https://buildermethods.com/agent-os"
echo ""
