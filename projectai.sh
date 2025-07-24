#!/bin/bash

# projectai.sh
# Description: Main script for project AI operations
# Created: July 24, 2025
# Usage: projectai <project_type>

# Exit on error
set -e

# Check if we have the required arguments
if [ "$#" -ne 1 ]; then
    echo "Error: Missing project type argument"
    echo "Usage: projectai <project_type>"
    exit 1
fi

# Set variables
PROJECT_TYPE="$1"
FULL_PATH="$(pwd)"
DIRECTORY=$(basename "$FULL_PATH")

# Base URL for raw GitHub content
BASE_URL="https://raw.githubusercontent.com/jdelon02/agent-os/main"

# Function to handle errors gracefully
handle_error() {
    local error_message="$1"
    echo "❌ Error: $error_message"
    return 1
}

# Function to check if curl request succeeded
check_curl() {
    local url="$1"
    local description="$2"
    if ! curl --output /dev/null --silent --head --fail "$url"; then
        handle_error "Unable to access $description at $url"
        return 1
    fi
    return 0
}

# Function to copy templates and perform replacements
copy_and_replace() {
    echo "🚀 Fetching project templates from GitHub..."
    
    # Create temporary directory for downloads
    local temp_dir=$(mktemp -d) || {
        handle_error "Failed to create temporary directory"
        return 1
    }
    trap 'rm -rf "$temp_dir"' EXIT
    
    # Check GitHub connectivity first
    if ! check_curl "${BASE_URL}" "GitHub repository"; then
        handle_error "Cannot connect to GitHub. Please check your internet connection"
        return 1
    }
    
    # Dynamically fetch list of directories from GitHub
    echo "📂 Fetching template directory structure..."
    local template_dirs
    template_dirs=($(curl -s --fail "${BASE_URL}/project_templates/" 2>/dev/null | grep -o 'href="[^"]*/"' | cut -d'"' -f2 | sed 's#/$##')) || {
        handle_error "Failed to fetch template directory structure"
        return 1
    }
    
    if [ ${#template_dirs[@]} -eq 0 ]; then
        handle_error "No template directories found at ${BASE_URL}/project_templates/"
        return 1
    fi
    
    echo "✓ Found ${#template_dirs[@]} template directories"
    local success_count=0
    local error_count=0
    
    for template_dir in "${template_dirs[@]}"; do
        echo "📁 Processing ${template_dir}..."
        local target_dir="$FULL_PATH/${template_dir}"
        
        # Check if directory already exists
        if [ -d "$target_dir" ]; then
            echo "  ⚠️  Directory ${template_dir} already exists, skipping..."
            continue
        fi
        
        # Create directory with error checking
        if ! mkdir -p "$target_dir"; then
            echo "  ⚠️  Failed to create directory ${template_dir}, skipping..."
            ((error_count++))
            continue
        fi
        
        # Attempt to fetch and process template files
        if check_curl "${BASE_URL}/project_templates/${template_dir}/" "template directory ${template_dir}"; then
            local files
            # Look for both .md files and other file types
            files=$(curl -s "${BASE_URL}/project_templates/${template_dir}/" 2>/dev/null | grep -o '"[^"]*\.\(md\|code-workspace\|json\|yaml\|yml\)"' | tr -d '"') || {
                echo "  ⚠️  Failed to list files in ${template_dir}, skipping..."
                ((error_count++))
                continue
            }
            
            local file_success=0
            for template_file in $files; do
                # Handle .code-workspace file specially
                local target_file="$template_file"
                local target_path="${target_dir}/${target_file}"
                
                if [[ "$template_file" == "template.code-workspace" ]]; then
                    # Keep the file in .vscode directory but rename it
                    target_file="${DIRECTORY}.code-workspace"
                    target_path="${FULL_PATH}/.vscode/${target_file}"
                    
                    # Ensure .vscode directory exists
                    mkdir -p "${FULL_PATH}/.vscode"
                fi
                
                echo "  ⬇️  Downloading ${template_file}..."
                if curl -s --fail -o "$target_path" "${BASE_URL}/project_templates/${template_dir}/${template_file}" 2>/dev/null; then
                    if [ -f "$target_path" ]; then
                        if sed -i '' \
                            -e "s/<PROJECTTYPE>/$PROJECT_TYPE/g" \
                            -e "s/<DIRECTORY_NAME>/$DIRECTORY/g" \
                            "$target_path" 2>/dev/null; then
                            echo "    ✓ Created and customized ${target_file}"
                            ((file_success++))
                        else
                            echo "    ⚠️  Failed to customize ${target_file}"
                            rm -f "$target_path"
                        fi
                    fi
                else
                    echo "    ⚠️  Failed to download ${template_file}"
                fi
            done
            
            if [ $file_success -gt 0 ]; then
                ((success_count++))
            else
                ((error_count++))
                rm -rf "$target_dir"
            fi
        else
            echo "  ⚠️  Failed to access ${template_dir}, skipping..."
            rm -rf "$target_dir"
            ((error_count++))
        fi
    done
    
    echo "🔄 Cleaning up temporary files..."
    echo "📊 Summary: $success_count directories processed successfully, $error_count failed"
    
    # Return success if at least some directories were processed
    [ $success_count -gt 0 ]
}

# Main script logic
main() {
    echo "Project AI initialization..."
    echo "Project Type: $PROJECT_TYPE"
    echo "Directory Name: $DIRECTORY"
    echo "Full Path: $FULL_PATH"
    
    # Execute the copy and replace function
    if copy_and_replace; then
        echo "✨ Project initialization complete!"
        echo "Template files have been copied and customized."
        return 0
    else
        echo "⚠️  Project initialization completed with some errors."
        echo "Please check the logs above for details."
        return 1
    fi
}

# Execute main function
main "$@"
