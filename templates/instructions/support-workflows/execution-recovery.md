---
description: Execution Recovery Procedures for Agent OS Execute-Tasks Workflow Integration
globs:
alwaysApply: false
version: 1.0
encoding: UTF-8
---

# Execution Recovery Procedures

<ai_meta>
  <parsing_rules>
    - Implement role-specific recovery procedures for execute-tasks workflow
    - Enable seamless recovery from any checkpoint or error state
    - Integrate with Memory-Keeper checkpoint restoration system
    - Support Redis MCP state recovery when available
    - Maintain workflow integrity during recovery operations
  </parsing_rules>
  <recovery_integration>
    - memory_keeper: checkpoint discovery and context restoration
    - redis_mcp: workflow state recovery and handoff data restoration
    - memento: pattern and decision context recovery
    - execution_checkpoints: integration with checkpoint infrastructure
    - role_handoff_templates: handoff data integrity during recovery
  </recovery_integration>
</ai_meta>

## Overview

<purpose>
  - Provide comprehensive recovery procedures for all execution workflow interruptions
  - Enable seamless resume from any role checkpoint or error state
  - Maintain data integrity and workflow consistency during recovery
  - Support both Memory-Keeper and Redis MCP recovery scenarios
  - Address execute-tasks reliability issues through robust recovery mechanisms
</purpose>

<context>
  - Used in orchestrated execute-tasks workflow with role specialization
  - Supports recovery for all 4 roles: Pattern Analyzer, Implementer, Verifier, Documenter
  - Integrates with execution checkpoint system and role handoff templates
  - Provides recovery procedures for workflow interruptions, errors, and user interactions
</context>

<prerequisites>
  - Execution checkpoint system implemented and functional
  - Role handoff templates available for data validation
  - Memory-Keeper MCP integration active with checkpoint history
  - Project canonical identity established (PROJECT_ENTITY_NAME)
</prerequisites>

## Recovery System Architecture

<step number="1" name="recovery_detection_and_analysis">

### Step 1: Recovery Detection and Analysis

<recovery_detection>
  <interruption_detection>
    <!-- Detect workflow interruption scenarios -->
    DETECT_WORKFLOW_INTERRUPTION:
      PARAMETERS: project_entity_name (string)
      RETURNS: interruption_type (string), recovery_context (object)
      
      SCENARIOS:
        1. ROLE_INTERRUPTION: Role execution stopped mid-process
        2. ROLE_FAILURE: Role completed with errors or failure status
        3. USER_INTERACTION_ABANDONMENT: User questions left workflow hanging
        4. SYSTEM_RESTART: Process terminated and restarted
        5. TIMEOUT_EXPIRATION: Workflow exceeded time limits
        6. MEMORY_SYSTEM_FAILURE: Storage system interruption
      
      DETECTION_PROCESS:
        1. QUERY_CHECKPOINTS: Search for incomplete role checkpoints
        2. ANALYZE_TIMESTAMPS: Check for stale or interrupted workflows
        3. VALIDATE_HANDOFFS: Verify handoff data integrity
        4. CHECK_ERROR_STATE: Look for error markers in storage systems
        5. ASSESS_CONTEXT: Determine recovery scope and requirements
  </interruption_detection>
  
  <context_analysis>
    <!-- Analyze recovery context and requirements -->
    ANALYZE_RECOVERY_CONTEXT:
      PARAMETERS: interruption_type (string), project_entity_name (string)
      RETURNS: recovery_requirements (object)
      
      ANALYSIS_DIMENSIONS:
        - Last successful checkpoint location
        - Role completion status and progress percentage
        - Available handoff data integrity
        - User interaction state and context
        - Error conditions and resolution requirements
        - Data consistency across storage systems
      
      CONTEXT_GATHERING:
        1. MEMORY_KEEPER_ANALYSIS: Query checkpoint history and session state
        2. REDIS_MCP_ANALYSIS: Check workflow state and handoff data (if available)
        3. MEMENTO_ANALYSIS: Verify pattern and decision context availability
        4. HANDOFF_VALIDATION: Validate existing handoff data completeness
        5. ERROR_INVESTIGATION: Analyze error patterns and resolution options
  </context_analysis>
</recovery_detection>

