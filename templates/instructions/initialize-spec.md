---
description: Phase 1 - Project Initialization and Scope Definition
globs:
alwaysApply: false
version: 1.0
encoding: UTF-8
---

# Phase 1: Project Initialization and Scope Definition

## ⚠️ IMMEDIATE ACTION REQUIRED ⚠️

**STOP**: Before proceeding with Phase 1, you MUST activate MCP workflow systems:

1. **ACTIVATE TOOLS**: `activate_context_management_tools`, `activate_memento_management_tools`, `activate_meilisearch_management_tools`
2. **RESOLVE PROJECT IDENTITY**: Execute universal namespace consolidation (Step 0 below)
3. **START SESSION**: Initialize Memory-Keeper session with this project directory
4. **CHECK CACHE FIRST**: Query Meilisearch for cached documentation before Context7
5. **CREATE ENTITIES**: Store project and technology entities in Memento knowledge graph using canonical names
6. **VALIDATE CONFIDENCE**: Ensure trust score ≥ 8.0 before proceeding

**Any Phase 1 work without completing these 6 steps is INVALID and must be restarted.**

## 🔧 MANDATORY MCP WORKFLOW INITIALIZATION

<include>@reference-docs/instructions/support-workflows/mandatory-mcp-initialization.md</include>

**All subsequent Phase 1 operations MUST use PROJECT_ENTITY_NAME exclusively.**

<ai_meta>
  <parsing_rules>
    - Initialize memory systems first
    - Process XML blocks for structured data
    - Execute instructions sequentially
    - Store project context in memory systems
    - Define clear project boundaries and scope
  </parsing_rules>
  <file_conventions>
    - encoding: UTF-8
    - line_endings: LF
    - indent: 2 spaces
    - markdown_headers: no indentation
  </file_conventions>
</ai_meta>

## Overview

<purpose>
  - Capture and structure initial project ideas
  - Define project scope and boundaries
  - Initialize MCP memory systems for project context
  - Set up structured handoff to Phase 2 (Research)
</purpose>

<context>
  - First phase of 5-phase specification workflow
  - Transforms raw ideas into structured project foundation
  - Enhanced with MCP intelligence for cross-project learning
  - Prepares context for detailed requirements gathering
</context>

<prerequisites>
  - Write access to project directory
  - MCP memory systems available (Memory-Keeper, Memento)
  - Basic understanding of project goals
</prerequisites>

<process_flow>

<step number="0" name="memory_and_precedence_initialization">

### Step 0: Initialize Memory Systems and Project Context

<memory_precedence_initialization>
  <!-- Use centralized Memory Systems and Precedence Initialization workflow -->
  <include>@reference-docs/instructions/memory-precedence-initialization.md</include>
  
  # Execute centralized initialization with initialize-spec specific parameters
  EXECUTE: memory_precedence_initialization_workflow()
  PARAMETERS:
    - command_name: "initialize-spec"
    - memory_requirements: "REQUIRED"  # Memory critical for project initialization
    - override_categories: ["project_scope", "initial_requirements", "project_constraints"]
    - session_description: "Agent OS Phase 1: Project Initialization"
    - fallback_behavior: "ERROR_IF_UNAVAILABLE"
  
  # Access standardized initialization results
  PROJECT_NAME = DETECTION_CONTEXT["project_name"]
  PROJECT_ENTITY_NAME = DETECTION_CONTEXT["project_entity_name"]
  PRIMARY_TECH = DETECTION_CONTEXT["primary_tech"]
  TECH_STACKS = DETECTION_CONTEXT["tech_stacks"]
  CONFIDENCE_LEVEL = DETECTION_CONTEXT["confidence_level"]
  PROJECT_OVERRIDES = initialization_result.project_overrides
  
  # Log initialization completion
  LOG: "🚀 Phase 1 initialization complete - project foundation ready"
  LOG: "🏷️ Project: {PROJECT_NAME} → {PROJECT_ENTITY_NAME}"
</memory_precedence_initialization>

</step>

<step number="1" name="capture_initial_idea">

### Step 1: Capture Initial Project Idea

<step_metadata>
  <action>structure raw project concept</action>
  <purpose>transform idea into workable project foundation</purpose>
  <memory_integration>store initial context for continuity</memory_integration>
</step_metadata>

