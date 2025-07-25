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

# Function to create directory structure and copy template files
create_template_structure() {
    local base_dir="$HOME/.agent-os"
    local project_name="$1"
    
    if [ -z "$project_name" ]; then
        echo "⚠️  No project name specified"
        return 1
    fi

    local project_dir="${base_dir}/${project_name}"
    echo "📁 Creating project structure for ${project_name}..."

    # Dynamically get template directories from GitHub
    local template_dirs
    template_dirs=$(curl -s "${API_URL}/templates" | jq -r '.[] | select(.type == "dir") | .name' 2>/dev/null) || {
        # Fallback if jq is not available
        template_dirs=$(curl -s "${API_URL}/templates" | grep -A1 '"type": "dir"' | grep '"name":' | cut -d'"' -f4) || {
            echo "  ❌ Error: Unable to fetch template directory list"
            return 1
        }
    }

    # Create project directories based on template structure
    for template_dir in $template_dirs; do
        if curl --output /dev/null --silent --head --fail "${API_URL}/templates/${template_dir}"; then
            mkdir -p "${project_dir}/${template_dir}"
            echo "  ✓ Created directory: ${project_name}/${template_dir}"
            
            # Copy template files for this directory
            for template_file in $(curl -s "${API_URL}/templates/${template_dir}" | jq -r '.[] | select(.type == "file") | .name | select(test("\\.md$"))' 2>/dev/null || curl -s "${API_URL}/templates/${template_dir}" | grep -A1 '"type": "file"' | grep '"name":' | cut -d'"' -f4 | grep '\.md$'); do
                local target_file="${project_dir}/${template_dir}/${template_file}"
                if [ -f "$target_file" ] && [ "$OVERWRITE_STANDARDS" = false ]; then
                    echo "    ⚠️  ${template_file} already exists - skipping"
                else
                    curl -s -o "$target_file" "${BASE_URL}/templates/${template_dir}/${template_file}"
                    if [ -f "$target_file" ]; then
                        echo "    ✓ Created ${project_name}/${template_dir}/${template_file}"
                    fi
                fi
            done
        fi
    done
}

# Option B: Configuration-based directory creation
create_project_directories() {
    local projects="$1"
    local files="$2"
    
    echo "DEBUG: Function parameters:"
    echo "  projects=$projects"
    echo "  files=$files"
    echo "  CUSTOM_DIRS=$CUSTOM_DIRS"
    echo "  CUSTOM_FILES=$CUSTOM_FILES"
    
    if [ -n "$projects" ]; then
        echo "DEBUG: Processing projects parameter"
        IFS=',' read -r -a project_names <<< "$projects"
        echo "DEBUG: Project names array: ${project_names[*]}"
        for project in "${project_names[@]}"; do
            project=$(echo $project | xargs)
            echo "Creating project structure for: $project"
            create_template_structure "$project"
        done
    else
        echo "DEBUG: No projects parameter provided"
    fi

    # Create directories and files if specified
    if [ -n "$CUSTOM_DIRS" ]; then
        echo "DEBUG: Processing CUSTOM_DIRS"
        IFS=',' read -r -a dir_names <<< "$CUSTOM_DIRS"
        for dir in "${dir_names[@]}"; do
            dir=$(echo $dir | xargs)
            target_dir="$HOME/.agent-os/$dir"
            
            if [ -d "$target_dir" ]; then
                echo "  ⚠️  Directory '$dir' already exists. Skipping creation."
            else
                mkdir -p "$target_dir"
                echo "  ✓ Created directory: $target_dir"
            fi

            if [ -n "$CUSTOM_FILES" ]; then
                IFS=',' read -r -a file_names <<< "$CUSTOM_FILES"
                for file in "${file_names[@]}"; do
                    file=$(echo $file | xargs)
                    file_path="$target_dir/$file"
                    
                    if [ -e "$file_path" ]; then
                        echo "    ⚠️  File '$file' already exists in '$dir'. Skipping."
                    else
                        # Check if file exists in templates folder
                        template_path="${BASE_URL}/templates"
                        if curl --output /dev/null --silent --head --fail "$template_path/$file"; then
                            curl -s -o "$file_path" "$template_path/$file"
                            echo "    ✓ Downloaded $file from templates"
                        else
                            echo "    ⚠️  No template found for $file - skipping"
                        fi
                    fi
                done
            fi
        done
        echo ""
        echo "✅ Project directories and files created successfully!"
    fi
}

