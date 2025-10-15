---
description: Phase 2 - Research Specification (Enhanced Requirements Gathering)
globs:
alwaysApply: false
version: 3.0
encoding: UTF-8
---

# Phase 2: Research Specification (Enhanced Requirements Gathering)

## ⚠️ IMMEDIATE ACTION REQUIRED ⚠️

**STOP**: Before proceeding with Phase 2, you MUST activate MCP workflow systems:

1. **ACTIVATE TOOLS**: `activate_context_management_tools`, `activate_memento_management_tools`, `activate_meilisearch_management_tools`
2. **RESOLVE PROJECT IDENTITY**: Execute universal namespace consolidation (Step 0 below)
3. **START SESSION**: Initialize Memory-Keeper session with this project directory
4. **CHECK CACHE FIRST**: Query Meilisearch for cached documentation before Context7
5. **CREATE ENTITIES**: Store project and technology entities in Memento knowledge graph using canonical names
6. **VALIDATE CONFIDENCE**: Ensure trust score ≥ 8.0 before proceeding

**Any Phase 2 work without completing these 6 steps is INVALID and must be restarted.**

## 🔧 MANDATORY MCP WORKFLOW INITIALIZATION

<include>@reference-docs/instructions/support-workflows/mandatory-mcp-initialization.md</include>

**All subsequent Phase 2 operations MUST use PROJECT_ENTITY_NAME exclusively.**

<ai_meta>
  <parsing_rules>
    - Initialize memory systems before analysis
    - Process XML blocks first for structured data
    - Execute instructions in sequential order
    - Use templates as exact patterns
    - Analyze existing code before generating documentation
    - Store analysis in memory systems vs context accumulation
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
  - Gather detailed requirements and technical constraints
  - Conduct stakeholder interviews and analysis 
  - Perform visual asset detection and code reusability analysis
  - Build comprehensive understanding for specification creation
</purpose>

<context>
  - Second phase of 5-phase specification workflow
  - Follows Phase 1 (Initialize) project foundation
  - Enhanced with MCP intelligence for cross-project learning
  - Prepares detailed context for Phase 3 (Write Specification)
</context>

<prerequisites>
  - Completed Phase 1 (Initialize) with project foundation
  - Write access to project directory
  - MCP memory systems with Phase 1 context
  - Access to stakeholders for requirements gathering
</prerequisites>

<process_flow>

<step number="0" name="memory_and_precedence_initialization">

### Step 0: Initialize Memory Systems and Resolve Precedence

<memory_precedence_initialization>
  <!-- Use centralized Memory Systems and Precedence Initialization workflow -->
  <include>@reference-docs/instructions/memory-precedence-initialization.md</include>
  
  # Execute centralized initialization with research-spec specific parameters
  EXECUTE: memory_precedence_initialization_workflow()
  PARAMETERS:
    - command_name: "research-spec"
    - memory_requirements: "REQUIRED"  # Memory critical for Phase 2 continuity
    - override_categories: ["research_priorities", "stakeholder_lists", "requirements_templates"]
    - session_description: "Agent OS Phase 2: Requirements Research"
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
  
  # Log initialization completion
  LOG: "🔍 Phase 2 research initialization complete - loading project context"
  LOG: "🏷️ Project: {PROJECT_NAME} → {PROJECT_ENTITY_NAME} (Status: {NAMESPACE_STATUS})"
  
  # Log project overrides if detected
  IF PROJECT_OVERRIDES.additional_documentation:
    LOG: "🟠 Additional documentation loaded: {len(PROJECT_OVERRIDES.additional_documentation)} sources"
  IF PROJECT_OVERRIDES.custom_analysis_areas:
    LOG: "🟠 Custom analysis areas loaded: {len(PROJECT_OVERRIDES.custom_analysis_areas)} areas"
</memory_precedence_initialization>

</step>

<step number="1" name="analyze_existing_codebase_with_memory">

### Step 1: Analyze Existing Codebase (Memory-Enhanced)

<step_metadata>
  <purpose>analyze codebase using initialization context from Step 0</purpose>
  <uses_memory>centralized memory initialization results</uses_memory>
</step_metadata>

