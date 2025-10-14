---
description: Memory-Enhanced Task Execution for Agent OS
globs:
alwaysApply: false
version: 2.0
encoding: UTF-8
---

# Memory-Enhanced Task Execution Rules

<ai_meta>
  <parsing_rules>
    - Initialize memory systems before task execution
    - Process XML blocks first for structured data
    - Execute instructions in sequential order
    - Use templates as exact patterns
    - Request missing data rather than assuming
    - Store progress and results in memory systems vs context accumulation
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
  - Execute spec tasks systematically with intelligent context management
  - Follow TDD development workflow with pattern consistency
  - Ensure quality through testing and review
  - Integrate memory-keeper for implementation insights and pattern continuity
</purpose>

<context>
  - Part of Agent OS framework
  - Executed after spec planning is complete
  - Follows tasks defined in spec tasks.md
  - Enhanced with persistent knowledge base for implementation consistency
</context>

<effort_scale>
  - XS: 1 hour
  - S: 2 hours
  - M: 4 hours
  - L: 8 hours
  - XL: 12+ hours
</effort_scale>

<prerequisites>
  - Spec documentation exists in @.agent-os/specs/
  - Tasks defined in spec's tasks.md
  - Development environment configured
  - Git repository initialized
  - Memory-keeper MCP available (optional, graceful degradation)
</prerequisites>

<process_flow>

<step number="0" name="memory_and_precedence_initialization">

### Step 0: Initialize Memory Systems and Resolve Precedence

<memory_precedence_initialization>
  <!-- Use centralized Memory Systems and Precedence Initialization workflow -->
  <include>@reference-docs/instructions/memory-precedence-initialization.md</include>
  
  # Execute centralized initialization with execute-tasks specific parameters
  EXECUTE: memory_precedence_initialization_workflow()
  PARAMETERS:
    - command_name: "execute-tasks"
    - memory_requirements: "RECOMMENDED"  # Graceful degradation if unavailable
    - override_categories: ["testing_requirements", "implementation_standards", "deployment_requirements"]
    - session_description: "Agent OS execute-tasks operation"
    - fallback_behavior: "GRACEFUL_DEGRADATION"
  
  # Access standardized initialization results
  PROJECT_NAME = DETECTION_CONTEXT["project_name"]
  PROJECT_ENTITY_NAME = DETECTION_CONTEXT["project_entity_name"]  # Canonical name
  PRIMARY_TECH = DETECTION_CONTEXT["primary_tech"]
  TECH_STACKS = DETECTION_CONTEXT["tech_stacks"]
  CONFIDENCE_LEVEL = DETECTION_CONTEXT["confidence_level"]
  AVAILABLE_ENTITIES = DETECTION_CONTEXT["entities"]
  NAMESPACE_STATUS = DETECTION_CONTEXT["namespace_status"]
  PROJECT_OVERRIDES = initialization_result.project_overrides
  
  # Log initialization completion
  LOG: "📋 Execute-tasks initialization complete - using centralized workflow"
  LOG: "🏷️ Project: {PROJECT_NAME} → {PROJECT_ENTITY_NAME} (Status: {NAMESPACE_STATUS})"
  
  # Log project overrides if detected
  IF PROJECT_OVERRIDES.testing_requirements:
    LOG: "🟠 Testing requirements loaded: {len(PROJECT_OVERRIDES.testing_requirements)} requirements"
  IF PROJECT_OVERRIDES.implementation_standards:
    LOG: "🟠 Implementation standards loaded: {len(PROJECT_OVERRIDES.implementation_standards)} standards"
</memory_precedence_initialization>

</step>

<step number="1" name="task_assignment">

### Step 1: Task Assignment

<step_metadata>
  <purpose>identify and assign specific task for execution</purpose>
  <requires>user input or spec reference</requires>
  <uses_memory>previous initialization context</uses_memory>
</step_metadata>

<instructions>
  ACTION: Task assignment logic (legacy KB initialization removed - now handled by centralized Step 0)
  CONTINUE: With standard task assignment workflow
</instructions>

</step>

<step number="1" name="time_tracking_initialization">

### Step 1: Time Tracking Initialization

<step_metadata>
  <initializes>time tracking</initializes>
  <records>start time</records>
</step_metadata>

<time_tracking>
  <initialization>
    - record start timestamp
    - store task identifier
    - initialize tracking variables
  </initialization>
  <storage>
    <variable>task_start_time</variable>
    <format>ISO 8601 (YYYY-MM-DDTHH:MM:SS)</format>
    <persistence>session</persistence>
  </storage>
</time_tracking>

<tracker_structure>
  <file_path>./TRACKER.md</file_path>
  <format>markdown table</format>
  <columns>
    - Task ID
    - Description
    - Effort Estimate
    - Actual Time
    - Variance
    - Notes
  </columns>
</tracker_structure>

<instructions>
  ACTION: Record current timestamp when execution begins
  STORE: Task identifier, description, and effort estimate for later documentation
  CHECK: Verify TRACKER.md exists and has proper format
  CREATE: TRACKER.md with header row if it doesn't exist
  FORMAT: Initialize TRACKER.md with markdown table if new
</instructions>

</step>

<step number="1.5" name="kb_context_retrieval">

