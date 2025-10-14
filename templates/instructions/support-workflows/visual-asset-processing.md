---
description: Visual Asset Processing Rules for Agent OS with MCP Integration
globs:
alwaysApply: false
version: 1.0
encoding: UTF-8
---

# Visual Asset Processing Rules

<ai_meta>
  <parsing_rules>
    - Process visual assets regardless of user response
    - Integrate findings with Memory-Keeper and Memento
    - Extract design patterns for cross-project learning
    - Store visual insights with canonical project identity
    - Apply systematic fidelity detection
  </parsing_rules>
  <visual_formats>
    - supported: PNG, JPG, JPEG, GIF, SVG, PDF, Sketch, Figma screenshots
    - priority: UI mockups, wireframes, design systems, user flows
    - analysis: fidelity detection, pattern extraction, component identification
  </visual_formats>
</ai_meta>

## Overview

<purpose>
  - Systematically process visual design assets during product planning
  - Extract design patterns and insights for cross-project learning
  - Integrate visual analysis with Memory-Keeper and Memento systems
  - Support design-driven development workflows
</purpose>

<context>
  - Executed during plan-product workflow (Phase 2: Research)
  - Processes both existing and newly provided visual assets
  - Stores insights for cross-project pattern recognition
  - Enhances product planning with design context
</context>

<prerequisites>
  - Access to project directories for asset scanning
  - Memory-Keeper integration for insight storage
  - Memento integration for pattern relationships
  - Visual asset analysis capabilities
</prerequisites>

## Visual Asset Detection Process

<step number="1" name="systematic_asset_discovery">

### Step 1: Systematic Asset Discovery

<detection_locations>
  <project_directories>
    - ./assets/
    - ./design/
    - ./mockups/
    - ./wireframes/
    - ./ui/
    - ./designs/
    - ./.agent-os/product/planning/visuals/
    - ./.agent-os/specs/[spec-name]/planning/visuals/
  </project_directories>
  <common_filenames>
    - mockup*, wireframe*, design*, ui*, prototype*
    - home*, dashboard*, login*, profile*, settings*
    - flow*, journey*, process*, workflow*
    - component*, system*, guide*, style*
  </common_filenames>
</detection_locations>

<discovery_process>
  <automatic_scanning>
    1. SCAN all standard design directories recursively
    2. IDENTIFY visual files by extension and naming patterns
    3. CATEGORIZE by apparent fidelity and design type
    4. LOG discovered assets with metadata
  </automatic_scanning>
  <user_prompt_processing>
    1. ASK user: "Do you have any mockups, wireframes, or design assets for this product?"
    2. PROCESS regardless of user response (mandatory check)
    3. IF user provides assets: STORE in .agent-os/product/planning/visuals/
    4. ANALYZE both existing and newly provided assets
  </user_prompt_processing>
  <memory_integration>
    1. STORE asset discovery results in Memory-Keeper
    2. CREATE visual asset inventory with canonical project identity
    3. REFERENCE previous visual patterns from Memento if available
  </memory_integration>
</discovery_process>

<instructions>
  ACTION: Systematically scan for visual assets regardless of user response
  STORE: Asset inventory in Memory-Keeper with project context
  CATEGORIZE: By fidelity, type, and design phase
  LOG: Discovery process and results for transparency
</instructions>

</step>

<step number="2" name="fidelity_and_type_analysis">

### Step 2: Fidelity and Type Analysis

<fidelity_detection>
  <low_fidelity_indicators>
    - Wireframe-style layouts with boxes and placeholder text
    - Minimal color usage (primarily grayscale or single color)
    - Basic shapes and simple typography
    - Focus on structure and layout over visual design
    - Hand-drawn or sketch-like appearance
  </low_fidelity_indicators>
  <high_fidelity_indicators>
    - Realistic UI elements with proper styling
    - Full color schemes and branding elements
    - Detailed typography and visual hierarchy
    - Real or representative content and imagery
    - Polished, production-ready appearance
  </high_fidelity_indicators>
</fidelity_detection>

