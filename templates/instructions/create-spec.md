---
description: Spec Creation Rules for Agent OS with Memory-Keeper Integration
globs:
alwaysApply: false
version: 2.0
encoding: UTF-8
---

# Spec Creation Rules

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
  - Create detailed spec plans for specific features
  - Generate structured documentation for implementation
  - Ensure alignment with product roadmap and mission
  - Integrate memory-keeper for enhanced context and cross-spec continuity
</purpose>

<context>
  - Part of Agent OS framework
  - Executed when implementing roadmap items
  - Creates spec-specific documentation
  - Enhanced with persistent knowledge base for informed specification
</context>

<prerequisites>
  - Product documentation exists in .agent-os/product/
  - Access to:
    - @.agent-os/product/mission.md,
    - @.agent-os/product/roadmap.md,
    - @.agent-os/product/tech-stack.md
  - User has spec idea or roadmap reference
  - Memory-keeper MCP available (optional, graceful degradation)
</prerequisites>

<process_flow>

<step number="0" name="memory_and_precedence_initialization">

### Step 0: Initialize Memory Systems and Resolve Precedence

<consolidation_mode_detection>
  # Check if running in consolidation mode (called by consolidate-specs)
  IF parameters.mode == "consolidation":
    CONSOLIDATION_MODE = true
    SKIP_INTERACTIVE = parameters.skip_interactive || true
    SOURCE_DATA = parameters.source_data
    APPEND_MODE = parameters.append_to_existing || true
    MEMORY_CONTEXT = parameters.memory_context || "consolidation"
    PRESERVE_METADATA = parameters.preserve_original_metadata || true
    
    LOG: "🔄 Create-spec running in consolidation mode for {SOURCE_DATA.feature_name}"
    LOG: "📁 Source: {SOURCE_DATA.original_folder} → Consolidated structure"
  ELSE:
    CONSOLIDATION_MODE = false
    LOG: "🆕 Create-spec running in standard interactive mode"
</consolidation_mode_detection>

<precedence_resolution>
  <!-- Include precedence rules -->
  <include>@reference-docs/instructions/precedence-rules.md</include>
  
  # Assert Agent OS command precedence
  AGENT_OS_COMMAND = "create-spec"
  CURRENT_MODE = "AGENT_OS_COMMAND_ACTIVE"
  LOG: "🔴 Agent OS create-spec active - absolute precedence"
</precedence_resolution>

<memory_initialization>
  <!-- Include memory integration -->
  <include>@reference-docs/instructions/memory-integration.md</include>
  
  # Access detected context from memory integration
  PROJECT_NAME = DETECTION_CONTEXT["project_name"]
  PRIMARY_TECH = DETECTION_CONTEXT["primary_tech"]
  TECH_STACKS = DETECTION_CONTEXT["tech_stacks"]
  CONFIDENCE_LEVEL = DETECTION_CONTEXT["confidence_level"]
  AVAILABLE_ENTITIES = DETECTION_CONTEXT["entities"]
  
  LOG: "Memory-enhanced create-spec initialized for {PROJECT_NAME} ({PRIMARY_TECH})"
</memory_initialization>

### Legacy Knowledge Base Initialization (Deprecated)

<step_metadata>
  <action>initialize project knowledge base</action>
  <purpose>setup memory-keeper for persistent project context</purpose>
  <creates>project namespace in memory-keeper</creates>
</step_metadata>

<kb_namespace>
  <project_name>derived from current directory name</project_name>
  <namespace_format>kb_{sanitized_project_name}</namespace_format>
  <session_description>Agent OS create-spec operation</session_description>
</kb_namespace>

<kb_initialization_process>
  <availability_check>
    1. CHECK if memory-keeper MCP is available
    2. IF available: PROCEED with KB initialization
    3. IF unavailable: LOG unavailability and SKIP to step 1
  </availability_check>
  <namespace_setup>
    1. GENERATE project namespace from directory name
    2. START new context session with project directory path
    3. SET session description: "Agent OS create-spec operation"
    4. LOG successful KB initialization
  </namespace_setup>
  <fallback_behavior>
    1. IF memory-keeper unavailable: USE standard file-based context loading
    2. DOCUMENT limitation in response
    3. CONTINUE with existing workflow patterns
  </fallback_behavior>
</kb_initialization_process>

<instructions>
  ACTION: Initialize memory-keeper with project-specific namespace
  VERIFY: Memory-keeper availability before proceeding
  FALLBACK: Gracefully degrade to file-based context if unavailable
  LOG: Initialization status for transparency
</instructions>

</step>

<step number="1" name="spec_initiation">

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

