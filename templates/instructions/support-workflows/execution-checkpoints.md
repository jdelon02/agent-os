---
description: Execution Checkpoint System for Agent OS Execute-Tasks Workflow Integration
globs:
alwaysApply: false
version: 1.0
encoding: UTF-8
---

# Execution Checkpoint System

<ai_meta>
  <parsing_rules>
    - Create checkpoints at every role transition in execute-tasks workflow
    - Store structured role execution data in Memory-Keeper
    - Enable granular recovery and resume capabilities for role-based execution
    - Integrate with Memento for implementation pattern storage
    - Maintain backward compatibility with standard execute-tasks workflow
  </parsing_rules>
  <checkpoint_integration>
    - memory_keeper: role checkpoints, implementation progress tracking, error state preservation
    - memento: implementation pattern storage at role completion
    - meilisearch: documentation caching and pattern retrieval
    - redis_mcp: primary state storage for role handoffs and workflow persistence (when available)
  </checkpoint_integration>
</ai_meta>

## Overview

<purpose>
  - Enable granular workflow recovery at any role transition
  - Provide structured progress tracking for complex implementation tasks
  - Integrate role-based checkpoints with Memory-Keeper and Redis MCP
  - Support both standard and orchestrated execution modes
  - Address execute-tasks reliability issues (Context loss, Role confusion, User interaction disruption)
</purpose>

<context>
  - Used in orchestrated execute-tasks workflow with role specialization
  - Integrates with Memory-Keeper for persistent session management
  - Supports resume capability for interrupted role execution
  - Enables role-specific error recovery and context preservation
  - Complements Redis MCP state management when available
</context>

<prerequisites>
  - Memory-Keeper MCP integration available
  - Project canonical identity established (PROJECT_ENTITY_NAME resolved)
  - Execute-tasks orchestrator workflow activated
  - Access to role-specific instruction templates
</prerequisites>

## Role Checkpoint Framework

<role_definitions>
  <role_1>
    <name>Pattern Analyzer</name>
    <purpose>Implementation pattern discovery and cross-project analysis</purpose>
    <outputs>discovered_patterns, cross_project_insights, anti_pattern_warnings, implementation_guidance</outputs>
    <success_criteria>patterns_documented, cross_project_analysis_complete, implementation_ready</success_criteria>
  </role_1>
  <role_2>
    <name>Implementer</name>
    <purpose>Feature implementation following discovered patterns</purpose>
    <outputs>implemented_features, implementation_evidence, pattern_applications, quality_validation</outputs>
    <success_criteria>features_implemented, tests_passing, patterns_applied, evidence_documented</success_criteria>
  </role_2>
  <role_3>
    <name>Verifier</name>
    <purpose>Quality assessment and acceptance criteria validation</purpose>
    <outputs>verification_results, quality_assessment, test_results, issue_identification</outputs>
    <success_criteria>acceptance_criteria_met, quality_validated, issues_resolved, verification_complete</success_criteria>
  </role_3>
  <role_4>
    <name>Documenter</name>
    <purpose>Implementation documentation and knowledge capture</purpose>
    <outputs>implementation_documentation, learning_outcomes, cross_project_patterns, knowledge_transfer</outputs>
    <success_criteria>documentation_complete, knowledge_captured, patterns_stored, handoff_ready</success_criteria>
  </role_4>
</role_definitions>

## Checkpoint Implementation

<step number="1" name="role_checkpoint_creation">

### Step 1: Role Checkpoint Creation

<checkpoint_structure>
  <checkpoint_metadata>
    - checkpoint_id: "{PROJECT_ENTITY_NAME}-role-{role_name}-{timestamp}"
    - role_name: "{ROLE_NAME}" 
    - role_stage: ["start", "progress", "complete", "error"]
    - project_entity_name: "{PROJECT_ENTITY_NAME}"
    - timestamp: "{ISO_TIMESTAMP}"
    - session_id: "{MEMORY_KEEPER_SESSION_ID}"
    - status: ["in_progress", "completed", "failed", "paused_for_user"]
    - progress_percent: {PROGRESS_PERCENTAGE}
  </checkpoint_metadata>
  <checkpoint_data>
    - role_inputs: structured data entering the role
    - role_outputs: structured data produced by the role
    - decisions_made: key implementation decisions and rationale
    - patterns_applied: implementation patterns used
    - errors_encountered: any errors and their resolutions
    - next_role_requirements: handoff data for next role
    - user_interactions: any user questions and responses
    - context_preservation: complete role execution context
  </checkpoint_data>
