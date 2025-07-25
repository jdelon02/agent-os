#!/bin/bash

# Agent OS Setup Script
# This script installs Agent OS files to your system

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
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --overwrite-instructions    Overwrite existing instruction files"
            echo "  --overwrite-standards       Overwrite existing standards files"
            echo "  --dirs                     Project names to create (comma-separated, e.g., 'Drupal10,Laravel9')"
            echo "  --files                    Additional files to create in each project (comma-separated)"
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

# Process 2: Create custom directories and populate them
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
        
        if [ -d "$target_dir" ]; then
            echo "  ⚠️  Directory '$dir' already exists. Skipping creation."
        else
            mkdir -p "$target_dir"
            echo "  ✓ Created directory: $target_dir"
        fi
        
        # Copy files from /common into the custom directory
        echo "  📥 Copying common files to $dir..."
        if ! download_files_from_github "common" "$target_dir" "$OVERWRITE_STANDARDS"; then
            echo "  ⚠️  Failed to copy common files to $dir (possibly due to rate limiting)"
        fi
        
        # Copy files from /templates/standards into the custom directory
        echo "  📥 Copying standards files to $dir..."
        if ! download_files_from_github "templates/standards" "$target_dir" "$OVERWRITE_STANDARDS"; then
            echo "  ⚠️  Failed to copy standards files to $dir (possibly due to rate limiting)"
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
echo "     curl -sSL https://raw.githubusercontent.com/buildermethods/agent-os/main/setup-claude-code.sh | bash"
echo ""
echo "   - Using Cursor? Install the Cursor commands with:"
echo "     curl -sSL https://raw.githubusercontent.com/buildermethods/agent-os/main/setup-cursor.sh | bash"
echo ""
echo "   - Using something else? See instructions at https://buildermethods.com/agent-os"
echo ""
echo "Learn more at https://buildermethods.com/agent-os"
echo ""