<step number="1.5" name="kb_context_retrieval">

### Step 1.5: Knowledge Base Context Retrieval

<step_metadata>
  <action>load relevant project context from KB</action>
  <purpose>reduce context memory by leveraging persistent knowledge</purpose>
  <queries>specifications, decisions, architectural patterns</queries>
  <condition>only if memory-keeper available</condition>
</step_metadata>

<kb_query_categories>
  <feature_specifications>
    - Previously defined user stories and requirements
    - Accepted requirements and scope decisions
    - Integration points and dependencies from other specs
  </feature_specifications>
  <technical_architecture>
    - Technology stack decisions and rationale
    - Architectural patterns and constraints
    - Performance and scalability considerations
  </technical_architecture>
  <implementation_decisions>
    - Code patterns and style preferences established
    - Library choices and justifications
    - Testing strategies and coverage requirements
  </implementation_decisions>
  <project_context>
    - Product mission and user goals
    - Current development phase and priorities
    - Recent specification work and outcomes
  </project_context>
</kb_query_categories>

<kb_retrieval_process>
  <semantic_search>
    1. QUERY memory-keeper for specification and architecture context
    2. SEARCH for related specifications and implementation patterns
    3. RETRIEVE relevant entries from each category
    4. SYNTHESIZE unified context summary for informed specification
  </semantic_search>
  <context_filtering>
    1. FILTER retrieved context by current spec relevance
    2. PRIORITIZE recent specifications and architectural decisions
    3. EXCLUDE outdated or superseded information
    4. LIMIT total context to manageable size (2000 tokens max)
  </context_filtering>
  <fallback_behavior>
    1. IF memory-keeper unavailable: SKIP this step
    2. CONTINUE with standard file-based workflow
    3. DOCUMENT KB unavailability in session notes
  </fallback_behavior>
</kb_retrieval_process>

<context_synthesis_template>
  ## Retrieved Project Context
  
  Based on project history and previous decisions:
  
  ### Related Specifications
  - **[SPEC_NAME_1]**: [SPEC_SUMMARY_FROM_KB]
  - **[SPEC_NAME_2]**: [SPEC_SUMMARY_FROM_KB]
  
  ### Technical Context
  - **Architecture**: [CURRENT_ARCHITECTURE_FROM_KB]
  - **Patterns**: [ESTABLISHED_PATTERNS_FROM_KB]
  - **Constraints**: [TECHNICAL_CONSTRAINTS_FROM_KB]
  
  ### Implementation Context
  - **Code Style**: [CODE_PREFERENCES_FROM_KB]
  - **Testing Strategy**: [TESTING_APPROACH_FROM_KB]
  - **Integration Points**: [KNOWN_INTEGRATIONS_FROM_KB]
  
  ### Project Priorities
  - [PRIORITY_INSIGHT_1_FROM_KB]
  - [PRIORITY_INSIGHT_2_FROM_KB]
</context_synthesis_template>

<instructions>
  ACTION: Query memory-keeper for specification context (if available)
  SYNTHESIZE: Combine KB results with current spec requirements
  FILTER: Limit context to current specification relevance
  FALLBACK: Skip if memory-keeper unavailable
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
  <enhances>with KB context if available</enhances>
</step_metadata>

<context_analysis>
  <mission>overall product vision</mission>
  <roadmap>current progress and plans</roadmap>
  <tech_stack>technical requirements</tech_stack>
  <kb_context>related specifications and patterns if available</kb_context>
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
</instructions>

</step>

<step number="3" name="documentation_verification">

### Step 3: Documentation Verification with Context7

<step_metadata>
  <purpose>ensure latest documentation for implementation</purpose>
  <required>true</required>
</step_metadata>

<context7_verification>
  <process>
    1. IDENTIFY primary technologies for this spec from tech-stack.md
    2. FOR EACH technology identified:
       a. EXTRACT Meilisearch key from mapping in tech-stack.md
       b. SEARCH Meilisearch cache using the extracted key
       c. IF cached documentation exists AND is not stale (< 30 days old):
          i. RETRIEVE documentation from Meilisearch
          ii. LOG cache hit for metrics
       d. IF NO cached documentation OR cache is stale:
          i. RESOLVE library ID using mcp__proxmoxmcp__context7-resolve-library-id
          ii. FETCH documentation using mcp__proxmoxmcp__context7-get-library-docs
          iii. STORE documentation in Meilisearch with the following schema:
               - id: "[language]_[library_name]" (e.g., "laravel_framework")
               - library_id: Context7 library ID (e.g., "/laravel/laravel")
               - title: "Documentation for [library_name]"
               - content: Full documentation content
               - fetch_date: Current date (YYYY-MM-DD format)
               - tokens: Number of tokens retrieved
               - topic: Topic used for focused documentation (if any)
               - version: Library version information (if available)
          iv. LOG cache miss and update for metrics
       e. SEARCH for specific implementation patterns related to spec
       f. DOCUMENT relevant findings
    3. VERIFY design patterns against latest best practices
  </process>
