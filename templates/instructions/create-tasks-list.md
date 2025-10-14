---
description: Phase 5 - Create Tasks List (Test-Driven Development Planning)
globs:
alwaysApply: false
version: 3.0
encoding: UTF-8
---

# Phase 5: Create Tasks List (Test-Driven Development Planning)

## ⚠️ IMMEDIATE ACTION REQUIRED ⚠️

**STOP**: Before proceeding with Phase 5, you MUST activate MCP workflow systems:

1. **ACTIVATE TOOLS**: `activate_context_management_tools`, `activate_memento_management_tools`, `activate_meilisearch_management_tools`
2. **RESOLVE PROJECT IDENTITY**: Execute universal namespace consolidation (Step 0 below)
3. **START SESSION**: Initialize Memory-Keeper session with this project directory
4. **CHECK CACHE FIRST**: Query Meilisearch for cached documentation before Context7
5. **CREATE ENTITIES**: Store project and technology entities in Memento knowledge graph using canonical names
6. **VALIDATE CONFIDENCE**: Ensure trust score ≥ 8.0 before proceeding

**Any Phase 5 work without completing these 6 steps is INVALID and must be restarted.**

## 🔧 MANDATORY MCP WORKFLOW INITIALIZATION

<include>@reference-docs/instructions/support-workflows/mandatory-mcp-initialization.md</include>

**All subsequent Phase 5 operations MUST use PROJECT_ENTITY_NAME exclusively.**

<ai_meta>
  <parsing_rules>
    - Initialize memory systems before spec creation
    - Process XML blocks first for structured data
    - Execute instructions in sequential order
    - Use templates as exact patterns
    - Request missing data rather than assuming
    - Store spec decisions in memory systems vs context accumulation
    - Use context reduction throughout workflow
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
  - Break down validated specification into actionable tasks
  - Apply test-driven development approach to task structure
  - Create implementation roadmap with clear priorities
  - Generate task groups organized by role and complexity
</purpose>

<context>
  - Fifth phase of 5-phase specification workflow
  - Follows Phase 4 (Verify) with validated specification
  - Enhanced with MCP intelligence for cross-project task patterns
  - Prepares structured tasks for implementation with execute-tasks.md
</context>

<prerequisites>
  - Product documentation exists in .agent-os/product/
  - Access to:
    - @.agent-os/product/mission.md,
    - @.agent-os/product/roadmap.md,
    - @.agent-os/product/tech-stack.md
  - User has spec idea or roadmap reference
  - MCP memory systems available (Memory-Keeper, Memento)
  - Completed Phase 4 (Verify) with validated specification
</prerequisites>

<process_flow>

<step number="0" name="memory_and_precedence_initialization">

### Step 0: Initialize Memory Systems and Resolve Precedence

<memory_precedence_initialization>
  <!-- Use centralized Memory Systems and Precedence Initialization workflow -->
  <include>@reference-docs/instructions/memory-precedence-initialization.md</include>
  
  # Execute centralized initialization with create-spec specific parameters
  EXECUTE: memory_precedence_initialization_workflow()
  PARAMETERS:
    - command_name: "create-tasks-list"
    - memory_requirements: "REQUIRED"  # Memory critical for Phase 5 continuity
    - override_categories: ["specification_standards", "testing_requirements", "implementation_patterns"]
    - session_description: "Agent OS Phase 5: Task Creation and Planning"
    - consolidation_support: true
    - fallback_behavior: "ERROR_IF_UNAVAILABLE"
  
  # Access standardized initialization results
  PROJECT_NAME = DETECTION_CONTEXT["project_name"]
  PROJECT_ENTITY_NAME = DETECTION_CONTEXT["project_entity_name"]  # Canonical name
  PRIMARY_TECH = DETECTION_CONTEXT["primary_tech"]
  TECH_STACKS = DETECTION_CONTEXT["tech_stacks"]
  CONFIDENCE_LEVEL = DETECTION_CONTEXT["confidence_level"]
  AVAILABLE_ENTITIES = DETECTION_CONTEXT["entities"]
  NAMESPACE_STATUS = DETECTION_CONTEXT["namespace_status"]
  PROJECT_OVERRIDES = initialization_result.project_overrides
  CONSOLIDATION_MODE = initialization_result.consolidation_mode  # Detected by centralized workflow
  CONSOLIDATION_CONFIG = initialization_result.consolidation_config
  
  # Log initialization completion
  LOG: "📋 Phase 5 task creation initialization complete - loading specification context"
  LOG: "🏷️ Project: {PROJECT_NAME} → {PROJECT_ENTITY_NAME} (Status: {NAMESPACE_STATUS})"
  IF CONSOLIDATION_MODE:
    LOG: "🔄 Consolidation mode active for {CONSOLIDATION_CONFIG.source_data.feature_name}"
</memory_precedence_initialization>

</step>

<step number="0.5" name="enforce_idempotent_task_design">

### Step 0.5: Enforce Idempotent Task Design

<step_metadata>
  <action>prevent task fragmentation and enforce consolidated tasks.md architecture</action>
  <purpose>ensure all tasks follow single-source-of-truth design</purpose>
  <enforcement>block creation of competing task files</enforcement>
  <critical>maintains Agent OS task management integrity</critical>
</step_metadata>

<idempotent_task_enforcement>
  # Enforce Agent OS idempotent task architecture
  LOG: "🛡️ Enforcing idempotent task design - preventing task fragmentation"
  
  <task_architecture_validation>
    # Verify proper Agent OS task structure
    expected_task_structure = {
      "master_tasks": ".agent-os/specs/tasks.md",
      "master_spec": ".agent-os/specs/spec.md",
      "supplementary_details": ".agent-os/specs/sub-specs/"
    }
    
    # Check for task fragmentation violations
    task_violation_patterns = [
      "*-tasks.md",
      "task-*.md",
      "*-task-list.md",
      "implementation-*.md",
      "*-implementation.md"
    ]
    
    # Scan for competing task files
    competing_tasks = find_files(".agent-os/specs/", patterns=task_violation_patterns, exclude=["tasks.md"])
    
    IF competing_tasks.found:
      LOG: "⚠️ TASK DESIGN VIOLATION: Found {len(competing_tasks)} competing task files"
      FOR competing_file IN competing_tasks:
        LOG: "  ❌ Competing: {competing_file.path}"
      
      ERROR: "IDEMPOTENT TASK DESIGN VIOLATION DETECTED"
      MESSAGE: """
      Agent OS uses idempotent task architecture:
      
      ✅ CORRECT: All tasks go in master .agent-os/specs/tasks.md
      ✅ CORRECT: Tasks organized by feature sections within tasks.md
      ❌ INVALID: Separate task files (creates competing task sources)
      
      Found competing task files that violate this design:
      {list_competing_files(competing_tasks)}
      
      REQUIRED ACTION:
      1. Consolidate competing task files into master tasks.md
      2. Use create-tasks-list.md template to add tasks to master tasks.md
      3. Never create standalone task files outside this workflow
      
      PREVENTION: Always use Phase 5 (Tasks) workflow, never bypass with direct file creation.
      """
      HALT: "Must resolve task violations before continuing"
  </task_architecture_validation>
  
  <spec_dependency_validation>
    # Ensure tasks are based on proper specification
    IF not file_exists(".agent-os/specs/spec.md"):
      ERROR: "MISSING SPECIFICATION DEPENDENCY"
      MESSAGE: """
      Phase 5 (Tasks) requires existing specification:
      
      ❌ Missing: .agent-os/specs/spec.md
      
      REQUIRED ACTION:
      1. Run Phase 1: initialize-spec.md
      2. Run Phase 2: research-spec.md
      3. Run Phase 3: write-spec.md (creates/updates spec.md)
      4. Run Phase 4: verify-spec.md
      5. Then run Phase 5: create-tasks-list.md
      
      PREVENTION: Never run create-tasks-list.md without existing specifications.
      """
      HALT: "Must have spec.md before creating tasks"
    
    # Validate specification content exists
    spec_content = read_file(".agent-os/specs/spec.md")
    IF spec_content.length < 100:
      WARNING: "Specification appears minimal - ensure proper Phase 1-4 completion before task creation"
  </spec_dependency_validation>
  
  <task_mode_determination>
    # Determine proper task creation mode
    IF not file_exists(".agent-os/specs/tasks.md"):
      LOG: "📋 No master tasks.md found - will create consolidated task structure"
      task_mode = "CREATE_MASTER_TASKS"
    ELSE:
      LOG: "📋 Master tasks.md exists - will add feature tasks using idempotent approach"
      task_mode = "ADD_FEATURE_TASKS"
    
    # Store enforcement context
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "idempotent-task-enforcement"
      - value: "Task design validated - proceeding with {task_mode} mode"
      - category: "enforcement"
      - priority: "high"
  </task_mode_determination>