### Step 1.5: Knowledge Base Context Retrieval

<step_metadata>
  <action>load relevant implementation context from KB</action>
  <purpose>reduce context memory by leveraging persistent implementation knowledge</purpose>
  <queries>implementation patterns, testing strategies, code conventions</queries>
  <condition>only if memory-keeper available</condition>
</step_metadata>

<kb_query_categories>
  <implementation_decisions>
    - Code patterns and style preferences established
    - Library choices and justifications
    - Testing strategies and coverage requirements
    - Integration approaches and architectural patterns
  </implementation_decisions>
  <task_execution>
    - Previous task completion outcomes and lessons learned
    - Successful implementation approaches and patterns
    - Common challenges and proven solutions
    - Quality standards and validation criteria
  </task_execution>
  <code_patterns>
    - Established coding conventions and style guides
    - Reusable components and design patterns
    - Architecture-specific implementation approaches
    - Performance optimization patterns
  </code_patterns>
  <testing_results>
    - Testing frameworks and strategies in use
    - Coverage standards and quality metrics
    - Mock patterns and test utilities
    - Validation approaches and acceptance criteria
  </testing_results>
</kb_query_categories>

<kb_retrieval_process>
  <semantic_search>
    1. QUERY memory-keeper for implementation and execution context
    2. SEARCH for related specifications and established patterns
    3. RETRIEVE relevant entries from each category
    4. SYNTHESIZE unified context summary for informed implementation
  </semantic_search>
  <context_filtering>
    1. FILTER retrieved context by current task relevance
    2. PRIORITIZE recent implementation patterns and successful approaches
    3. EXCLUDE outdated or superseded implementation methods
    4. LIMIT total context to manageable size (2000 tokens max)
  </context_filtering>
  <fallback_behavior>
    1. IF memory-keeper unavailable: SKIP this step
    2. CONTINUE with standard implementation workflow
    3. DOCUMENT KB unavailability in session notes
  </fallback_behavior>
</kb_retrieval_process>

<context_synthesis_template>
  ## Retrieved Implementation Context
  
  Based on project history and previous implementation sessions:
  
  ### Established Patterns
  - **Code Style**: [CODE_CONVENTIONS_FROM_KB]
  - **Architecture**: [ARCHITECTURAL_PATTERNS_FROM_KB]
  - **Testing Strategy**: [TESTING_APPROACHES_FROM_KB]
  
  ### Implementation Insights
  - **Proven Approaches**: [SUCCESSFUL_PATTERNS_FROM_KB]
  - **Integration Methods**: [INTEGRATION_PATTERNS_FROM_KB]
  - **Quality Standards**: [QUALITY_METRICS_FROM_KB]
  
  ### Lessons Learned
  - [LESSON_1_FROM_KB]
  - [LESSON_2_FROM_KB]
  
  ### Recommended Patterns
  - [PATTERN_1_FROM_KB]
  - [PATTERN_2_FROM_KB]
</context_synthesis_template>

<instructions>
  ACTION: Query memory-keeper for implementation context (if available)
  SYNTHESIZE: Combine KB results with current task requirements
  FILTER: Limit context to implementation relevance
  ENHANCE: Use established patterns for consistent implementation
</instructions>

</step>

<step number="2" name="task_assignment">

### Step 2: Task Assignment

<step_metadata>
  <inputs>
    - spec_srd_reference: file path
    - specific_tasks: array[string] (optional)
  </inputs>
  <default>next uncompleted parent task</default>
</step_metadata>

<task_selection>
  <explicit>user specifies exact task(s)</explicit>
  <implicit>find next uncompleted task in tasks.md</implicit>
</task_selection>

<instructions>
  ACTION: Identify task(s) to execute
  DEFAULT: Select next uncompleted parent task if not specified
  CONFIRM: Task selection with user
</instructions>

</step>

<step number="2" name="context_analysis_with_memory">

### Step 2: Context Analysis (Memory-Enhanced)

<step_metadata>
  <reads>
    - spec SRD file
    - spec tasks.md
    - all files in spec sub-specs/ folder
    - @.agent-os/product/mission.md
  </reads>
  <purpose>complete understanding of requirements</purpose>
  <enhances>with KB implementation context if available</enhances>
</step_metadata>

<context_gathering>
  <spec_level>
    - requirements from SRD
    - technical specs
    - test specifications
  </spec_level>
  <product_level>
    - overall mission alignment
    - technical standards
    - best practices
  </product_level>
  <kb_level>
    - established implementation patterns if available
    - proven integration approaches
    - quality standards and testing strategies
  </kb_level>
</context_gathering>