</context7_verification>

<verification_template>
  ## Documentation Verification

  I've verified the spec requirements against the latest documentation:

  - **[TECH_NAME]**: `[CONTEXT7_LIBRARY_ID]`
    - [KEY_IMPLEMENTATION_PATTERN_1]
    - [KEY_IMPLEMENTATION_PATTERN_2]
    - Source: [CACHE_HIT ? "Meilisearch cache" : "Context7 API"]
    - Cache Status: [CACHE_STATUS]
  
  - **[TECH_NAME]**: `[CONTEXT7_LIBRARY_ID]`
    - [KEY_IMPLEMENTATION_PATTERN_1]
    - [KEY_IMPLEMENTATION_PATTERN_2]
    - Source: [CACHE_HIT ? "Meilisearch cache" : "Context7 API"]
    - Cache Status: [CACHE_STATUS]
</verification_template>

<instructions>
  ACTION: Check Meilisearch cache first, then use Context7 MCP tools if needed
  FOCUS: Technologies directly relevant to this spec
  DOCUMENT: Specific implementation patterns and best practices
  VALIDATE: Spec design against current documentation
  CACHE: Store Context7 documentation in Meilisearch for future use
  RECORD: Document source (cache or API) and cache status for each technology
  UPDATE: Refresh stale cache entries (older than 30 days)
  STRUCTURE: Follow the Meilisearch schema for consistent caching
</instructions>

</step>

<step number="4" name="requirements_clarification">

### Step 4: Requirements Clarification

<step_metadata>
  <required_clarifications>
    - scope_boundaries: string
    - technical_considerations: array[string]
  </required_clarifications>
  <enhances>with KB insights if available</enhances>
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
    - alignment with previous specifications from KB
    - consistency with established patterns
    - integration with existing features
  </consistency>
</clarification_areas>

<decision_tree>
  IF clarification_needed:
    ASK numbered_questions (enhanced with KB context)
    WAIT for_user_response
  ELSE:
    PROCEED to_date_determination
</decision_tree>

<question_template>
  Based on the spec description and project context, I need clarification on:

  1. [SPECIFIC_QUESTION_ABOUT_SCOPE]
  2. [SPECIFIC_QUESTION_ABOUT_TECHNICAL_APPROACH]
  3. [SPECIFIC_QUESTION_ABOUT_USER_EXPERIENCE]
  [IF KB_AVAILABLE]:
  4. [CONSISTENCY_QUESTION_BASED_ON_KB_CONTEXT]
</question_template>

<instructions>
  ACTION: Evaluate need for clarification
  ASK: Numbered questions if needed (enhanced with KB insights)
  PROCEED: Only with clear requirements
  ENHANCE: Use KB context to identify potential consistency issues
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
    - file: .agent-os/specs/spec.md (if exists, append new feature)
  </updates>
  <enhances>with KB context if available</enhances>
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
    
    # Handle append vs create based on APPEND_MODE
    IF APPEND_MODE AND file_exists(".agent-os/specs/spec.md"):
      append_feature_section_to_spec(enhanced_section)
      LOG: "📝 Appended {SOURCE_DATA.feature_name} to existing spec.md"
    ELSE:
      create_spec_file_with_consolidation_header(enhanced_section)
      LOG: "🆕 Created spec.md with consolidated feature {SOURCE_DATA.feature_name}"
    
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
  <kb_enhancement>
    - Reference related specifications from KB if available
    - Ensure alignment with established product goals
  </kb_enhancement>
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
  <kb_enhancement>
    - Build on user personas from KB if available
    - Ensure consistency with previous user stories
  </kb_enhancement>
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
  FILL: Use spec details from steps 1-4 and KB context if available
  MAINTAIN: Clear, concise descriptions
  ENHANCE: Leverage KB context for consistency and alignment
</instructions>

</step>

<step number="7" name="create_technical_spec">

### Step 7: Create Technical Specification