<idea_capture>
  <project_vision>
    - What problem does this project solve?
    - Who are the target users?
    - What is the core value proposition?
    - What inspired this project idea?
  </project_vision>
  
  <initial_scope>
    - What are the primary features needed?
    - What are the boundaries (what's NOT included)?
    - Are there any existing solutions to compare against?
    - What's the rough timeline expectation?
  </initial_scope>
  
  <constraints_and_context>
    - Technical constraints (platforms, technologies)
    - Resource constraints (time, budget, team)
    - Business constraints (compliance, policies)
    - Integration requirements (existing systems)
  </constraints_and_context>
</idea_capture>

<memory_storage>
  # Store initial project context
  CALL: mcp-memory-keeper-context_save
  PARAMETERS:
    - key: "project-vision"
    - value: "{structured_vision_summary}"
    - category: "progress"
    - priority: "high"
  
  CALL: mcp-memory-keeper-context_save
  PARAMETERS:
    - key: "initial-scope"
    - value: "{structured_scope_summary}"
    - category: "progress"
    - priority: "high"
  
  # Store in long-term memory for cross-project learning
  CALL: memento-mcp-create_entities
  PARAMETERS:
    - entities: [{
        "name": "{PROJECT_ENTITY_NAME}",
        "entityType": "project",
        "observations": [
          "Vision: {vision_one_liner}",
          "Primary Tech: {PRIMARY_TECH}",
          "Target Users: {target_users}",
          "Core Problem: {core_problem}",
          "Initialization Date: {current_date()}"
        ]
      }]
</memory_storage>

</step>

<step number="1.5" name="legacy_specification_discovery_and_consolidation">

### Step 1.5: Legacy Specification Discovery and Consolidation

<step_metadata>
  <action>discover and consolidate existing specifications</action>
  <purpose>preserve valuable context from legacy specs for future phases</purpose>
  <memory_integration>consolidate legacy knowledge into structured foundation</memory_integration>
  <condition>execute if legacy specs detected</condition>
</step_metadata>

<legacy_detection>
  # Scan for legacy specification structures
  CALL: check_for_legacy_specs()
  PARAMETERS:
    - scan_paths: [".agent-os/specs/", "docs/", "specifications/"]
    - patterns: ["date-prefixed folders", "loose spec files", "unconsolidated structures"]
  
  IF legacy_specs_found:
    LOG: "🔍 Found legacy specifications - consolidating before proceeding"
    
    # Execute consolidation workflow
    <include>@reference-docs/instructions/consolidate-specs.md</include>
    
    # Execute deduplication to clean up overlaps
    <include>@reference-docs/instructions/dedupe-specs.md</include>
    
    # Store consolidation results
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "legacy-consolidation-results"
      - value: "{consolidation_summary}"
      - category: "progress"
      - priority: "high"
    
    # Extract valuable insights for future phases
    consolidated_insights = extract_legacy_insights(consolidation_results)
    CALL: memento-mcp-add_observations
    PARAMETERS:
      - observations: [{
          "entityName": "{PROJECT_ENTITY_NAME}",
          "contents": [
            "Legacy consolidation completed: {consolidation_summary}",
            "Key insights: {consolidated_insights.key_patterns}",
            "Feature count: {consolidated_insights.feature_count}",
            "Historical context: {consolidated_insights.evolution_notes}"
          ]
        }]
    
    LOG: "✅ Legacy specifications consolidated and integrated into project foundation"
  ELSE:
    LOG: "ℹ️ No legacy specifications found - proceeding with fresh initialization"
</legacy_detection>

<integration_benefits>
  <context_preservation>
    - Historical feature decisions preserved
    - Previous technical approaches documented  
    - User requirements evolution captured
    - Implementation lessons learned integrated
  </context_preservation>
  
  <future_phase_enhancement>
    - Phase 2 (Research) informed by consolidated historical context
    - Phase 3 (Write) builds on previous specification patterns
    - Phase 4 (Verify) can validate against historical approaches
    - Phase 5 (Create Tasks) leverages proven task breakdown patterns
  </future_phase_enhancement>
</integration_benefits>

<instructions>
  ACTION: Detect and consolidate legacy specifications if present
  PRESERVE: All valuable context from previous work
  INTEGRATE: Legacy insights into project foundation
  PREPARE: Clean, consolidated specification base for future phases
</instructions>

</step>

<step number="2" name="define_project_structure">

### Step 2: Define Project Structure and Foundation

<step_metadata>
  <action>establish project organization</action>
  <purpose>create consistent project foundation</purpose>
  <memory_integration>pattern matching with similar projects</memory_integration>
</step_metadata>

<project_foundation>
  # Search for similar project patterns
  CALL: memento-mcp-semantic_search
  PARAMETERS:
    - query: "{PRIMARY_TECH} {project_type} project structure patterns"
    - entity_types: ["project", "architectural_decision"]
    - limit: 3
  
  <directory_structure>
    - Determine appropriate project layout
    - Identify key directories needed
    - Plan configuration file locations
    - Consider deployment structure needs
  </directory_structure>
  
  <technology_decisions>
    - Confirm primary technology stack
    - Identify key dependencies needed
    - Consider development tools required
    - Plan testing and deployment approaches
  </technology_decisions>
  
  <documentation_approach>
    - README.md structure planning
    - API documentation needs
    - User documentation requirements
    - Development documentation approach
  </documentation_approach>
</project_foundation>

<structure_storage>
  # Store structural decisions
  CALL: mcp-memory-keeper-context_save
  PARAMETERS:
    - key: "project-structure"
    - value: "{structure_decisions_summary}"
    - category: "decision"
    - priority: "high"
  
  # Create relationships in long-term memory
  IF similar_projects_found:
    FOR_EACH: similar_project
      CALL: memento-mcp-create_relations
      PARAMETERS:
        - relations: [{
            "from": "{PROJECT_ENTITY_NAME}",
            "to": "{similar_project.name}",
            "relationType": "inspired_by",
            "metadata": {"similarity_score": "{similarity_score}"}
          }]
</structure_storage>

</step>

<step number="2.5" name="analyze_existing_specifications">

### Step 2.5: Analyze Existing Specifications

<step_metadata>
  <action>read and analyze existing spec.md for project context</action>
  <purpose>understand current project architecture and specifications</purpose>
  <memory_integration>context reduction + specification analysis</memory_integration>
  <condition>optional - graceful fallback if spec.md doesn't exist</condition>
</step_metadata>

<existing_spec_analysis>
  # Check for existing master specification
  IF file_exists(".agent-os/specs/spec.md"):
    LOG: "📋 Found existing spec.md - analyzing current specifications"
    
    # Read and parse spec.md content
    spec_content = read_file(".agent-os/specs/spec.md")
    
    # Extract key information with context reduction
    spec_analysis = {
      "existing_features": extract_feature_sections(spec_content, max_features=5),
      "project_architecture": extract_architecture_overview(spec_content, max_length=300),
      "tech_stack_decisions": extract_tech_decisions(spec_content, max_length=200),
      "integration_patterns": extract_integration_patterns(spec_content, max_patterns=3),
      "project_maturity": assess_specification_maturity(spec_content)
    }
    
    # Store analysis in memory with context reduction
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "existing-spec-analysis"
      - value: create_summary(spec_analysis, max_length=400)
      - category: "analysis"
      - priority: "high"
    
    # Find similar project patterns using Qdrant
    CALL: qdrant-qdrant_retrieve
    PARAMETERS:
      - collectionNames: ["agent-os-global-specs"]
      - query: [spec_analysis.project_architecture, spec_analysis.tech_stack_decisions]
      - topK: 3
    
    IF similar_patterns_found:
      pattern_insights = analyze_similar_project_patterns(similar_patterns)
      CALL: mcp-memory-keeper-context_save
      PARAMETERS:
        - key: "similar-project-patterns"
        - value: pattern_insights
        - category: "analysis"
        - priority: "normal"
    
    # Update Memento with specification insights
    CALL: memento-mcp-add_observations
    PARAMETERS:
      - observations: [{
          "entityName": "{PROJECT_ENTITY_NAME}",
          "contents": [
            "Existing Specifications: {len(spec_analysis.existing_features)} features documented",
            "Project Maturity: {spec_analysis.project_maturity}",
            "Architecture: {spec_analysis.project_architecture[:100]}...",
            "Analysis Date: {current_date()}"
          ]
        }]
    
    LOG: "✅ Spec analysis complete - found {len(spec_analysis.existing_features)} existing features"
    CONTEXT_NOTE: "Existing specifications analyzed: {spec_analysis.project_maturity} maturity level"
  
  ELSE:
    LOG: "ℹ️ No existing spec.md found - proceeding with fresh project initialization"
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "existing-spec-analysis"
      - value: "No existing specifications found - fresh project start"
      - category: "analysis"
      - priority: "normal"
</existing_spec_analysis>

<spec_analysis_benefits>
  <informed_initialization>
    - Understand existing project scope and boundaries
    - Build on established architectural decisions
    - Avoid reinventing existing specifications
    - Maintain consistency with current project direction
  </informed_initialization>
  
  <pattern_discovery>
    - Find similar projects via Qdrant search
    - Learn from successful project patterns
    - Identify common architectural approaches
    - Leverage cross-project specification intelligence
  </pattern_discovery>
  
  <context_continuity>
    - Memory-keeper stores analysis for future phases
    - Memento tracks project evolution over time
    - Context reduction prevents information overload
    - Graceful fallback ensures workflow continuity
  </context_continuity>
</spec_analysis_benefits>

<instructions>
  ACTION: Analyze existing spec.md if present, graceful fallback if not
  EXTRACT: Key project information with aggressive context reduction
  SEARCH: Similar project patterns via Qdrant for cross-project learning
  STORE: Analysis results in memory systems for Phase 2-3 continuation
  ENHANCE: Project initialization with existing specification knowledge
</instructions>

</step>

<step number="3" name="scope_boundaries">

### Step 3: Define Clear Scope Boundaries

<step_metadata>
  <action>establish project boundaries</action>
  <purpose>prevent scope creep and focus development</purpose>
  <memory_integration>learn from past scope challenges</memory_integration>
</step_metadata>

<boundary_definition>
  <included_features>
    - Core features that MUST be included
    - Priority levels for each feature
    - Dependencies between features
    - Success criteria for each feature
  </included_features>
  
  <explicitly_excluded>
    - Features that are OUT OF SCOPE
    - Future version considerations
    - Nice-to-have features for later
    - Integration points that won't be built initially
  </explicitly_excluded>
  
  <success_criteria>
    - What defines project completion?
    - Key metrics for success
    - User acceptance criteria
    - Performance requirements
  </success_criteria>
</boundary_definition>

<scope_storage>
  # Store scope decisions for future reference
  CALL: mcp-memory-keeper-context_save
  PARAMETERS:
    - key: "project-scope-boundaries"
    - value: "{scope_boundaries_summary}"
    - category: "decision"
    - priority: "high"
  
  # Learn from cross-project scope patterns
  CALL: memento-mcp-semantic_search
  PARAMETERS:
    - query: "scope creep prevention {PRIMARY_TECH} projects"
    - entity_types: ["project", "decision", "lesson_learned"]
    - limit: 3
</scope_storage>

</step>

<step number="4" name="prepare_phase2_handoff">

### Step 4: Prepare Structured Handoff to Phase 2 (Research)

<step_metadata>
  <action>structure context for requirements gathering</action>
  <purpose>enable effective Phase 2 research</purpose>
  <memory_integration>provide rich context for next phase</memory_integration>
</step_metadata>

<handoff_preparation>
  <research_questions>
    - What technical details need investigation?
    - Which architectural decisions need research?
    - What user experience aspects need exploration?
    - Are there compliance or security research needs?
  </research_questions>
  
  <stakeholder_identification>
    - Who are the key stakeholders to interview?
    - What user personas need validation?
    - Which technical experts should be consulted?
    - Are there business stakeholders to include?
  </stakeholder_identification>
  
  <research_priorities>
    - High-risk areas needing immediate research
    - Assumptions that need validation
    - Technical feasibility questions
    - Market or competitive research needs
  </research_priorities>
</handoff_preparation>

<phase2_context>
  # Prepare comprehensive context for Phase 2
  CALL: mcp-memory-keeper-context_save
  PARAMETERS:
    - key: "phase2-research-context"
    - value: "{research_context_summary}"
    - category: "task"
    - priority: "high"
  
  # Store Phase 1 completion milestone
  CALL: memento-mcp-add_observations
  PARAMETERS:
    - observations: [{
        "entityName": "{PROJECT_ENTITY_NAME}",
        "contents": [
          "Phase 1 Complete: Project initialized and scoped",
          "Ready for Phase 2: Requirements research",
          "Key Research Areas: {top_research_priorities}",
          "Completion Date: {current_date()}"
        ]
      }]
  
  LOG: "✅ Phase 1 Complete: Project foundation established"
  LOG: "➡️ Ready for Phase 2: Requirements Research"
  LOG: "🎯 Next: Execute research-spec.md with established context"
</phase2_context>

</step>

</process_flow>

## Phase 1 Output Requirements

<deliverables>
  <project_foundation_document>
    - Clear project vision statement
    - Defined scope boundaries (in/out)
    - Technical foundation decisions
    - Success criteria definition
  </project_foundation_document>
  
  <memory_context>
    - Project entity created in Memento
    - Key decisions stored in Memory-Keeper
    - Cross-project patterns identified
    - Research priorities established
  </memory_context>
  
  <phase2_preparation>
    - Research questions prioritized
    - Stakeholder list prepared
    - Technical investigation areas identified
    - Context ready for requirements gathering
  </phase2_preparation>
</deliverables>

<success_metrics>
  - [ ] Project vision clearly articulated
  - [ ] Scope boundaries explicitly defined  
  - [ ] Technical foundation established
  - [ ] Memory systems populated with context
  - [ ] Phase 2 research priorities identified
  - [ ] Stakeholder engagement plan ready
</success_metrics>

## Integration with Agent OS Framework

<framework_integration>
  - Initializes global project context for all subsequent phases
  - Establishes MCP memory foundation for enhanced continuity
  - Creates structured handoff ensuring no context loss
  - Integrates with existing Agent OS template architecture
  - Maintains compatibility with ProjectAI deployment system
</framework_integration>

<next_phase>
  **Phase 2 Trigger**: Execute `research-spec.md` with established project context
  **Context Transfer**: All Phase 1 decisions available in Memory-Keeper session
  **Continuity**: Project entity available in Memento for cross-project learning
</next_phase>