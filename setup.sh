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

# Create template directory structure first
create_template_structure
BASE_URL="https://raw.githubusercontent.com/jdelon02/agent-os/main"

# Create base directory structure from templates
echo "📁 Creating directory structure from templates..."

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

    # Create project directories based on template structure
    for template_dir in standards instructions commands claude-code github_template vscode_template; do
        if curl --output /dev/null --silent --head --fail "${BASE_URL}/templates/${template_dir}"; then
            mkdir -p "${project_dir}/${template_dir}"
            echo "  ✓ Created directory: ${project_name}/${template_dir}"
            
            # Copy template files for this directory
            for template_file in $(curl -s "${BASE_URL}/templates/${template_dir}/" | grep -o '"[^"]*\.md"' | tr -d '"'); do
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
    
    if [ -n "$projects" ]; then
        IFS=',' read -r -a project_names <<< "$projects"
        for project in "${project_names[@]}"; do
            project=$(echo $project | xargs)
            echo "Creating project structure for: $project"
            create_template_structure "$project"
        done
    fi

    # Create directories and files if specified
    if [ -n "$dirs" ]; then
        IFS=',' read -r -A dir_names <<< "$dirs"
        for dir in "${dir_names[@]}"; do
            dir=$(echo $dir | xargs)
            target_dir="$HOME/.agent-os/$dir"
            
            if [ -d "$target_dir" ]; then
                echo "  ⚠️  Directory '$dir' already exists. Skipping creation."
            else
                mkdir -p "$target_dir"
                echo "  ✓ Created directory: $target_dir"
            fi

            if [ -n "$files" ]; then
                IFS=',' read -r -A file_names <<< "$files"
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
                        esac
                    fi
                done
            fi
        done
        echo ""
        echo "✅ Project directories and files created successfully!"
    fi
}

# Call the function with CLI arguments
create_project_directories "$CUSTOM_DIRS" "$CUSTOM_FILES" "$PROJECT_TYPE"

# Option A: Interactive prompt for custom directories and files
echo ""
echo "Would you like to create custom default directories in ~/.agent-os? (y/n)"
read create_dirs
if [[ "$create_dirs" =~ ^[Yy]$ ]]; then
  echo "Enter default directory names (comma-separated, e.g., projects,logs,configs):"
  read dir_input
  IFS=',' read -r -a dir_names <<< "$dir_input"
  for dir in "${dir_names[@]}"; do
    dir=$(echo $dir | xargs) # trim whitespace
    target_dir="$HOME/.agent-os/$dir"
    if [ -d "$target_dir" ]; then
      echo "  ⚠️  Directory '$dir' already exists. Skipping creation."
    else
      mkdir -p "$target_dir"
      echo "  ✓ Created directory: $target_dir"
    fi
    echo "    Enter default files for '$dir' (comma-separated, e.g., README.md,config.json,.gitkeep):"
    read file_input
    IFS=',' read -r -a file_names <<< "$file_input"
    for file in "${file_names[@]}"; do
      file=$(echo $file | xargs) # trim whitespace
      file_path="$target_dir/$file"
      if [ -e "$file_path" ]; then
        echo "      ⚠️  File '$file' already exists in '$dir'. Skipping."
      else
        touch "$file_path"
        echo "      ✓ Created file: $file_path"
      fi
    done
  done
  echo ""
  echo "✅ Custom directories and files created in ~/.agent-os."
fi

# Download standards files
echo ""
echo "📥 Downloading standards files to ~/.agent-os/standards/"

# tech-stack.md
if [ -f "$HOME/.agent-os/standards/tech-stack.md" ] && [ "$OVERWRITE_STANDARDS" = false ]; then
    echo "  ⚠️  ~/.agent-os/standards/tech-stack.md already exists - skipping"
else
    curl -s -o "$HOME/.agent-os/standards/tech-stack.md" "${BASE_URL}/standards/tech-stack.md"
    if [ -f "$HOME/.agent-os/standards/tech-stack.md" ] && [ "$OVERWRITE_STANDARDS" = true ]; then
        echo "  ✓ ~/.agent-os/standards/tech-stack.md (overwritten)"
    else
        echo "  ✓ ~/.agent-os/standards/tech-stack.md"
    fi
fi

# code-style.md
if [ -f "$HOME/.agent-os/standards/code-style.md" ] && [ "$OVERWRITE_STANDARDS" = false ]; then
    echo "  ⚠️  ~/.agent-os/standards/code-style.md already exists - skipping"