<instructions>
  ACTION: Codebase analysis logic (legacy KB initialization removed - now handled by centralized Step 0)
  CONTINUE: With memory-enhanced codebase analysis workflow
</instructions>

</step>

<step number="1" name="analyze_existing_codebase">

### Step 1: Analyze Existing Codebase (Memory-Enhanced)

<step_metadata>
  <action>deep codebase analysis with memory storage</action>
  <purpose>understand current state before documentation</purpose>
  <memory_integration>context reduction + cross-project learning</memory_integration>
</step_metadata>

<analysis_areas>
  <project_structure>
    - Directory organization
    - File naming patterns
    - Module structure
    - Build configuration
  </project_structure>
  <technology_stack>
    - Frameworks in use
    - Dependencies (package.json, Gemfile, requirements.txt, etc.)
    - Database systems
    - Infrastructure configuration
    - Documentation system (Context7 with Meilisearch caching)
  </technology_stack>
  <implementation_progress>
    - Completed features
    - Work in progress
    - Authentication/authorization state
    - API endpoints
    - Database schema
  </implementation_progress>
  <code_patterns>
    - Coding style in use
    - Naming conventions
    - File organization patterns
    - Testing approach
  </code_patterns>
  <documentation_caching>
    - Meilisearch integration for Context7 caching
    - Mapping between library names and Context7 library IDs
    - Documentation fetch and storage workflows
    - Cache invalidation and refresh policies
  </documentation_caching>
</analysis_areas>

<memory_enhanced_analysis>
  <!-- Apply project overrides if scheduled -->
  IF project_overrides.additional_documentation:
    FOR doc in additional_docs:
      READ: document with memory caching
      CALL: mcp-memory-keeper-context_cache_file
      STORE_SUMMARY: in memory vs full context
  
  <!-- Perform codebase analysis with memory storage -->
  FOR_EACH: codebase_component
    # Perform detailed analysis
    component_analysis = analyze_component(component, PRIMARY_TECH)
    
    # Store in Memory-Keeper (workflow continuity)
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "analysis-{component_name}"
      - value: create_summary(component_analysis, max_length=300)
      - category: "analysis"
      - priority: "high"
    
    # Store in Memento (long-term knowledge)
    CALL: memento-mcp-create_entities
    PARAMETERS:
      - entities: [{
          "name": "{PROJECT_NAME}-{component_name}",
          "entityType": "code_component",
          "observations": [
            "Type: {component_type}",
            "Tech: {get_tech_for_component(component_name, TECH_STACKS)}",
            "Key Features: {extract_key_features(component_analysis)}",
            "Analysis Date: {current_date()}"
          ]
        }]
    
    # Context reduction - keep essential summary only
    CONTEXT_SUMMARY += "✓ {component_name}: {create_brief_summary(component_analysis, max_length=50)}"
  
  <!-- Cross-project pattern recognition -->
  CALL: memento-mcp-semantic_search
  PARAMETERS:
    - query: "{PRIMARY_TECH} {PROJECT_TYPE} architecture patterns"
    - entity_types: ["code_component", "architectural_decision"]
    - limit: 5
  
  IF similar_patterns_found:
    pattern_insights = analyze_similar_patterns(similar_patterns)
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "cross-project-insights"
      - value: pattern_insights
      - category: "analysis"
      - priority: "normal"
    
    LOG: "💡 Found {len(similar_patterns)} similar patterns from other projects"
    CONTEXT_NOTE: "Cross-project insights available: {pattern_insights[:100]}..."
</memory_enhanced_analysis>

<instructions>
  ACTION: Analyze codebase with memory integration and context reduction
  STORE: Detailed analysis in memory systems, summaries in context
  LEVERAGE: Cross-project patterns for enhanced insights  
  REDUCE: Context size by 70-90% vs traditional approach
</instructions>
  EXAMINE: Meilisearch configuration for documentation caching
</instructions>

</step>

<step number="1.4" name="analyze_existing_specifications">

### Step 1.4: Analyze Existing Specifications for Research Focus

<step_metadata>
  <action>read existing spec.md to identify research gaps and focus areas</action>
  <purpose>focus research efforts on gaps rather than duplicating existing work</purpose>
  <memory_integration>specification analysis + research prioritization</memory_integration>
  <condition>optional - graceful fallback if spec.md doesn't exist</condition>