<recovery_strategy_selection>
  <strategy_matrix>
    <!-- Recovery strategy selection based on context -->
    RECOVERY_STRATEGY_MATRIX:
      
      ROLE_INTERRUPTION:
        - CHECKPOINT_AVAILABLE: Resume from last checkpoint with context restoration
        - HANDOFF_AVAILABLE: Resume from last successful handoff
        - PARTIAL_PROGRESS: Resume with progress validation and continuation
        - NO_CHECKPOINT: Restart role with available context
      
      ROLE_FAILURE:
        - ERROR_IDENTIFIED: Apply error-specific recovery procedures
        - PATTERN_MISMATCH: Re-analyze patterns and restart with corrections
        - DATA_CORRUPTION: Restore from backup and validate data integrity
        - DEPENDENCY_FAILURE: Resolve dependencies and resume execution
      
      USER_INTERACTION_ABANDONMENT:
        - INTERACTION_CHECKPOINT: Restore pre-interaction state
        - USER_CONTEXT_AVAILABLE: Resume with user context integration
        - QUESTION_RESOLVED: Continue with user-provided information
        - CONTEXT_LOST: Restart interaction with context reconstruction
      
      SYSTEM_RESTART:
        - PERSISTENT_STATE: Restore from persistent storage systems
        - CHECKPOINT_RECOVERY: Resume from last valid checkpoint
        - HANDOFF_RECOVERY: Restore role transitions and continue
        - CLEAN_RESTART: Initialize with historical context integration
  </strategy_matrix>
  
  <strategy_selection>
    <!-- Select optimal recovery strategy -->
    SELECT_RECOVERY_STRATEGY:
      PARAMETERS: interruption_type (string), recovery_context (object)
      RETURNS: recovery_strategy (string), recovery_plan (object)
      
      SELECTION_LOGIC:
        1. ASSESS_DATA_AVAILABILITY: Check checkpoint and handoff data completeness
        2. EVALUATE_INTEGRITY: Validate data consistency across systems
        3. DETERMINE_ROLLBACK_SCOPE: Identify safe recovery point
        4. CALCULATE_RECOVERY_COST: Estimate effort vs restart trade-offs
        5. SELECT_OPTIMAL_PATH: Choose strategy maximizing continuity and integrity
  </strategy_selection>
</recovery_strategy_selection>

<instructions>
  ACTION: Implement comprehensive recovery detection and strategy selection
  ANALYZE: Workflow interruption scenarios and recovery requirements
  SELECT: Optimal recovery strategy based on available context and data integrity
  PREPARE: Recovery plan with clear execution steps and validation checkpoints
</instructions>

</step>

<step number="2" name="role_specific_recovery">

### Step 2: Role-Specific Recovery Procedures