# Debug values before function calls
echo "DEBUG: Before function calls:"
echo "  CUSTOM_DIRS=$CUSTOM_DIRS"
echo "  CUSTOM_FILES=$CUSTOM_FILES"
echo "  PROJECT_TYPE=$PROJECT_TYPE"

# Create initial template structure
if [ -z "$CUSTOM_DIRS" ]; then
    echo "DEBUG: No CUSTOM_DIRS set, creating base template structure"
    create_template_structure "base"
else
    echo "DEBUG: CUSTOM_DIRS is set, skipping base template structure"
fi

# Call the function with CLI arguments
echo "DEBUG: Calling create_project_directories with arguments:"
echo "  \$1=$CUSTOM_DIRS"
echo "  \$2=$CUSTOM_FILES"
echo "  \$3=$PROJECT_TYPE"
create_project_directories "$CUSTOM_DIRS" "$CUSTOM_FILES" "$PROJECT_TYPE"

# Function to download template files for a directory
download_template_files() {
    local source_dir="$1"
    local target_dir="$2"
    local overwrite_flag="$3"
    
    echo "📥 Downloading files from ${source_dir} to ${target_dir}"
    echo "DEBUG: source_dir=$source_dir, target_dir=$target_dir, overwrite_flag=$overwrite_flag"
    mkdir -p "$target_dir"
    
    # Get list of files in the directory
    local files
    echo "DEBUG: Fetching file list from ${API_URL}/${source_dir}"
    if ! files=$(curl -s "${API_URL}/${source_dir}" | jq -r '.[] | select(.type == "file") | .name | select(test("\\.(md|json|yaml|yml)$"))' 2>/dev/null); then
        # Fallback if jq is not available
        if ! files=$(curl -s "${API_URL}/${source_dir}" | grep -A1 '"type": "file"' | grep '"name":' | cut -d'"' -f4 | grep '\.\(md\|json\|yaml\|yml\)$'); then
            echo "  ⚠️  Unable to list files in ${source_dir}"
            echo "DEBUG: curl command failed or no files found"
            return 1
        fi
    fi
    
    echo "DEBUG: Found files: $files"
    
    if [ -z "$files" ]; then
        echo "  ⚠️  No files found in ${source_dir}"
        return 1
    fi
    
    for file in $files; do
        local target_file="${target_dir}/${file}"
        echo "DEBUG: Processing file: $file -> $target_file"
        if [ -f "$target_file" ] && [ "$overwrite_flag" = false ]; then
            echo "  ⚠️  ${file} already exists - skipping"
        else
            echo "DEBUG: Downloading from ${BASE_URL}/${source_dir}/${file}"
            if curl -s -o "$target_file" "${BASE_URL}/${source_dir}/${file}"; then
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
                echo "  ⚠️  Failed to download ${file}"
                rm -f "$target_file"
            fi
        fi
    done
}

# Download template files from GitHub
echo ""
echo "🔄 Synchronizing template files from GitHub..."

# Get list of template directories
template_dirs=$(curl -s "${API_URL}/templates" | jq -r '.[] | select(.type == "dir") | .name' 2>/dev/null) || {
    # Fallback if jq is not available
    template_dirs=$(curl -s "${API_URL}/templates" | grep -A1 '"type": "dir"' | grep '"name":' | cut -d'"' -f4) || {
        echo "❌ Error: Unable to fetch template directory list"
        exit 1
    }
}

echo "DEBUG: Found template directories: $template_dirs"

# Process each template directory
for dir in $template_dirs; do
    target_dir="$HOME/.agent-os/templates/${dir}"
    echo "DEBUG: Processing directory: $dir -> $target_dir"
    download_template_files "templates/${dir}" "$target_dir" "$OVERWRITE_STANDARDS"
done

# Also create instruction files in the root instructions directory for backward compatibility
echo ""
echo "📥 Creating instruction files in ~/.agent-os/instructions/"
mkdir -p "$HOME/.agent-os/instructions"
download_template_files "templates/instructions" "$HOME/.agent-os/instructions" "$OVERWRITE_INSTRUCTIONS"

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