<memory_enhanced_context_analysis>
  # Check for previous create-spec session context
  CALL: mcp-memory-keeper-context_search
  PARAMETERS:
    - query: "{PROJECT_NAME} create-spec {SPEC_NAME}"
    - categories: ["progress", "decision"]
  
  IF previous_spec_found:
    spec_context = summarize_previous_spec(previous_spec)
    LOG: "Building on previous spec: {spec_context[:100]}..."
    CONTEXT_NOTE: "Previous spec context available in memory"
  
  # Smart spec document retrieval with memory caching
  FOR_EACH: spec_document IN ["spec.md", "sub-specs/technical-spec.md", "sub-specs/tests.md", "tasks.md"]
    IF file_exists(spec_document):
      # Check if file changed since last cache
      CALL: mcp-memory-keeper-context_file_changed
      PARAMETERS:
        - filePath: spec_document
      
      IF file_changed OR not_cached:
        # Cache file and create summary
        CALL: mcp-memory-keeper-context_cache_file
        PARAMETERS:
          - filePath: spec_document
          - content: read_file(spec_document)
        
        document_summary = create_summary(document_content, max_length=400)
        CALL: mcp-memory-keeper-context_save
        PARAMETERS:
          - key: "spec-doc-{document_name}-summary"
          - value: document_summary
          - category: "analysis"
          - priority: "high"
        
        # Store implementation insights in Memento
        implementation_insights = extract_implementation_insights(document_content, PRIMARY_TECH)
        IF implementation_insights:
          CALL: memento-mcp-add_observations
          PARAMETERS:
            - observations: [{
                "entityName": "{PROJECT_NAME}-{FEATURE_NAME}",
                "contents": implementation_insights
              }]
      
      # Reference in context, don't load full content
      CONTEXT_REFERENCE: "📄 {document_name}: {brief_summary} (cached in memory)"
  
  # Cross-project implementation pattern search
  CALL: memento-mcp-semantic_search
  PARAMETERS:
    - query: "{TASK_TYPE} {PRIMARY_TECH} implementation success patterns"
    - entity_types: ["implementation_pattern", "task_completion"]
    - limit: 5
  
  IF similar_implementations_found:
    implementation_insights = analyze_similar_implementations(similar_implementations)
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "cross-project-implementation-insights"
      - value: implementation_insights
      - category: "analysis"
      - priority: "normal"
    
    LOG: "💡 Found {len(similar_implementations)} similar implementations from other projects"
    CONTEXT_NOTE: "Cross-project implementation insights available: {implementation_insights[:100]}..."
</memory_enhanced_context_analysis>

<instructions>
  ACTION: Analyze requirements with memory integration and cross-project learning
  CACHE: Spec documents to avoid re-reading
  LEVERAGE: Previous spec sessions and similar implementation patterns
  REDUCE: Context size by storing details in memory systems
</instructions>
</instructions>

</step>

<step number="4" name="documentation_research">

### Step 4: Documentation Research with Context7

<step_metadata>
  <purpose>gather authoritative implementation guidance using centralized workflow</purpose>
  <required>true</required>
  <uses>centralized Context7 + Meilisearch documentation workflow</uses>
</step_metadata>

<context7_meilisearch_workflow>
  <!-- Use centralized Context7 + Meilisearch documentation workflow -->
  <include>@reference-docs/instructions/support-workflows/context7-meilisearch-workflow.md</include>
  
  # Execute the centralized documentation workflow for task-specific research
  EXECUTE: context7_documentation_workflow()
  PARAMETERS:
    - workflow_type: "implementation"
    - focus_areas: ["implementation_specific"]
    - trust_threshold: 9.0  # High threshold for task execution accuracy
    - technologies: TASK_RELEVANT_TECH  # Technologies specific to current task
    - documentation_depth: "code_examples_and_apis"
    - topic: "{TASK_TYPE}"  # Focus on specific task type
  
  # Store workflow results for implementation planning
  DOCUMENTATION_RESULTS = workflow_output.documentation_summary
  TRUST_ASSESSMENT = workflow_output.confidence_level
  IMPLEMENTATION_GUIDANCE = workflow_output.key_architectural_insights
  CACHE_PERFORMANCE = workflow_output.performance_metrics
  
  # Log research results
  LOG: "📚 Task research completed with {TRUST_ASSESSMENT} confidence"
  LOG: "📊 Documentation sources: {CACHE_PERFORMANCE.cache_hits} cached, {CACHE_PERFORMANCE.api_calls} fresh"
</context7_meilisearch_workflow>

<task_integration>
  # Integration results for task implementation planning
  # The centralized workflow provides:
  # - implementation_guidance: Task-specific code examples and patterns
  # - confidence_level: HIGH/MEDIUM/LOW based on documentation trust scores
  # - best_practices: Latest best practices for task implementation
  # - performance_metrics: Documentation freshness and optimization data
  
  # Store research context for implementation planning
  CALL: mcp-memory-keeper-context_save
  PARAMETERS:
    - key: "task-research-results-{TASK_NAME}"
    - value: "{IMPLEMENTATION_GUIDANCE}"
    - category: "analysis"
    - priority: "high"
  
  # Create Memento entities for cross-project task learning
  CALL: memento-mcp-create_entities
  PARAMETERS:
    - entities: [{
        "name": "{PROJECT_NAME}-task-{TASK_NAME}-research",
        "entityType": "task_research",
        "observations": [
          "Research for: {TASK_TYPE}",
          "Implementation patterns: {IMPLEMENTATION_GUIDANCE[:3]}",
          "Documentation sources: {DOCUMENTATION_SOURCES}",
          "Trust level: {TRUST_ASSESSMENT}",
          "Date: {current_date()}"
        ]
      }]
  
  # Link to project and task context
  CALL: memento-mcp-create_relations
  PARAMETERS:
    - relations: [{
        "from": "{PROJECT_NAME}",
        "to": "{PROJECT_NAME}-task-{TASK_NAME}-research",
        "relationType": "informed_by"
      }]
