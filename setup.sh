#!/bin/bash

# Agent OS Setup Script
# This script installs the Agent OS foundation that all AI tools will reference
#
# USAGE:
#   Basic installation:
#     curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/setup.sh | bash
#
#   With custom project directories:
#     curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/setup.sh | bash -s -- --dirs "Laravel,React,Python"
#
#   With overwrite options:
#     curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/setup.sh | bash -s -- --overwrite-standards --dirs "NodeJS,Django"
#
# WHAT THIS SCRIPT DOES:
#   1. Creates ~/.agent-os/ directory structure
#   2. Downloads templates, standards, and instructions from GitHub
#   3. Creates custom project directories with standards files
#   4. Sets up the foundation for AI tool integration
#
# AFTER INSTALLATION:
#   Run an AI tool-specific setup script:
#   - Claude Code: curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/ide_specific/claude-setup.sh | bash
#   - Cursor IDE:  curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/ide_specific/cursor-setup.sh | bash
#   - VS Code:     curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/ide_specific/vscode-setup.sh | bash
#
# BEST PRACTICES:
#   - Run this script first before any AI tool setup
#   - Use meaningful directory names (Laravel, React, Python, etc.)
#   - Customize standards in ~/.agent-os/templates/standards/ after installation
#   - Use --overwrite-standards to update with latest GitHub versions

set -e  # Exit on error

# Initialize flags
OVERWRITE_INSTRUCTIONS=false
OVERWRITE_STANDARDS=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --overwrite-instructions)
            OVERWRITE_INSTRUCTIONS=true
            shift
            ;;
        --overwrite-standards)
            OVERWRITE_STANDARDS=true
            shift
            ;;
        --dirs)
            CUSTOM_DIRS="$2"
            shift 2
            ;;
        --files)
            CUSTOM_FILES="$2"
            shift 2
            ;;
        -h|--help)
            echo "Agent OS Setup Script"
            echo "====================="
            echo ""
            echo "Installs the Agent OS foundation that all AI tools will reference."
            echo ""
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --overwrite-instructions    Overwrite existing instruction files"
            echo "  --overwrite-standards       Overwrite existing standards files"
            echo "  --dirs                     Project names to create (comma-separated)"
            echo "                             Examples: 'Laravel,React,Python' or 'NodeJS,Django,Vue'"
            echo "  --files                    Additional files to create in each project (comma-separated)"
            echo "  -h, --help                 Show this help message"
            echo ""
            echo "Examples:"
            echo "  # Basic installation"
            echo "  $0"
            echo ""
            echo "  # With custom project directories"
            echo "  $0 --dirs 'Laravel,React,Python,API'"
            echo ""
            echo "  # Update existing standards"
            echo "  $0 --overwrite-standards"
            echo ""
            echo "  # Full refresh with new directories"
            echo "  $0 --overwrite-instructions --overwrite-standards --dirs 'NextJS,FastAPI'"
            echo ""
            echo "After installation, run an AI tool setup script:"
            echo "  Claude Code: curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/ide_specific/claude-setup.sh | bash"
            echo "  Cursor IDE:  curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/ide_specific/cursor-setup.sh | bash"
            echo "  VS Code:     curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/ide_specific/vscode-setup.sh | bash"
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

echo "🚀 Agent OS Setup Script"
echo "========================"
echo ""

# Base URL for raw GitHub content
BASE_URL="https://raw.githubusercontent.com/jdelon02/agent-os/main"
# GitHub API URL for directory listings
API_URL="https://api.github.com/repos/jdelon02/agent-os/contents"

# Debug values before function calls
echo "DEBUG: Before function calls:"
echo "  CUSTOM_DIRS=$CUSTOM_DIRS"
echo "  CUSTOM_FILES=$CUSTOM_FILES"
echo "  PROJECT_TYPE=$PROJECT_TYPE"

