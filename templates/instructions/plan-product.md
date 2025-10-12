---
description: Product Planning Rules for Agent OS with Memory-Keeper Integration
globs:
alwaysApply: false
version: 5.0
encoding: UTF-8
---

# Product Planning Rules

<ai_meta>
  <parsing_rules>
    - Initialize memory systems before planning
    - Process XML blocks first for structured data
    - Execute instructions in sequential order
    - Use templates as exact patterns
    - Request missing data rather than assuming
    - Store user inputs in memory systems vs context accumulation
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
  - Generate comprehensive product documentation for new projects
  - Create structured files for AI agent consumption
  - Establish consistent project initialization
  - Integrate memory-keeper for persistent knowledge management
</purpose>

<context>
  - Part of Agent OS framework
  - Triggered during project initialization
  - Output used by AI agents throughout development
  - Enhanced with persistent knowledge base for cross-session continuity
</context>

<prerequisites>
  - Write access to project root
  - Git initialized (recommended)
  - User has product requirements
  - Access to @~/.claude/CLAUDE.md and Cursor rules
  - Memory-keeper MCP available (optional, graceful degradation)
</prerequisites>

<process_flow>

<step number="0" name="memory_and_precedence_initialization">

### Step 0: Initialize Memory Systems and Resolve Precedence

<precedence_resolution>
  <!-- Include precedence rules -->
  <include>@reference-docs/instructions/precedence-rules.md</include>
  
  # Assert Agent OS command precedence
  AGENT_OS_COMMAND = "plan-product"
  CURRENT_MODE = "AGENT_OS_COMMAND_ACTIVE"
  LOG: "🔴 Agent OS plan-product active - absolute precedence"
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
  
  LOG: "Memory-enhanced plan-product initialized for {PROJECT_NAME} ({PRIMARY_TECH})"
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
  <session_description>Agent OS plan-product operation</session_description>
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
    3. SET session description: "Agent OS plan-product operation"
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

<step number="1" name="gather_user_input_with_memory">

### Step 1: Gather User Input (Memory-Enhanced)

<step_metadata>
  <required_inputs>
    - main_idea: string
    - key_features: array[string] (minimum: 3)
    - target_users: array[string] (minimum: 1)
    - tech_stack: object
  </required_inputs>
  <validation>blocking</validation>
</step_metadata>

<data_sources>
  <primary>user_direct_input</primary>
  <fallback_sequence>
    1. @~/.agent-os/standards/tech-stack.md
    2. @~/.claude/CLAUDE.md
    3. Cursor User Rules
  </fallback_sequence>
</data_sources>

<error_template>
  Please provide the following missing information:
  1. Main idea for the product
  2. List of key features (minimum 3)
  3. Target users and use cases (minimum 1)
  4. Tech stack preferences
  5. Has the new application been initialized yet and we're inside the project folder? (yes/no)
</error_template>

<memory_enhanced_input_gathering>
  <!-- Check for previous analyze-product session context -->
  CALL: mcp-memory-keeper-context_search
  PARAMETERS:
    - query: "{PROJECT_NAME} analyze-product analysis"
    - categories: ["analysis", "decision"]
  
  IF previous_analysis_found:
    analysis_context = summarize_previous_analysis(previous_analysis)
    LOG: "Building on previous analysis: {analysis_context[:100]}..."
    CONTEXT_NOTE: "Previous analysis available in memory"
  
  <!-- Collect user inputs with immediate memory storage -->
  FOR_EACH: required_input
    user_response = collect_input(required_input)
    
    # Store immediately in Memory-Keeper
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "plan-input-{input_type}"
      - value: user_response
      - category: "decision"
      - priority: "high"
    
    # Extract strategic decisions for Memento
    IF contains_strategic_decision(user_response):
      decision_summary = extract_decision_summary(user_response)
      CALL: memento-mcp-create_entities
      PARAMETERS:
        - entities: [{
            "name": "{PROJECT_NAME}-planning-decision-{timestamp}",
            "entityType": "product_decision",
            "observations": [
              "Decision: {decision_summary}",
              "Context: Product Planning",
              "Tech Stack: {PRIMARY_TECH}",
              "Date: {current_date()}"
            ]
          }]
      
      # Link to project
      CALL: memento-mcp-create_relations
      PARAMETERS:
        - relations: [{
            "from": "{PROJECT_NAME}",
            "to": "{PROJECT_NAME}-planning-decision-{timestamp}",
            "relationType": "guided_by"
          }]
    
    # Context reduction - store full response, keep summary
    response_summary = create_summary(user_response, max_length=100)
    CONTEXT_SUMMARY += "💬 {input_type}: {response_summary} (full response in memory)\n"
  
  # Create checkpoint after input gathering
  CALL: mcp-memory-keeper-context_checkpoint
  PARAMETERS:
    - name: "user-inputs-complete-{PROJECT_NAME}"
    - description: "All planning inputs gathered for {PROJECT_NAME}"