</idempotent_task_enforcement>

<task_enforcement_benefits>
  <prevents_task_fragmentation>
    - Blocks creation of competing task files
    - Ensures single source of truth (tasks.md) is maintained
    - Prevents task conflicts and confusion
    - Enforces Agent OS task management principles
  </prevents_task_fragmentation>
  
  <validates_workflow_sequence>
    - Ensures Phase 5 follows proper Phase 1-4 sequence
    - Validates specification dependency before task creation
    - Prevents orphaned tasks without corresponding specifications
    - Maintains proper 5-phase workflow integrity
  </validates_workflow_sequence>
</task_enforcement_benefits>

<instructions>
  CRITICAL: Enforce Agent OS idempotent task architecture without exception
  VALIDATE: Check for competing task files and missing spec dependencies
  ENSURE: Proper 5-phase workflow sequence before task creation
  MAINTAIN: Single source of truth (tasks.md) for all project tasks
  PREVENT: Task fragmentation through design enforcement
</instructions>

</step>

<step number="1" name="memory_and_precedence_initialization">

### Step 1: Spec Initiation

<step_metadata>
  <trigger_options>
    - option_a: user_asks_whats_next (standard mode only)
    - option_b: user_provides_specific_spec (standard mode only)
    - option_c: consolidation_mode_data_provided (consolidation mode)
  </trigger_options>
</step_metadata>

<consolidation_mode_flow>
  IF CONSOLIDATION_MODE:
    # Use provided source data instead of user input
    spec_name = SOURCE_DATA.feature_name
    spec_priority = SOURCE_DATA.feature_priority
    original_context = {
      "folder": SOURCE_DATA.original_folder,
      "date": SOURCE_DATA.original_date,
      "consolidation_date": SOURCE_DATA.consolidation_date
    }
    
    LOG: "📋 Using consolidation data: {spec_name} (Priority: {spec_priority})"
    LOG: "📅 Original: {original_context.date}, Consolidating: {original_context.consolidation_date}"
    
    # Skip to context gathering with provided data
    PROCEED_TO: step_2_context_gathering
</consolidation_mode_flow>

<standard_mode_flow>
  IF NOT CONSOLIDATION_MODE:
    <option_a_flow>
      <trigger_phrases>
        - "what's next?"
        - "what should we work on next?"
      </trigger_phrases>
      <actions>
        1. CHECK @.agent-os/product/roadmap.md
        2. FIND next uncompleted item
        3. SUGGEST item to user
        4. WAIT for approval
      </actions>
    </option_a_flow>
    
    <option_b_flow>
      <trigger>user describes specific spec idea</trigger>
      <accept>any format, length, or detail level</accept>
      <proceed>to context gathering</proceed>
    </option_b_flow>
</standard_mode_flow>

<instructions>
  ACTION: Determine spec initiation method based on mode
  CONSOLIDATION: Use provided source data automatically
  STANDARD: Follow interactive user input flows
  ROUTE: Skip interactive steps when in consolidation mode
</instructions>

</step>

<step number="1.5" name="phase_context_loading">

### Step 1.5: Load Previous Phase Context

<step_metadata>
  <action>load specification context from Phase 4 validation</action>
  <purpose>retrieve validated specification and task creation context</purpose>
  <queries>validated specification, implementation priorities, risk areas</queries>
  <condition>requires previous phase completion</condition>
</step_metadata>

<phase_context_categories>
  <validated_specification>
    - Completed and validated project specification
    - Verified technical feasibility and constraints
    - Approved scope boundaries and requirements
    - Quality validation results and recommendations
  </validated_specification>
  <implementation_priorities>
    - High-priority features requiring immediate attention
    - Risk areas identified during validation
    - Dependencies and blockers for task sequencing
    - Performance and scalability considerations
  </implementation_priorities>
  <task_creation_guidance>
    - Test-driven development requirements
    - Acceptance criteria definitions
    - Role-based task assignment preferences
    - Implementation complexity assessments
  </task_creation_guidance>
  <cross_project_patterns>
    - Similar project task breakdown patterns
    - Successful implementation approaches
    - Common pitfalls and mitigation strategies
    - Best practices for task organization
  </cross_project_patterns>
</phase_context_categories>

<context_loading_process>
  # Load Phase 4 validation results
  CALL: mcp-memory-keeper-context_get
  PARAMETERS:
    - key: "phase5-task-creation-context"
  
  # Load validated specification context
  CALL: mcp-memory-keeper-context_get
  PARAMETERS:
    - key: "phase4-complete"
  
  # Load validation results and priorities
  CALL: mcp-memory-keeper-context_get
  PARAMETERS:
    - key: "feasibility-validation"
  
  # Search for similar project task patterns
  CALL: memento-mcp-semantic_search
  PARAMETERS:
    - query: "{PRIMARY_TECH} task breakdown implementation patterns"
    - entity_types: ["task_pattern", "implementation_approach", "best_practice"]
    - limit: 5
  
  # Load project-specific patterns if available
  CALL: memento-mcp-semantic_search
  PARAMETERS:
    - query: "{PROJECT_ENTITY_NAME} task organization development workflow"
    - entity_types: ["project", "workflow", "task_group"]
    - limit: 3
</context_loading_process>

<phase5_context_template>
  ## Phase 5: Task Creation Context
  
  Based on validated specification and previous phases:
  
  ### Validated Specification Summary
  - **Scope**: [VALIDATED_SCOPE_FROM_PHASE4]
  - **Technical Approach**: [APPROVED_ARCHITECTURE_FROM_PHASE4]
  - **Quality Score**: [VALIDATION_SCORE_FROM_PHASE4]
  
  ### Implementation Priorities
  - **High Priority**: [CRITICAL_FEATURES_FROM_VALIDATION]
  - **Dependencies**: [IDENTIFIED_BLOCKERS_FROM_VALIDATION]
  - **Risk Areas**: [VALIDATION_CONCERNS_FROM_PHASE4]
  
  ### Task Creation Guidance
  - **TDD Requirements**: [TEST_FIRST_REQUIREMENTS]
  - **Acceptance Criteria**: [VALIDATION_BASED_CRITERIA]
  - **Complexity Assessment**: [TECHNICAL_COMPLEXITY_FROM_PHASE4]
  
  ### Cross-Project Insights
  - [SIMILAR_PROJECT_PATTERN_1]
  - [SUCCESSFUL_APPROACH_PATTERN_2]