</task_integration>

<instructions>
  ACTION: Execute centralized Context7 + Meilisearch documentation workflow
  CONFIGURE: Use implementation-specific parameters with high trust thresholds
  LEVERAGE: Existing tech-stack.md mappings via centralized workflow
  FOCUS: Implementation patterns and code examples specific to current task
  APPLY: Research findings to implementation planning phase
  STORE: Research results in memory systems for cross-project task learning
</instructions>

</step>

<step number="5" name="implementation_planning">

### Step 5: Implementation Planning

<step_metadata>
  <creates>execution plan</creates>
  <requires>user approval</requires>
  <enhances>with KB patterns if available</enhances>
</step_metadata>

<plan_structure>
  <format>numbered list with sub-bullets</format>
  <includes>
    - all subtasks from tasks.md
    - implementation approach based on Context7 research
    - dependencies to install
    - test strategy
    - integration with established patterns from KB if available
  </includes>
</plan_structure>

<plan_template>
  ## Implementation Plan for [TASK_NAME]

  1. **[MAJOR_STEP_1]**
     - [SPECIFIC_ACTION]
     - [SPECIFIC_ACTION]

  2. **[MAJOR_STEP_2]**
     - [SPECIFIC_ACTION]
     - [SPECIFIC_ACTION]

  **Dependencies to Install:**
  - [LIBRARY_NAME] - [PURPOSE]

  **Test Strategy:**
  - [TEST_APPROACH]

  [IF KB_AVAILABLE]:
  **Pattern Consistency:**
  - [KB_PATTERN_APPLICATION]
  - [KB_INTEGRATION_APPROACH]
  
  **Quality Standards:**
  - [KB_QUALITY_REQUIREMENTS]
</plan_template>

<approval_request>
  I've prepared the above implementation plan incorporating established project patterns.
  Please review and confirm before I proceed with execution.
</approval_request>

<instructions>
  ACTION: Create detailed execution plan
  INTEGRATE: KB patterns and established approaches if available
  DISPLAY: Plan to user for review
  WAIT: For explicit approval before proceeding
  BLOCK: Do not proceed without affirmative permission
</instructions>

</step>

<step number="6" name="development_server_check">

### Step 6: Check for Development Server

<step_metadata>
  <checks>running development server</checks>
  <prevents>port conflicts</prevents>
</step_metadata>

<server_check_flow>
  <if_running>
    ASK user to shut down
    WAIT for response
  </if_running>
  <if_not_running>
    PROCEED immediately
  </if_not_running>
</server_check_flow>

<user_prompt>
  A development server is currently running.
  Should I shut it down before proceeding? (yes/no)
</user_prompt>

<instructions>
  ACTION: Check for running local development server
  CONDITIONAL: Ask permission only if server is running
  PROCEED: Immediately if no server detected
</instructions>

</step>

<step number="7" name="git_branch_management">

### Step 7: Git Branch Management

<step_metadata>
  <manages>git branches</manages>
  <ensures>proper isolation</ensures>
</step_metadata>

<branch_naming>
  <source>spec folder name</source>
  <format>exclude date prefix</format>
  <example>
    - folder: 2025-03-15-password-reset
    - branch: password-reset
  </example>
</branch_naming>

<branch_logic>
  <case_a>
    <condition>current branch matches spec name</condition>
    <action>PROCEED immediately</action>
  </case_a>
  <case_b>
    <condition>current branch is main/staging/review</condition>
    <action>CREATE new branch and PROCEED</action>
  </case_b>
  <case_c>
    <condition>current branch is different feature</condition>
    <action>ASK permission to create new branch</action>
  </case_c>
</branch_logic>

<case_c_prompt>
  Current branch: [CURRENT_BRANCH]
  This spec needs branch: [SPEC_BRANCH]

  May I create a new branch for this spec? (yes/no)
</case_c_prompt>

<instructions>
  ACTION: Check current git branch
  EVALUATE: Which case applies
  EXECUTE: Appropriate branch action
  WAIT: Only for case C approval
</instructions>

</step>

<step number="8" name="development_execution">

### Step 8: Development Execution

<step_metadata>
  <follows>approved implementation plan</follows>
  <adheres_to>all spec standards and established patterns</adheres_to>
</step_metadata>

<execution_standards>
  <follow_exactly>
    - approved implementation plan
    - spec specifications
    - @.agent-os/product/code-style.md
    - @.agent-os/product/dev-best-practices.md
    - established patterns from KB if available
  </follow_exactly>
  <approach>test-driven development (TDD)</approach>
</execution_standards>

<tdd_workflow>
  1. Write failing tests first
  2. Implement minimal code to pass
  3. Refactor while keeping tests green
  4. Repeat for each feature
</tdd_workflow>

<kb_integration>
  <pattern_application>
    - Apply established code conventions from KB
    - Use proven integration approaches
    - Follow established testing patterns
    - Maintain consistency with existing codebase patterns
  </pattern_application>
  <quality_assurance>
    - Adhere to quality standards from KB
    - Apply established validation criteria
    - Follow proven implementation approaches
  </quality_assurance>