# Function to recursively download files from a GitHub directory to a local directory
# This function handles the core file downloading logic with retry mechanisms and error handling
# Parameters:
#   $1 - source_dir: GitHub repository path (e.g., "templates/standards")
#   $2 - target_dir: Local filesystem path (e.g., "$HOME/.agent-os/templates/standards")
#   $3 - overwrite_flag: Boolean to determine if existing files should be overwritten
#   $4 - depth: Recursion depth counter to prevent infinite loops
download_files_from_github() {
    local source_dir="$1"
    local target_dir="$2"
    local overwrite_flag="$3"
    local depth="${4:-0}"  # Track recursion depth, default to 0
    
    # Safety check: prevent infinite recursion
    if [ "$depth" -gt 10 ]; then
        echo "  ⚠️  Maximum recursion depth reached for ${source_dir}"
        return 1
    fi
    
    echo "📥 Downloading files from ${source_dir} to ${target_dir} (depth: $depth)"
    echo "DEBUG: source_dir=$source_dir, target_dir=$target_dir, overwrite_flag=$overwrite_flag, depth=$depth"
    mkdir -p "$target_dir"
    
    # Get list of items (files and directories) in the directory
    local api_response
    local retry_count=0
    local max_retries=3
    
    echo "DEBUG: Fetching content list from ${API_URL}/${source_dir}"
    
    # Retry loop for API calls
    while [ $retry_count -lt $max_retries ]; do
        if api_response=$(curl -s --max-time 30 "${API_URL}/${source_dir}"); then
            # Check for API rate limit
            if echo "$api_response" | grep -q '"message":.*"API rate limit exceeded"'; then
                echo "  ⚠️  GitHub API rate limit exceeded (attempt $((retry_count + 1))/$max_retries)"
                if [ $retry_count -lt $((max_retries - 1)) ]; then
                    echo "  💤  Waiting 10 seconds before retry..."
                    sleep 10
                    retry_count=$((retry_count + 1))
                    continue
                else
                    echo "  ❌  Maximum retries reached. Try again later or use authentication for higher limits"
                    return 1
                fi
            else
                # Success - break out of retry loop
                break
            fi
        else
            echo "  ⚠️  Unable to fetch content from ${source_dir} (timeout or error, attempt $((retry_count + 1))/$max_retries)"
            if [ $retry_count -lt $((max_retries - 1)) ]; then
                echo "  💤  Waiting 5 seconds before retry..."
                sleep 5
                retry_count=$((retry_count + 1))
                continue
            else
                echo "DEBUG: curl command failed or timed out after $max_retries attempts"
                return 1
            fi
        fi
    done
    
    # Check if response is valid JSON and not an error
    if echo "$api_response" | grep -q '"message":.*"Not Found"'; then
        echo "  ⚠️  Directory ${source_dir} not found on GitHub"
        return 1
    fi
    
    echo "DEBUG: API response received, parsing..."
    
    # Process files first
    local files
    echo "DEBUG: Raw API response (first 200 chars): $(echo "$api_response" | head -c 200)"
    
    if ! files=$(echo "$api_response" | jq -r '.[] | select(.type == "file") | .name' 2>/dev/null | grep -E '\.(md|json|yaml|yml)$'); then
        # Fallback if jq is not available
        files=$(echo "$api_response" | grep -A1 '"type": "file"' | grep '"name":' | cut -d'"' -f4 | grep '\.\(md\|json\|yaml\|yml\)$')
    fi
    
    echo "DEBUG: Found files: $files"
    echo "DEBUG: File count: $(echo "$files" | wc -l)"
    
    # Download files
    for file in $files; do
        if [ -n "$file" ]; then
            local target_file="${target_dir}/${file}"
            echo "DEBUG: Processing file: $file -> $target_file"
            if [ -f "$target_file" ] && [ "$overwrite_flag" = false ]; then
                echo "  ⚠️  ${file} already exists - skipping"
            else
                echo "DEBUG: Downloading from ${BASE_URL}/${source_dir}/${file}"
                if curl -s --max-time 30 -o "$target_file" "${BASE_URL}/${source_dir}/${file}"; then
                    if [ -f "$target_file" ] && [ -s "$target_file" ]; then
                        if [ "$overwrite_flag" = true ]; then
                            echo "  ✓ ${file} (overwritten)"
                        else
                            echo "  ✓ ${file}"
                        fi
                    else
                        echo "  ⚠️  Downloaded ${file} but file is empty or missing"
                        rm -f "$target_file"
                    fi
                else
                    echo "  ⚠️  Failed to download ${file} (timeout or error)"
                    rm -f "$target_file"
                fi
            fi
        fi
    done
    
    # Now process subdirectories recursively
    local subdirs
    if ! subdirs=$(echo "$api_response" | jq -r '.[] | select(.type == "dir") | .name' 2>/dev/null); then
        # Fallback if jq is not available
        subdirs=$(echo "$api_response" | grep -A1 '"type": "dir"' | grep '"name":' | cut -d'"' -f4)
    fi
    
    echo "DEBUG: Found subdirectories: $subdirs"
    
    # Recursively process subdirectories
    for subdir in $subdirs; do
        if [ -n "$subdir" ]; then
            local sub_source_dir="${source_dir}/${subdir}"
            local sub_target_dir="${target_dir}/${subdir}"
            local next_depth=$((depth + 1))
            echo "DEBUG: Recursively processing subdirectory: $subdir (depth will be $next_depth)"
            download_files_from_github "$sub_source_dir" "$sub_target_dir" "$overwrite_flag" "$next_depth"
        fi
    done
}