</step_metadata>

<spec_guided_research>
  # Check for existing specifications to guide research
  IF file_exists(".agent-os/specs/spec.md"):
    LOG: "📋 Found existing spec.md - analyzing for research gaps and focus areas"
    
    # Read and analyze specification content
    spec_content = read_file(".agent-os/specs/spec.md")
    
    # Identify research areas with context reduction
    research_analysis = {
      "documented_features": extract_feature_list(spec_content, max_features=7),
      "implementation_gaps": identify_implementation_gaps(spec_content),
      "architecture_questions": extract_unresolved_questions(spec_content),
      "technology_decisions": extract_pending_tech_decisions(spec_content),
      "integration_unknowns": identify_integration_research_needs(spec_content),
      "research_priorities": prioritize_research_areas(spec_content)
    }
    
    # Store research focus in memory
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "spec-guided-research-focus"
      - value: create_research_summary(research_analysis, max_length=500)
      - category: "research"
      - priority: "high"
    
    # Search for similar architectural patterns using Qdrant
    IF research_analysis.architecture_questions:
      CALL: qdrant-qdrant_retrieve
      PARAMETERS:
        - collectionNames: ["agent-os-global-specs", "agent-os-global-decisions"]
        - query: research_analysis.architecture_questions
        - topK: 5
      
      IF similar_architecture_found:
        architecture_insights = analyze_similar_architectures(similar_patterns)
        CALL: mcp-memory-keeper-context_save
        PARAMETERS:
          - key: "architecture-research-insights"
          - value: architecture_insights
          - category: "research"
          - priority: "high"
    
    # Enhanced Context7 research based on spec analysis
    IF research_analysis.technology_decisions:
      FOR tech_question IN research_analysis.technology_decisions[:3]:  # Limit to top 3
        CALL: context7-resolve-library-id
        PARAMETERS:
          - libraryName: extract_technology_name(tech_question)
        
        IF library_resolved:
          CALL: context7-get-library-docs
          PARAMETERS:
            - context7CompatibleLibraryID: "{resolved_library_id}"
            - topic: "{tech_question}"
            - tokens: 2000
          
          # Store focused research results
          CALL: mcp-memory-keeper-context_save
          PARAMETERS:
            - key: "tech-research-{tech_question_id}"
            - value: "{documentation_insights}"
            - category: "research"
            - priority: "high"
    
    # Update project entity with research focus
    CALL: memento-mcp-add_observations
    PARAMETERS:
      - observations: [{
          "entityName": "{PROJECT_ENTITY_NAME}",
          "contents": [
            "Research Focus: {len(research_analysis.research_priorities)} priority areas identified",
            "Implementation Gaps: {len(research_analysis.implementation_gaps)} areas need research",
            "Tech Decisions: {len(research_analysis.technology_decisions)} pending decisions",
            "Guided Research: Focused on specification gaps rather than broad exploration"
          ]
        }]
    
    LOG: "✅ Spec-guided research focus established - {len(research_analysis.research_priorities)} priority areas"
    CONTEXT_NOTE: "Research focused on: {research_analysis.research_priorities[:3]}"
  
  ELSE:
    LOG: "ℹ️ No existing spec.md - proceeding with broad project research"
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "spec-guided-research-focus"
      - value: "No existing specifications - conducting comprehensive project research"
      - category: "research"
      - priority: "normal"
</spec_guided_research>

<spec_guided_benefits>
  <targeted_research>
    - Focus on actual gaps rather than duplicating documented areas
    - Prioritize research based on specification maturity
    - Identify specific technology decisions needing investigation
    - Target integration points requiring architectural research
  </targeted_research>
  
  <enhanced_mcp_usage>
    - Context7 searches guided by specific technology questions from spec
    - Qdrant searches target similar architectural patterns
    - Research MCPs work on focused queries rather than broad exploration
    - Memory systems track research progress against specification needs
  </enhanced_mcp_usage>
  
  <research_efficiency>
    - Avoid researching already-decided architectural choices
    - Focus documentation lookup on unresolved questions
    - Prioritize research time on highest-impact unknowns
    - Build research directly on existing project foundation
  </research_efficiency>