</kb_integration>

<instructions>
  ACTION: Execute development plan systematically
  FOLLOW: All coding standards and specifications
  APPLY: Established patterns from KB for consistency
  IMPLEMENT: TDD approach throughout
  MAINTAIN: Code quality at every step
</instructions>

</step>

<step number="9" name="task_status_updates">

### Step 7: Task Status Updates (Memory-Enhanced)

<step_metadata>
  <updates>tasks.md file + memory systems</updates>
  <timing>immediately after completion</timing>
  <memory_integration>progress tracking + cross-project learning</memory_integration>
</step_metadata>

<update_format>
  <completed>- [x] Task description</completed>
  <incomplete>- [ ] Task description</incomplete>
  <blocked>
    - [ ] Task description
    ⚠️ Blocking issue: [DESCRIPTION]
  </blocked>
</update_format>

<blocking_criteria>
  <attempts>maximum 3 different approaches</attempts>
  <action>document blocking issue</action>
  <emoji>⚠️</emoji>
</blocking_criteria>

<memory_enhanced_progress_tracking>
  # Update tasks.md file as before
  FOR_EACH: completed_task
    UPDATE: tasks.md with [x] completion marker
    
    # Store detailed progress in Memory-Keeper
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "task-complete-{task_id}"
      - value: "{task_description}: {completion_summary} - Status: Completed"
      - category: "progress"
      - priority: "normal"
    
    # Store implementation pattern in Memento for cross-project learning
    IF task_successful:
      task_pattern = extract_implementation_pattern(task_result, PRIMARY_TECH)
      CALL: memento-mcp-create_entities
      PARAMETERS:
        - entities: [{
            "name": "{PROJECT_NAME}-{task_type}-{timestamp}",
            "entityType": "implementation_pattern",
            "observations": [
              "Task: {task_description}",
              "Approach: {implementation_approach}",
              "Result: {task_result}",
              "Tech Stack: {PRIMARY_TECH}",
              "Success: {success_indicators}",
              "Date: {current_date()}"
            ]
          }]
      
      # Link to project and feature
      CALL: memento-mcp-create_relations
      PARAMETERS:
        - relations: [
            {
              "from": "{PROJECT_NAME}",
              "to": "{PROJECT_NAME}-{task_type}-{timestamp}",
              "relationType": "implemented_using"
            },
            {
              "from": "{PROJECT_NAME}-{FEATURE_NAME}",
              "to": "{PROJECT_NAME}-{task_type}-{timestamp}",
              "relationType": "built_with"
            }
          ]
  
  FOR_EACH: blocked_task
    UPDATE: tasks.md with ⚠️ blocking issue marker
    
    # Store blocking issue in Memory-Keeper for analysis
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "task-blocked-{task_id}"
      - value: "{task_description}: {blocking_issue} - Status: Blocked after {attempt_count} attempts"
      - category: "error"
      - priority: "high"
    
    # Store blocking pattern in Memento to avoid similar issues
    CALL: memento-mcp-create_entities
    PARAMETERS:
      - entities: [{
          "name": "{PROJECT_NAME}-blocking-{task_type}-{timestamp}",
          "entityType": "implementation_blocker",
          "observations": [
            "Task: {task_description}",
            "Blocker: {blocking_issue}",
            "Attempts: {attempt_count}",
            "Tech Stack: {PRIMARY_TECH}",
            "Resolution Needed: {suggested_resolution}",
            "Date: {current_date()}"
          ]
        }]
  
  # Create progress checkpoint
  CALL: mcp-memory-keeper-context_checkpoint
  PARAMETERS:
    - name: "task-progress-{PROJECT_NAME}-{timestamp}"
    - description: "Task progress updated: {completed_count} completed, {blocked_count} blocked"
</memory_enhanced_progress_tracking>

<instructions>
  ACTION: Update tasks.md and memory systems with progress tracking
  STORE: Implementation patterns for cross-project learning
  TRACK: Blocking issues to prevent similar problems
  CHECKPOINT: Progress state for workflow continuity
</instructions>

</step>

<step number="10" name="test_suite_verification">

### Step 10: Run All Tests

<step_metadata>
  <runs>entire test suite</runs>
  <ensures>no regressions</ensures>
</step_metadata>

<test_execution>
  <order>
    1. Verify new tests pass
    2. Run entire test suite
    3. Fix any failures
  </order>
  <requirement>100% pass rate</requirement>
</test_execution>

<failure_handling>
  <action>troubleshoot and fix</action>
  <priority>before proceeding</priority>
</failure_handling>

<instructions>
  ACTION: Run complete test suite
  VERIFY: All tests pass including new ones
  FIX: Any test failures before continuing
  BLOCK: Do not proceed with failing tests
</instructions>

</step>

<step number="10.5" name="kb_knowledge_persistence">

### Step 10.5: Knowledge Base Persistence

<step_metadata>
  <action>capture and store implementation insights</action>
  <purpose>build persistent knowledge for future implementation sessions</purpose>
  <stores>implementation patterns, testing outcomes, lessons learned</stores>
  <condition>only if memory-keeper available</condition>
</step_metadata>