# Process 1: Copy all /templates/* directories to ~/.agent-os/* (flattened)
# This downloads the core Agent OS templates, standards, and instructions
# All AI tools will reference these shared files
echo ""
echo "🔄 Process 1: Copying template structure from GitHub..."

# Get list of template directories
template_dirs=$(curl -s "${API_URL}/templates" | jq -r '.[] | select(.type == "dir") | .name' 2>/dev/null) || {
    # Fallback if jq is not available
    template_dirs=$(curl -s "${API_URL}/templates" | grep -A1 '"type": "dir"' | grep '"name":' | cut -d'"' -f4) || {
        echo "❌ Error: Unable to fetch template directory list"
        exit 1
    }
}

echo "DEBUG: Found template directories: $template_dirs"

# Copy each template directory to ~/.agent-os/ (flattened)
for dir in $template_dirs; do
    target_dir="$HOME/.agent-os/${dir}"
    echo "DEBUG: Processing template directory: $dir -> $target_dir"
    download_files_from_github "templates/${dir}" "$target_dir" "$OVERWRITE_STANDARDS"
done

# Create global CLAUDE.md in instructions directory (separate from main.instructions.md)
echo ""
echo "📝 Creating global CLAUDE.md..."
if curl -s --max-time 30 "${BASE_URL}/ide_specific/templates/claude/global-CLAUDE.md" > "$HOME/.agent-os/instructions/CLAUDE.md"; then
    echo "  ✓ ~/.agent-os/instructions/CLAUDE.md"
else
    echo "  ⚠️  Failed to create global CLAUDE.md"
fi

# Process 2: Create custom directories and populate them
# This creates project-specific directories (Laravel, React, Python, etc.)
# Each directory gets populated with standards files for that project type
echo ""
echo "🔄 Process 2: Creating custom directories..."