<pattern_analyzer_recovery>
  <recovery_procedures>
    ## Pattern Analyzer Role Recovery
    
    ### Recovery Scenarios
    
    <interruption_recovery>
      <!-- Pattern analysis interrupted mid-process -->
      PATTERN_ANALYZER_INTERRUPTION_RECOVERY:
        
        DETECTION:
          - Role status: "in_progress" with no completion checkpoint
          - Incomplete pattern analysis data in memory systems
          - Cross-project analysis partially completed
        
        RECOVERY_PROCEDURE:
          1. RESTORE_ANALYSIS_CONTEXT: Retrieve partial analysis results
          2. VALIDATE_EXISTING_PATTERNS: Check discovered patterns for completeness
          3. RESUME_CROSS_PROJECT_SEARCH: Continue cross-project pattern discovery
          4. COMPLETE_ANALYSIS: Finish remaining analysis tasks
          5. GENERATE_HANDOFF: Create complete handoff data for Implementer
        
        CONTEXT_RESTORATION:
          CALL: mcp-memory-keeper-context_search
          PARAMETERS:
            - query: "{PROJECT_ENTITY_NAME} pattern analysis progress"
            - categories: ["progress", "analysis"]
          
          CALL: memento-mcp-search_nodes
          PARAMETERS:
            - query: "{PROJECT_ENTITY_NAME} discovered patterns"
          
          RESTORE: partial analysis state and continue from interruption point
    </interruption_recovery>
    
    <failure_recovery>
      <!-- Pattern analysis failed or produced insufficient results -->
      PATTERN_ANALYZER_FAILURE_RECOVERY:
        
        DETECTION:
          - Role status: "failed" or "partially_completed"
          - Insufficient patterns discovered (below threshold)
          - Cross-project search yielded limited results
        
        RECOVERY_PROCEDURE:
          1. ANALYZE_FAILURE_CAUSE: Identify specific analysis failures
          2. EXPAND_SEARCH_SCOPE: Broaden cross-project pattern search
          3. ADJUST_ANALYSIS_CRITERIA: Lower confidence thresholds if appropriate
          4. APPLY_FALLBACK_PATTERNS: Use generic patterns as fallback
          5. GENERATE_ENHANCED_GUIDANCE: Create implementation guidance with caveats
        
        FAILURE_ANALYSIS:
          CALL: mcp-memory-keeper-context_search
          PARAMETERS:
            - query: "{PROJECT_ENTITY_NAME} pattern analysis error"
            - categories: ["error"]
          
          IDENTIFY: specific analysis failures and root causes
          APPLY: targeted recovery strategies based on failure type
    </failure_recovery>
    
    <context_recovery>
      <!-- User interaction interrupted pattern analysis -->
      PATTERN_ANALYZER_CONTEXT_RECOVERY:
        
        DETECTION:
          - User interaction checkpoint exists
          - Analysis paused for user clarification
          - Pattern analysis context preserved
        
        RECOVERY_PROCEDURE:
          1. RESTORE_INTERACTION_CONTEXT: Load user question and analysis state
          2. INTEGRATE_USER_RESPONSE: Apply user-provided information
          3. RESUME_ANALYSIS: Continue pattern discovery with user context
          4. VALIDATE_USER_INTEGRATION: Ensure user input properly integrated
          5. COMPLETE_ENHANCED_ANALYSIS: Finish analysis with user insights
  </recovery_procedures>
</pattern_analyzer_recovery>

<implementer_recovery>
  <recovery_procedures>
    ## Implementer Role Recovery
    
    ### Recovery Scenarios
    
    <interruption_recovery>
      <!-- Implementation interrupted mid-process -->
      IMPLEMENTER_INTERRUPTION_RECOVERY:
        
        DETECTION:
          - Role status: "in_progress" with incomplete implementation
          - Partial code changes and file modifications
          - Implementation evidence partially documented
        
        RECOVERY_PROCEDURE:
          1. RESTORE_IMPLEMENTATION_STATE: Load implementation progress and context
          2. VALIDATE_PARTIAL_IMPLEMENTATION: Check existing code changes integrity
          3. RESUME_IMPLEMENTATION: Continue from last completed task
          4. APPLY_INCREMENTAL_TESTING: Validate implementation progress
          5. COMPLETE_IMPLEMENTATION_EVIDENCE: Document remaining implementation work
        
        STATE_RESTORATION:
          CALL: mcp-memory-keeper-context_search
          PARAMETERS:
            - query: "{PROJECT_ENTITY_NAME} implementation progress"
            - categories: ["progress", "task"]
          
          CALL: mcp-memory-keeper-context_file_changed
          PARAMETERS:
            - filePath: "{IMPLEMENTATION_FILES}"
          
          RESTORE: implementation state and validate file system consistency
    </interruption_recovery>
    
    <failure_recovery>
      <!-- Implementation failed with errors or blockers -->
      IMPLEMENTER_FAILURE_RECOVERY:
        
        DETECTION:
          - Role status: "failed" with implementation errors
          - Blocking issues preventing task completion
          - Pattern application failures or conflicts
        
        RECOVERY_PROCEDURE:
          1. ANALYZE_IMPLEMENTATION_ERRORS: Identify specific implementation failures
          2. APPLY_ERROR_RESOLUTION_PATTERNS: Use memory-guided error resolution
          3. ROLLBACK_PROBLEMATIC_CHANGES: Revert failed implementation attempts
          4. APPLY_ALTERNATIVE_PATTERNS: Try different implementation approaches
          5. ESCALATE_UNRESOLVED_BLOCKERS: Document remaining issues for user resolution
        
        ERROR_RECOVERY:
          CALL: Enhanced error resolution via memory (from error-resolution-via-memory.md)
          APPLY: Cross-project error patterns and solutions
          IMPLEMENT: Alternative implementation strategies
          DOCUMENT: Resolution attempts and outcomes
    </failure_recovery>
    
    <pattern_recovery>
      <!-- Pattern application failed or produced poor results -->
      IMPLEMENTER_PATTERN_RECOVERY:
        
        DETECTION:
          - Pattern compliance below acceptable threshold
          - Implementation deviates significantly from discovered patterns
          - Pattern application resulted in poor code quality
        
        RECOVERY_PROCEDURE:
          1. RE_ANALYZE_PATTERN_APPLICABILITY: Validate pattern suitability
          2. ADAPT_PATTERNS_TO_CONTEXT: Modify patterns for current implementation
          3. APPLY_HYBRID_APPROACH: Combine multiple patterns strategically
          4. DOCUMENT_PATTERN_ADAPTATIONS: Record pattern modifications and rationale
          5. VALIDATE_ADAPTED_IMPLEMENTATION: Ensure quality meets standards
  </recovery_procedures>