</checkpoint_structure>

<checkpoint_creation_process>
  <role_start_checkpoint>
    <!-- Create checkpoint at role start -->
    CALL: mcp-memory-keeper-context_checkpoint
    PARAMETERS:
      - name: "{PROJECT_ENTITY_NAME}-{role_name}-start"
      - description: "Starting {role_name} role for {PROJECT_ENTITY_NAME}"
      - includeFiles: true
      - includeGitStatus: true
    
    <!-- Store role initialization data -->
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "role-{role_name}-start-data"
      - value: "{ROLE_INITIALIZATION_DATA}"
      - category: "progress"
      - priority: "high"
    
    <!-- Store role context in Redis MCP if available -->
    IF redis_mcp_available:
      STORE: workflow state with current role context
      SET_TTL: 2 hours for role execution
  </role_start_checkpoint>
  
  <role_progress_checkpoint>
    <!-- Create progress checkpoint during role execution -->
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "role-{role_name}-progress-{timestamp}"
      - value: "{ROLE_PROGRESS_DATA}"
      - category: "progress"
      - priority: "normal"
    
    <!-- Update Redis MCP workflow state -->
    IF redis_mcp_available:
      UPDATE: workflow progress percentage
      UPDATE: current step and context
      EXTEND_TTL: if actively progressing
  </role_progress_checkpoint>
  
  <role_completion_checkpoint>
    <!-- Create checkpoint at role completion -->
    CALL: mcp-memory-keeper-context_checkpoint
    PARAMETERS:
      - name: "{PROJECT_ENTITY_NAME}-{role_name}-complete"
      - description: "Completed {role_name} role for {PROJECT_ENTITY_NAME}"
      - includeFiles: true
      - includeGitStatus: true
    
    <!-- Store role completion data -->
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "role-{role_name}-completion-data"
      - value: "{ROLE_COMPLETION_DATA}"
      - category: "progress"
      - priority: "high"
    
    <!-- Store implementation patterns in Memento -->
    IF implementation_patterns_identified:
      CALL: memento-mcp-create_entities
      PARAMETERS:
        - entities: [{
            "name": "{PROJECT_ENTITY_NAME}-{role_name}-patterns",
            "entityType": "implementation_pattern",
            "observations": [
              "Role: {role_name}",
              "Patterns: {applied_patterns}",
              "Implementation Evidence: {evidence_summary}",
              "Completion Date: {current_date()}",
              "Status: completed"
            ]
          }]
    
    <!-- Store handoff data in Redis MCP -->
    IF redis_mcp_available:
      STORE: structured handoff data for next role
      SET_TTL: 48 hours for handoff persistence
  </role_completion_checkpoint>
  
  <user_interaction_checkpoint>
    <!-- Create checkpoint before user interaction -->
    CALL: mcp-memory-keeper-context_checkpoint
    PARAMETERS:
      - name: "{PROJECT_ENTITY_NAME}-{role_name}-user-interaction-{timestamp}"
      - description: "User interaction checkpoint during {role_name} role"
      - includeFiles: true
      - includeGitStatus: false
    
    <!-- Store user interaction context -->
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "user-interaction-{role_name}-{timestamp}"
      - value: "{USER_INTERACTION_CONTEXT}"
      - category: "progress" 
      - priority: "high"
    
    <!-- Store interaction checkpoint in Redis MCP -->
    IF redis_mcp_available:
      STORE: user interaction checkpoint with resume context
      SET_TTL: 1 hour for interaction recovery
  </user_interaction_checkpoint>