</spec_guided_benefits>

<instructions>
  ACTION: Read existing spec.md to identify research gaps and focus areas
  PRIORITIZE: Research efforts on actual specification gaps rather than broad exploration
  ENHANCE: MCP research tools with specific questions from specification analysis
  STORE: Research focus and findings in memory systems for Phase 3 continuation
  LEVERAGE: Existing project knowledge to make research more targeted and efficient
</instructions>

</step>

<step number="1.5" name="kb_context_retrieval">

### Step 1.5: Knowledge Base Context Retrieval

<step_metadata>
  <action>load relevant project context from KB</action>
  <purpose>reduce context memory by leveraging persistent knowledge</purpose>
  <queries>project history, previous analysis, architectural evolution</queries>
  <condition>only if memory-keeper available</condition>
</step_metadata>

<kb_query_categories>
  <project_history>
    - Previous analysis sessions and findings
    - Architectural evolution and changes over time
    - Major refactoring decisions and outcomes
    - Technology migration history
  </project_history>
  <architectural_decisions>
    - Framework and technology choices made
    - Infrastructure and deployment decisions
    - Integration patterns established
    - Performance and scalability considerations
  </architectural_decisions>
  <implementation_insights>
    - Code patterns and conventions discovered
    - Testing strategies and coverage established
    - Build and deployment processes
    - Development workflow patterns
  </implementation_insights>
  <analysis_context>
    - Focus areas from previous analysis sessions
    - Known technical debt and improvement areas
    - Stakeholder priorities and business context
    - Success criteria and metrics established
  </analysis_context>
</kb_query_categories>

<kb_retrieval_process>
  <semantic_search>
    1. QUERY memory-keeper for project analysis and architectural context
    2. SEARCH for historical decisions and evolution patterns
    3. RETRIEVE relevant entries from each category
    4. SYNTHESIZE unified context summary for informed analysis
  </semantic_search>
  <context_filtering>
    1. FILTER retrieved context by current analysis relevance
    2. PRIORITIZE recent architectural decisions and insights
    3. EXCLUDE outdated or superseded information
    4. LIMIT total context to manageable size (2000 tokens max)
  </context_filtering>
  <fallback_behavior>
    1. IF memory-keeper unavailable: SKIP this step
    2. CONTINUE with standard codebase analysis workflow
    3. DOCUMENT KB unavailability in session notes
  </fallback_behavior>
</kb_retrieval_process>

<context_synthesis_template>
  ## Retrieved Project Context
  
  Based on project history and previous analysis:
  
  ### Architectural Evolution
  - **Previous Architecture**: [HISTORICAL_ARCHITECTURE_FROM_KB]
  - **Migration History**: [TECHNOLOGY_MIGRATIONS_FROM_KB]
  - **Key Decisions**: [ARCHITECTURAL_DECISIONS_FROM_KB]
  
  ### Implementation Insights
  - **Code Patterns**: [ESTABLISHED_PATTERNS_FROM_KB]
  - **Testing Strategy**: [TESTING_APPROACH_FROM_KB]
  - **Development Workflow**: [WORKFLOW_PATTERNS_FROM_KB]
  
  ### Analysis Focus Areas
  - [FOCUS_AREA_1_FROM_KB]
  - [FOCUS_AREA_2_FROM_KB]
  
  ### Known Technical Debt
  - [TECHNICAL_DEBT_1_FROM_KB]
  - [TECHNICAL_DEBT_2_FROM_KB]
</context_synthesis_template>

<instructions>
  ACTION: Query memory-keeper for project analysis context (if available)
  SYNTHESIZE: Combine KB results with current codebase analysis
  FILTER: Limit context to current analysis relevance
  ENHANCE: Use historical context to inform deeper analysis
</instructions>

</step>

<step number="2" name="gather_product_context">

### Step 2: Gather Product Context

<step_metadata>
  <supplements>codebase analysis</supplements>
  <gathers>business context and future plans</gathers>
  <enhances>with historical context from KB if available</enhances>
</step_metadata>