<kb_persistence_categories>
  <implementation_decisions>
    - Code patterns and architectural choices established
    - Integration approaches and dependencies resolved
    - Performance considerations and optimization decisions
    - Library and framework usage patterns
  </implementation_decisions>
  <task_execution>
    - Completion outcomes and success factors
    - Challenges encountered and solutions applied
    - Time estimation accuracy and variance factors
    - Quality metrics and validation results
  </task_execution>
  <code_patterns>
    - Coding conventions established or reinforced
    - Reusable components and design patterns created
    - Testing utilities and mock patterns developed
    - Architecture-specific implementation approaches
  </code_patterns>
  <testing_results>
    - Test coverage achieved and strategies used
    - Testing frameworks and tools effectiveness
    - Quality validation outcomes and metrics
    - Acceptance criteria verification methods
  </testing_results>
</kb_persistence_categories>

<kb_persistence_process>
  <insight_extraction>
    1. ANALYZE session content for key implementation insights and patterns
    2. EXTRACT successful approaches, code conventions, and testing strategies
    3. CATEGORIZE findings by persistence category
    4. PRIORITIZE information by future implementation relevance
  </insight_extraction>
  <knowledge_storage>
    1. SAVE implementation decisions and code patterns to memory-keeper
    2. STORE testing outcomes and quality validation results
    3. TAG entries with relevant technology areas and implementation contexts
    4. LINK to completed tasks, specifications, and related documentation
  </knowledge_storage>
  <pattern_establishment>
    1. ESTABLISH reusable implementation patterns and approaches
    2. DOCUMENT successful integration methods and architectural decisions
    3. CAPTURE lessons learned and optimization opportunities
    4. PREPARE context for future implementation sessions
  </pattern_establishment>
  <fallback_behavior>
    1. IF memory-keeper unavailable: SKIP KB persistence
    2. DOCUMENT key implementation insights in completion summary
    3. RECOMMEND manual pattern documentation in project files
  </fallback_behavior>
</kb_persistence_process>

<persistence_template>
  ## Implementation Knowledge Captured
  
  The following insights have been stored in the project knowledge base:
  
  ### Implementation Patterns
  - **Code Style**: [CAPTURED_CODE_CONVENTIONS]
  - **Architecture**: [CAPTURED_ARCHITECTURAL_PATTERNS]
  - **Integration**: [CAPTURED_INTEGRATION_APPROACHES]
  - **Performance**: [CAPTURED_OPTIMIZATION_PATTERNS]
  
  ### Testing Strategies
  - **Test Coverage**: [CAPTURED_TESTING_APPROACH]
  - **Quality Validation**: [CAPTURED_QUALITY_METRICS]
  - **Test Utilities**: [CAPTURED_TESTING_UTILITIES]
  - **Acceptance Criteria**: [CAPTURED_VALIDATION_METHODS]
  
  ### Task Execution Insights
  - **Success Factors**: [CAPTURED_SUCCESS_PATTERNS]
  - **Challenge Solutions**: [CAPTURED_PROBLEM_SOLUTIONS]
  - **Time Accuracy**: [CAPTURED_ESTIMATION_INSIGHTS]
  - **Quality Outcomes**: [CAPTURED_QUALITY_RESULTS]
  
  ### Lessons Learned
  - [CAPTURED_LESSON_1]
  - [CAPTURED_LESSON_2]
  
  ### Future Recommendations
  - [CAPTURED_RECOMMENDATION_1]
  - [CAPTURED_RECOMMENDATION_2]
</persistence_template>

<instructions>
  ACTION: Extract and categorize implementation session insights
  STORE: Save structured knowledge to memory-keeper (if available)
  ESTABLISH: Reusable patterns and approaches for future implementation
  PREPARE: Context foundation for subsequent development sessions
</instructions>

</step>

<step number="11" name="git_workflow">

### Step 11: Git Workflow

<step_metadata>
  <creates>
    - git commit
    - github push
    - pull request
  </creates>
</step_metadata>

<commit_process>
  <commit>
    <message>descriptive summary of changes</message>
    <format>conventional commits if applicable</format>
  </commit>
  <push>
    <target>spec branch</target>
    <remote>origin</remote>
  </push>
  <pull_request>
    <title>descriptive PR title</title>
    <description>functionality recap</description>
  </pull_request>
</commit_process>

<pr_template>
  ## Summary

  [BRIEF_DESCRIPTION_OF_CHANGES]

  ## Changes Made

  - [CHANGE_1]
  - [CHANGE_2]

  ## Testing

  - [TEST_COVERAGE]
  - All tests passing ✓

  [IF KB_AVAILABLE]:
  ## Pattern Consistency

  - [KB_PATTERN_ADHERENCE]
  - [KB_QUALITY_VALIDATION]
</pr_template>

<instructions>
  ACTION: Commit all changes with descriptive message
  PUSH: To GitHub on spec branch
  CREATE: Pull request with detailed description
  INCLUDE: KB pattern consistency information if available
</instructions>

</step>

<step number="12" name="roadmap_progress_check">

### Step 12: Roadmap Progress Check

<step_metadata>
  <checks>@.agent-os/product/roadmap.md</checks>
  <updates>if spec completes roadmap item</updates>
</step_metadata>

<roadmap_criteria>
  <update_when>
    - spec fully implements roadmap feature
    - all related tasks completed
    - tests passing
  </update_when>
  <caution>only mark complete if absolutely certain</caution>