</memory_enhanced_input_gathering>

<instructions>
  ACTION: Collect inputs with memory integration and context reduction
  STORE: Full responses in memory, summaries in context
  LEVERAGE: Previous analyze-product results if available
  VALIDATE: All inputs provided before proceeding
</instructions>

</step>

<step number="1.5" name="kb_context_retrieval">

### Step 1.5: Knowledge Base Context Retrieval

<step_metadata>
  <action>load relevant project context from KB</action>
  <purpose>reduce context memory by leveraging persistent knowledge</purpose>
  <queries>project history, decisions, specifications</queries>
  <condition>only if memory-keeper available</condition>
</step_metadata>

<kb_query_categories>
  <product_context>
    - Mission and vision statements from previous sessions
    - Target users and market position decisions
    - Key differentiators and value propositions
  </product_context>
  <technical_architecture>
    - Technology stack decisions and rationale
    - Architectural patterns and constraints
    - Performance and scalability considerations
  </technical_architecture>
  <project_history>
    - Major pivots and directional changes
    - Lessons learned from previous product planning
    - Timeline of significant decisions
  </project_history>
</kb_query_categories>

<kb_retrieval_process>
  <semantic_search>
    1. QUERY memory-keeper for product planning context
    2. SEARCH for existing product decisions and specifications
    3. RETRIEVE relevant entries from each category
    4. SYNTHESIZE unified context summary for informed planning
  </semantic_search>
  <context_filtering>
    1. FILTER retrieved context by product planning relevance
    2. PRIORITIZE recent decisions and specifications
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
  
  ### Product Context
  - **Previous Mission**: [SYNTHESIZED_MISSION_FROM_KB]
  - **Known Users**: [TARGET_USERS_FROM_KB]
  - **Established Features**: [PRIORITY_FEATURES_FROM_KB]
  
  ### Technical Context
  - **Architecture Decisions**: [CURRENT_ARCHITECTURE_FROM_KB]
  - **Stack Rationale**: [TECHNOLOGY_DECISIONS_FROM_KB]
  - **Patterns**: [CODE_PATTERNS_FROM_KB]
  
  ### Project Evolution
  - [EVOLUTION_INSIGHT_1_FROM_KB]
  - [EVOLUTION_INSIGHT_2_FROM_KB]
</context_synthesis_template>

<instructions>
  ACTION: Query memory-keeper for product planning context (if available)
  SYNTHESIZE: Combine KB results with user input for informed planning
  FILTER: Limit context to product planning relevance
  FALLBACK: Skip if memory-keeper unavailable
</instructions>

</step>

<step number="2" name="create_documentation_structure">

### Step 2: Create Documentation Structure

<step_metadata>
  <creates>
    - directory: .agent-os/product/
    - files: 4
  </creates>
</step_metadata>

<file_structure>
  .agent-os/
  └── product/
      ├── mission.md          # Product vision and purpose
      ├── tech-stack.md       # Technical architecture
      ├── roadmap.md          # Development phases
      └── decisions.md        # Decision log
</file_structure>

<git_config>
  <commit_message>Initialize Agent OS product documentation</commit_message>
  <tag>v0.1.0-planning</tag>
  <gitignore_consideration>true</gitignore_consideration>
</git_config>

<instructions>
  ACTION: Create directory structure as specified
  VALIDATION: Verify write permissions before creating
  PROTECTION: Confirm before overwriting existing files