<context_questions>
  Based on my analysis of your codebase, I can see you're building [OBSERVED_PRODUCT_TYPE].

  [IF KB_AVAILABLE]:
  From the project history, I understand there have been [KB_HISTORICAL_CONTEXT_SUMMARY].

  To properly set up Agent OS, I need to understand:

  1. **Product Vision**: What problem does this solve? Who are the target users?

  2. **Current State**: Are there features I should know about that aren't obvious from the code?

  3. **Roadmap**: What features are planned next? Any major refactoring planned?

  4. **Decisions**: Are there important technical or product decisions I should document?

  5. **Team Preferences**: Any coding standards or practices the team follows that I should capture?

  [IF KB_AVAILABLE]:
  6. **Evolution**: How do current plans align with the architectural evolution I see in the project history?
</context_questions>

<instructions>
  ACTION: Ask user for product context
  COMBINE: Merge user input with codebase analysis and KB context
  PREPARE: Information for plan-product.md execution
  ENHANCE: Use KB historical context to ask more informed questions
</instructions>

</step>

<step number="2.8" name="enhanced_mcp_learning_integration">

### Step 2.8: Enhanced MCP Learning Integration

<step_metadata>
  <action>apply enhanced MCP learning tools for research decomposition analysis</action>
  <purpose>capture learning patterns from research processes for cross-project intelligence</purpose>
  <memory_integration>store research patterns and thinking approaches for future research phases</memory_integration>
</step_metadata>

<enhanced_mcp_learning>
  <!-- Apply Enhanced MCP Learning Integration Module -->
  <include>@templates/instructions/support-workflows/enhanced-mcp-learning-integration.md</include>
  
  PARAMETERS:
    - workflow_phase: "research"
    - context: "research_decomposition"
    - learning_focus: ["thinking_patterns", "research_simplification"]
  
  LOG: "🧠 Phase 2 Enhanced Learning: Analyzing research decomposition effectiveness"
  LOG: "📊 Focus Areas: Thinking patterns and research simplification approaches"
</enhanced_mcp_learning>

</step>

<step number="3" name="execute_plan_product">

### Step 3: Execute Plan-Product with Context

<step_metadata>
  <uses>./plan-product.md</uses>
  <modifies>standard flow for existing products</modifies>
</step_metadata>

<execution_parameters>
  <main_idea>[DERIVED_FROM_ANALYSIS_AND_USER_INPUT]</main_idea>
  <key_features>[IDENTIFIED_IMPLEMENTED_AND_PLANNED_FEATURES]</key_features>
  <target_users>[FROM_USER_CONTEXT]</target_users>
  <tech_stack>[DETECTED_FROM_CODEBASE]</tech_stack>
</execution_parameters>

<execution_prompt>
  ./plan-product.md

  Here's what I've gathered:

  **Main Idea**: [SUMMARY_FROM_ANALYSIS_AND_CONTEXT]

  **Key Features**:
  - Already Implemented: [LIST_FROM_ANALYSIS]
  - Planned: [LIST_FROM_USER]

  **Target Users**: [FROM_USER_RESPONSE]

  **Tech Stack**: [DETECTED_STACK_WITH_VERSIONS]
  
  [IF KB_AVAILABLE]:
  **Historical Context**: [KB_EVOLUTION_SUMMARY]
</execution_prompt>

<instructions>
  ACTION: Execute plan-product.md with gathered information
  PROVIDE: All context as structured input including KB insights
  ALLOW: plan-product.md to create .agent-os/product/ structure
  SETUP: Create .agent-os/specs/ directory structure for consolidated specifications
  ENHANCE: Incorporate historical context for better documentation
</instructions>

</step>

<step number="4" name="customize_generated_files">

### Step 4: Customize Generated Documentation

<step_metadata>
  <refines>generated documentation</refines>
  <ensures>accuracy for existing product</ensures>
  <enhances>with KB insights if available</enhances>
</step_metadata>