</checkpoint_creation_process>

<instructions>
  ACTION: Create structured checkpoints at role start, progress, completion, and user interactions
  STORE: Role execution data in Memory-Keeper with canonical project identity
  INTEGRATE: Implementation patterns with Memento knowledge graph
  PERSIST: Workflow state in Redis MCP when available for enhanced reliability
  LOG: Checkpoint creation for recovery and resume capabilities
</instructions>

</step>

<step number="2" name="role_data_management">

### Step 2: Role Data Management

<structured_data_templates>
  <pattern_analyzer_data>
    ## Pattern Analyzer Role - Data Template
    
    ### Input Data
    ```json
    {
      "project_entity_name": "{PROJECT_ENTITY_NAME}",
      "task_specifications": "{TASK_SPECS}",
      "cross_project_context": "{MEMENTO_CONTEXT}",
      "implementation_requirements": "{REQUIREMENTS}"
    }
    ```
    
    ### Output Data
    ```json
    {
      "discovered_patterns": [
        {
          "pattern_name": "{PATTERN_NAME}",
          "pattern_source": "{SOURCE_PROJECT}",
          "applicability": "{APPLICATION_GUIDANCE}",
          "evidence": "{PATTERN_EVIDENCE}"
        }
      ],
      "anti_patterns": [
        {
          "anti_pattern_name": "{ANTI_PATTERN_NAME}",
          "warning": "{WARNING_MESSAGE}",
          "prevention": "{PREVENTION_STRATEGY}"
        }
      ],
      "implementation_guidance": "{GUIDANCE_SUMMARY}",
      "cross_project_insights": "{INSIGHTS_SUMMARY}",
      "next_role_handoff": "{IMPLEMENTER_HANDOFF_DATA}"
    }
    ```
  </pattern_analyzer_data>
  
  <implementer_data>
    ## Implementer Role - Data Template
    
    ### Input Data
    ```json
    {
      "pattern_analysis_results": "{ANALYZER_HANDOFF_DATA}",
      "implementation_guidance": "{GUIDANCE_FROM_ANALYZER}",
      "task_requirements": "{TASK_SPECIFICATIONS}",
      "quality_standards": "{QUALITY_CRITERIA}"
    }
    ```
    
    ### Output Data
    ```json
    {
      "implemented_features": [
        {
          "feature_name": "{FEATURE_NAME}",
          "implementation_evidence": "{EVIDENCE}",
          "pattern_applied": "{PATTERN_NAME}",
          "test_status": "{TEST_RESULTS}"
        }
      ],
      "pattern_applications": [
        {
          "pattern_used": "{PATTERN_NAME}",
          "implementation_location": "{FILE_PATH}",
          "adherence_level": "{ADHERENCE_RATING}"
        }
      ],
      "quality_validation": "{QUALITY_CHECK_RESULTS}",
      "implementation_decisions": "{DECISION_LOG}",
      "next_role_handoff": "{VERIFIER_HANDOFF_DATA}"
    }
    ```
  </implementer_data>
  
  <verifier_data>
    ## Verifier Role - Data Template
    
    ### Input Data
    ```json
    {
      "implementation_results": "{IMPLEMENTER_HANDOFF_DATA}",
      "acceptance_criteria": "{CRITERIA_LIST}",
      "quality_standards": "{QUALITY_REQUIREMENTS}",
      "test_specifications": "{TEST_SPECS}"
    }
    ```
    
    ### Output Data
    ```json
    {
      "verification_results": {
        "overall_score": "{QUALITY_SCORE}",
        "acceptance_status": "{PASS_FAIL_STATUS}",
        "test_coverage": "{COVERAGE_PERCENTAGE}",
        "pattern_compliance": "{COMPLIANCE_SCORE}"
      },
      "test_results": {
        "unit_tests": "{UNIT_TEST_RESULTS}",
        "integration_tests": "{INTEGRATION_RESULTS}",
        "acceptance_tests": "{ACCEPTANCE_RESULTS}"
      },
      "identified_issues": [
        {
          "issue_description": "{ISSUE_DESCRIPTION}",
          "severity": "{SEVERITY_LEVEL}",
          "resolution_status": "{STATUS}",
          "recommendation": "{RESOLUTION_GUIDANCE}"
        }
      ],
      "quality_assessment": "{ASSESSMENT_SUMMARY}",
      "next_role_handoff": "{DOCUMENTER_HANDOFF_DATA}"
    }
    ```
  </verifier_data>
  
  <documenter_data>
    ## Documenter Role - Data Template
    
    ### Input Data
    ```json
    {
      "verification_results": "{VERIFIER_HANDOFF_DATA}",
      "implementation_summary": "{IMPLEMENTATION_OVERVIEW}",
      "pattern_applications": "{PATTERN_USAGE}",
      "learning_outcomes": "{IDENTIFIED_LEARNINGS}"
    }
    ```
    
    ### Output Data
    ```json
    {
      "implementation_documentation": "{DOCUMENTATION_SUMMARY}",
      "learning_outcomes": [
        {
          "learning_item": "{LEARNING_DESCRIPTION}",
          "application": "{FUTURE_APPLICATION}",
          "pattern_validation": "{PATTERN_EFFECTIVENESS}"
        }
      ],
      "cross_project_patterns": [
        {
          "pattern_name": "{PATTERN_NAME}",
          "validation_status": "{VALIDATED_EFFECTIVE}",
          "reuse_guidance": "{REUSE_INSTRUCTIONS}"
        }
      ],
      "knowledge_transfer": "{KNOWLEDGE_SUMMARY}",
      "workflow_completion_status": "complete"
    }
    ```
  </documenter_data>