</implementer_recovery>

<verifier_recovery>
  <recovery_procedures>
    ## Verifier Role Recovery
    
    ### Recovery Scenarios
    
    <interruption_recovery>
      <!-- Verification interrupted mid-process -->
      VERIFIER_INTERRUPTION_RECOVERY:
        
        DETECTION:
          - Role status: "in_progress" with incomplete verification
          - Partial test results and quality assessment
          - Verification scope partially completed
        
        RECOVERY_PROCEDURE:
          1. RESTORE_VERIFICATION_STATE: Load verification progress and results
          2. VALIDATE_PARTIAL_RESULTS: Check existing test results validity
          3. RESUME_VERIFICATION: Continue from last completed verification task
          4. COMPLETE_QUALITY_ASSESSMENT: Finish remaining quality evaluations
          5. GENERATE_COMPREHENSIVE_RESULTS: Compile complete verification report
    </interruption_recovery>
    
    <failure_recovery>
      <!-- Verification failed with critical issues -->
      VERIFIER_FAILURE_RECOVERY:
        
        DETECTION:
          - Role status: "failed" with critical verification failures
          - Acceptance criteria not met
          - Quality standards below acceptable threshold
        
        RECOVERY_PROCEDURE:
          1. CATEGORIZE_VERIFICATION_FAILURES: Identify failure types and severity
          2. DETERMINE_RECOVERY_FEASIBILITY: Assess if issues can be resolved
          3. PROVIDE_DETAILED_FEEDBACK: Create actionable improvement guidance
          4. RECOMMEND_ROLLBACK_SCOPE: Suggest implementation corrections needed
          5. ESTABLISH_RE_VERIFICATION_CRITERIA: Define requirements for retry
        
        FAILURE_CATEGORIZATION:
          - CRITICAL: Security vulnerabilities, data corruption, system failures
          - HIGH: Major functionality broken, performance unacceptable
          - MEDIUM: Quality standards not met, incomplete features
          - LOW: Minor issues, documentation gaps, style violations
    </failure_recovery>
    
    <quality_recovery>
      <!-- Quality assessment produced mixed or unclear results -->
      VERIFIER_QUALITY_RECOVERY:
        
        DETECTION:
          - Quality scores inconsistent or borderline
          - Mixed test results with unclear overall status
          - Acceptance criteria partially met with edge cases
        
        RECOVERY_PROCEDURE:
          1. RE_EVALUATE_QUALITY_CRITERIA: Validate assessment criteria appropriateness
          2. CONDUCT_TARGETED_RE_TESTING: Focus on problematic areas
          3. APPLY_CONTEXTUAL_JUDGMENT: Consider implementation trade-offs
          4. DOCUMENT_QUALITY_DECISIONS: Record assessment rationale and exceptions
          5. PROVIDE_CONDITIONAL_APPROVAL: Approve with documented limitations
  </recovery_procedures>
</verifier_recovery>