<customization_tasks>
  <roadmap_adjustment>
    - Mark completed features as done
    - Move implemented items to "Phase 0: Already Completed"
    - Adjust future phases based on actual progress
    - Incorporate lessons learned from KB if available
  </roadmap_adjustment>
  <tech_stack_verification>
    - Verify detected versions are correct
    - Add any missing infrastructure details
    - Document actual deployment setup
    - Set up Context7 documentation mappings in tech-stack.md files
    - Establish Meilisearch keys for documentation caching
  </tech_stack_verification>
  <decisions_documentation>
    - Add historical decisions that shaped current architecture
    - Document why certain technologies were chosen
    - Capture any pivots or major changes
    - Incorporate decision history from KB if available
  </decisions_documentation>
  <documentation_system_setup>
    - Configure Context7 with Meilisearch caching system
    - Ensure mappings exist between Meilisearch keys and Context7 library IDs
    - Document the required workflow for checking cache before API calls
    - Implement the cache-first documentation retrieval pattern
    - Add schema for Meilisearch documentation records
  </documentation_system_setup>
  <kb_integration_setup>
    - Incorporate insights from historical analysis if available
    - Ensure documentation reflects architectural evolution
    - Document patterns and decisions discovered through KB analysis
    - Establish baseline for future analysis sessions
  </kb_integration_setup>
</customization_tasks>

<roadmap_template>
  ## Phase 0: Already Completed

  The following features have been implemented:

  - [x] [FEATURE_1] - [DESCRIPTION_FROM_CODE]
  - [x] [FEATURE_2] - [DESCRIPTION_FROM_CODE]
  - [x] [FEATURE_3] - [DESCRIPTION_FROM_CODE]

  [IF KB_AVAILABLE]:
  ### Historical Development
  - **Evolution**: [KB_ARCHITECTURAL_EVOLUTION]
  - **Key Milestones**: [KB_DEVELOPMENT_MILESTONES]
  - **Lessons Learned**: [KB_LESSONS_LEARNED]

  ## Phase 1: Current Development

  - [ ] [IN_PROGRESS_FEATURE] - [DESCRIPTION]

  [CONTINUE_WITH_STANDARD_PHASES]
</roadmap_template>

<instructions>
  ACTION: Update generated files to reflect reality
  MODIFY: Roadmap to show completed work and historical context
  VERIFY: Tech stack matches actual implementation
  ADD: Historical context to decisions.md from KB if available
  ENHANCE: Documentation with evolutionary insights
</instructions>

</step>

<step number="4.5" name="integrated_memory_persistence">

### Step 4.5: Integrated Memory System Persistence

<step_metadata>
  <action>capture and store session insights</action>
  <purpose>build persistent knowledge for future sessions</purpose>
  <stores>analysis insights, architectural discoveries, evolution patterns</stores>
  <condition>only if memory-keeper available</condition>
</step_metadata>

<kb_persistence_categories>
  <analysis_insights>
    - Codebase architecture and patterns discovered
    - Technology stack analysis and rationale
    - Implementation quality and code patterns
    - Testing coverage and strategies found
  </analysis_insights>
  <architectural_discoveries>
    - Design patterns and conventions identified
    - Integration approaches and dependencies
    - Performance considerations and bottlenecks
    - Scalability patterns and limitations
  </architectural_discoveries>
  <project_evolution>
    - Development timeline and milestones
    - Technology migrations and upgrades
    - Feature development progression
    - Team practices and workflows identified
  </project_evolution>
  <technical_debt_assessment>
    - Areas needing improvement or refactoring
    - Outdated dependencies or practices
    - Security considerations and vulnerabilities
    - Performance optimization opportunities
  </technical_debt_assessment>
</kb_persistence_categories>

<kb_persistence_process>
  <insight_extraction>
    1. ANALYZE session content for key analysis insights and discoveries
    2. EXTRACT architectural patterns, technology decisions, and implementation details
    3. CATEGORIZE findings by persistence category
    4. PRIORITIZE information by future development relevance
  </insight_extraction>
  <knowledge_storage>
    1. SAVE analysis insights and architectural discoveries to memory-keeper
    2. STORE technology stack analysis and implementation patterns
    3. TAG entries with relevant architectural areas and technology categories
    4. LINK to created documentation files and analysis artifacts
  </knowledge_storage>
  <evolution_tracking>
    1. ESTABLISH baseline for project current state
    2. DOCUMENT development history and evolution patterns
    3. CAPTURE lessons learned and best practices identified
    4. PREPARE context for future analysis and development sessions
  </evolution_tracking>
  <fallback_behavior>
    1. IF memory-keeper unavailable: SKIP Integrated Memory System persistence
    2. DOCUMENT key analysis insights in session summary
    3. RECOMMEND manual knowledge capture in project documentation
  </fallback_behavior>