</structured_data_templates>

<instructions>
  ACTION: Use structured data templates for consistent role data management
  STORE: Role-specific input/output data with defined JSON schemas
  VALIDATE: Data completeness before role transitions
  PRESERVE: Data format consistency across all role transitions
</instructions>

</step>

<step number="3" name="checkpoint_recovery">

### Step 3: Checkpoint Recovery and Resume

<recovery_procedures>
  <checkpoint_discovery>
    <!-- Discover available checkpoints for project -->
    CALL: mcp-memory-keeper-context_search
    PARAMETERS:
      - query: "{PROJECT_ENTITY_NAME} role checkpoint"
      - categories: ["progress"]
    
    <!-- Query Redis MCP for workflow state -->
    IF redis_mcp_available:
      QUERY: workflow state for project entity
      RETRIEVE: latest role context and handoff data
    
    <!-- Identify most recent checkpoint -->
    IDENTIFY: latest checkpoint by timestamp
    VALIDATE: checkpoint data completeness
    DETERMINE: optimal resume point
  </checkpoint_discovery>
  
  <context_restoration>
    <!-- Restore Memory-Keeper context -->
    CALL: mcp-memory-keeper-context_get
    PARAMETERS:
      - key: "role-{last_role}-completion-data"
    
    <!-- Restore Redis MCP workflow state -->
    IF redis_mcp_available:
      RESTORE: workflow state from Redis
      VALIDATE: state consistency
      RESUME: from stored context
    
    <!-- Restore Memento pattern context -->
    CALL: memento-mcp-search_nodes
    PARAMETERS:
      - query: "{PROJECT_ENTITY_NAME} implementation patterns"
    
    <!-- Reconstruct role execution context -->
    MERGE: all context sources into unified state
    VALIDATE: context completeness for resume
    PREPARE: next role execution environment
  </context_restoration>
  
  <resume_validation>
    <!-- Validate resume readiness -->
    VALIDATE: checkpoint data integrity
    VERIFY: handoff data completeness
    CHECK: prerequisite role completion
    CONFIRM: next role requirements satisfied
    
    <!-- Prepare resume execution -->
    SET: role execution context
    INITIALIZE: role-specific parameters
    RESTORE: user interaction context if needed
    LOG: resume operation initiation
  </resume_validation>
</recovery_procedures>