</instructions>

</step>

<step number="3" name="create_mission_md">

### Step 3: Create mission.md

<step_metadata>
  <creates>
    - file: .agent-os/product/mission.md
  </creates>
  <enhances>with KB context if available</enhances>
</step_metadata>

<file_template>
  <header>
    # Product Mission

    > Last Updated: [CURRENT_DATE]
    > Version: 1.0.0
  </header>
  <required_sections>
    - Pitch
    - Users
    - The Problem
    - Differentiators
    - Key Features
  </required_sections>
</file_template>

<section name="pitch">
  <template>
    ## Pitch

    [PRODUCT_NAME] is a [PRODUCT_TYPE] that helps [TARGET_USERS] [SOLVE_PROBLEM] by providing [KEY_VALUE_PROPOSITION].
  </template>
  <constraints>
    - length: 1-2 sentences
    - style: elevator pitch
  </constraints>
  <kb_enhancement>
    - Use KB context to refine product positioning if available
    - Build on previous mission statements for consistency
  </kb_enhancement>
</section>

<section name="users">
  <template>
    ## Users

    ### Primary Customers

    - [CUSTOMER_SEGMENT_1]: [DESCRIPTION]
    - [CUSTOMER_SEGMENT_2]: [DESCRIPTION]

    ### User Personas

    **[USER_TYPE]** ([AGE_RANGE])
    - **Role:** [JOB_TITLE]
    - **Context:** [BUSINESS_CONTEXT]
    - **Pain Points:** [PAIN_POINT_1], [PAIN_POINT_2]
    - **Goals:** [GOAL_1], [GOAL_2]
  </template>
  <schema>
    - name: string
    - age_range: "XX-XX years old"
    - role: string
    - context: string
    - pain_points: array[string]
    - goals: array[string]
  </schema>
  <kb_enhancement>
    - Incorporate user insights from KB if available
    - Build on previous user research and personas
  </kb_enhancement>
</section>

<section name="problem">
  <template>
    ## The Problem

    ### [PROBLEM_TITLE]

    [PROBLEM_DESCRIPTION]. [QUANTIFIABLE_IMPACT].

    **Our Solution:** [SOLUTION_DESCRIPTION]
  </template>
  <constraints>
    - problems: 2-4
    - description: 1-3 sentences
    - impact: include metrics
    - solution: 1 sentence
  </constraints>
</section>

<section name="differentiators">
  <template>
    ## Differentiators

    ### [DIFFERENTIATOR_TITLE]

    Unlike [COMPETITOR_OR_ALTERNATIVE], we provide [SPECIFIC_ADVANTAGE]. This results in [MEASURABLE_BENEFIT].
  </template>
  <constraints>
    - count: 2-3
    - focus: competitive advantages
    - evidence: required
  </constraints>
</section>

<section name="features">
  <template>
    ## Key Features

    ### Core Features

    - **[FEATURE_NAME]:** [USER_BENEFIT_DESCRIPTION]

    ### Collaboration Features

    - **[FEATURE_NAME]:** [USER_BENEFIT_DESCRIPTION]
  </template>
  <constraints>
    - total: 8-10 features
    - grouping: by category
    - description: user-benefit focused
  </constraints>
</section>

<instructions>
  ACTION: Create mission.md using all section templates
  FILL: Use data from Step 1 user inputs and KB context if available
  FORMAT: Maintain exact template structure
  ENHANCE: Leverage KB context for consistency and refinement
</instructions>

</step>

<step number="4" name="gather_tech_documentation">

### Step 4: Gather Technology Documentation

<step_metadata>
  <action>verify and research technology choices</action>
  <purpose>ensure up-to-date documentation reference</purpose>
</step_metadata>

<context7_documentation>
  <required>true</required>
  <process>
    1. FOR EACH technology in tech_stack:
      a. GENERATE a Meilisearch-compatible key from the technology name
         (e.g., "laravel_framework" for Laravel framework)
      b. CHECK if documentation exists in Meilisearch cache using the key
      c. IF cached documentation exists AND is not stale (< 30 days old):
         i. RETRIEVE documentation from Meilisearch
         ii. LOG cache hit for performance metrics
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
      e. EXTRACT key architectural patterns and best practices
      f. VERIFY version compatibility with other components
      g. RECORD documentation source (cache or API) for transparency
    2. DOCUMENT sources and mappings used in tech-stack.md
  </process>