<documenter_recovery>
  <recovery_procedures>
    ## Documenter Role Recovery
    
    ### Recovery Scenarios
    
    <interruption_recovery>
      <!-- Documentation interrupted mid-process -->
      DOCUMENTER_INTERRUPTION_RECOVERY:
        
        DETECTION:
          - Role status: "in_progress" with incomplete documentation
          - Partial knowledge capture and learning outcomes
          - Cross-project pattern documentation incomplete
        
        RECOVERY_PROCEDURE:
          1. RESTORE_DOCUMENTATION_STATE: Load documentation progress and context
          2. VALIDATE_EXISTING_DOCUMENTATION: Check completed documentation quality
          3. RESUME_KNOWLEDGE_CAPTURE: Continue learning outcomes extraction
          4. COMPLETE_PATTERN_DOCUMENTATION: Finish cross-project pattern capture
          5. FINALIZE_KNOWLEDGE_TRANSFER: Complete comprehensive documentation
    </interruption_recovery>
    
    <context_recovery>
      <!-- Documentation context incomplete or unclear -->
      DOCUMENTER_CONTEXT_RECOVERY:
        
        DETECTION:
          - Insufficient context from previous roles
          - Missing verification results or implementation details
          - Learning outcomes unclear or incomplete
        
        RECOVERY_PROCEDURE:
          1. RECONSTRUCT_MISSING_CONTEXT: Gather context from available sources
          2. SYNTHESIZE_AVAILABLE_INFORMATION: Create coherent documentation from fragments
          3. HIGHLIGHT_INFORMATION_GAPS: Document missing information clearly
          4. FOCUS_ON_AVAILABLE_INSIGHTS: Maximize value from available data
          5. RECOMMEND_FUTURE_IMPROVEMENTS: Suggest process improvements
  </recovery_procedures>
</documenter_recovery>

<instructions>
  ACTION: Implement role-specific recovery procedures for all execution roles
  RESTORE: Role state and context using available checkpoint and handoff data
  VALIDATE: Data integrity and consistency during recovery operations
  RESUME: Role execution from appropriate recovery point with full context
  DOCUMENT: Recovery actions and outcomes for future optimization
</instructions>

</step>

<step number="3" name="checkpoint_restoration">

### Step 3: Checkpoint and Context Restoration

<checkpoint_discovery>
  <discovery_procedures>
    <!-- Discover available checkpoints for recovery -->
    DISCOVER_RECOVERY_CHECKPOINTS:
      PARAMETERS: project_entity_name (string), recovery_scope (string)
      RETURNS: checkpoint_options (array), recommended_checkpoint (object)
      
      DISCOVERY_PROCESS:
        1. MEMORY_KEEPER_CHECKPOINT_SEARCH:
           CALL: mcp-memory-keeper-context_search
           PARAMETERS:
             - query: "{project_entity_name} checkpoint"
             - categories: ["progress"]
           
        2. REDIS_MCP_STATE_QUERY:
           IF redis_mcp_available:
             QUERY: workflow state for project_entity_name
             RETRIEVE: role context and handoff data
           
        3. CHECKPOINT_VALIDATION:
           FOR_EACH: checkpoint in discovered_checkpoints
             VALIDATE: checkpoint data integrity
             ASSESS: recovery feasibility
             CALCULATE: recovery effort and risk
           
        4. RECOMMENDATION_ENGINE:
           RANK: checkpoints by recovery success probability
           CONSIDER: data completeness, temporal proximity, context quality
           SELECT: optimal checkpoint for recovery recommendation
  </discovery_procedures>
  
  <checkpoint_validation>
    <!-- Validate checkpoint integrity and completeness -->
    VALIDATE_CHECKPOINT_INTEGRITY:
      PARAMETERS: checkpoint_data (object)
      RETURNS: is_valid (boolean), integrity_report (object)
      
      VALIDATION_CHECKS:
        - Checkpoint metadata completeness
        - Role execution context availability
        - Handoff data consistency (if transitioning between roles)
        - Timestamp logical ordering
        - File system state alignment
        - User interaction context preservation
        - Error state documentation
      
      INTEGRITY_ASSESSMENT:
        1. METADATA_VALIDATION: Check checkpoint metadata completeness
        2. CONTEXT_VALIDATION: Verify role execution context availability
        3. DATA_CONSISTENCY: Validate cross-system data consistency
        4. TEMPORAL_VALIDATION: Check timestamp ordering and logic
        5. DEPENDENCY_VALIDATION: Ensure required dependencies available
  </checkpoint_validation>
</checkpoint_discovery>