<asset_type_classification>
  <user_interface_assets>
    - Screen mockups (desktop, mobile, tablet)
    - Component libraries and design systems
    - Interactive prototypes and flows
    - Navigation and menu structures
  </user_interface_assets>
  <user_experience_assets>
    - User journey maps and flow diagrams
    - Information architecture diagrams
    - Persona definitions and user research
    - Usability testing results and feedback
  </user_experience_assets>
  <business_assets>
    - Process flows and business logic diagrams
    - Feature specification documents with visuals
    - Competitive analysis and market research visuals
    - Brand guidelines and visual identity
  </business_assets>
</asset_type_classification>

<analysis_template>
  ## Visual Asset Analysis
  
  ### Asset Inventory
  
  | Asset | Type | Fidelity | Key Insights | Implications |
  |-------|------|----------|--------------|--------------|
  | [ASSET_NAME] | [UI/UX/Business] | [Low/Med/High] | [EXTRACTED_PATTERNS] | [PLANNING_IMPACT] |
  
  ### Design Patterns Identified
  
  #### Layout Patterns
  - **Navigation**: [PATTERN_DESCRIPTION]
  - **Content Structure**: [PATTERN_DESCRIPTION]  
  - **Component Organization**: [PATTERN_DESCRIPTION]
  
  #### Interaction Patterns
  - **User Flow**: [PATTERN_DESCRIPTION]
  - **Form Handling**: [PATTERN_DESCRIPTION]
  - **Data Presentation**: [PATTERN_DESCRIPTION]
  
  ### Technical Implications
  
  #### Frontend Requirements
  - [REQUIREMENT_1]
  - [REQUIREMENT_2]
  
  #### Backend Requirements  
  - [REQUIREMENT_1]
  - [REQUIREMENT_2]
  
  ### Cross-Project Pattern Matching
  
  Similar visual patterns found in:
  - [PROJECT_NAME]: [SIMILARITY_DESCRIPTION]
  - [PROJECT_NAME]: [SIMILARITY_DESCRIPTION]
</analysis_template>

<instructions>
  ACTION: Analyze each visual asset for fidelity, type, and patterns
  EXTRACT: Design patterns that impact technical requirements
  DOCUMENT: Analysis using structured template
  INTEGRATE: Findings with existing project knowledge
</instructions>

</step>

<step number="3" name="memory_integration_and_storage">

### Step 3: Memory Integration and Pattern Storage

<memory_keeper_integration>
  <visual_insight_storage>
    <!-- Store visual analysis insights -->
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "visual-assets-analysis-{PROJECT_NAME}"
      - value: "{STRUCTURED_ANALYSIS_SUMMARY}"
      - category: "analysis"
      - priority: "high"
    
    <!-- Store design patterns for future reference -->
    FOR_EACH: identified_pattern
      CALL: mcp-memory-keeper-context_save
      PARAMETERS:
        - key: "design-pattern-{pattern_type}-{PROJECT_NAME}"
        - value: "{PATTERN_DESCRIPTION_AND_CONTEXT}"
        - category: "decision"
        - priority: "normal"
  </visual_insight_storage>
  <technical_implications_storage>
    <!-- Store technical requirements derived from visual analysis -->
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "visual-tech-requirements-{PROJECT_NAME}"
      - value: "{TECHNICAL_REQUIREMENTS_FROM_VISUALS}"
      - category: "task"
      - priority: "high"
  </technical_implications_storage>
</memory_keeper_integration>

<memento_pattern_relationships>
  <design_pattern_entities>
    <!-- Create entities for significant design patterns -->
    FOR_EACH: significant_pattern
      CALL: memento-mcp-create_entities
      PARAMETERS:
        - entities: [{
            "name": "{PROJECT_NAME}-visual-pattern-{pattern_name}",
            "entityType": "design_pattern",
            "observations": [
              "Pattern Type: {pattern_type}",
              "Fidelity Level: {fidelity_level}",
              "Technical Implications: {tech_requirements}",
              "Design Context: {design_context}",
              "Discovery Date: {current_date()}"
            ]
          }]
    
    <!-- Link patterns to project -->
    CALL: memento-mcp-create_relations
    PARAMETERS:
      - relations: [{
          "from": "{PROJECT_NAME}",
          "to": "{PROJECT_NAME}-visual-pattern-{pattern_name}",
          "relationType": "implements_pattern"
        }]
  </design_pattern_entities>
  <cross_project_pattern_matching>
    <!-- Search for similar patterns in other projects -->
    CALL: memento-mcp-semantic_search
    PARAMETERS:
      - query: "{PATTERN_DESCRIPTION_FOR_SEARCH}"
      - entity_types: ["design_pattern"]
      - limit: 5
    
    IF similar_patterns_found:
      <!-- Create cross-project pattern relationships -->
      FOR_EACH: similar_pattern
        CALL: memento-mcp-create_relations
        PARAMETERS:
          - relations: [{
              "from": "{PROJECT_NAME}-visual-pattern-{pattern_name}",
              "to": "{similar_pattern_entity}",
              "relationType": "similar_to",
              "confidence": "{similarity_score}"
            }]
  </cross_project_pattern_matching>