</context7_documentation>

<documentation_template>
  ## Documentation Sources

  The following Context7 library references were used to verify technology choices:
  
  - **[TECH_NAME]**: `[CONTEXT7_LIBRARY_ID]`
    - Key Insights: [KEY_INSIGHTS]
    - Source: [CACHE_HIT ? "Meilisearch cache" : "Context7 API"]
    - Cache Status: [CACHE_STATUS]
    - Last Updated: [FETCH_DATE]
    - Meilisearch Key: [MEILISEARCH_KEY]
  
  - **[TECH_NAME]**: `[CONTEXT7_LIBRARY_ID]`
    - Key Insights: [KEY_INSIGHTS]
    - Source: [CACHE_HIT ? "Meilisearch cache" : "Context7 API"]
    - Cache Status: [CACHE_STATUS]
    - Last Updated: [FETCH_DATE]
    - Meilisearch Key: [MEILISEARCH_KEY]

  ## Context7 Documentation Mappings

  | Meilisearch Key | Context7 Library ID | Description | Version |
  |-----------------|---------------------|-------------|--------|
  | [MEILISEARCH_KEY_1] | [CONTEXT7_LIBRARY_ID_1] | [DESCRIPTION_1] | [VERSION_1] |
  | [MEILISEARCH_KEY_2] | [CONTEXT7_LIBRARY_ID_2] | [DESCRIPTION_2] | [VERSION_2] |
</documentation_template>

<instructions>
  ACTION: Check Meilisearch cache first, then use Context7 MCP tools if needed
  VERIFY: Technology choices against latest documentation
  DOCUMENT: Library IDs and key architectural patterns found
  PRIORITIZE: Main application framework and database documentation
  ESTABLISH: Create mapping between Meilisearch keys and Context7 library IDs
  CACHE: Store documentation in Meilisearch for future use
  REFRESH: Update stale cache entries (older than 30 days)
  STRUCTURE: Follow the Meilisearch schema for consistent caching
</instructions>

</step>

<step number="5" name="create_tech_stack_md">

### Step 5: Create tech-stack.md

<step_metadata>
  <creates>
    - file: .agent-os/product/tech-stack.md
  </creates>
</step_metadata>

<file_template>
  <header>
    # Technical Stack

    > Last Updated: [CURRENT_DATE]
    > Version: 1.0.0
  </header>
</file_template>

<required_items>
  - application_framework: string + version
  - database_system: string
  - javascript_framework: string
  - import_strategy: ["importmaps", "node"]
  - css_framework: string + version
  - ui_component_library: string
  - fonts_provider: string
  - icon_library: string
  - application_hosting: string
  - database_hosting: string
  - asset_hosting: string
  - deployment_solution: string
  - code_repository_url: string
</required_items>

<data_resolution>
  <for_each item="required_items">
    <if_not_in>user_input</if_not_in>
    <then_check>
      1. @~/.agent-os/standards/tech-stack.md
      2. @~/.claude/CLAUDE.md
      3. Cursor User Rules
    </then_check>
    <else>add_to_missing_list</else>
  </for_each>
</data_resolution>

<missing_items_template>
  Please provide the following technical stack details:
  [NUMBERED_LIST_OF_MISSING_ITEMS]

  You can respond with the technology choice or "n/a" for each item.
</missing_items_template>

<instructions>
  ACTION: Document all tech stack choices
  RESOLUTION: Check user input first, then config files
  REQUEST: Ask for any missing items using template
</instructions>

</step>

<step number="6" name="create_roadmap_md">

### Step 6: Create roadmap.md

<step_metadata>
  <creates>
    - file: .agent-os/product/roadmap.md
  </creates>
</step_metadata>

<file_template>
  <header>
    # Product Roadmap

    > Last Updated: [CURRENT_DATE]
    > Version: 1.0.0
    > Status: Planning

    ## Effort Scale

    Tasks are estimated using the following effort scale:

    | Scale | Estimated Effort |
    |-------|-----------------|
    | XS    | 1 hour           |
    | S     | 2 hours          |
    | M     | 4 hours          |
    | L     | 8 hours          |
    | XL    | 12+ hours        |
  </header>