else
    curl -s -o "$HOME/.agent-os/standards/code-style.md" "${BASE_URL}/standards/code-style.md"
    if [ -f "$HOME/.agent-os/standards/code-style.md" ] && [ "$OVERWRITE_STANDARDS" = true ]; then
        echo "  ✓ ~/.agent-os/standards/code-style.md (overwritten)"
    else
        echo "  ✓ ~/.agent-os/standards/code-style.md"
    fi
fi

# best-practices.md
if [ -f "$HOME/.agent-os/standards/best-practices.md" ] && [ "$OVERWRITE_STANDARDS" = false ]; then
    echo "  ⚠️  ~/.agent-os/standards/best-practices.md already exists - skipping"
else
    curl -s -o "$HOME/.agent-os/standards/best-practices.md" "${BASE_URL}/standards/best-practices.md"
    if [ -f "$HOME/.agent-os/standards/best-practices.md" ] && [ "$OVERWRITE_STANDARDS" = true ]; then
        echo "  ✓ ~/.agent-os/standards/best-practices.md (overwritten)"
    else
        echo "  ✓ ~/.agent-os/standards/best-practices.md"
    fi
fi

# Download instruction files
echo ""
echo "📥 Downloading instruction files to ~/.agent-os/instructions/"

# plan-product.md
if [ -f "$HOME/.agent-os/instructions/plan-product.md" ] && [ "$OVERWRITE_INSTRUCTIONS" = false ]; then
    echo "  ⚠️  ~/.agent-os/instructions/plan-product.md already exists - skipping"
else
    curl -s -o "$HOME/.agent-os/instructions/plan-product.md" "${BASE_URL}/instructions/plan-product.md"
    if [ -f "$HOME/.agent-os/instructions/plan-product.md" ] && [ "$OVERWRITE_INSTRUCTIONS" = true ]; then
        echo "  ✓ ~/.agent-os/instructions/plan-product.md (overwritten)"
    else
        echo "  ✓ ~/.agent-os/instructions/plan-product.md"
    fi
fi

# create-spec.md
if [ -f "$HOME/.agent-os/instructions/create-spec.md" ] && [ "$OVERWRITE_INSTRUCTIONS" = false ]; then
  echo "  ⚠️  ~/.agent-os/instructions/create-spec.md already exists - skipping"
else
  curl -s -o "$HOME/.agent-os/instructions/create-spec.md" "${BASE_URL}/instructions/create-spec.md"
  if [ -f "$HOME/.agent-os/instructions/create-spec.md" ] && [ "$OVERWRITE_INSTRUCTIONS" = true ]; then
    echo "  ✓ ~/.agent-os/instructions/create-spec.md (overwritten)"
  else
    echo "  ✓ ~/.agent-os/instructions/create-spec.md"
  fi
fi

# execute-tasks.md
if [ -f "$HOME/.agent-os/instructions/execute-tasks.md" ] && [ "$OVERWRITE_INSTRUCTIONS" = false ]; then
    echo "  ⚠️  ~/.agent-os/instructions/execute-tasks.md already exists - skipping"
else
    curl -s -o "$HOME/.agent-os/instructions/execute-tasks.md" "${BASE_URL}/instructions/execute-tasks.md"
    if [ -f "$HOME/.agent-os/instructions/execute-tasks.md" ] && [ "$OVERWRITE_INSTRUCTIONS" = true ]; then
        echo "  ✓ ~/.agent-os/instructions/execute-tasks.md (overwritten)"
    else
        echo "  ✓ ~/.agent-os/instructions/execute-tasks.md"
    fi
fi

# analyze-product.md
if [ -f "$HOME/.agent-os/instructions/analyze-product.md" ] && [ "$OVERWRITE_INSTRUCTIONS" = false ]; then
    echo "  ⚠️  ~/.agent-os/instructions/analyze-product.md already exists - skipping"
else
    curl -s -o "$HOME/.agent-os/instructions/analyze-product.md" "${BASE_URL}/instructions/analyze-product.md"
    if [ -f "$HOME/.agent-os/instructions/analyze-product.md" ] && [ "$OVERWRITE_INSTRUCTIONS" = true ]; then
        echo "  ✓ ~/.agent-os/instructions/analyze-product.md (overwritten)"
    else
        echo "  ✓ ~/.agent-os/instructions/analyze-product.md"
    fi
fi

echo ""
echo "✅ Agent OS base installation complete!"
echo ""
echo "📍 Files installed to:"
echo "   ~/.agent-os/standards/     - Your development standards"
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
echo "1. Customize your coding standards in ~/.agent-os/standards/"
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