</kb_persistence_process>

<persistence_template>
  ## Analysis Knowledge Captured
  
  The following insights have been stored in the Integrated Memory System:
  
  ### Architectural Analysis
  - **Architecture Pattern**: [CAPTURED_ARCHITECTURE_PATTERN]
  - **Technology Stack**: [CAPTURED_TECH_STACK_ANALYSIS]
  - **Code Quality**: [CAPTURED_QUALITY_ASSESSMENT]
  - **Integration Patterns**: [CAPTURED_INTEGRATION_ANALYSIS]
  
  ### Implementation Insights
  - **Design Patterns**: [CAPTURED_DESIGN_PATTERNS]
  - **Code Conventions**: [CAPTURED_CODE_CONVENTIONS]
  - **Testing Strategy**: [CAPTURED_TESTING_ANALYSIS]
  - **Build Process**: [CAPTURED_BUILD_ANALYSIS]
  
  ### Evolution Context
  - **Development History**: [CAPTURED_DEVELOPMENT_TIMELINE]
  - **Technology Decisions**: [CAPTURED_TECH_DECISIONS]
  - **Feature Progression**: [CAPTURED_FEATURE_DEVELOPMENT]
  - **Team Practices**: [CAPTURED_TEAM_WORKFLOW]
  
  ### Technical Assessment
  - **Strengths**: [CAPTURED_PROJECT_STRENGTHS]
  - **Improvement Areas**: [CAPTURED_IMPROVEMENT_AREAS]
  - **Technical Debt**: [CAPTURED_TECHNICAL_DEBT]
  - **Optimization Opportunities**: [CAPTURED_OPTIMIZATION_AREAS]
  
  ### Project Status
  - **Analysis Date**: [CURRENT_DATE]
  - **Agent OS Installation**: Completed
  - **Documentation Created**: [LIST_OF_CREATED_FILES]
  - **Next Recommended Phase**: [RECOMMENDED_NEXT_STEPS]
</persistence_template>

<instructions>
  ACTION: Extract and categorize analysis session insights
  STORE: Save structured knowledge to memory-keeper (if available)
  ESTABLISH: Project baseline and evolution context
  PREPARE: Foundation for future analysis and development sessions
</instructions>

</step>

<step number="5" name="final_verification">

### Step 5: Final Verification and Summary

<step_metadata>
  <verifies>installation completeness</verifies>
  <provides>next steps for user</provides>
</step_metadata>

<verification_checklist>
  - [ ] Memory-keeper Integrated Memory System initialization attempted (if available)
  - [ ] Project context retrieved and integrated from Integrated Memory System (if available)
  - [ ] .agent-os/product/ directory created
  - [ ] .agent-os/specs/ directory structure prepared for consolidated specifications
  - [ ] All product documentation reflects actual codebase
  - [ ] Roadmap shows completed and planned features accurately
  - [ ] Tech stack matches installed dependencies
  - [ ] Context7 mappings added to tech-stack.md files
  - [ ] Documentation workflow properly configured with Meilisearch caching
  - [ ] Meilisearch keys and Context7 library IDs mapping established
  - [ ] Cache-first documentation retrieval pattern implemented
  - [ ] Meilisearch collection created for documentation storage
  - [ ] CLAUDE.md or .cursorrules configured (if applicable)
  - [ ] Analysis insights stored in Integrated Memory System (if available)
  - [ ] Project evolution baseline established
</verification_checklist>