</phase5_context_template>

<instructions>
  ACTION: Load Phase 4 validation context and cross-project patterns
  SYNTHESIZE: Combine validation results with task creation requirements
  ENHANCE: Apply similar project patterns and best practices
  VALIDATE: Ensure Phase 4 completion before proceeding
</instructions>

</step>

<step number="2" name="context_gathering_with_memory">

### Step 2: Context Gathering (Memory-Enhanced)

<step_metadata>
  <reads>
    - @.agent-os/product/mission.md
    - @.agent-os/product/roadmap.md
    - @.agent-os/product/tech-stack.md
  </reads>
  <purpose>understand spec alignment</purpose>
  <enhances>with Phase 4 validation context</enhances>
</step_metadata>

<context_analysis>
  <mission>overall product vision</mission>
  <roadmap>current progress and plans</roadmap>
  <tech_stack>technical requirements</tech_stack>
  <validation_context>Phase 4 results and implementation guidance</validation_context>
</context_analysis>

<memory_enhanced_context_gathering>
  # Check for previous plan-product session context
  CALL: mcp-memory-keeper-context_search
  PARAMETERS:
    - query: "{PROJECT_NAME} plan-product planning"
    - categories: ["decision", "progress"]
  
  IF previous_planning_found:
    planning_context = summarize_previous_planning(previous_planning)
    LOG: "Building on previous planning: {planning_context[:100]}..."
    CONTEXT_NOTE: "Previous planning available in memory"
  
  # Smart document retrieval with memory caching
  FOR_EACH: product_document IN ["@.agent-os/product/mission.md", "@.agent-os/product/roadmap.md", "@.agent-os/product/tech-stack.md"]
    # Check if file changed since last cache
    CALL: mcp-memory-keeper-context_file_changed
    PARAMETERS:
      - filePath: product_document
    
    IF file_changed OR not_cached:
      # Cache file and create summary
      CALL: mcp-memory-keeper-context_cache_file
      PARAMETERS:
        - filePath: product_document
        - content: read_file(product_document)
      
      document_summary = create_summary(document_content, max_length=300)
      CALL: mcp-memory-keeper-context_save
      PARAMETERS:
        - key: "doc-{document_name}-summary"
        - value: document_summary
        - category: "analysis"
        - priority: "normal"
      
      # Store tech-specific insights in Memento
      IF document_name == "tech-stack":
        tech_insights = extract_tech_insights(document_content, PRIMARY_TECH)
        CALL: memento-mcp-add_observations
        PARAMETERS:
          - observations: [{
              "entityName": "{PROJECT_NAME}-{PRIMARY_TECH}-app",
              "contents": tech_insights
            }]
    
    # Reference in context, don't load full content
    CONTEXT_REFERENCE: "📄 {document_name}: {brief_summary} (cached in memory)"
  
  # Cross-project pattern search for similar specs
  CALL: memento-mcp-semantic_search
  PARAMETERS:
    - query: "{spec_type} {PRIMARY_TECH} implementation patterns"
    - entity_types: ["product_feature", "technical_specification"]
    - limit: 5
  
  IF similar_specs_found:
    spec_insights = analyze_similar_specs(similar_specs)
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "cross-project-spec-insights"
      - value: spec_insights
      - category: "analysis"
      - priority: "normal"
    
    LOG: "💡 Found {len(similar_specs)} similar specs from other projects"
    CONTEXT_NOTE: "Cross-project spec insights available: {spec_insights[:100]}..."
</memory_enhanced_context_gathering>

<instructions>
  ACTION: Gather context with memory integration and cross-project learning
  CACHE: Product documents to avoid re-reading
  LEVERAGE: Previous planning sessions and similar spec patterns
  REDUCE: Context size by storing details in memory systems
</instructions>

</step>

<step number="3" name="documentation_verification">

### Step 3: Documentation Verification with Context7

<step_metadata>
  <purpose>ensure latest documentation for implementation using centralized workflow</purpose>
  <required>true</required>
  <uses>centralized Context7 + Meilisearch documentation workflow</uses>
</step_metadata>

<context7_meilisearch_workflow>
  <!-- Use centralized Context7 + Meilisearch documentation workflow -->
  <include>@reference-docs/instructions/support-workflows/context7-meilisearch-workflow.md</include>
  
  # Execute the centralized documentation workflow for implementation-focused analysis
  EXECUTE: context7_documentation_workflow()
  PARAMETERS:
    - workflow_type: "implementation"
    - focus_areas: ["implementation_specific"]
    - trust_threshold: 9.0  # Higher threshold for implementation accuracy
    - technologies: SPEC_RELEVANT_TECH  # Technologies specific to this spec
    - documentation_depth: "code_examples_and_apis"
  
  # Store workflow results for spec validation
  DOCUMENTATION_RESULTS = workflow_output.documentation_summary
  TRUST_ASSESSMENT = workflow_output.confidence_level
  IMPLEMENTATION_PATTERNS = workflow_output.key_architectural_insights
  
  # Log verification results
  LOG: "🔍 Implementation verification completed with {TRUST_ASSESSMENT} confidence"
  LOG: "🏗️ Found {len(IMPLEMENTATION_PATTERNS)} relevant implementation patterns"
</context7_meilisearch_workflow>

<spec_integration>
  # Integration results for spec validation and requirements verification
  # The centralized workflow provides:
  # - implementation_patterns: Code examples and API patterns
  # - confidence_level: HIGH/MEDIUM/LOW based on implementation trust scores
  # - version_compatibility: Cross-technology version analysis
  # - performance_metrics: Documentation freshness and cache optimization
  
  # Store verification context for spec creation
  CALL: mcp-memory-keeper-context_save
  PARAMETERS:
    - key: "spec-verification-results-{SPEC_NAME}"
    - value: "{IMPLEMENTATION_PATTERNS}"
    - category: "analysis"
    - priority: "high"
  
  # Create Memento entities for cross-project spec learning
  CALL: memento-mcp-create_entities
  PARAMETERS:
    - entities: [{
        "name": "{PROJECT_NAME}-spec-{SPEC_NAME}-verification",
        "entityType": "implementation_verification",
        "observations": [
          "Verified against: {DOCUMENTATION_SOURCES}",
          "Implementation patterns: {IMPLEMENTATION_PATTERNS[:3]}",
          "Trust level: {TRUST_ASSESSMENT}",
          "Date: {current_date()}"
        ]
      }]
</spec_integration>

<instructions>
  ACTION: Execute centralized Context7 + Meilisearch documentation workflow
  CONFIGURE: Use implementation-specific parameters and higher trust thresholds
  LEVERAGE: Existing tech-stack.md mappings via centralized workflow
  FOCUS: Technologies and patterns directly relevant to this specification
  VALIDATE: Spec design against latest implementation best practices via workflow
  STORE: Verification results in memory systems for cross-project learning
</instructions>

</step>

<step number="4" name="requirements_clarification">

### Step 4: Requirements Clarification

<step_metadata>
  <required_clarifications>
    - scope_boundaries: string
    - technical_considerations: array[string]
  </required_clarifications>
  <enhances>with Phase 4 validation context and cross-project patterns</enhances>
</step_metadata>

<clarification_areas>
  <scope>
    - in_scope: what is included
    - out_of_scope: what is excluded (optional)
  </scope>
  <technical>
    - functionality specifics
    - UI/UX requirements
    - integration points
  </technical>
  <consistency>
    - alignment with validated specification from Phase 4
    - consistency with established patterns from cross-project learning
    - integration with existing features
  </consistency>