<context_restoration>
  <restoration_procedures>
    <!-- Restore execution context from checkpoint -->
    RESTORE_EXECUTION_CONTEXT:
      PARAMETERS: checkpoint_data (object), recovery_strategy (string)
      RETURNS: restored_context (object), restoration_status (boolean)
      
      RESTORATION_PROCESS:
        1. MEMORY_KEEPER_CONTEXT_RESTORATION:
           CALL: mcp-memory-keeper-context_get
           PARAMETERS:
             - key: checkpoint_data.context_key
           
           RESTORE: role execution state and progress data
           VALIDATE: context completeness and consistency
           
        2. REDIS_MCP_STATE_RESTORATION:
           IF redis_mcp_available AND checkpoint_data.redis_state_available:
             RESTORE: workflow state from Redis
             VALIDATE: state consistency with checkpoint
             SYNCHRONIZE: Memory-Keeper and Redis state
           
        3. MEMENTO_PATTERN_RESTORATION:
           CALL: memento-mcp-search_nodes
           PARAMETERS:
             - query: "{project_entity_name} implementation patterns"
           
           RESTORE: discovered patterns and cross-project insights
           VALIDATE: pattern data availability and consistency
           
        4. HANDOFF_DATA_RESTORATION:
           IF transitioning_between_roles:
             VALIDATE: handoff data completeness using role-handoff-templates
             RESTORE: role transition data and validation results
             PREPARE: next role execution environment
           
        5. USER_INTERACTION_RESTORATION:
           IF user_interaction_context_exists:
             RESTORE: user questions, responses, and interaction state
             PREPARE: enhanced context for continued interaction
             VALIDATE: user context integration readiness
  </restoration_procedures>
  
  <context_merging>
    <!-- Merge context from multiple sources -->
    MERGE_RECOVERY_CONTEXT:
      PARAMETERS: checkpoint_context (object), current_state (object)
      RETURNS: merged_context (object), conflicts (array)
      
      MERGING_STRATEGY:
        - CHECKPOINT_PRIORITY: Use checkpoint data as primary source
        - CURRENT_STATE_ENHANCEMENT: Enhance with current valid state
        - CONFLICT_RESOLUTION: Handle data conflicts with user guidance
        - CONTEXT_VALIDATION: Validate merged context completeness
        - INTEGRITY_VERIFICATION: Ensure merged context integrity
      
      CONFLICT_RESOLUTION:
        1. TIMESTAMP_CONFLICTS: Use most recent valid data
        2. STATE_CONFLICTS: Prefer checkpoint state over current state
        3. USER_CONTEXT_CONFLICTS: Preserve user-provided information
        4. DATA_CORRUPTION: Use backup data or request user clarification
        5. UNRESOLVABLE_CONFLICTS: Document conflicts and request user intervention
  </context_merging>
</context_restoration>

<validation_procedures>
  <restoration_validation>
    <!-- Validate restoration success -->
    VALIDATE_CONTEXT_RESTORATION:
      PARAMETERS: restored_context (object), recovery_requirements (object)
      RETURNS: validation_result (boolean), validation_report (object)
      
      VALIDATION_DIMENSIONS:
        - Context completeness against recovery requirements
        - Data consistency across all storage systems
        - Role execution readiness and dependency availability
        - User interaction context preservation
        - Error state resolution and clean-up
        - Cross-project pattern availability
      
      VALIDATION_PROCESS:
        1. COMPLETENESS_CHECK: Verify all required context elements restored
        2. CONSISTENCY_CHECK: Validate data consistency across systems
        3. READINESS_CHECK: Confirm role execution environment ready
        4. INTEGRITY_CHECK: Ensure no data corruption during restoration
        5. DEPENDENCY_CHECK: Validate all role dependencies available
  </restoration_validation>
</validation_procedures>

<instructions>
  ACTION: Implement comprehensive checkpoint discovery and context restoration
  DISCOVER: Available recovery checkpoints with integrity validation
  RESTORE: Complete execution context from optimal checkpoint
  MERGE: Context from multiple sources with conflict resolution
  VALIDATE: Restoration success and execution readiness
  PREPARE: Clean execution environment for workflow resumption
</instructions>

</step>

<step number="4" name="resume_coordination">

