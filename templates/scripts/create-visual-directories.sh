#!/bin/bash

# Create Visual Asset Directory Structure for Agent OS
# This script creates the standardized visual asset directory structure
# Usage: bash reference-docs/scripts/create-visual-directories.sh

echo "🎨 Creating Agent OS visual asset directory structure..."

# Ensure we're in a project directory (contains .agent-os or can create it)
if [ ! -d ".agent-os" ]; then
    echo "Creating .agent-os directory..."
    mkdir -p .agent-os
fi

# Create product planning visual directories
echo "📁 Creating product planning visual directories..."
mkdir -p .agent-os/product/planning/visuals/{original/{mockups,wireframes,flows,components,branding},analysis,processed/{by-feature,by-fidelity,by-component,annotations}}

# Create .gitkeep files to preserve directory structure
echo "📝 Creating .gitkeep files..."
touch .agent-os/product/planning/visuals/.gitkeep
touch .agent-os/product/planning/visuals/original/.gitkeep
touch .agent-os/product/planning/visuals/original/mockups/.gitkeep
touch .agent-os/product/planning/visuals/original/wireframes/.gitkeep
touch .agent-os/product/planning/visuals/original/flows/.gitkeep
touch .agent-os/product/planning/visuals/original/components/.gitkeep
touch .agent-os/product/planning/visuals/original/branding/.gitkeep
touch .agent-os/product/planning/visuals/analysis/.gitkeep
touch .agent-os/product/planning/visuals/processed/.gitkeep
touch .agent-os/product/planning/visuals/processed/by-feature/.gitkeep
touch .agent-os/product/planning/visuals/processed/by-fidelity/.gitkeep
touch .agent-os/product/planning/visuals/processed/by-component/.gitkeep
touch .agent-os/product/planning/visuals/processed/annotations/.gitkeep

# Create README files for main directories
echo "📄 Creating README files..."

# Main visuals README
cat > .agent-os/product/planning/visuals/README.md << 'EOF'
# Product Visual Assets

This directory contains visual design assets for product planning and development.

## Directory Structure