if [ -n "$CUSTOM_DIRS" ]; then
    echo "DEBUG: Processing CUSTOM_DIRS: $CUSTOM_DIRS"
    # Use IFS to split the comma-separated string into an array
    IFS=',' read -r -a dir_names <<< "$CUSTOM_DIRS"
    
    echo "DEBUG: Array contains ${#dir_names[@]} directories: ${dir_names[*]}"
    
    for dir in "${dir_names[@]}"; do
        # Trim whitespace from directory name
        dir=$(echo "$dir" | xargs)
        if [ -z "$dir" ]; then
            echo "  ⚠️  Empty directory name found, skipping"
            continue
        fi
        
        target_dir="$HOME/.agent-os/$dir"
        echo "DEBUG: Processing custom directory: '$dir' -> $target_dir"
        
        # Create the project-specific directory in ~/.agent-os/
        # This will contain standards and files specific to this project type
        
        if [ -d "$target_dir" ]; then
            echo "  ⚠️  Directory '$dir' already exists. Skipping creation."
        else
            mkdir -p "$target_dir"
            echo "  ✓ Created directory: $target_dir"
        fi
        
        # Generate customized standards files for this project type
        # Standards files define coding standards and best practices for this project type
        echo "  📝 Creating customized standards files for $dir..."
        
        # Download and customize each standards file
        for standards_file in "best-practices.md" "code-style.md" "tech-stack.md"; do
            target_file="$target_dir/${standards_file}"
            if [ -f "$target_file" ] && [ "$OVERWRITE_STANDARDS" = false ]; then
                echo "    ⚠️  ${standards_file} already exists - skipping"
            else
                if curl -s --max-time 30 "${BASE_URL}/templates/standards/${standards_file}" | sed "s/{PROJECT_TYPE}/$dir/g" > "$target_file"; then
                    if [ "$OVERWRITE_STANDARDS" = true ]; then
                        echo "    ✓ ${standards_file} (customized for $dir, overwritten)"
                    else
                        echo "    ✓ ${standards_file} (customized for $dir)"
                    fi
                else
                    echo "    ⚠️  Failed to create ${standards_file}"
                fi
            fi
        done
        
        # Generate CLAUDE.md file for this custom directory (inherits from global)
        echo "  📝 Creating CLAUDE.md for $dir..."
        claude_file="$target_dir/CLAUDE.md"
        if [ -f "$claude_file" ] && [ "$OVERWRITE_INSTRUCTIONS" = false ]; then
            echo "    ⚠️  CLAUDE.md already exists - skipping"
        else
            if curl -s --max-time 30 "${BASE_URL}/ide_specific/templates/claude/CLAUDE.md" | sed "s/{PROJECT_TYPE}/$dir/g" > "$claude_file"; then
                if [ "$OVERWRITE_INSTRUCTIONS" = true ]; then
                    echo "    ✓ CLAUDE.md (inherits from global, overwritten)"
                else
                    echo "    ✓ CLAUDE.md (inherits from global)"
                fi
            else
                echo "    ⚠️  Failed to create CLAUDE.md"
            fi
        fi
        
        # Generate main.instructions.md file for this custom directory (inherits from global)
        echo "  📝 Creating main.instructions.md for $dir..."
        instructions_file="$target_dir/main.instructions.md"
        if [ -f "$instructions_file" ] && [ "$OVERWRITE_INSTRUCTIONS" = false ]; then
            echo "    ⚠️  main.instructions.md already exists - skipping"
        else
            if curl -s --max-time 30 "${BASE_URL}/project-templates/custom-main.instructions.md" | sed "s/{PROJECT_TYPE}/$dir/g" > "$instructions_file"; then
                if [ "$OVERWRITE_INSTRUCTIONS" = true ]; then
                    echo "    ✓ main.instructions.md (inherits from global, overwritten)"
                else
                    echo "    ✓ main.instructions.md (inherits from global)"
                fi
            else
                echo "    ⚠️  Failed to create main.instructions.md"
            fi
        fi
    done
    
    echo ""
    echo "✅ Custom directories created and populated successfully!"
else
    echo "DEBUG: No custom directories specified"
fi

echo ""
echo "✅ Agent OS base installation complete!"
echo ""
echo "📍 Files installed to:"
echo "   ~/.agent-os/templates/standards/     - Your development standards"
echo "   ~/.agent-os/instructions/  - Agent OS instructions"
echo ""
if [ "$OVERWRITE_INSTRUCTIONS" = false ] && [ "$OVERWRITE_STANDARDS" = false ]; then
    echo "💡 Note: Existing files were skipped to preserve your customizations"
    echo "   Use --overwrite-instructions or --overwrite-standards to update specific files"
else
    echo "💡 Note: Some files were overwritten based on your flags"
    if [ "$OVERWRITE_INSTRUCTIONS" = false ]; then
        echo "   Existing instruction files were preserved"
    fi
    if [ "$OVERWRITE_STANDARDS" = false ]; then
        echo "   Existing standards files were preserved"
    fi
fi
echo ""
echo "Next steps:"
echo ""
echo "1. Customize your coding standards in ~/.agent-os/templates/standards/"
echo ""
echo "2. Install commands for your AI coding assistant(s):"
echo ""
echo "   - Using Claude Code? Install the Claude Code commands with:"
echo "     curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/ide_specific/claude-setup.sh | bash"
echo ""
echo "   - Using Cursor? Install the Cursor commands with:"
echo "     curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/ide_specific/cursor-setup.sh | bash"
echo ""
echo "   - Using VS Code? Install the VS Code commands with:"
echo "     curl -sSL https://raw.githubusercontent.com/jdelon02/agent-os/main/ide_specific/vscode-setup.sh | bash"
echo ""
echo "   - Using something else? See instructions at https://buildermethods.com/agent-os"
echo ""
echo "Learn more at https://buildermethods.com/agent-os"
echo ""