</clarification_areas>

<decision_tree>
  IF clarification_needed:
    ASK numbered_questions (enhanced with validation context)
    WAIT for_user_response
  ELSE:
    PROCEED to_date_determination
</decision_tree>

<question_template>
  Based on the spec description and project context, I need clarification on:

  1. [SPECIFIC_QUESTION_ABOUT_SCOPE]
  2. [SPECIFIC_QUESTION_ABOUT_TECHNICAL_APPROACH]
  3. [SPECIFIC_QUESTION_ABOUT_USER_EXPERIENCE]
  [IF VALIDATION_CONTEXT_AVAILABLE]:
  4. [CONSISTENCY_QUESTION_BASED_ON_PHASE4_VALIDATION]
</question_template>

<instructions>
  ACTION: Evaluate need for clarification
  ASK: Numbered questions if needed (enhanced with Phase 4 validation insights)
  PROCEED: Only with clear requirements
  ENHANCE: Use validation context to identify potential consistency issues
</instructions>

</step>

<step number="5" name="spec_directory_setup">

### Step 5: Spec Directory Setup

<step_metadata>
  <creates>
    - directory: .agent-os/specs/ (if not exists)
    - directory: .agent-os/specs/sub-specs/ (if not exists)
  </creates>
</step_metadata>

<directory_structure>
  .agent-os/
  └── specs/
      ├── spec.md          # Master specification file
      ├── tasks.md         # Consolidated tasks file
      └── sub-specs/       # Detailed technical specifications
          ├── technical-spec.md
          ├── database-schema.md (conditional)
          ├── api-spec.md (conditional)
          └── tests.md
</directory_structure>

<instructions>
  ACTION: Ensure .agent-os/specs/ directory structure exists
  CREATE: Base directories if they don't exist
  VERIFY: Directory structure created successfully
</instructions>

</step>

<step number="6" name="create_spec_md">

### Step 6: Create or Update spec.md

<step_metadata>
  <creates>
    - file: .agent-os/specs/spec.md (if not exists)
  </creates>
  <updates>
    - file: .agent-os/specs/spec.md (if exists, find and update matching feature or append if new)
  </updates>
  <enhances>with Phase 4 validation context and task patterns</enhances>
  <consolidation_mode>processes provided feature data for consistent formatting</consolidation_mode>
</step_metadata>

<consolidation_mode_handling>
  IF CONSOLIDATION_MODE:
    # Use provided feature data instead of gathering new input
    feature_section = create_consolidation_feature_section(SOURCE_DATA)
    
    # Enhanced feature section with consolidation metadata
    enhanced_section = add_consolidation_metadata(
      feature_section,
      original_folder = SOURCE_DATA.original_folder,
      original_date = SOURCE_DATA.original_date,
      consolidation_date = SOURCE_DATA.consolidation_date,
      preserve_metadata = PRESERVE_METADATA
    )
    
    # Handle update vs append vs create with intelligent spec matching
    IF file_exists(".agent-os/specs/spec.md"):
      existing_spec_content = read_file(".agent-os/specs/spec.md")
      
      # Look for existing feature specification by name/ID
      feature_match = find_existing_feature_spec(
        existing_spec_content,
        SOURCE_DATA.feature_name,
        [SOURCE_DATA.feature_id, SOURCE_DATA.original_folder]
      )
      
      IF feature_match.found:
        # Update existing feature specification in place
        updated_content = replace_feature_section(
          existing_spec_content,
          feature_match.section_range,
          enhanced_section
        )
        write_file(".agent-os/specs/spec.md", updated_content)
        LOG: "🔄 Updated existing feature '{SOURCE_DATA.feature_name}' in spec.md"
        LOG: "📍 Replaced section at lines {feature_match.section_range.start}-{feature_match.section_range.end}"
      ELSE:
        # No existing match found - append new feature
        append_feature_section_to_spec(enhanced_section)
        LOG: "📝 Appended new feature '{SOURCE_DATA.feature_name}' to existing spec.md"
    ELSE:
      create_spec_file_with_consolidation_header(enhanced_section)
      LOG: "🆕 Created spec.md with feature '{SOURCE_DATA.feature_name}'"
    
    # Store consolidation progress in memory
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "consolidated-spec-{SOURCE_DATA.original_folder}"
      - value: "Feature spec migrated via create-spec consolidation mode"
      - category: "progress"
      - priority: "normal"
</consolidation_mode_handling>

<file_template>
  <header_new_file>
    # Project Specifications

    > Last Updated: [CURRENT_DATE]
    > Version: 1.0.0
  </header_new_file>
  <header_new_feature>
    ## Feature: [SPEC_NAME]
    
    > Added: [CURRENT_DATE]
    > Status: Planning
    > Priority: [HIGH/MEDIUM/LOW]
  </header_new_feature>
  <required_sections>
    - Overview
    - User Stories
    - Spec Scope
    - Out of Scope
    - Expected Deliverable
  </required_sections>
</file_template>

<section name="overview">
  <template>
    ## Overview

    [1-2_SENTENCE_GOAL_AND_OBJECTIVE]
  </template>
  <constraints>
    - length: 1-2 sentences
    - content: goal and objective
  </constraints>
  <example>
    Implement a secure password reset functionality that allows users to regain account access through email verification. This feature will reduce support ticket volume and improve user experience by providing self-service account recovery.
  </example>
  <validation_enhancement>
    - Reference validated specification context from Phase 4
    - Ensure alignment with established product goals and scope boundaries
  </validation_enhancement>
</section>

<section name="user_stories">
  <template>
    ## User Stories

    ### [STORY_TITLE]

    As a [USER_TYPE], I want to [ACTION], so that [BENEFIT].

    [DETAILED_WORKFLOW_DESCRIPTION]
  </template>
  <constraints>
    - count: 1-3 stories
    - include: workflow and problem solved
    - format: title + story + details
  </constraints>
  <validation_enhancement>
    - Build on user personas from validated specification context
    - Ensure consistency with Phase 4 validated requirements
  </validation_enhancement>
</section>

<section name="spec_scope">
  <template>
    ## Spec Scope

    1. **[FEATURE_NAME]** - [ONE_SENTENCE_DESCRIPTION]
    2. **[FEATURE_NAME]** - [ONE_SENTENCE_DESCRIPTION]
  </template>
  <constraints>
    - count: 1-5 features
    - format: numbered list
    - description: one sentence each
  </constraints>
</section>

<section name="out_of_scope">
  <template>
    ## Out of Scope

    - [EXCLUDED_FUNCTIONALITY_1]
    - [EXCLUDED_FUNCTIONALITY_2]
  </template>
  <purpose>explicitly exclude functionalities</purpose>
</section>

<section name="expected_deliverable">
  <template>
    ## Expected Deliverable

    1. [TESTABLE_OUTCOME_1]
    2. [TESTABLE_OUTCOME_2]
  </template>
  <constraints>
    - count: 1-3 expectations
    - focus: browser-testable outcomes
  </constraints>
</section>

<instructions>
  ACTION: Create spec.md with all sections
  FILL: Use spec details from steps 1-4 and Phase 4 validation context
  MAINTAIN: Clear, concise descriptions
  ENHANCE: Leverage validation context for consistency and alignment
</instructions>

</step>

<step number="7" name="create_technical_spec">

### Step 7: Create Technical Specification