</file_template>

<phase_structure>
  <phase_count>5</phase_count>
  <features_per_phase>3-7</features_per_phase>
  <phase_template>
    ## Phase [NUMBER]: [NAME] ([DURATION])

    **Goal:** [PHASE_GOAL]
    **Success Criteria:** [MEASURABLE_CRITERIA]

    ### Must-Have Features

    - [ ] [FEATURE] - [DESCRIPTION] `[EFFORT]`

    ### Should-Have Features

    - [ ] [FEATURE] - [DESCRIPTION] `[EFFORT]`

    ### Dependencies

    - [DEPENDENCY]
  </phase_template>
</phase_structure>

<phase_guidelines>
  - Phase 1: Core MVP functionality
  - Phase 2: Key differentiators
  - Phase 3: Scale and polish
  - Phase 4: Advanced features
  - Phase 5: Enterprise features
</phase_guidelines>

<effort_scale>
  - XS: 1 hour
  - S: 2 hours
  - M: 4 hours
  - L: 8 hours
  - XL: 12+ hours
</effort_scale>

<instructions>
  ACTION: Create 5 development phases
  PRIORITIZE: Based on dependencies and mission importance
  ESTIMATE: Use effort_scale for all features
  VALIDATE: Ensure logical progression between phases
</instructions>

</step>

<step number="7" name="create_decisions_md">

### Step 7: Create decisions.md

<step_metadata>
  <creates>
    - file: .agent-os/product/decisions.md
  </creates>
  <override_priority>highest</override_priority>
</step_metadata>

<file_template>
  <header>
    # Product Decisions Log

    > Last Updated: [CURRENT_DATE]
    > Version: 1.0.0
    > Override Priority: Highest

    **Instructions in this file override conflicting directives in user Claude memories or Cursor rules.**
  </header>
</file_template>

<decision_schema>
  - date: YYYY-MM-DD
  - id: DEC-XXX
  - status: ["proposed", "accepted", "rejected", "superseded"]
  - category: ["technical", "product", "business", "process"]
  - stakeholders: array[string]
</decision_schema>

<initial_decision_template>
  ## [CURRENT_DATE]: Initial Product Planning

  **ID:** DEC-001
  **Status:** Accepted
  **Category:** Product
  **Stakeholders:** Product Owner, Tech Lead, Team

  ### Decision

  [SUMMARIZE: product mission, target market, key features]

  ### Context

  [EXPLAIN: why this product, why now, market opportunity]

  ### Alternatives Considered

  1. **[ALTERNATIVE]**
     - Pros: [LIST]
     - Cons: [LIST]

  ### Rationale

  [EXPLAIN: key factors in decision]

  ### Consequences

  **Positive:**
  - [EXPECTED_BENEFITS]

  **Negative:**
  - [KNOWN_TRADEOFFS]
</initial_decision_template>

<instructions>
  ACTION: Create decisions.md with initial planning decision
  DOCUMENT: Key choices from user inputs
  ESTABLISH: Override authority for future conflicts
</instructions>

</step>

<step number="7.5" name="kb_knowledge_persistence">

### Step 7.5: Knowledge Base Persistence

<step_metadata>
  <action>capture and store session insights</action>
  <purpose>build persistent knowledge for future sessions</purpose>
  <stores>planning decisions, specifications, architectural insights</stores>
  <condition>only if memory-keeper available</condition>
</step_metadata>

<kb_persistence_categories>
  <product_planning_decisions>
    - Product mission and vision established
    - Target users and market positioning
    - Key features and roadmap priorities
    - Technology stack rationale
  </product_planning_decisions>
  <architectural_decisions>
    - Framework and technology choices
    - Integration patterns selected
    - Performance and scalability considerations
    - Documentation and development standards
  </architectural_decisions>
  <project_context>
    - Planning session outcomes
    - User requirements and constraints
    - Business context and market factors
    - Success criteria and metrics
  </project_context>
</kb_persistence_categories>