### Step 4: Resume Workflow Coordination

<resume_orchestration>
  <resume_workflow>
    <!-- Orchestrate workflow resume from recovery point -->
    ORCHESTRATE_WORKFLOW_RESUME:
      PARAMETERS: restored_context (object), resume_target (string)
      RETURNS: resume_success (boolean), workflow_state (object)
      
      RESUME_COORDINATION:
        1. ROLE_STATE_PREPARATION:
           DETERMINE: target role for resume operation
           PREPARE: role-specific execution environment
           LOAD: role instruction templates and parameters
           
        2. CONTEXT_INTEGRATION:
           INTEGRATE: restored context with current execution environment
           VALIDATE: context compatibility with target role
           RESOLVE: any integration conflicts or issues
           
        3. WORKFLOW_STATE_SYNCHRONIZATION:
           SYNCHRONIZE: Memory-Keeper session state
           UPDATE: Redis MCP workflow state (if available)
           REFRESH: Memento pattern context
           
        4. HANDOFF_DATA_PREPARATION:
           IF resuming_mid_transition:
             VALIDATE: handoff data completeness
             PREPARE: role transition with validated data
           ELSE:
             PREPARE: role continuation with current context
           
        5. RESUME_EXECUTION:
           INITIALIZE: target role with restored context
           BEGIN: workflow execution from resume point
           MONITOR: execution for recovery success
  </resume_workflow>
  
  <role_transition_resume>
    <!-- Handle resume during role transitions -->
    RESUME_ROLE_TRANSITION:
      PARAMETERS: transition_context (object), target_role (string)
      RETURNS: transition_success (boolean), handoff_validation (object)
      
      TRANSITION_RESUME_PROCESS:
        1. HANDOFF_DATA_VALIDATION:
           VALIDATE: existing handoff data against schema
           CHECK: data completeness and consistency
           RESOLVE: any handoff data issues
           
        2. ROLE_READINESS_CHECK:
           VERIFY: target role prerequisites met
           VALIDATE: role execution environment prepared
           CHECK: required dependencies available
           
        3. CONTEXT_HANDOFF:
           TRANSFER: validated handoff data to target role
           INTEGRATE: role-specific context and parameters
           PREPARE: role execution with full context
           
        4. TRANSITION_COMPLETION:
           UPDATE: role transition checkpoints
           LOG: successful role transition resume
           MONITOR: target role execution initiation
  </role_transition_resume>
</resume_orchestration>

<error_recovery_coordination>
  <error_state_resolution>
    <!-- Coordinate recovery from error states -->
    COORDINATE_ERROR_RECOVERY:
      PARAMETERS: error_context (object), recovery_strategy (string)
      RETURNS: recovery_success (boolean), resolved_state (object)
      
      ERROR_RECOVERY_COORDINATION:
        1. ERROR_ANALYSIS_AND_CLASSIFICATION:
           ANALYZE: error context and root causes
           CLASSIFY: error severity and recovery complexity
           DETERMINE: optimal recovery approach
           
        2. RECOVERY_STRATEGY_EXECUTION:
           APPLY: selected recovery strategy
           MONITOR: recovery progress and success
           HANDLE: recovery complications or failures
           
        3. STATE_CLEANUP_AND_RESTORATION:
           CLEANUP: error state artifacts and corrupted data
           RESTORE: clean execution environment
           VALIDATE: error resolution completeness
           
        4. PREVENTION_MEASURES:
           DOCUMENT: error patterns for future prevention
           UPDATE: error resolution procedures
           ENHANCE: error detection and prevention systems
  </error_state_resolution>
  
  <recovery_validation>
    <!-- Validate complete recovery success -->
    VALIDATE_RECOVERY_COMPLETION:
      PARAMETERS: recovery_result (object), original_context (object)
      RETURNS: recovery_validated (boolean), validation_report (object)
      
      RECOVERY_VALIDATION_PROCESS:
        1. FUNCTIONALITY_VALIDATION:
           TEST: workflow execution functionality
           VERIFY: role transitions work correctly
           CHECK: checkpoint creation and storage
           
        2. DATA_INTEGRITY_VALIDATION:
           VALIDATE: data consistency across storage systems
           CHECK: handoff data integrity and completeness
           VERIFY: cross-project pattern preservation
           
        3. PERFORMANCE_VALIDATION:
           ASSESS: recovery performance and efficiency
           MEASURE: resume time and resource usage
           COMPARE: performance against baseline metrics
           
        4. USER_EXPERIENCE_VALIDATION:
           VERIFY: seamless user experience during recovery
           CHECK: context preservation quality
           VALIDATE: interaction continuity and coherence
  </recovery_validation>