<step_metadata>
  <creates>
    - file: .agent-os/specs/sub-specs/[FEATURE_FOLDER]/technical-spec.md (if not exists)
  </creates>
  <updates>
    - file: .agent-os/specs/sub-specs/[FEATURE_FOLDER]/technical-spec.md (if exists, find and update matching feature or append if new)
  </updates>
  <enhances>with Phase 4 validated architectural patterns and technical feasibility</enhances>
  <consolidation_mode>creates feature-specific folder structure for organized sub-specs</consolidation_mode>
</step_metadata>

<consolidation_mode_sub_specs_handling>
  IF CONSOLIDATION_MODE:
    # Create feature-specific folder for sub-specs
    feature_folder = derive_feature_folder_name(SOURCE_DATA.original_folder)
    sub_specs_folder = ".agent-os/specs/sub-specs/{feature_folder}"
    
    # Create feature folder if not exists
    create_directory_if_not_exists(sub_specs_folder)
    
    # Process each sub-spec type from source data
    FOR_EACH: sub_spec_type IN ["technical_spec", "api_spec", "database_schema", "tests"]:
      IF SOURCE_DATA.sub_specs_content[sub_spec_type] EXISTS:
        sub_spec_file = "{sub_specs_folder}/{sub_spec_type.replace('_', '-')}.md"
        
        # Create consolidated sub-spec with metadata
        consolidated_content = create_consolidation_sub_spec(
          sub_spec_type,
          SOURCE_DATA.sub_specs_content[sub_spec_type],
          SOURCE_DATA
        )
        
        write_file(sub_spec_file, consolidated_content)
        
        # Store consolidation progress
        CALL: mcp-memory-keeper-context_save
        PARAMETERS:
          - key: "consolidated-{sub_spec_type}-{SOURCE_DATA.original_folder}"
          - value: "Sub-spec {sub_spec_type} consolidated to {feature_folder} folder"
          - category: "progress"
          - priority: "normal"
        
        LOG: "📝 Created {sub_spec_file} from consolidation"
</consolidation_mode_sub_specs_handling>

<file_template>
  <header_new_file>
    # Technical Specification

    This is the technical specification for the features detailed in @.agent-os/specs/spec.md

    > Last Updated: [CURRENT_DATE]
    > Version: 1.0.0
  </header_new_file>
  <header_new_feature>
    ## Feature: [SPEC_NAME] Technical Requirements
    
    > Added: [CURRENT_DATE]
  </header_new_feature>
</file_template>

<spec_sections>
  <technical_requirements>
    - functionality details
    - UI/UX specifications
    - integration requirements
    - performance criteria
  </technical_requirements>
  <approach_options>
    - multiple approaches (if applicable)
    - selected approach
    - rationale for selection
  </approach_options>
  <external_dependencies>
    - new libraries/packages
    - justification for each
    - version requirements
  </external_dependencies>
  <validation_enhancements>
    - architectural patterns from Phase 4 validation
    - integration points with existing features from feasibility assessment
    - consistency with validated technical decisions
  </validation_enhancements>
</spec_sections>

<example_template>
  ## Technical Requirements

  - [SPECIFIC_TECHNICAL_REQUIREMENT]
  - [SPECIFIC_TECHNICAL_REQUIREMENT]

  ## Approach Options

  **Option A:** [DESCRIPTION]
  - Pros: [LIST]
  - Cons: [LIST]

  **Option B:** [DESCRIPTION] (Selected)
  - Pros: [LIST]
  - Cons: [LIST]

  **Rationale:** [EXPLANATION]

  [IF VALIDATION_CONTEXT_AVAILABLE]:
  **Consistency with Existing Architecture:** [PHASE4_ARCHITECTURAL_ALIGNMENT]

  ## External Dependencies

  - **[LIBRARY_NAME]** - [PURPOSE]
  - **Justification:** [REASON_FOR_INCLUSION]
</example_template>

<instructions>
  ACTION: Create sub-specs folder and technical-spec.md
  DOCUMENT: All technical decisions and requirements
  JUSTIFY: Any new dependencies
  ENHANCE: Leverage Phase 4 validation context for architectural consistency
</instructions>

</step>

<step number="8" name="create_database_schema">

### Step 8: Create Database Schema (Conditional)

<step_metadata>
  <creates>
    - file: .agent-os/specs/sub-specs/database-schema.md (if not exists)
  </creates>
  <updates>
    - file: .agent-os/specs/sub-specs/database-schema.md (if exists, find and update matching feature or append if new)
  </updates>
  <condition>only if database changes needed</condition>
</step_metadata>

<decision_tree>
  IF spec_requires_database_changes:
    CREATE or UPDATE .agent-os/specs/sub-specs/database-schema.md
  ELSE:
    SKIP this_step
</decision_tree>

<file_template>
  <header_new_file>
    # Database Schema

    This is the database schema implementation for the features detailed in @.agent-os/specs/spec.md

    > Last Updated: [CURRENT_DATE]
    > Version: 1.0.0
  </header_new_file>
  <header_new_feature>
    ## Feature: [SPEC_NAME] Database Changes
    
    > Added: [CURRENT_DATE]
  </header_new_feature>
</file_template>

<schema_sections>
  <changes>
    - new tables
    - new columns
    - modifications
    - migrations
  </changes>
  <specifications>
    - exact SQL or migration syntax
    - indexes and constraints
    - foreign key relationships
  </specifications>
  <rationale>
    - reason for each change
    - performance considerations
    - data integrity rules
  </rationale>
  <validation_enhancements>
    - consistency with existing schema patterns from Phase 4 validation
    - integration with established data models from feasibility assessment
  </validation_enhancements>
</schema_sections>

<instructions>
  ACTION: Check if database changes needed
  CREATE: database-schema.md only if required
  INCLUDE: Complete SQL/migration specifications
  ENHANCE: Ensure consistency with existing data architecture from Phase 4 validation
</instructions>

</step>

<step number="9" name="create_api_spec">

### Step 9: Create API Specification (Conditional)

<step_metadata>
  <creates>
    - file: .agent-os/specs/sub-specs/api-spec.md (if not exists)
  </creates>
  <updates>
    - file: .agent-os/specs/sub-specs/api-spec.md (if exists, find and update matching feature or append if new)
  </updates>
  <condition>only if API changes needed</condition>
</step_metadata>

<decision_tree>
  IF spec_requires_api_changes:
    CREATE or UPDATE .agent-os/specs/sub-specs/api-spec.md
  ELSE:
    SKIP this_step
</decision_tree>

<file_template>
  <header_new_file>
    # API Specification

    This is the API specification for the features detailed in @.agent-os/specs/spec.md

    > Last Updated: [CURRENT_DATE]
    > Version: 1.0.0
  </header_new_file>
  <header_new_feature>
    ## Feature: [SPEC_NAME] API Changes
    
    > Added: [CURRENT_DATE]
  </header_new_feature>
</file_template>

<api_sections>
  <routes>
    - HTTP method
    - endpoint path
    - parameters
    - response format
  </routes>
  <controllers>
    - action names
    - business logic
    - error handling
  </controllers>
  <purpose>
    - endpoint rationale
    - integration with features
  </purpose>
  <validation_enhancements>
    - consistency with existing API patterns from Phase 4 validation
    - integration with established authentication/authorization from feasibility assessment
  </validation_enhancements>
</api_sections>

<endpoint_template>
  ## Endpoints

  ### [HTTP_METHOD] [ENDPOINT_PATH]

  **Purpose:** [DESCRIPTION]
  **Parameters:** [LIST]
  **Response:** [FORMAT]
  **Errors:** [POSSIBLE_ERRORS]
  [IF VALIDATION_CONTEXT_AVAILABLE]:
  **Integration:** [PHASE4_API_PATTERN_CONSISTENCY]