<resume_command_support>
  <resume_last_checkpoint>
    <!-- Resume from last successful checkpoint -->
    DISCOVER: latest completed role checkpoint
    RESTORE: checkpoint context and handoff data
    DETERMINE: next role in sequence
    INITIALIZE: next role execution with restored context
  </resume_last_checkpoint>
  
  <resume_specific_role>
    <!-- Resume from specific role checkpoint -->
    VALIDATE: specified role has valid checkpoint
    RESTORE: role-specific checkpoint data
    VERIFY: handoff data availability
    INITIALIZE: role execution from checkpoint state
  </resume_specific_role>
  
  <resume_from_error>
    <!-- Resume from error state with recovery -->
    IDENTIFY: error checkpoint and context
    ANALYZE: error cause and resolution options
    APPLY: error resolution from memory patterns
    RESTORE: pre-error checkpoint state
    RESUME: execution with error context awareness
  </resume_from_error>
</resume_command_support>

<instructions>
  ACTION: Implement comprehensive checkpoint recovery and resume capabilities
  DISCOVER: Available checkpoints across all storage systems
  RESTORE: Complete role execution context for seamless continuation
  VALIDATE: Resume readiness before continuing execution
  SUPPORT: All resume command variations with proper validation
</instructions>

</step>

</execution_checkpoint_framework>

## Integration with Memory-Keeper

<memory_keeper_integration>
  <checkpoint_categories>
    - "progress": Role start, progress, and completion checkpoints
    - "decision": Key implementation decisions and rationale
    - "error": Error states and recovery context
    - "interaction": User interaction checkpoints and context
  </memory_keeper_categories>
  
  <session_management>
    <!-- Maintain session continuity across role transitions -->
    SESSION_CONTEXT: Preserve Memory-Keeper session across all roles
    CHECKPOINT_LINKING: Link all role checkpoints to same session
    CONTEXT_COMPRESSION: Compress old checkpoints while preserving key data
    SESSION_RECOVERY: Enable session restoration from any checkpoint
  </session_management>
  
  <data_persistence>
    <!-- Ensure checkpoint data persistence -->
    HIGH_PRIORITY: Mark all role checkpoints as high priority
    STRUCTURED_STORAGE: Use consistent key naming for checkpoint discovery
    METADATA_ENRICHMENT: Include rich metadata for checkpoint identification
    CROSS_REFERENCE: Link checkpoints to related Memento patterns
  </data_persistence>
</memory_keeper_integration>

## Redis MCP Integration Support

<redis_mcp_integration>
  <workflow_state_management>
    <!-- Primary workflow state in Redis when available -->
    IF redis_mcp_available:
      PRIMARY_STORAGE: Use Redis for workflow state persistence
      FALLBACK_SUPPORT: Memory-Keeper as backup when Redis unavailable
      STATE_SYNCHRONIZATION: Keep Redis and Memory-Keeper in sync
      TTL_MANAGEMENT: Appropriate TTL for different data types
  </workflow_state_management>
  
  <handoff_data_storage>
    <!-- Structured handoff data in Redis -->
    HANDOFF_TEMPLATES: Store JSON handoff data with validation
    ROLE_TRANSITIONS: Atomic transitions using Redis transactions
    DATA_INTEGRITY: Ensure handoff data completeness
    EXPIRATION_MANAGEMENT: Appropriate TTL for handoff data
  </handoff_data_storage>
  
  <graceful_degradation>
    <!-- Fallback when Redis unavailable -->
    SERVICE_DETECTION: Check Redis availability before operations
    FALLBACK_MODE: Use Memory-Keeper when Redis unavailable
    FEATURE_NOTIFICATION: Inform user of degraded functionality
    RECOVERY_PROCEDURES: Resume Redis integration when available
  </graceful_degradation>
</redis_mcp_integration>

---

*This execution checkpoint framework provides comprehensive checkpoint and recovery capabilities for the Agent OS execute-tasks orchestrated workflow, with support for both Memory-Keeper and Redis MCP integration patterns.*