</error_recovery_coordination>

<instructions>
  ACTION: Implement comprehensive resume workflow coordination
  ORCHESTRATE: Workflow resumption from optimal recovery point
  COORDINATE: Role transitions and error state resolution
  VALIDATE: Complete recovery success and functionality
  MONITOR: Resume execution for stability and performance
  DOCUMENT: Recovery actions and outcomes for optimization
</instructions>

</step>

## Integration with Existing Systems

<step number="5" name="system_integration">

### Step 5: Recovery System Integration

<checkpoint_system_integration>
  <integration_procedures>
    <!-- Integrate with execution checkpoint system -->
    INTEGRATE_CHECKPOINT_RECOVERY:
      
      CHECKPOINT_DISCOVERY_INTEGRATION:
        - Use execution-checkpoints.md checkpoint structure
        - Leverage checkpoint metadata for recovery planning
        - Integrate with Memory-Keeper checkpoint storage
        - Support Redis MCP checkpoint data when available
      
      RECOVERY_PROCEDURE_INTEGRATION:
        - Apply role-specific recovery logic
        - Use checkpoint validation from execution-checkpoints.md
        - Integrate handoff data validation from role-handoff-templates.md
        - Maintain checkpoint creation during recovery operations
      
      CONTEXT_RESTORATION_INTEGRATION:
        - Use checkpoint context restoration procedures
        - Integrate with role data templates for validation
        - Apply context merging and conflict resolution
        - Ensure checkpoint system continuity after recovery
  </integration_procedures>
</checkpoint_system_integration>

<handoff_system_integration>
  <integration_procedures>
    <!-- Integrate with role handoff templates -->
    INTEGRATE_HANDOFF_RECOVERY:
      
      HANDOFF_VALIDATION_INTEGRATION:
        - Use JSON schema validation from role-handoff-templates.md
        - Apply handoff data integrity checks during recovery
        - Validate recovered handoff data against schemas
        - Ensure handoff data completeness for role transitions
      
      RECOVERY_HANDOFF_COORDINATION:
        - Coordinate recovery with handoff data requirements
        - Validate handoff data before role transitions
        - Apply handoff error recovery procedures
        - Maintain handoff data integrity during recovery operations
  </integration_procedures>
</handoff_system_integration>

<memory_system_integration>
  <integration_procedures>
    <!-- Integrate with Memory-Keeper, Redis MCP, and Memento -->
    INTEGRATE_MEMORY_SYSTEM_RECOVERY:
      
      MEMORY_KEEPER_RECOVERY_INTEGRATION:
        - Use Memory-Keeper context search and retrieval
        - Apply checkpoint discovery and restoration
        - Integrate session management with recovery
        - Maintain Memory-Keeper data consistency
      
      REDIS_MCP_RECOVERY_INTEGRATION:
        - Support Redis MCP workflow state recovery
        - Apply TTL management during recovery
        - Coordinate dual storage recovery strategies
        - Maintain Redis-Memory-Keeper synchronization
      
      MEMENTO_RECOVERY_INTEGRATION:
        - Restore cross-project pattern context
        - Apply pattern-based recovery strategies
        - Maintain pattern knowledge continuity
        - Store recovery patterns for future use
  </integration_procedures>
</memory_system_integration>

<instructions>
  ACTION: Integrate recovery procedures with all existing systems
  COORDINATE: Recovery operations across checkpoint, handoff, and memory systems
  MAINTAIN: Data consistency and system integrity during recovery
  ENSURE: Seamless integration with established workflow patterns
  OPTIMIZE: Recovery performance through integrated system coordination
</instructions>

</step>

---

*This execution recovery procedures system provides comprehensive recovery capabilities for the Agent OS execute-tasks orchestrated workflow, with role-specific recovery procedures, checkpoint restoration, context integration, and seamless workflow resumption capabilities.*