</endpoint_template>

<instructions>
  ACTION: Check if API changes needed
  CREATE: api-spec.md only if required
  DOCUMENT: All endpoints and controllers
  ENHANCE: Ensure consistency with existing API architecture from Phase 4 validation
</instructions>

</step>

<step number="10" name="create_tests_spec">

### Step 10: Create Tests Specification

<step_metadata>
  <creates>
    - file: .agent-os/specs/sub-specs/tests.md (if not exists)
  </creates>
  <updates>
    - file: .agent-os/specs/sub-specs/tests.md (if exists, find and update matching feature or append if new)
  </updates>
</step_metadata>

<file_template>
  <header_new_file>
    # Tests Specification

    This is the tests coverage details for the features detailed in @.agent-os/specs/spec.md

    > Last Updated: [CURRENT_DATE]
    > Version: 1.0.0
  </header_new_file>
  <header_new_feature>
    ## Feature: [SPEC_NAME] Test Coverage
    
    > Added: [CURRENT_DATE]
  </header_new_feature>
</file_template>

<test_categories>
  <unit_tests>
    - model tests
    - service tests
    - helper tests
  </unit_tests>
  <integration_tests>
    - controller tests
    - API tests
    - workflow tests
  </integration_tests>
  <feature_tests>
    - end-to-end scenarios
    - user workflows
  </feature_tests>
  <mocking_requirements>
    - external services
    - API responses
    - time-based tests
  </mocking_requirements>
</test_categories>

<test_template>
  ## Test Coverage

  ### Unit Tests

  **[CLASS_NAME]**
  - [TEST_DESCRIPTION]
  - [TEST_DESCRIPTION]

  ### Integration Tests

  **[FEATURE_NAME]**
  - [SCENARIO_DESCRIPTION]
  - [SCENARIO_DESCRIPTION]

  ### Mocking Requirements

  - **[SERVICE_NAME]:** [MOCK_STRATEGY]
  
  [IF VALIDATION_CONTEXT_AVAILABLE]:
  ### Consistency with Existing Tests
  - **Testing Patterns:** [PHASE4_TESTING_PATTERNS]
  - **Coverage Standards:** [PHASE4_COVERAGE_REQUIREMENTS]
</test_template>

<instructions>
  ACTION: Create comprehensive test specification
  ENSURE: All new functionality has test coverage
  SPECIFY: Mock requirements for external services
  ENHANCE: Leverage Phase 4 validation context for testing consistency
</instructions>

</step>

<step number="11" name="user_review">

### Step 11: User Review

<step_metadata>
  <action>request user review</action>
  <reviews>
    - spec.md
    - all sub-specs files
  </reviews>
</step_metadata>

<review_request>
  I've created/updated the spec documentation:

  - Spec Requirements: @.agent-os/specs/spec.md
  - Technical Spec: @.agent-os/specs/sub-specs/technical-spec.md
  [LIST_OTHER_CREATED_SPECS]

  Please review and let me know if any changes are needed before I create the task breakdown.
</review_request>

<instructions>
  ACTION: Request user review of all documents
  WAIT: For approval or revision requests
  REVISE: Make requested changes if any
</instructions>

</step>

<step number="12" name="create_tasks">

### Step 12: Create or Update tasks.md

<step_metadata>
  <creates>
    - file: .agent-os/specs/tasks.md (if not exists)
  </creates>
  <updates>
    - file: .agent-os/specs/tasks.md (if exists, find and update matching feature tasks or append if new)
  </updates>
  <depends_on>user approval from step 11 (standard mode only)</depends_on>
  <enhances>with Phase 4 validation patterns and cross-project implementation insights</enhances>
  <consolidation_mode>processes provided tasks data for consistent formatting</consolidation_mode>
</step_metadata>

<consolidation_mode_tasks_handling>
  IF CONSOLIDATION_MODE:
    # Use provided tasks data instead of generating new tasks
    feature_tasks_section = create_consolidation_tasks_section(SOURCE_DATA)
    
    # Enhanced tasks section with consolidation metadata
    enhanced_tasks_section = add_consolidation_tasks_metadata(
      feature_tasks_section,
      original_folder = SOURCE_DATA.original_folder,
      original_date = SOURCE_DATA.original_date,
      consolidation_date = SOURCE_DATA.consolidation_date
    )
    
    # Handle update vs append vs create with intelligent task matching
    IF file_exists(".agent-os/specs/tasks.md"):
      existing_tasks_content = read_file(".agent-os/specs/tasks.md")
      
      # Look for existing feature task section by name/ID
      task_match = find_existing_task_section(
        existing_tasks_content,
        SOURCE_DATA.feature_name,
        [SOURCE_DATA.feature_id, SOURCE_DATA.original_folder]
      )
      
      IF task_match.found:
        # Update existing task section in place
        updated_content = replace_task_section(
          existing_tasks_content,
          task_match.section_range,
          enhanced_tasks_section
        )
        write_file(".agent-os/specs/tasks.md", updated_content)
        LOG: "🔄 Updated existing tasks for '{SOURCE_DATA.feature_name}' in tasks.md"
        LOG: "📍 Replaced task section at lines {task_match.section_range.start}-{task_match.section_range.end}"
      ELSE:
        # No existing task match found - append new tasks
        append_tasks_section_to_file(enhanced_tasks_section)
        LOG: "📋 Appended new tasks for '{SOURCE_DATA.feature_name}' to existing tasks.md"
    ELSE:
      create_tasks_file_with_consolidation_header(enhanced_tasks_section)
      LOG: "🆕 Created tasks.md with tasks for '{SOURCE_DATA.feature_name}'"
    
    # Store consolidation progress in memory
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "consolidated-tasks-{SOURCE_DATA.original_folder}"
      - value: "Feature tasks migrated via create-spec consolidation mode"
      - category: "progress"
      - priority: "normal"
</consolidation_mode_tasks_handling>

<specification_matching_algorithm>
  <!-- Intelligent spec/task section matching to prevent duplicates -->
  <matching_strategy>
    # Algorithm for finding existing feature sections in spec files
    
    FUNCTION: find_existing_feature_spec(content, feature_name, identifiers)
      # Multi-criteria matching to find existing specs
      matching_criteria = [
        "## Feature: {feature_name}",           # Exact feature name match
        "## {feature_name}",                    # Simple header match  
        "Feature: {feature_name} ",              # Inline feature reference
        "# {feature_name}",                     # H1 header match
        ">{feature_id}",                        # ID-based matching
        ">{original_folder}",                   # Folder-based matching
      ]
      
      FOR criteria in matching_criteria:
        match_position = find_in_content(content, criteria)
        IF match_position.found:
          section_range = extract_section_boundaries(
            content, 
            match_position.start,
            next_feature_header_or_end_of_file
          )
          RETURN: {
            "found": true,
            "section_range": section_range,
            "match_type": criteria,
            "confidence": calculate_match_confidence(criteria, feature_name)
          }
      
      RETURN: {"found": false}
    
    FUNCTION: replace_feature_section(content, section_range, new_section)
      # Replace existing section content while preserving file structure
      before_section = content[0:section_range.start]
      after_section = content[section_range.end:end]
      updated_content = before_section + new_section + after_section
      RETURN: updated_content
    
    LOG: "🔍 Intelligent spec matching prevents duplicate feature sections"
  </matching_strategy>
  
  <matching_benefits>
    # Benefits of intelligent spec matching vs naive append
    
    ✅ **Prevents Duplicates**: No duplicate feature sections in spec files
    ✅ **Maintains History**: Updates existing specs while preserving structure  
    ✅ **Version Control Friendly**: Clean diffs show actual changes, not additions
    ✅ **Keeps Files Organized**: Specs stay logically organized, not chronologically cluttered
    ✅ **Supports Iteration**: Easy to refine and update specifications over time
    ✅ **Memory Efficient**: Memory systems track updates, not redundant data
    
    LOG: "📋 Smart spec management improves workflow efficiency"
  </matching_benefits>