<step_metadata>
  <creates>
    - file: .agent-os/specs/sub-specs/[FEATURE_FOLDER]/technical-spec.md (if not exists)
  </creates>
  <updates>
    - file: .agent-os/specs/sub-specs/[FEATURE_FOLDER]/technical-spec.md (if exists, append new feature section)
  </updates>
  <enhances>with KB architectural patterns if available</enhances>
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
  <kb_enhancements>
    - architectural patterns from KB
    - integration points with existing features
    - consistency with established technical decisions
  </kb_enhancements>
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

  [IF KB_AVAILABLE]:
  **Consistency with Existing Architecture:** [KB_ARCHITECTURAL_ALIGNMENT]

  ## External Dependencies

  - **[LIBRARY_NAME]** - [PURPOSE]
  - **Justification:** [REASON_FOR_INCLUSION]
</example_template>

<instructions>
  ACTION: Create sub-specs folder and technical-spec.md
  DOCUMENT: All technical decisions and requirements
  JUSTIFY: Any new dependencies
  ENHANCE: Leverage KB context for architectural consistency
</instructions>

</step>

<step number="8" name="create_database_schema">

### Step 8: Create Database Schema (Conditional)

<step_metadata>
  <creates>
    - file: .agent-os/specs/sub-specs/database-schema.md (if not exists)
  </creates>
  <updates>
    - file: .agent-os/specs/sub-specs/database-schema.md (if exists, append new feature section)
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
  <kb_enhancements>
    - consistency with existing schema patterns from KB
    - integration with established data models
  </kb_enhancements>
</schema_sections>

<instructions>
  ACTION: Check if database changes needed
  CREATE: database-schema.md only if required
  INCLUDE: Complete SQL/migration specifications
  ENHANCE: Ensure consistency with existing data architecture from KB
</instructions>

</step>

<step number="9" name="create_api_spec">

### Step 9: Create API Specification (Conditional)

<step_metadata>
  <creates>
    - file: .agent-os/specs/sub-specs/api-spec.md (if not exists)
  </creates>
  <updates>
    - file: .agent-os/specs/sub-specs/api-spec.md (if exists, append new feature section)
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
  <kb_enhancements>
    - consistency with existing API patterns from KB
    - integration with established authentication/authorization
  </kb_enhancements>
</api_sections>

<endpoint_template>
  ## Endpoints

  ### [HTTP_METHOD] [ENDPOINT_PATH]

  **Purpose:** [DESCRIPTION]
  **Parameters:** [LIST]
  **Response:** [FORMAT]
  **Errors:** [POSSIBLE_ERRORS]
  [IF KB_AVAILABLE]:
  **Integration:** [KB_API_PATTERN_CONSISTENCY]
</endpoint_template>

<instructions>
  ACTION: Check if API changes needed
  CREATE: api-spec.md only if required
  DOCUMENT: All endpoints and controllers
  ENHANCE: Ensure consistency with existing API architecture from KB
</instructions>

</step>

<step number="10" name="create_tests_spec">

### Step 10: Create Tests Specification

<step_metadata>
  <creates>
    - file: .agent-os/specs/sub-specs/tests.md (if not exists)
  </creates>
  <updates>
    - file: .agent-os/specs/sub-specs/tests.md (if exists, append new feature section)
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
  
  [IF KB_AVAILABLE]:
  ### Consistency with Existing Tests
  - **Testing Patterns:** [KB_TESTING_PATTERNS]
  - **Coverage Standards:** [KB_COVERAGE_REQUIREMENTS]
</test_template>

<instructions>
  ACTION: Create comprehensive test specification
  ENSURE: All new functionality has test coverage
  SPECIFY: Mock requirements for external services
  ENHANCE: Leverage KB context for testing consistency
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
    - file: .agent-os/specs/tasks.md (if exists, append new feature tasks)
  </updates>
  <depends_on>user approval from step 11 (standard mode only)</depends_on>
  <enhances>with KB implementation patterns if available</enhances>
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
    
    # Handle append vs create based on APPEND_MODE
    IF APPEND_MODE AND file_exists(".agent-os/specs/tasks.md"):
      append_tasks_section_to_file(enhanced_tasks_section)
      LOG: "📋 Appended {SOURCE_DATA.feature_name} tasks to existing tasks.md"
    ELSE:
      create_tasks_file_with_consolidation_header(enhanced_tasks_section)
      LOG: "🆕 Created tasks.md with consolidated feature {SOURCE_DATA.feature_name} tasks"
    
    # Store consolidation progress in memory
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "consolidated-tasks-{SOURCE_DATA.original_folder}"
      - value: "Feature tasks migrated via create-spec consolidation mode"
      - category: "progress"
      - priority: "normal"
</consolidation_mode_tasks_handling>

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
  - Leverage established patterns from KB if available
</ordering_principles>