<kb_persistence_process>
  <insight_extraction>
    1. ANALYZE session content for key planning decisions and insights
    2. EXTRACT product mission, features, and technical architecture
    3. CATEGORIZE findings by persistence category
    4. PRIORITIZE information by future project relevance
  </insight_extraction>
  <knowledge_storage>
    1. SAVE product planning decisions to memory-keeper
    2. STORE technical architecture rationale and constraints
    3. TAG entries with relevant project context and keywords
    4. LINK to created documentation files and decision records
  </knowledge_storage>
  <project_timeline>
    1. ESTABLISH initial project timeline and milestones
    2. DOCUMENT planning phase completion
    3. PREPARE context for consolidated specification workflow
    4. SET expectations for feature additions to master spec.md file
  </project_timeline>
  <fallback_behavior>
    1. IF memory-keeper unavailable: SKIP KB persistence
    2. DOCUMENT key planning insights in session summary
    3. RECOMMEND manual knowledge capture in project documentation
  </fallback_behavior>
</kb_persistence_process>

<persistence_template>
  ## Planning Knowledge Captured
  
  The following insights have been stored in the Integrated Memory System:
  
  ### Product Decisions
  - **Mission Statement**: [CAPTURED_MISSION]
  - **Target Market**: [CAPTURED_USERS_AND_MARKET]
  - **Core Features**: [CAPTURED_KEY_FEATURES]
  - **Differentiation Strategy**: [CAPTURED_DIFFERENTIATORS]
  
  ### Technical Decisions
  - **Architecture Approach**: [CAPTURED_TECH_STACK_RATIONALE]
  - **Framework Choice**: [CAPTURED_FRAMEWORK_DECISION]
  - **Integration Strategy**: [CAPTURED_INTEGRATION_APPROACH]
  - **Development Standards**: [CAPTURED_STANDARDS_AND_PRACTICES]
  
  ### Project Context
  - **Planning Phase**: Completed [CURRENT_DATE]
  - **Documentation Created**: [LIST_OF_CREATED_FILES]
  - **Next Phase**: Ready for consolidated feature specification in spec.md
  - **Specification Approach**: Consolidated single-file approach for easy tracking
  - **Success Criteria**: [CAPTURED_SUCCESS_METRICS]
</persistence_template>

<instructions>
  ACTION: Extract and categorize planning session insights
  STORE: Save structured knowledge to memory-keeper (if available)
  ESTABLISH: Project context and timeline for future sessions
  PREPARE: Foundation for next development phases
</instructions>

</step>

<step number="8" name="create_or_update_claude_md">

### Step 8: Create or Update CLAUDE.md

<step_metadata>
  <creates>
    - file: CLAUDE.md
  </creates>
  <updates>
    - file: CLAUDE.md (if exists)
  </updates>
  <merge_strategy>append_or_replace_section</merge_strategy>
</step_metadata>

<file_location>
  <path>./CLAUDE.md</path>
  <description>Project root directory</description>
</file_location>

<content_template>
## Agent OS Documentation

### Product Context
- **Mission & Vision:** @.agent-os/product/mission.md
- **Technical Architecture:** @.agent-os/product/tech-stack.md
- **Development Roadmap:** @.agent-os/product/roadmap.md
- **Decision History:** @.agent-os/product/decisions.md

### Development Standards
- **Code Style:** @~/.agent-os/standards/code-style.md
- **Best Practices:** @~/.agent-os/standards/best-practices.md

### Project Management
- **Master Specification:** @.agent-os/specs/spec.md
- **Project Tasks:** @.agent-os/specs/tasks.md
- **Technical Details:** @.agent-os/specs/sub-specs/
- **Spec Planning:** Use `@~/.agent-os/instructions/create-spec.md`
- **Tasks Execution:** Use `@~/.agent-os/instructions/execute-tasks.md`

### Integrated Memory System
- **Project Namespace:** kb_[PROJECT_NAME]
- **Persistent Context:** Leverages memory-keeper for cross-session continuity
- **Memory Architecture:** 
  - Layer 1: Persistent project knowledge (memory-keeper)
  - Layer 2: Documentation cache (Meilisearch + Context7)
  - Layer 3: Session memory (current context)