</specification_matching_algorithm>

<file_template>
  <header_new_file>
    # Project Tasks

    These are the tasks to be completed for all features detailed in @.agent-os/specs/spec.md

    > Last Updated: [CURRENT_DATE]
    > Status: Ready for Implementation

    ## Effort Scale

    Tasks are estimated using the following effort scale:

    | Scale | Estimated Effort |
    |-------|-----------------|
    | XS    | 1 hour           |
    | S     | 2 hours          |
    | M     | 4 hours          |
    | L     | 8 hours          |
    | XL    | 12+ hours        |
  </header_new_file>
  <header_new_feature>
    ## Feature: [SPEC_NAME] Tasks
    
    > Added: [CURRENT_DATE]
  </header_new_feature>
</file_template>

<task_structure>
  <major_tasks>
    - count: 1-5
    - format: numbered checklist
    - grouping: by feature or component
  </major_tasks>
  <subtasks>
    - count: up to 8 per major task
    - format: decimal notation (1.1, 1.2)
    - first_subtask: typically write tests
    - last_subtask: verify all tests pass
  </subtasks>
</task_structure>

<consolidation_tasks_template>
  ## Feature: [FEATURE_NAME] Tasks
  
  > Originally: [ORIGINAL_FOLDER_NAME]
  > Added: [ORIGINAL_DATE]
  > Consolidated: [CONSOLIDATION_DATE]
  
  [SOURCE_DATA.tasks_content]
  
  ---
</consolidation_tasks_template>

<standard_tasks_template>
  ## Feature: [FEATURE_NAME] Tasks
  
  > Added: [CURRENT_DATE]
  
  - [ ] 1. [MAJOR_TASK_DESCRIPTION] `[EFFORT]`
    - [ ] 1.1 Write tests for [COMPONENT] `[EFFORT]`
    - [ ] 1.2 [IMPLEMENTATION_STEP] `[EFFORT]`
    - [ ] 1.3 [IMPLEMENTATION_STEP] `[EFFORT]`
    - [ ] 1.4 Verify all tests pass `[EFFORT]`

  - [ ] 2. [MAJOR_TASK_DESCRIPTION] `[EFFORT]`
    - [ ] 2.1 Write tests for [COMPONENT] `[EFFORT]`
    - [ ] 2.2 [IMPLEMENTATION_STEP] `[EFFORT]`
    
  ---
</standard_tasks_template>

<ordering_principles>
  - Consider technical dependencies
  - Follow TDD approach
  - Group related functionality
  - Build incrementally
  - Leverage established patterns from Phase 4 validation and cross-project insights
</ordering_principles>

<instructions>
  ACTION: Create task breakdown following TDD
  STRUCTURE: Major tasks with subtasks
  ORDER: Consider dependencies and Phase 4 validation patterns
  ESTIMATE: Add effort scale (XS, S, M, L, XL) to each task and subtask
  REFER: Use the effort scale definition in the header
  ENHANCE: Leverage Phase 4 validation context for implementation approach
</instructions>

</step>

<step number="12.5" name="mcp_knowledge_persistence">

### Step 12.5: MCP Knowledge Persistence

<step_metadata>
  <action>capture and store task creation insights in MCP systems</action>
  <purpose>build persistent knowledge for future projects and cross-project learning</purpose>
  <stores>task patterns, implementation approaches, validation results</stores>
  <condition>Memory-Keeper and Memento required</condition>
</step_metadata>

<mcp_persistence_categories>
  <task_creation_patterns>
    - Task breakdown strategies and granularity
    - TDD approach and test-first patterns
    - Implementation sequencing and dependencies
    - Effort estimation accuracy and patterns
  </task_creation_patterns>
  <validation_results>
    - Phase 4 validation outcomes and lessons
    - Technical feasibility assessments
    - Risk mitigation strategies applied
    - Quality standards adherence patterns
  </validation_results>
  <cross_project_insights>
    - Similar project task patterns
    - Successful implementation approaches
    - Common pitfalls and avoidance strategies
    - Best practices for technology stack
  </cross_project_insights>
</mcp_persistence_categories>

<mcp_persistence_process>
  # Store Phase 5 completion and task patterns
  CALL: mcp-memory-keeper-context_save
  PARAMETERS:
    - key: "tasks-list-complete"
    - value: "Phase 5 completed: {tasks_created_count} tasks created for {PROJECT_NAME}"
    - category: "progress"
    - priority: "high"
  
  # Store task creation patterns in Memento for cross-project learning
  CALL: memento-mcp-add_observations
  PARAMETERS:
    - observations: [{
        "entityName": "{PROJECT_ENTITY_NAME}",
        "contents": [
          "Phase 5 Complete: Task breakdown created",
          "Task Count: {total_tasks_created}",
          "TDD Approach: {tdd_patterns_used}",
          "Effort Estimation: {effort_distribution}",
          "Technology: {PRIMARY_TECH}",
          "Completion Date: {current_date()}"
        ]
      }]
  
  # Create task pattern entities for future reference
  CALL: memento-mcp-create_entities
  PARAMETERS:
    - entities: [{
        "name": "{PROJECT_ENTITY_NAME}-task-patterns",
        "entityType": "task_creation_pattern",
        "observations": [
          "Breakdown Strategy: {task_breakdown_approach}",
          "TDD Integration: {test_first_patterns}",
          "Effort Scale Used: {effort_scale_distribution}",
          "Dependencies: {key_dependencies_identified}"
        ]
      }]
  
  # Link to project workflow completion
  CALL: memento-mcp-create_relations
  PARAMETERS:
    - relations: [{
        "from": "{PROJECT_ENTITY_NAME}-workflow",
        "to": "{PROJECT_ENTITY_NAME}-task-patterns",
        "relationType": "completed_with",
        "metadata": {"phase": "5", "completion_date": "{current_date()}"}
      }]
</mcp_persistence_process>

<persistence_template>
  ## Phase 5: Task Creation Complete
  
  The following insights have been stored in MCP memory systems:
  
  ### Task Creation Patterns
  - **Breakdown Strategy**: [TASK_BREAKDOWN_APPROACH]
  - **TDD Integration**: [TEST_FIRST_PATTERNS]
  - **Effort Distribution**: [EFFORT_SCALE_USAGE]
  - **Dependency Mapping**: [IDENTIFIED_DEPENDENCIES]
  
  ### Validation Integration
  - **Phase 4 Results**: [VALIDATION_OUTCOMES_APPLIED]
  - **Risk Mitigation**: [RISK_AREAS_ADDRESSED]
  - **Quality Standards**: [STANDARDS_MAINTAINED]
  - **Technical Feasibility**: [FEASIBILITY_CONSIDERATIONS]
  
  ### Cross-Project Learning
  - **Similar Projects**: [PATTERN_MATCHES_FOUND]
  - **Best Practices**: [APPLIED_BEST_PRACTICES]
  - **Lessons Learned**: [PITFALLS_AVOIDED]
  - **Technology Patterns**: [TECH_SPECIFIC_APPROACHES]
  
  ### Workflow Completion
  - **5-Phase Workflow**: Completed [CURRENT_DATE]
  - **Ready for Implementation**: Task breakdown created with {TASK_COUNT} tasks
  - **Estimated Effort**: [TOTAL_EFFORT_ESTIMATE]
  - **Next Steps**: Ready for execute-tasks workflow