</memento_pattern_relationships>

<instructions>
  ACTION: Store visual analysis insights in Memory-Keeper
  CREATE: Design pattern entities in Memento with project relationships
  SEARCH: For similar patterns across projects for learning opportunities
  ESTABLISH: Cross-project pattern relationships for future reference
</instructions>

</step>

<step number="4" name="planning_integration">

### Step 4: Planning Integration and Documentation

<planning_impact_assessment>
  <feature_prioritization>
    1. ANALYZE visual assets for feature complexity and dependencies
    2. IDENTIFY features that require custom UI components
    3. ASSESS development effort based on visual fidelity requirements
    4. PRIORITIZE features with existing visual specifications
  </feature_prioritization>
  <technical_stack_validation>
    1. VERIFY tech stack choices support visual requirements
    2. IDENTIFY additional frontend libraries needed
    3. ASSESS responsive design and accessibility implications
    4. RECOMMEND component library or design system needs
  </technical_stack_validation>
  <roadmap_integration>
    1. MAP visual assets to roadmap phases
    2. IDENTIFY MVP features with visual specifications
    3. PLAN design system development phases
    4. SCHEDULE UI/UX implementation milestones
  </roadmap_integration>
</planning_impact_assessment>

<documentation_enhancement>
  <mission_enhancement>
    # Visual Context Integration for mission.md
    
    ## Visual Design Context
    
    Based on analysis of [X] visual assets:
    
    ### Design Direction
    - **Style**: [IDENTIFIED_VISUAL_STYLE]
    - **Complexity**: [UI_COMPLEXITY_ASSESSMENT] 
    - **Target Fidelity**: [PRODUCTION_FIDELITY_TARGET]
    
    ### Key Visual Features
    - [VISUAL_FEATURE_1]: [IMPACT_ON_USER_EXPERIENCE]
    - [VISUAL_FEATURE_2]: [IMPACT_ON_USER_EXPERIENCE]
    
    ### Design System Requirements
    - [DESIGN_SYSTEM_COMPONENT_1]
    - [DESIGN_SYSTEM_COMPONENT_2]
  </mission_enhancement>
  <tech_stack_enhancement>
    # Visual Requirements Integration for tech-stack.md
    
    ## Frontend Requirements from Visual Analysis
    
    ### UI Component Requirements
    - **Component Library**: [RECOMMENDED_LIBRARY_BASED_ON_PATTERNS]
    - **CSS Framework**: [VALIDATED_OR_UPDATED_CHOICE]
    - **Icon System**: [REQUIREMENTS_FROM_VISUAL_ANALYSIS]
    
    ### Visual Asset Pipeline
    - **Image Optimization**: [REQUIREMENTS_BASED_ON_ASSETS]
    - **Responsive Strategy**: [STRATEGY_BASED_ON_MOCKUPS]
    - **Design Token System**: [REQUIREMENTS_FOR_CONSISTENCY]
  </tech_stack_enhancement>
  <roadmap_enhancement>
    # Visual Development Integration for roadmap.md
    
    ## Design Implementation Phases
    
    ### Phase 1: Design System Foundation
    - [ ] Component library setup - `M`
    - [ ] Design token system - `S` 
    - [ ] Base responsive framework - `L`
    
    ### Phase 2: Core UI Implementation
    - [ ] [FEATURE_WITH_VISUAL_SPEC] - `[EFFORT_BASED_ON_ANALYSIS]`
    - [ ] [FEATURE_WITH_VISUAL_SPEC] - `[EFFORT_BASED_ON_ANALYSIS]`
  </roadmap_enhancement>