## Workflow Instructions

When asked to work on this codebase:

1. **First**, check @.agent-os/product/roadmap.md for current priorities
2. **Then**, follow the appropriate instruction file:
   - For new features: @.agent-os/instructions/create-spec.md
   - For tasks execution: @.agent-os/instructions/execute-tasks.md
3. **Always**, adhere to the standards in the files listed above

## Important Notes

- Product-specific files in `.agent-os/product/` override any global standards
- User's specific instructions override (or amend) instructions found in `.agent-os/specs/`
- All feature specifications are consolidated in single spec.md file for easy tracking
- Task management uses consolidated tasks.md with feature-specific sections
- Always adhere to established patterns, code style, and best practices documented above
- Memory-keeper integration provides persistent context across sessions for enhanced development continuity
</content_template>

<merge_behavior>
  <if_file_exists>
    <check_for_section>"## Agent OS Documentation"</check_for_section>
    <if_section_exists>
      <action>replace_section</action>
      <start_marker>"## Agent OS Documentation"</start_marker>
      <end_marker>next_h2_heading_or_end_of_file</end_marker>
    </if_section_exists>
    <if_section_not_exists>
      <action>append_to_file</action>
      <separator>"\n\n"</separator>
    </if_section_not_exists>
  </if_file_exists>
  <if_file_not_exists>
    <action>create_new_file</action>
    <content>content_template</content>
  </if_file_not_exists>
</merge_behavior>

<instructions>
  ACTION: Check if CLAUDE.md exists in project root
  MERGE: Replace "Agent OS Documentation" section if it exists
  APPEND: Add section to end if file exists but section doesn't
  CREATE: Create new file with template content if file doesn't exist
  PRESERVE: Keep all other existing content in the file
  ENHANCE: Include Integrated Memory System information in documentation
</instructions>

</step>

</process_flow>

## Execution Summary

<final_checklist>
  <verify>
    - [ ] Memory-keeper initialization attempted (if available)
    - [ ] Project context retrieved from Integrated Memory System (if available)
    - [ ] All 4 files created in .agent-os/product/
    - [ ] User inputs incorporated throughout
    - [ ] Missing tech stack items requested
    - [ ] Initial decisions documented
    - [ ] Planning insights stored in Integrated Memory System (if available)
    - [ ] CLAUDE.md created or updated with Agent OS documentation
    - [ ] Integrated Memory System integration documented for future sessions
  </verify>
</final_checklist>

<execution_order>
  1. Initialize Integrated Memory System namespace (if memory-keeper available)
  2. Gather and validate all user inputs
  3. Retrieve relevant project context from Integrated Memory System (if available)
  4. Create directory structure
  5. Generate each documentation file sequentially
  6. Request any missing information
  7. Capture planning insights in Integrated Memory System (if available)
  8. Create or update project CLAUDE.md file
  9. Validate complete documentation set with Integrated Memory System integration
</execution_order>

## Error Handling

<error_scenarios>
  <scenario name="planning_error_occurs">
    <condition>Any error occurs during product planning or documentation generation</condition>
    <action>Execute memory-guided error resolution procedures</action>
    <procedure>
      1. IMMEDIATE: Store error details in Memory-Keeper for tracking
      2. SEARCH: Query Memory-Keeper and Memento for similar planning errors
      3. APPLY: Try memory-guided solutions in confidence order
      4. DOCUMENT: Store successful resolution for future reference
      5. REFERENCE: Follow detailed procedures in @error-resolution-via-memory.md
    </procedure>
    <enhancement>Build cross-project planning error solution database</enhancement>
  </scenario>
  <scenario name="strategic_decision_failure">
    <condition>Unable to generate strategic documentation or make planning decisions</condition>
    <action>Apply memory-guided troubleshooting for strategic planning issues</action>
    <fallback>Continue with standard planning but document limitation</fallback>
  </scenario>
</error_scenarios>

<memory_system_integration_benefits>
  - Reduced context memory consumption through persistent storage
  - Cross-session continuity for iterative product development
  - Intelligent context loading based on project history
  - Consistent decision tracking and architectural evolution
  - Enhanced planning through historical insights and lessons learned
</memory_system_integration_benefits>