<instructions>
  ACTION: Create task breakdown following TDD
  STRUCTURE: Major tasks with subtasks
  ORDER: Consider dependencies and KB patterns
  ESTIMATE: Add effort scale (XS, S, M, L, XL) to each task and subtask
  REFER: Use the effort scale definition in the header
  ENHANCE: Leverage KB context for implementation approach
</instructions>

</step>

<step number="12.5" name="kb_knowledge_persistence">

### Step 12.5: Knowledge Base Persistence

<step_metadata>
  <action>capture and store session insights</action>
  <purpose>build persistent knowledge for future sessions</purpose>
  <stores>specifications, technical decisions, implementation approaches</stores>
  <condition>only if memory-keeper available</condition>
</step_metadata>

<kb_persistence_categories>
  <specification_decisions>
    - Feature requirements and scope established
    - User stories and acceptance criteria
    - Technical approach and architecture selected
    - API and database design decisions
  </specification_decisions>
  <implementation_patterns>
    - Code patterns and architectural choices
    - Testing strategies and coverage requirements
    - Integration approaches and dependencies
    - Performance and scalability considerations
  </implementation_patterns>
  <cross_spec_relationships>
    - Dependencies on other specifications
    - Integration points with existing features
    - Shared components and patterns
    - Consistency requirements and constraints
  </cross_spec_relationships>
</kb_persistence_categories>

<kb_persistence_process>
  <insight_extraction>
    1. ANALYZE session content for key specification decisions and insights
    2. EXTRACT technical approaches, user requirements, and implementation details
    3. CATEGORIZE findings by persistence category
    4. PRIORITIZE information by future development relevance
  </insight_extraction>
  <knowledge_storage>
    1. SAVE specification decisions and requirements to memory-keeper
    2. STORE technical architecture and implementation approaches
    3. TAG entries with relevant feature areas and integration points
    4. LINK to created specification files and related documentation
  </knowledge_storage>
  <cross_reference_establishment>
    1. CONNECT new specification to related existing specs
    2. ESTABLISH integration points and dependencies
    3. UPDATE project architecture knowledge with new patterns
    4. MAINTAIN consistency across all project specifications
  </cross_reference_establishment>
  <fallback_behavior>
    1. IF memory-keeper unavailable: SKIP KB persistence
    2. DOCUMENT key specification insights in session summary
    3. RECOMMEND manual knowledge capture in project documentation
  </fallback_behavior>
</kb_persistence_process>

<persistence_template>
  ## Specification Knowledge Captured
  
  The following insights have been stored in the project knowledge base:
  
  ### Specification Decisions
  - **Feature Scope**: [CAPTURED_SCOPE_AND_REQUIREMENTS]
  - **User Stories**: [CAPTURED_USER_REQUIREMENTS]
  - **Technical Approach**: [CAPTURED_TECHNICAL_DECISIONS]
  - **Integration Points**: [CAPTURED_INTEGRATION_REQUIREMENTS]
  
  ### Implementation Patterns
  - **Architecture Pattern**: [CAPTURED_ARCHITECTURAL_APPROACH]
  - **Code Patterns**: [CAPTURED_IMPLEMENTATION_PATTERNS]
  - **Testing Strategy**: [CAPTURED_TESTING_APPROACH]
  - **Dependencies**: [CAPTURED_EXTERNAL_DEPENDENCIES]
  
  ### Cross-Spec Relationships
  - **Related Specifications**: [IDENTIFIED_RELATED_SPECS]
  - **Shared Components**: [IDENTIFIED_SHARED_ELEMENTS]
  - **Integration Requirements**: [CAPTURED_INTEGRATION_NEEDS]
  - **Consistency Constraints**: [IDENTIFIED_CONSISTENCY_REQUIREMENTS]
  
  ### Project Timeline Updated
  - **Specification Phase**: Completed [CURRENT_DATE]
  - **Ready for Implementation**: Task breakdown created
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
    - KB context integration status
  </present_to_user>
</readiness_summary>

<execution_prompt>
  PROMPT: "The spec planning is complete. The first task is:

  **Task 1:** [FIRST_TASK_TITLE]
  [BRIEF_DESCRIPTION_OF_TASK_1_AND_SUBTASKS]

  [IF KB_AVAILABLE]:
  **Memory System Context:** This specification has been stored in the Integrated Memory System and will be available for future sessions and related specifications.

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
  ACTION: Summarize first task and Integrated Memory System status
  REFERENCE: Use execute-tasks.md for implementation
  SCOPE: Limit to Task 1 only unless user specifies otherwise
  HIGHLIGHT: Integrated Memory System benefits for future work
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