- **original/**: Original visual assets as provided or discovered
  - `mockups/`: High-fidelity UI mockups and design screens  
  - `wireframes/`: Low-fidelity wireframes and layout sketches
  - `flows/`: User flows, journey maps, and process diagrams
  - `components/`: Individual component designs and patterns
  - `branding/`: Brand guidelines, logos, and visual identity assets

- **analysis/**: Agent OS generated analysis and insights
  - `pattern-extraction.md`: Design patterns extracted from assets
  - `technical-requirements.md`: Technical requirements derived from visuals
  - `fidelity-analysis.md`: Assessment of visual fidelity and complexity
  - `cross-project-similarities.md`: Similar patterns from other projects

- **processed/**: Organized and enhanced assets for development
  - `by-feature/`: Assets organized by product feature
  - `by-fidelity/`: Assets grouped by fidelity level
  - `by-component/`: Assets organized by UI component type
  - `annotations/`: Annotated versions with development notes

## Integration

This structure integrates with Agent OS MCP systems:
- **Memory-Keeper**: Stores analysis results and pattern insights
- **Memento**: Creates design pattern entities and relationships
- **Meilisearch**: Caches visual documentation and analysis
- **Phase Checkpoints**: Enables recovery and resume for visual processing

## Automatic Processing

Agent OS will automatically:
1. Scan for visual assets in common project locations
2. Analyze fidelity, patterns, and technical requirements
3. Generate cross-project pattern comparisons
4. Create processed versions organized for development use
EOF

# Original assets README
cat > .agent-os/product/planning/visuals/original/README.md << 'EOF'
# Original Visual Assets

This directory contains the original visual assets as provided or discovered during project scanning.

## Asset Organization

- **mockups/**: High-fidelity designs showing final visual appearance
- **wireframes/**: Low-fidelity structural layouts and information architecture  
- **flows/**: User flows, journey maps, and interaction sequences
- **components/**: Individual UI components and design system elements
- **branding/**: Brand assets including logos, colors, typography, and guidelines

## File Naming Conventions

Use descriptive names that indicate:
- Asset type (e.g., `homepage-mockup.png`, `login-wireframe.pdf`)
- Screen or feature (e.g., `dashboard-overview.jpg`, `user-profile-flow.svg`)
- Fidelity level (e.g., `checkout-wireframe-v1.png`, `checkout-mockup-final.png`)

## Supported Formats

Agent OS can process these visual formats:
- Images: PNG, JPG, JPEG, GIF, SVG
- Documents: PDF, Sketch exports, Figma screenshots
- Interactive: HTML prototypes, clickable demos

## Processing

Original assets are preserved unchanged. Agent OS creates analyzed and processed versions in the `../analysis/` and `../processed/` directories.
EOF

# Analysis README
cat > .agent-os/product/planning/visuals/analysis/README.md << 'EOF'
# Visual Asset Analysis

This directory contains Agent OS generated analysis of visual assets.

## Generated Files

- **pattern-extraction.md**: Design patterns and components identified in assets
- **technical-requirements.md**: Technical implementation requirements derived from visuals
- **fidelity-analysis.md**: Assessment of visual complexity and development effort
- **cross-project-similarities.md**: Similar design patterns from other Agent OS projects

## Analysis Process

Agent OS automatically:
1. **Fidelity Detection**: Determines if assets are wireframes, mockups, or high-fidelity designs
2. **Pattern Recognition**: Identifies UI patterns, components, and design system elements
3. **Technical Analysis**: Extracts frontend/backend requirements from visual specifications  
4. **Cross-Project Learning**: Finds similar patterns in other projects for insights and reuse
5. **Integration Assessment**: Evaluates how visuals align with chosen technology stack

## MCP Integration

Analysis results are stored in:
- **Memory-Keeper**: For session continuity and progress tracking
- **Memento**: For cross-project pattern relationships and learning
- **Meilisearch**: For searchable visual documentation and insights

## Usage

These analysis files inform:
- Technical stack validation and requirements
- Feature complexity assessment and effort estimation  
- Design system and component library planning
- Cross-project pattern reuse and best practices
EOF

# Processed README
cat > .agent-os/product/planning/visuals/processed/README.md << 'EOF'
# Processed Visual Assets

This directory contains organized and enhanced versions of visual assets for development use.

## Organization Structure

- **by-feature/**: Assets grouped by product feature or user story
- **by-fidelity/**: Assets separated by complexity level (wireframes, mockups, high-fidelity)
- **by-component/**: Assets organized by UI component type (navigation, forms, dashboards, etc.)  
- **annotations/**: Enhanced versions with development notes and technical specifications

## Processing Enhancements

Agent OS creates processed versions that include:
- **Technical Annotations**: Implementation notes, component specifications, API requirements
- **Cross-References**: Links to similar patterns in other projects and proven solutions
- **Development Ready**: Organized for easy reference during feature development
- **Pattern Matching**: Identified reusable components and design system elements

## Development Integration

Processed assets support:
- **Feature Development**: Quick visual reference during `/create-spec` and `/execute-tasks`
- **Component Libraries**: Identification of reusable UI components and patterns
- **Technical Validation**: Visual requirements alignment with chosen technology stack
- **Cross-Project Insights**: Leverage proven patterns and solutions from similar projects

## Automatic Updates

As original assets are added or updated, Agent OS will automatically:
1. Re-analyze and update technical requirements
2. Refresh cross-project pattern matching
3. Update processed versions with new insights
4. Maintain consistency across all processed variations
EOF

# Create specs visual template structure (for future specs)
echo "📁 Creating specs visual template structure..."
mkdir -p .agent-os/specs/template/planning/visuals/{original,analysis,processed}
touch .agent-os/specs/template/planning/visuals/.gitkeep
touch .agent-os/specs/template/planning/visuals/original/.gitkeep
touch .agent-os/specs/template/planning/visuals/analysis/.gitkeep
touch .agent-os/specs/template/planning/visuals/processed/.gitkeep

# Create specs visual template README
cat > .agent-os/specs/template/planning/visuals/README.md << 'EOF'
# Spec-Specific Visual Assets

This directory structure is created for each individual feature specification to contain visual assets specific to that feature.

## Usage

When creating a new spec, this template structure is copied to:
`.agent-os/specs/[spec-name]/planning/visuals/`

## Organization

- **original/**: Visual assets specific to this feature specification
- **analysis/**: Agent OS analysis of assets related to this specific feature  
- **processed/**: Processed versions organized for this feature's development

## Integration with Product Visuals

Spec-specific visuals complement the main product visuals in:
`.agent-os/product/planning/visuals/`

## Automatic Processing

Agent OS will process spec-specific visuals alongside product-wide assets to ensure:
- Consistent pattern recognition across all project visuals
- Cross-feature component identification and reuse
- Comprehensive technical requirements analysis
- Integrated design system development
EOF

echo "✅ Visual asset directory structure created successfully!"
echo ""
echo "📁 Directory structure created in:"
echo "   .agent-os/product/planning/visuals/"
echo "   .agent-os/specs/template/planning/visuals/"
echo ""
echo "🎯 Next steps:"
echo "1. Add visual assets to .agent-os/product/planning/visuals/original/"
echo "2. Run /plan-product to automatically process and analyze assets"
echo "3. Use processed assets during feature development with /create-spec"
echo ""
echo "💡 The visual asset processing system will automatically:"
echo "   - Scan for existing assets in common project locations"
echo "   - Analyze patterns and extract technical requirements"  
echo "   - Create cross-project pattern relationships"
echo "   - Generate development-ready processed versions"