</persistence_template>

<instructions>
  ACTION: Extract and categorize specification session insights
  STORE: Save structured knowledge to memory-keeper (if available)
  ESTABLISH: Cross-references and integration points
  PREPARE: Foundation for implementation phase
</instructions>

</step>

<step number="13" name="update_cross_references">

### Step 13: Documentation Cross-References

<step_metadata>
  <updates>
    - file: .agent-os/specs/spec.md
  </updates>
  <adds>references to all spec files at end of current feature</adds>
</step_metadata>

<reference_template>
  #### Documentation References

  - Tasks: @.agent-os/specs/tasks.md
  - Technical Specification: @.agent-os/specs/sub-specs/technical-spec.md
  - API Specification: @.agent-os/specs/sub-specs/api-spec.md
  - Database Schema: @.agent-os/specs/sub-specs/database-schema.md
  - Tests Specification: @.agent-os/specs/sub-specs/tests.md
</reference_template>

<reference_format>
  - Use @ prefix for clickable paths
  - Include full path from project root
  - Only list files that were created
</reference_format>

<instructions>
  ACTION: Update spec.md with references
  FORMAT: Use @ prefix for all paths
  INCLUDE: Only files actually created
</instructions>

</step>

<step number="14" name="decision_documentation">

### Step 14: Decision Documentation

<step_metadata>
  <evaluates>strategic impact</evaluates>
  <updates>decisions.md if needed</updates>
</step_metadata>

<decision_analysis>
  <review_against>
    - @.agent-os/product/mission.md
    - @.agent-os/product/decisions.md
  </review_against>
  <criteria>
    - changes product direction
    - impacts roadmap priorities
    - introduces new technical patterns
    - affects user experience significantly
  </criteria>
</decision_analysis>

<decision_tree>
  IF spec_impacts_mission_or_roadmap:
    IDENTIFY key_decisions (max 3)
    DOCUMENT decision_details
    ASK user_for_approval
    IF approved:
      UPDATE decisions.md
  ELSE:
    STATE "This spec is inline with the current mission and roadmap, so no need to post anything to our decisions log at this time."
</decision_tree>

<decision_template>
  ## [CURRENT_DATE]: [DECISION_TITLE]

  **ID:** DEC-[NEXT_NUMBER]
  **Status:** Accepted
  **Category:** [technical/product/business/process]
  **Related Spec:** @.agent-os/specs/spec.md

  ### Decision

  [DECISION_SUMMARY]

  ### Context

  [WHY_THIS_DECISION_WAS_NEEDED]

  ### Consequences

  **Positive:**
  - [EXPECTED_BENEFITS]

  **Negative:**
  - [KNOWN_TRADEOFFS]
</decision_template>

<instructions>
  ACTION: Analyze spec for strategic decisions
  IDENTIFY: Up to 3 key decisions if any
  REQUEST: User approval before updating
  UPDATE: Add to decisions.md if approved
</instructions>

</step>

<step number="15" name="execution_readiness">

### Step 15: Execution Readiness Check

<step_metadata>
  <evaluates>readiness to begin implementation</evaluates>
  <depends_on>completion of all previous steps</depends_on>
</step_metadata>

<readiness_summary>
  <present_to_user>
    - Spec name and description
    - First task summary from tasks.md
    - Estimated complexity/scope
    - Key deliverables for task 1
    - MCP memory integration status
  </present_to_user>
</readiness_summary>

<execution_prompt>
  PROMPT: "The spec planning is complete. The first task is:

  **Task 1:** [FIRST_TASK_TITLE]
  [BRIEF_DESCRIPTION_OF_TASK_1_AND_SUBTASKS]

  [IF MCP_AVAILABLE]:
  **MCP Memory Context:** This specification has been stored in Memory-Keeper and Memento systems and will be available for future sessions and cross-project learning.

  Would you like me to proceed with implementing Task 1? I will follow the execution guidelines in @~/.agent-os/instructions/execute-tasks.md and focus only on this first task and its subtasks unless you specify otherwise.

  Type 'yes' to proceed with Task 1, or let me know if you'd like to review or modify the plan first."
</execution_prompt>

<execution_flow>
  IF user_confirms_yes:
    REFERENCE: @~/.agent-os/instructions/execute-tasks.md
    FOCUS: Only Task 1 and its subtasks
    CONSTRAINT: Do not proceed to additional tasks without explicit user request
  ELSE:
    WAIT: For user clarification or modifications
</execution_flow>

<instructions>
  ACTION: Summarize first task and MCP memory system status
  REFERENCE: Use execute-tasks.md for implementation
  SCOPE: Limit to Task 1 only unless user specifies otherwise
  HIGHLIGHT: MCP memory system benefits for future work and cross-project learning
</instructions>

</step>

</process_flow>

## Execution Standards

<standards>
  <follow>
    - @.agent-os/product/code-style.md
    - @.agent-os/product/dev-best-practices.md
    - @.agent-os/product/tech-stack.md
  </follow>
  <maintain>
    - Consistency with product mission
    - Alignment with roadmap
    - Technical coherence
    - Cross-specification consistency (enhanced with Integrated Memory System)
  </maintain>
  <create>
    - Comprehensive documentation
    - Clear implementation path
    - Testable outcomes
    - Integrated Memory System entries for future reference
  </create>
</standards>

## Error Handling

<error_scenarios>
  <scenario name="specification_error_occurs">
    <condition>Any error occurs during specification creation or context analysis</condition>
    <action>Execute memory-guided error resolution procedures</action>
    <procedure>
      1. IMMEDIATE: Store error details in Memory-Keeper for tracking
      2. SEARCH: Query Memory-Keeper and Memento for similar specification errors
      3. APPLY: Try memory-guided solutions in confidence order
      4. DOCUMENT: Store successful resolution for future reference
      5. REFERENCE: Follow detailed procedures in @error-resolution-via-memory.md
    </procedure>
    <enhancement>Build cross-project specification error solution database</enhancement>
  </scenario>
  <scenario name="context_analysis_failure">
    <condition>Unable to analyze existing specifications or documentation</condition>
    <action>Apply memory-guided troubleshooting for context gathering issues</action>
    <fallback>Continue with reduced context but document limitation</fallback>
  </scenario>
</error_scenarios>

<final_checklist>
  <verify>
    - [ ] Memory-keeper initialization attempted (if available)
    - [ ] Project context retrieved from Integrated Memory System (if available)
    - [ ] Consolidated specs directory structure prepared
    - [ ] spec.md contains all required sections enhanced with Memory System context
    - [ ] All applicable sub-specs created with architectural consistency
    - [ ] User approved documentation
    - [ ] tasks.md created with TDD approach and Memory System patterns
    - [ ] Cross-references added to spec.md
    - [ ] Strategic decisions evaluated and documented
    - [ ] Specification insights stored in Integrated Memory System (if available)
    - [ ] Cross-spec relationships established in Integrated Memory System
  </verify>
</final_checklist>

<memory_system_integration_benefits>
  - Enhanced specification consistency across related features
  - Reduced context memory through persistent architectural knowledge
  - Cross-specification relationship tracking and management
  - Informed technical decision-making based on project history
  - Accelerated specification creation through pattern reuse
  - Improved integration planning through dependency awareness
</memory_system_integration_benefits>
