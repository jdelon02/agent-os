---
description: Mandatory MCP Workflow Initialization - Universal Enforcement Module
version: 1.0
encoding: UTF-8
---

# Mandatory MCP Workflow Initialization

<ai_meta>
  <parsing_rules>
    - Execute all steps sequentially without bypassing
    - Validate each step completion before proceeding
    - Use canonical project naming exclusively
    - Store all validation results in memory systems
  </parsing_rules>
  <enforcement_level>CRITICAL</enforcement_level>
  <bypass_prevention>All steps mandatory - no shortcuts allowed</bypass_prevention>
</ai_meta>

## 🔧 STEP 0: UNIVERSAL PROJECT IDENTITY CONSOLIDATION (MANDATORY)

**CRITICAL**: Execute this BEFORE any phase operations to prevent knowledge fragmentation:

### Universal Namespace Resolution Protocol

<canonical_project_id_generation>
  ```
  1. GENERATE CANONICAL PROJECT ID:
     - PROJECT_BASE_NAME = basename(current_working_directory)
     - CANONICAL_PROJECT_ID = normalize_slug(PROJECT_BASE_NAME)
     - If collision risk: CANONICAL_PROJECT_ID = "{base_name}-{path_hash_8_chars}"

  2. BUILD PROJECT ALIASES:
     - Include: [PROJECT_BASE_NAME, git_repo_name, title_case variants]
     - Include: "{base}_project", "{Title} {Tech}" patterns

  3. SEARCH FOR EXISTING ENTITIES:
     - Query each alias: memento-mcp-search_nodes query="{alias}"
     - Search by patterns: "*project*", "*Project*" with base name
     - Collect all potential matches for this project

  4. CONSOLIDATE DUPLICATES:
     IF multiple entities found:
       - Select primary entity (most complete/recent)
       - Create same_as relations: duplicate -> primary
       - Merge observations into primary entity
       - Use primary entity name for all subsequent operations
     
     IF single entity found:
       - Use existing entity name consistently
     
     IF no entities found:
       - Use CANONICAL_PROJECT_ID for new entities

  5. STORE RESOLVED NAME:
     - PROJECT_ENTITY_NAME = final resolved canonical name
     - Use ONLY this name for all Memento operations in session
  ```
</canonical_project_id_generation>

### Smart Memory Session Management

<memory_session_initialization>
  **PREREQUISITE**: Complete Step 0 (Namespace Consolidation) before session management.

  **CRITICAL**: Always check for existing sessions before creating new ones to maintain continuity and avoid resource waste.

  #### Step 1: Check for Existing Sessions
  ```
  1. Query active sessions: mcp-memory-keeper-context_status
     - Check for sessions matching current project directory
     - Look for sessions with related project context

  2. List recent sessions: mcp-memory-keeper-context_session_list
     - Find sessions from current project or related work
     - Check session metadata for relevance

  3. Evaluate session suitability:
     - Same project directory → High priority for reuse
     - Related project context → Consider continuation
     - Recent timestamp (within 24 hours) → Prefer continuation
     - Different project/context → Create new session
  ```

  #### Step 2: Session Decision Logic
  ```
  IF existing suitable session found:
     - Continue with existing session (no new initialization needed)
     - Save current context: mcp-memory-keeper-context_save
     - Update session with new task context
     - Log: "Continuing existing session: {session_id}"

  ELSE (no suitable session):
     - Create new session: mcp-memory-keeper-context_session_start
     - name: "{project_name}_{phase_name}_{timestamp}"
     - projectDir: "{absolute_project_path}"
     - description: "{phase_description}"
     - Log: "Created new session: {session_id}"
  ```

  #### Step 3: Session Context Management
  ```
  1. Save task context: mcp-memory-keeper-context_save
     - category: "task" 
     - key: "{project}_{phase}_{timestamp}"
     - priority: "high"
     - value: "{phase_summary_and_context}"

  2. Link to project context:
     - Reference previous phase analysis if continuing session
     - Note session continuity or new session reasoning
     - Document what context is being preserved/started fresh
  ```
</memory_session_initialization>

### Execute Confidence Assessment

<confidence_assessment>
  ```
  1. Check Meilisearch Cache First: Meilisearch-search
     - Query: "{primary_tech_stack} documentation" (e.g., "bash scripting documentation")
     - Check for existing cached documentation with trust scores
     - If relevant results found with trust ≥ 8.0 → Use cached documentation
     - If no results or trust < 8.0 → Proceed to Context7

  2. Fetch from Context7 (if needed): Only if Meilisearch cache miss or low trust
     a. Resolve library documentation: context7-resolve-library-id
        - libraryName: "{primary_tech_stack}" (e.g., "bash scripting")
     b. Fetch high-trust documentation: context7-get-library-docs
        - Use Context7-compatible library ID from step 2a
        - Store trust score for confidence calculation
     c. Cache results: Meilisearch-add-documents
        - Store retrieved documentation in appropriate technology index
        - Include trust scores and metadata for future cache hits

  3. Create knowledge entities: memento-mcp-create_entities
     - Use PROJECT_ENTITY_NAME (from Step 0) for all project entities
     - Technology/pattern entities with canonical naming
     - Documentation entities with trust scores (from cache or fresh retrieval)

  4. Establish relationships: memento-mcp-create_relations
     - Link using PROJECT_ENTITY_NAME consistently
     - Include confidence and strength scores
     - Store metadata with trust scores and documentation source (cache vs fresh)
  ```