</roadmap_criteria>

<instructions>
  ACTION: Review roadmap.md for related items
  EVALUATE: If current spec completes roadmap goals
  UPDATE: Mark roadmap items complete if applicable
  VERIFY: Certainty before marking complete
</instructions>

</step>

<step number="13" name="completion_notification">

### Step 13: Task Completion Notification

<step_metadata>
  <plays>system sound</plays>
  <alerts>user of completion</alerts>
</step_metadata>

<notification_command>
  afplay /System/Library/Sounds/Glass.aiff
</notification_command>

<instructions>
  ACTION: Play completion sound
  PURPOSE: Alert user that task is complete
</instructions>

</step>

<step number="14" name="time_tracking_finalization">

### Step 14: Time Tracking Finalization

<step_metadata>
  <records>task completion time</records>
  <calculates>time difference</calculates>
  <updates>TRACKER.md</updates>
</step_metadata>

<time_calculation>
  <formula>end_time - start_time</formula>
  <format>hours:minutes (Xh Ym)</format>
  <presentation>human-readable</presentation>
</time_calculation>

<variance_calculation>
  <effort_scale_mapping>
    - XS: 1 hours
    - S: 2 hours
    - M: 4 hours
    - L: 8 hours
    - XL: 12 hours
  </effort_scale_mapping>
  <formula>((actual_time_hours / effort_scale_hours) - 1) * 100</formula>
  <format>percentage with sign</format>
  <thresholds>
    - significant_over: +30%
    - significant_under: -30%
  </thresholds>
</variance_calculation>

<tracker_update>
  <operation>append</operation>
  <entry_format>
    | [TASK_ID] | [TASK_DESCRIPTION] | [EFFORT_ESTIMATE] | [ACTUAL_TIME] | [VARIANCE] | [NOTES] |
  </entry_format>
</tracker_update>

<instructions>
  ACTION: Record completion timestamp
  CALCULATE: Total time spent on task (in hours and minutes)
  CALCULATE: Variance between estimate and actual time
  FORMAT: Time in human-readable format (Xh Ym)
  UPDATE: Add entry to TRACKER.md with completed task information
  ANALYZE: Document significant variances with explanatory notes
  REFLECT: Consider reasons for estimation accuracy or inaccuracy
</instructions>

</step>

<step number="15" name="completion_summary">

### Step 15: Completion Summary (Memory-Enhanced)

<step_metadata>
  <creates>summary message</creates>
  <format>structured with emojis</format>
  <memory_integration>session summary + cross-project insights</memory_integration>
</step_metadata>

<summary_template>
  ## ⏱️ Time Tracking

  - **Task ID:** [TASK_ID]
  - **Effort Estimate:** [EFFORT_SCALE]
  - **Actual Time:** [ACTUAL_TIME]
  - **Variance:** [VARIANCE]% [OVER_UNDER] estimate
  - **Added to TRACKER.md:** ✅

  ## ✅ What's been done

  1. **[FEATURE_1]** - [ONE_SENTENCE_DESCRIPTION]
  2. **[FEATURE_2]** - [ONE_SENTENCE_DESCRIPTION]

  ## ⚠️ Issues encountered

  [ONLY_IF_APPLICABLE]
  - **[ISSUE_1]** - [DESCRIPTION_AND_REASON]

  ## 👀 Ready to test in browser

  [ONLY_IF_APPLICABLE]
  1. [STEP_1_TO_TEST]
  2. [STEP_2_TO_TEST]

  ## 📦 Pull Request

  View PR: [GITHUB_PR_URL]

  [IF KB_AVAILABLE]:
  ## 🧠 Knowledge Base Integration

  - **Pattern Consistency:** ✅ Applied established project patterns
  - **Implementation Insights:** ✅ Captured for future sessions
  - **Quality Standards:** ✅ Maintained project quality benchmarks
  - **KB Enhancement:** [KB_ENHANCEMENT_SUMMARY]
</summary_template>

<summary_sections>
  <required>
    - time tracking information
    - functionality recap
    - pull request info
  </required>
  <conditional>
    - issues encountered (if any)
    - testing instructions (if testable in browser)
    - KB integration status (if memory-keeper available)
  </conditional>
</summary_sections>