<summary_template>
  ## ✅ Agent OS Successfully Installed

  I've analyzed your [PRODUCT_TYPE] codebase and set up Agent OS with documentation that reflects your actual implementation.

  ### What I Found

  - **Tech Stack**: [SUMMARY_OF_DETECTED_STACK]
  - **Completed Features**: [COUNT] features already implemented
  - **Code Style**: [DETECTED_PATTERNS]
  - **Current Phase**: [IDENTIFIED_DEVELOPMENT_STAGE]
  [IF KB_AVAILABLE]:
  - **Historical Context**: [KB_EVOLUTION_INSIGHTS]
  - **Architectural Maturity**: [KB_MATURITY_ASSESSMENT]

  ### What Was Created

  - ✓ Product documentation in `.agent-os/product/`
  - ✓ Consolidated specification structure in `.agent-os/specs/`
  - ✓ Roadmap with completed work in Phase 0
  - ✓ Tech stack reflecting actual dependencies
  [IF KB_AVAILABLE]:
  - ✓ Project analysis stored in Integrated Memory System
  - ✓ Evolution baseline established for future sessions

  ### Next Steps

  1. Review the generated documentation in `.agent-os/product/`
  2. Make any necessary adjustments to reflect your vision
  3. See the Agent OS README for usage instructions: https://github.com/jdelon02/agent-os
  4. Start using Agent OS for your next feature:
     ```
     ./create-spec.md
     ```
     This will create/update your consolidated specification files:
     - `.agent-os/specs/spec.md` - Master specification document
     - `.agent-os/specs/tasks.md` - Consolidated task breakdown
     - `.agent-os/specs/sub-specs/` - Technical implementation details

  [IF KB_AVAILABLE]:
  ### Integrated Memory System Benefits

  Your project analysis has been stored for future sessions, enabling:
  - Informed architectural decisions based on project history
  - Consistent development patterns across team members
  - Evolutionary tracking of your codebase over time
  - Enhanced context for future Agent OS operations
  - Consolidated specification workflow for streamlined feature development

  Your codebase is now Agent OS-enabled with intelligent context management and consolidated specifications! 🚀
</summary_template>

<instructions>
  ACTION: Verify all files created correctly
  SUMMARIZE: What was found and created, including Integrated Memory System
  PROVIDE: Clear next steps for user
  HIGHLIGHT: Integrated Memory System benefits if available
</instructions>

</step>

</process_flow>

## Error Handling

<error_scenarios>
  <scenario name="no_clear_structure">
    <condition>Cannot determine project type or structure</condition>
    <action>Ask user for clarification about project</action>
  </scenario>
  <scenario name="conflicting_patterns">
    <condition>Multiple coding styles detected</condition>
    <action>Ask user which pattern to document</action>
    <enhancement>Check KB for historical pattern decisions if available</enhancement>
  </scenario>
  <scenario name="missing_dependencies">
    <condition>Cannot determine full tech stack</condition>
    <action>List detected technologies and ask for missing pieces</action>
  </scenario>
  <scenario name="kb_unavailable">
    <condition>Memory-keeper MCP not available</condition>
    <action>Continue with standard analysis, document limitation</action>
    <impact>Reduced context continuity but full functionality preserved</impact>
  </scenario>
  <scenario name="analysis_error_occurs">
    <condition>Any error occurs during codebase analysis or tech detection</condition>
    <action>Execute memory-guided error resolution procedures</action>
    <procedure>
      1. IMMEDIATE: Store error details in Memory-Keeper for tracking
      2. SEARCH: Query Memory-Keeper and Memento for similar analysis errors
      3. APPLY: Try memory-guided solutions in confidence order
      4. DOCUMENT: Store successful resolution for future reference
      5. REFERENCE: Follow detailed procedures in @error-resolution-via-memory.md
    </procedure>
    <enhancement>Build cross-project analysis error solution database</enhancement>
  </scenario>
</error_scenarios>

## Execution Summary

<final_checklist>
  <verify>
    - [ ] Memory-keeper KB initialization attempted (if available)
    - [ ] Historical project context retrieved and integrated (if available)
    - [ ] Codebase analyzed thoroughly
    - [ ] User context gathered with historical insights
    - [ ] plan-product.md executed with proper context
    - [ ] Documentation customized for existing product with evolution context
    - [ ] Analysis insights captured in KB (if available)
    - [ ] Team can adopt Agent OS workflow with enhanced context
  </verify>
</final_checklist>

<memory_system_integration_benefits>
  - Enhanced analysis depth through historical context and patterns
  - Reduced context memory consumption through persistent architectural knowledge
  - Evolutionary tracking of codebase changes and decisions over time
  - Cross-session continuity for ongoing analysis and improvement
  - Informed decision-making based on project history and lessons learned
  - Accelerated onboarding for new team members through comprehensive project context
</memory_system_integration_benefits>