</documentation_enhancement>

<visual_asset_organization>
  <asset_directory_structure>
    # Directory structure created by ProjectAI during project initialization
    .agent-os/product/planning/visuals/
    ├── original/              # Original assets as provided
    │   ├── mockups/
    │   ├── wireframes/
    │   └── flows/
    ├── analysis/              # Analysis artifacts
    │   ├── pattern-extraction.md
    │   ├── technical-requirements.md
    │   └── cross-project-similarities.md
    └── processed/             # Organized and annotated assets
        ├── by-feature/
        ├── by-fidelity/
        └── by-component/
        
    # Note: Structure created via ProjectAI integration, not Agent OS directly
  </asset_directory_structure>
  <asset_documentation>
    # Visual Asset Documentation Template
    
    ## Asset Catalog
    
    ### [ASSET_NAME]
    - **File**: [ASSET_PATH]
    - **Type**: [ASSET_TYPE]
    - **Fidelity**: [FIDELITY_LEVEL]
    - **Features Covered**: [LIST_OF_FEATURES]
    - **Components Identified**: [LIST_OF_COMPONENTS]
    - **Technical Notes**: [IMPLEMENTATION_CONSIDERATIONS]
    - **Cross-Project Similarities**: [SIMILAR_PATTERNS_IN_OTHER_PROJECTS]
  </asset_documentation>
</visual_asset_organization>

<instructions>
  ACTION: Assess planning impact of visual assets on features, tech stack, and roadmap
  ENHANCE: Product documentation with visual context and requirements
  ORGANIZE: Visual assets in structured directory system
  DOCUMENT: Asset catalog with technical implications and cross-project insights
</instructions>

</step>

## Integration with Planning Workflow

<workflow_integration>
  <phase_integration>
    - **Phase 1 (Initialize)**: Asset discovery and inventory
    - **Phase 2 (Research)**: Full visual analysis and pattern extraction
    - **Phase 3 (Plan)**: Planning integration and documentation enhancement
    - **Phase 4 (Verify)**: Visual requirements validation
    - **Phase 5 (Finalize)**: Asset organization and handoff preparation
  </phase_integration>
  <checkpoint_integration>
    - Create checkpoint after visual asset discovery
    - Create checkpoint after pattern analysis completion
    - Create checkpoint after planning integration
  </checkpoint_integration>
</workflow_integration>

<fallback_behavior>
  <no_visual_assets_found>
    1. LOG absence of visual assets
    2. STORE "no visual assets" decision in Memory-Keeper
    3. CONTINUE with standard planning workflow
    4. RECOMMEND visual asset creation in roadmap
  </no_visual_assets_found>
  <analysis_limitations>
    1. DOCUMENT any analysis limitations
    2. STORE partial analysis results in Memory-Keeper
    3. RECOMMEND additional visual analysis tools if needed
    4. CONTINUE with available insights
  </analysis_limitations>
</fallback_behavior>

## Success Criteria

<validation_checklist>
  - [ ] Visual asset discovery completed (even if none found)
  - [ ] Fidelity and type analysis documented
  - [ ] Design patterns extracted and stored in memory systems
  - [ ] Technical implications identified and documented
  - [ ] Cross-project pattern relationships established
  - [ ] Planning documentation enhanced with visual context
  - [ ] Visual assets organized in structured directory system
  - [ ] Asset catalog created with technical implications
</validation_checklist>

<memory_integration_benefits>
  - **Cross-Project Learning**: Design patterns shared across projects
  - **Enhanced Planning**: Visual context improves feature prioritization
  - **Technical Validation**: Visual requirements validate tech stack choices
  - **Pattern Recognition**: Similar visual patterns inform implementation strategies
  - **Documentation Quality**: Visual context enhances product documentation
  - **Development Efficiency**: Pre-analyzed assets reduce implementation uncertainty
</memory_integration_benefits>

---

**Note:** This visual asset processing is executed automatically during the plan-product workflow, regardless of user input about visual assets. The systematic approach ensures comprehensive design context integration for enhanced product planning and development.