<memory_enhanced_completion>
  # Create comprehensive session summary as before
  GENERATE: summary using template sections
  
  # Store final session summary in Memory-Keeper
  CALL: mcp-memory-keeper-context_summarize
  PARAMETERS:
    - maxLength: 2000
    - categories: ["task", "progress", "decision", "error"]
  
  session_summary = response.summary
  
  # Store completion insights in Memory-Keeper
  CALL: mcp-memory-keeper-context_save
  PARAMETERS:
    - key: "session-complete-{PROJECT_NAME}-{timestamp}"
    - value: "Execution session completed: {session_summary}"
    - category: "progress"
    - priority: "high"
  
  # Extract high-level project insights for Memento
  IF project_insights_found:
    CALL: memento-mcp-create_entities
    PARAMETERS:
      - entities: [{
          "name": "{PROJECT_NAME}-session-insights-{timestamp}",
          "entityType": "project_insights",
          "observations": [
            "Session Type: Task Execution",
            "Tech Stack: {PRIMARY_TECH}",
            "Completion Rate: {task_success_rate}%",
            "Key Learnings: {extracted_learnings}",
            "Pattern Effectiveness: {pattern_performance}",
            "Date: {current_date()}"
          ]
        }]
  
  # Create final checkpoint with context compression
  CALL: mcp-memory-keeper-context_checkpoint
  PARAMETERS:
    - name: "execution-final-{PROJECT_NAME}-{timestamp}"
    - description: "Task execution session completed successfully"
  
  # Compress old context to maintain efficiency
  IF context_size > CONTEXT_SIZE_LIMIT:
    CALL: mcp-memory-keeper-context_compress
    PARAMETERS:
      - olderThan: "{seven_days_ago()}"
      - preserveCategories: ["decision", "progress"]
      - targetSize: OPTIMAL_CONTEXT_SIZE
  
  # Generate enhanced summary with memory integration status
  enhanced_summary = merge_template_with_memory_insights()
</memory_enhanced_completion>

<instructions>
  ACTION: Create comprehensive summary with memory integration
  STORE: Session insights in Memory-Keeper and Memento
  COMPRESS: Old context to maintain system efficiency
  ENHANCE: Summary with cross-project learning insights
  CHECKPOINT: Final session state for continuity
</instructions>

</step>

</process_flow>

## Development Standards

<standards>
  <code_style>
    <follow>@.agent-os/product/code-style.md</follow>
    <enforce>strictly</enforce>
    <enhance>with KB established patterns if available</enhance>
  </code_style>
  <best_practices>
    <follow>@.agent-os/product/dev-best-practices.md</follow>
    <apply>all directives</apply>
    <integrate>KB proven approaches if available</integrate>
  </best_practices>
  <testing>
    <coverage>comprehensive</coverage>
    <approach>test-driven development</approach>
    <consistency>established patterns from KB if available</consistency>
  </testing>
  <documentation>
    <commits>clear and descriptive</commits>
    <pull_requests>detailed descriptions with pattern consistency</pull_requests>
  </documentation>
</standards>

## Error Handling

<error_protocols>
  <blocking_issues>
    - document in tasks.md
    - mark with ⚠️ emoji
    - include in summary
  </blocking_issues>
  <test_failures>
    - **FIRST**: Search memory systems for similar test failures (@error-resolution-via-memory.md)
    - Apply memory-guided solutions in confidence order
    - Fix before proceeding using documented approaches
    - Store successful resolution for future reference
    - Never commit broken tests
  </test_failures>
  <technical_roadblocks>
    - **FIRST**: Search Memory-Keeper and Memento for similar blocking issues
    - Try memory-guided solutions before attempting novel approaches
    - If memory solutions fail, attempt 3 different approaches
    - Document all attempts and solutions for memory storage
    - Document if unresolved and seek user input
    - Store resolution pattern for cross-project learning
  </technical_roadblocks>
  <compilation_errors>
    - **IMMEDIATE**: Capture error details in Memory-Keeper
    - Search Memento for similar compilation/build issues
    - Apply highest-confidence solution from memory first
    - Document successful resolution for future reference
    - Create checkpoint after resolution
  </compilation_errors>
  <runtime_errors>
    - **CAPTURE**: Store runtime error context immediately
    - Search cross-project patterns for similar runtime issues
    - Try memory-guided debugging approaches first
    - Store successful debugging patterns for reuse
    - Link resolution to tech stack patterns
  </runtime_errors>
  <kb_unavailable>
    - continue with standard workflow
    - document limitation in summary
    - recommend manual pattern documentation
  </kb_unavailable>
</error_protocols>

<final_checklist>
  <verify>
    - [ ] Memory systems initialized with precedence handling
    - [ ] Tech stack detected from reference-docs symlinks
    - [ ] Context gathered using Memory-Keeper and Memento systems
    - [ ] Task implementation complete with cross-project pattern consistency
    - [ ] All tests passing
    - [ ] tasks.md updated with memory-enhanced progress tracking
    - [ ] Implementation patterns stored in Memento for reuse
    - [ ] Blocking issues documented in memory systems
    - [ ] Code committed and pushed
    - [ ] Pull request created
    - [ ] Roadmap checked/updated
    - [ ] Time tracking data recorded in TRACKER.md
    - [ ] Session insights stored in Memory-Keeper
    - [ ] Context compressed for efficiency
    - [ ] Final checkpoint created
    - [ ] Summary provided with memory integration status
  </verify>
</final_checklist>

<memory_integration_benefits>
  - **Dual Memory Architecture**: Session context (Memory-Keeper) + knowledge graph (Memento)
  - **Dynamic Tech Detection**: Automatic tech stack discovery via reference-docs symlinks
  - **Cross-Project Learning**: Implementation patterns shared across projects
  - **Context Efficiency**: Smart compression and reduction for large projects
  - **Implementation Consistency**: Pattern reuse ensures consistent code quality
  - **Workflow Continuity**: Checkpoint system enables session recovery and branching
  - **Blocking Issue Prevention**: Historical blocker patterns prevent similar problems
  - **Project Portability**: Reference-docs symlinks work across any project setup
</memory_integration_benefits>