</confidence_assessment>

### Mandatory Validation Checklist

<validation_checklist>
  ```
  🔍 MCP WORKFLOW INITIALIZATION STATUS:

  STEP 0 - NAMESPACE CONSOLIDATION:
  ✅ CANONICAL_PROJECT_ID: [generated from directory]
  ✅ PROJECT_ALIASES: [X aliases identified]  
  ✅ ENTITY_SEARCH: [searched all aliases - found X matches]
  ✅ CONSOLIDATION: [merged X duplicates / selected primary / created new]
  ✅ PROJECT_ENTITY_NAME: [final canonical name for session]

  STEP 1 - MEMORY SESSION:
  ✅ SESSION_CHECK: [existing session found/new session created]
  ✅ SESSION_ACTIVE: [session ID and project directory confirmed]
  ✅ CONTEXT_SAVED: [phase context stored in memory]

  STEP 2 - CONFIDENCE ASSESSMENT:
  ✅ CACHE_CHECKED: [Meilisearch documentation cache queried]
  ✅ DOCUMENTATION: [Context7 docs retrieved if needed]
  ✅ ENTITIES_CREATED: [project entities created with canonical naming]
  ✅ RELATIONSHIPS: [cross-project relationships established]
  ✅ CONFIDENCE_VALIDATED: [trust score ≥ 8.0 achieved]

  WORKFLOW STATUS: [COMPLETE/INCOMPLETE - explain any issues]
  NAMESPACE STATUS: [CLEAN/CONSOLIDATED - explain consolidation performed]
  ```
</validation_checklist>

### MCP Workflow Error Handling & Resilience

<error_handling>
  **CRITICAL RULE**: AI agents must NEVER abandon the MCP workflow due to individual tool failures. Instead, follow this escalation protocol:

  #### Step 1: Attempt Alternative Tools
  If a specific MCP tool is disabled or unavailable:

  1. **Memory-Keeper Issues**: Try alternative Memory-Keeper tools in this order:
     - If `session_start` fails → First try `status` and `session_list` to find existing sessions
     - If session discovery works → Use `context_save`, `context_analyze` with existing session
     - If no existing sessions found → Use `context_save` to create standalone context
     - Document whether continuing existing session or creating new context

  2. **Meilisearch Issues**: Try alternative documentation access in this order:
     - First: Use `Meilisearch-search` to check cache for existing documentation
     - If cache miss: Use `get-documents` to browse available cached documentation  
     - If cache insufficient: Fall back to direct Context7 queries
     - Document cache hit/miss ratio for optimization insights

  3. **Context7 Issues**: Try alternative documentation strategies:
     - Use cached Meilisearch results if available (even with lower trust scores)
     - Query Memento knowledge graph for similar project patterns
     - Use semantic search across existing documentation
     - Document degraded confidence levels and proceed with caution

  4. **Memento Issues**: Try alternative knowledge operations:
     - Use `read_graph` to assess existing knowledge
     - Try `search_nodes` instead of `create_entities`
     - Use `semantic_search` for pattern discovery

  #### Step 2: Mandatory Escalation Protocol
  If alternative tools don't provide the required functionality:

  **REQUIRED ACTION**: IMMEDIATELY stop work and ask the user:

  > "I cannot complete the mandatory MCP workflow because [specific tool/function] is unavailable and no suitable alternatives exist. According to your Agent OS instructions, I must complete the full MCP workflow before proceeding. 
  > 
  > Available options:
  > 1. Help me identify alternative tools to complete the workflow
  > 2. Provide temporary workflow modifications for this session
  > 3. Resolve the tool availability issue
  > 
  > How would you like me to proceed?"

  #### Step 3: Never Proceed Without Authorization
  **FORBIDDEN ACTIONS**:
  - ❌ Continuing phase work without completing MCP workflow
  - ❌ Making excuses for skipping required steps
  - ❌ Assuming workflow steps are "optional"
  - ❌ Proceeding with partial workflow completion

  **REQUIRED ACTIONS**:
  - ✅ Exhaustively try alternative tools first
  - ✅ Document exactly what was attempted
  - ✅ Explicitly ask for user guidance when stuck
  - ✅ Wait for clear authorization before proceeding differently
</error_handling>

### Completion Validation

<completion_validation>
  **Before proceeding to phase-specific work:**

  1. **Validate All Steps Completed**: Confirm all checklist items are ✅
  2. **Verify PROJECT_ENTITY_NAME Set**: Ensure canonical naming is active
  3. **Confirm Session Active**: Memory-Keeper session initialized and context saved
  4. **Check Confidence Level**: Trust score validation completed
  5. **Document Initialization**: Store completion status in memory

  **If ANY step is incomplete:**
  - **ERROR**: "MANDATORY MCP WORKFLOW INCOMPLETE"
  - **HALT**: Phase work cannot proceed until all initialization steps are completed
  - **RESTART**: Begin MCP workflow from Step 0 with full validation
</completion_validation>

## 🚨 Failure to Initialize = Invalid Phase Analysis

**Any phase execution without proper MCP initialization is considered incomplete and must be restarted with full workflow.**

**All subsequent phase operations MUST use PROJECT_ENTITY_NAME exclusively.**