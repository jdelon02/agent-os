---
description: Phase Checkpoint System for Agent OS V2.0 Workflow Integration
globs:
alwaysApply: false
version: 1.0
encoding: UTF-8
---

# Phase Checkpoint System

<ai_meta>
  <parsing_rules>
    - Create checkpoints at every phase transition
    - Store structured phase data in Memory-Keeper
    - Enable granular recovery and resume capabilities
    - Integrate with Memento for pattern storage
    - Maintain backward compatibility with standard workflow
  </parsing_rules>
  <checkpoint_integration>
    - memory_keeper: session checkpoints and progress tracking
    - memento: strategic pattern storage at phase completion
    - meilisearch: documentation caching and retrieval
    - git_integration: optional git commits at checkpoints
  </checkpoint_integration>
</ai_meta>

## Overview

<purpose>
  - Enable granular workflow recovery at any phase
  - Provide structured progress tracking for complex projects
  - Integrate phase-based checkpoints with Memory-Keeper
  - Support both standard and phase-based workflow modes
</purpose>

<context>
  - Used in enhanced plan-product workflow with --phases option
  - Integrates with Memory-Keeper for persistent session management
  - Supports resume capability for interrupted workflows
  - Enables phase-specific error recovery and validation
</context>

<prerequisites>
  - Memory-Keeper MCP integration available
  - Project canonical identity established
  - Phase-based workflow mode activated
  - Access to project directory structure
</prerequisites>

## Phase Checkpoint Framework

<phase_definitions>
  <phase_1>
    <name>Initialize</name>
    <purpose>Project structure setup and technology detection</purpose>
    <outputs>project_structure, tech_stack_detection, memory_system_initialization</outputs>
    <success_criteria>canonical_project_identity_established, memory_systems_active</success_criteria>
  </phase_1>
  <phase_2>
    <name>Research</name>
    <purpose>Requirements gathering and visual asset processing</purpose>
    <outputs>user_requirements, visual_asset_analysis, cross_project_patterns</outputs>
    <success_criteria>requirements_validated, visual_assets_processed, patterns_identified</success_criteria>
  </phase_2>
  <phase_3>
    <name>Plan</name>
    <purpose>Strategic planning and documentation generation</purpose>
    <outputs>mission_document, tech_stack_document, roadmap_document</outputs>
    <success_criteria>documentation_complete, technical_feasibility_validated, roadmap_structured</success_criteria>
  </phase_3>
  <phase_4>
    <name>Verify</name>
    <purpose>Validation and pattern alignment checking</purpose>
    <outputs>validation_report, feasibility_assessment, pattern_alignment</outputs>
    <success_criteria>validation_passed, patterns_aligned, technical_feasibility_confirmed</success_criteria>
  </phase_4>
  <phase_5>
    <name>Finalize</name>
    <purpose>Documentation finalization and handoff preparation</purpose>
    <outputs>final_documentation, project_handoff, next_steps</outputs>
    <success_criteria>documentation_finalized, handoff_prepared, next_phase_ready</success_criteria>
  </phase_5>
</phase_definitions>

## Checkpoint Implementation

<step number="1" name="checkpoint_creation">

### Step 1: Checkpoint Creation

<checkpoint_structure>
  <checkpoint_metadata>
    - checkpoint_id: "{PROJECT_NAME}-phase-{phase_number}-{timestamp}"
    - phase_name: "{PHASE_NAME}"
    - phase_number: {PHASE_NUMBER}
    - project_name: "{PROJECT_NAME}"
    - timestamp: "{ISO_TIMESTAMP}"
    - session_id: "{MEMORY_KEEPER_SESSION_ID}"
    - status: ["in_progress", "completed", "failed"]
  </checkpoint_metadata>
  <checkpoint_data>
    - phase_inputs: structured data entering the phase
    - phase_outputs: structured data produced by the phase
    - decisions_made: key decisions and rationale
    - patterns_identified: design and strategic patterns found
    - errors_encountered: any errors and their resolutions
    - next_phase_requirements: data needed for next phase
  </checkpoint_data>
</checkpoint_structure>

<checkpoint_creation_process>
  <phase_start_checkpoint>
    <!-- Create checkpoint at phase start -->
    CALL: mcp-memory-keeper-context_checkpoint
    PARAMETERS:
      - name: "{PROJECT_NAME}-phase-{phase_number}-start"
      - description: "Starting Phase {phase_number}: {phase_name} for {PROJECT_NAME}"
      - includeFiles: true
      - includeGitStatus: true
    
    <!-- Store phase initialization data -->
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "phase-{phase_number}-start-data"
      - value: "{PHASE_INITIALIZATION_DATA}"
      - category: "progress"
      - priority: "high"
  </phase_start_checkpoint>
  <phase_completion_checkpoint>
    <!-- Create checkpoint at phase completion -->
    CALL: mcp-memory-keeper-context_checkpoint
    PARAMETERS:
      - name: "{PROJECT_NAME}-phase-{phase_number}-complete"
      - description: "Completed Phase {phase_number}: {phase_name} for {PROJECT_NAME}"
      - includeFiles: true
      - includeGitStatus: true
    
    <!-- Store phase completion data -->
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "phase-{phase_number}-completion-data"
      - value: "{PHASE_COMPLETION_DATA}"
      - category: "progress"
      - priority: "high"
    
    <!-- Store strategic patterns in Memento -->
    IF strategic_patterns_identified:
      CALL: memento-mcp-create_entities
      PARAMETERS:
        - entities: [{
            "name": "{PROJECT_NAME}-phase-{phase_number}-patterns",
            "entityType": "phase_patterns",
            "observations": [
              "Phase: {phase_name}",
              "Patterns: {identified_patterns}",
              "Completion Date: {current_date()}",
              "Status: completed"
            ]
          }]
  </phase_completion_checkpoint>
</checkpoint_creation_process>

<instructions>
  ACTION: Create structured checkpoints at phase start and completion
  STORE: Phase data in Memory-Keeper with canonical project identity
  INTEGRATE: Strategic patterns with Memento knowledge graph
  LOG: Checkpoint creation for recovery and resume capabilities
</instructions>

</step>

<step number="2" name="phase_data_management">

### Step 2: Phase Data Management

<structured_data_templates>
  <phase_1_data>
    ## Phase 1: Initialize - Data Template
    
    ### Input Data
    ```json
    {
      "project_directory": "{PROJECT_PATH}",
      "user_request": "{ORIGINAL_USER_REQUEST}",
      "workflow_mode": "phases",
      "memory_systems_available": "{MEMORY_STATUS}"
    }
    ```
    
    ### Output Data
    ```json
    {
      "canonical_project_name": "{CANONICAL_NAME}",
      "project_structure_created": "{STRUCTURE_STATUS}",
      "tech_stack_detected": "{DETECTED_TECHNOLOGIES}",
      "memory_session_id": "{SESSION_ID}",
      "visual_directories_created": "{VISUAL_DIR_STATUS}"
    }
    ```
  </phase_1_data>
  <phase_2_data>
    ## Phase 2: Research - Data Template
    
    ### Input Data
    ```json
    {
      "canonical_project_name": "{FROM_PHASE_1}",
      "project_structure": "{FROM_PHASE_1}",
      "tech_stack_baseline": "{FROM_PHASE_1}"
    }
    ```
    
    ### Output Data
    ```json
    {
      "user_requirements": "{STRUCTURED_REQUIREMENTS}",
      "visual_assets_found": "{ASSET_INVENTORY}",
      "visual_patterns_identified": "{PATTERN_ANALYSIS}",
      "cross_project_similarities": "{SIMILAR_PATTERNS}",
      "technical_implications": "{TECH_REQUIREMENTS}"
    }
    ```
  </phase_2_data>
  <phase_3_data>
    ## Phase 3: Plan - Data Template
    
    ### Input Data
    ```json
    {
      "requirements": "{FROM_PHASE_2}",
      "visual_context": "{FROM_PHASE_2}",
      "technical_implications": "{FROM_PHASE_2}"
    }
    ```
    
    ### Output Data
    ```json
    {
      "mission_document": "{MISSION_MD_STATUS}",
      "tech_stack_document": "{TECH_STACK_MD_STATUS}",
      "roadmap_document": "{ROADMAP_MD_STATUS}",
      "decisions_document": "{DECISIONS_MD_STATUS}",
      "strategic_decisions": "{KEY_DECISIONS}"
    }
    ```
  </phase_3_data>
  <phase_4_data>
    ## Phase 4: Verify - Data Template
    
    ### Input Data
    ```json
    {
      "generated_documentation": "{FROM_PHASE_3}",
      "strategic_decisions": "{FROM_PHASE_3}",
      "technical_stack": "{FROM_PHASE_3}"
    }
    ```
    
    ### Output Data
    ```json
    {
      "validation_results": "{VALIDATION_STATUS}",
      "feasibility_assessment": "{FEASIBILITY_REPORT}",
      "pattern_alignment": "{ALIGNMENT_CHECK}",
      "risk_assessment": "{IDENTIFIED_RISKS}",
      "recommendations": "{IMPROVEMENT_SUGGESTIONS}"
    }
    ```
  </phase_4_data>
  <phase_5_data>
    ## Phase 5: Finalize - Data Template
    
    ### Input Data
    ```json
    {
      "validated_documentation": "{FROM_PHASE_4}",
      "validation_results": "{FROM_PHASE_4}",
      "recommendations": "{FROM_PHASE_4}"
    }
    ```
    
    ### Output Data
    ```json
    {
      "finalized_documentation": "{FINAL_STATUS}",
      "project_handoff": "{HANDOFF_PACKAGE}",
      "next_steps": "{RECOMMENDED_ACTIONS}",
      "knowledge_stored": "{MEMORY_STORAGE_STATUS}",
      "patterns_cataloged": "{PATTERN_CATALOG_STATUS}"
    }
    ```
  </phase_5_data>
</structured_data_templates>

<data_validation_rules>
  <input_validation>
    1. VERIFY all required input data from previous phase is available
    2. VALIDATE data structure matches expected schema
    3. CHECK for missing or corrupted data
    4. RESTORE from checkpoint if data validation fails
  </input_validation>
  <output_validation>
    1. VERIFY all required outputs are generated
    2. VALIDATE output data structure and completeness
    3. CHECK integration with memory systems
    4. CONFIRM handoff data for next phase
  </output_validation>
</data_validation_rules>

<instructions>
  ACTION: Structure phase data using standardized templates
  VALIDATE: Input and output data at each phase transition
  STORE: Structured data for recovery and resume capabilities
  HANDOFF: Clean data contracts between phases
</instructions>

</step>

<step number="3" name="recovery_and_resume">

### Step 3: Recovery and Resume Capabilities

<recovery_scenarios>
  <workflow_interruption>
    <condition>Workflow interrupted mid-phase</condition>
    <recovery_process>
      1. IDENTIFY last successful checkpoint
      2. RESTORE session state from Memory-Keeper
      3. RELOAD phase data and context
      4. RESUME from interruption point
      5. VALIDATE restored state before continuing
    </recovery_process>
  </workflow_interruption>
  <phase_failure>
    <condition>Phase fails validation or encounters errors</condition>
    <recovery_process>
      1. CAPTURE error details and context
      2. STORE error information in Memory-Keeper
      3. ROLLBACK to previous checkpoint
      4. APPLY error-specific recovery procedures
      5. RETRY phase with corrected inputs
    </recovery_process>
  </phase_failure>
  <selective_re_execution>
    <condition>User wants to modify specific phase output</condition>
    <recovery_process>
      1. IDENTIFY target phase for modification
      2. RESTORE checkpoint for that phase
      3. ALLOW selective input modification
      4. RE-EXECUTE from target phase forward
      5. PRESERVE downstream phase compatibility
    </recovery_process>
  </selective_re_execution>
</recovery_scenarios>

<resume_implementation>
  <resume_command_structure>
    # Resume Workflow Commands
    
    ## Resume from Last Checkpoint
    `/plan-product --resume`
    
    ## Resume from Specific Phase
    `/plan-product --resume --phase=3`
    
    ## Resume with Modified Input
    `/plan-product --resume --phase=2 --modify-input`
    
    ## Resume After Error Recovery
    `/plan-product --resume --from-error`
  </resume_command_structure>
  <resume_process>
    <!-- Detect resume request -->
    IF resume_requested:
      <!-- Query Memory-Keeper for checkpoints -->
      CALL: mcp-memory-keeper-context_search
      PARAMETERS:
        - query: "{PROJECT_NAME} phase checkpoint"
        - categories: ["progress"]
      
      <!-- Identify available checkpoints -->
      available_checkpoints = extract_checkpoints(search_results)
      
      <!-- Determine resume point -->
      IF specific_phase_requested:
        resume_point = find_checkpoint_for_phase(target_phase)
      ELSE:
        resume_point = find_latest_checkpoint()
      
      <!-- Restore session state -->
      CALL: mcp-memory-keeper-context_restore_checkpoint
      PARAMETERS:
        - checkpointId: resume_point.checkpoint_id
        - restoreFiles: true
      
      <!-- Validate restored state -->
      validate_restored_state()
      
      <!-- Resume workflow from target phase -->
      execute_workflow_from_phase(resume_point.phase_number + 1)
  </resume_process>
</resume_implementation>

<error_recovery_procedures>
  <phase_specific_recovery>
    <phase_1_recovery>
      # Initialize Phase Recovery
      - RETRY project structure creation
      - RE-DETECT technology stack
      - REINITIALIZE memory systems
      - VALIDATE canonical project identity
    </phase_1_recovery>
    <phase_2_recovery>
      # Research Phase Recovery
      - RE-GATHER user requirements
      - RE-SCAN for visual assets
      - RETRY pattern analysis
      - REVALIDATE technical implications
    </phase_2_recovery>
    <phase_3_recovery>
      # Planning Phase Recovery
      - REGENERATE documentation with corrected inputs
      - REVALIDATE technical stack choices
      - REWRITE roadmap with updated requirements
      - RECHECK strategic decisions alignment
    </phase_3_recovery>
    <phase_4_recovery>
      # Verification Phase Recovery
      - RE-RUN validation procedures
      - REASSESS feasibility with updated data
      - RECHECK pattern alignment
      - UPDATE risk assessment
    </phase_4_recovery>
    <phase_5_recovery>
      # Finalization Phase Recovery
      - RECOMPILE final documentation
      - REGENERATE handoff package
      - REVALIDATE knowledge storage
      - RECHECK pattern cataloging
    </phase_5_recovery>
  </phase_specific_recovery>
</error_recovery_procedures>

<instructions>
  ACTION: Implement comprehensive recovery and resume capabilities
  DETECT: Interruption points and failure scenarios
  RESTORE: Session state from Memory-Keeper checkpoints
  VALIDATE: Restored state before resuming workflow
  RETRY: Failed phases with corrected inputs and error recovery
</instructions>

</step>

## Integration with Memory Systems

<memory_keeper_integration>
  <checkpoint_storage>
    <!-- Checkpoint metadata storage -->
    CHECKPOINT_KEY_FORMAT: "checkpoint-{PROJECT_NAME}-phase-{phase_number}-{timestamp}"
    CHECKPOINT_CATEGORY: "progress"
    CHECKPOINT_PRIORITY: "high"
    
    <!-- Phase data storage -->
    PHASE_DATA_KEY_FORMAT: "phase-data-{PROJECT_NAME}-{phase_number}-{data_type}"
    PHASE_DATA_CATEGORY: "progress"
    PHASE_DATA_PRIORITY: "high"
    
    <!-- Recovery information storage -->
    RECOVERY_KEY_FORMAT: "recovery-{PROJECT_NAME}-{error_type}-{timestamp}"
    RECOVERY_CATEGORY: "error"
    RECOVERY_PRIORITY: "high"
  </checkpoint_storage>
  <session_management>
    <!-- Session continuity across phases -->
    SESSION_PERSISTENCE: true
    SESSION_COMPRESSION: automatic_after_phase_completion
    SESSION_BACKUP: checkpoint_based
    
    <!-- Cross-session context -->
    CROSS_SESSION_KEYS: [
      "canonical-project-identity",
      "strategic-decisions",
      "technical-requirements",
      "visual-patterns"
    ]
  </session_management>
</memory_keeper_integration>

<memento_integration>
  <pattern_storage>
    <!-- Phase-specific patterns -->
    FOR_EACH: completed_phase
      IF strategic_patterns_identified:
        CREATE_ENTITY: "{PROJECT_NAME}-phase-{phase_number}-patterns"
        ENTITY_TYPE: "phase_patterns"
        OBSERVATIONS: [
          "Phase Name: {phase_name}",
          "Patterns Identified: {pattern_list}",
          "Strategic Implications: {implications}",
          "Cross-Project Relevance: {relevance_score}"
        ]
    
    <!-- Phase relationships -->
    CREATE_RELATIONS: [
      "{PROJECT_NAME}" -> "implements_phase_workflow" -> "{PROJECT_NAME}-phase-patterns"
    ]
  </pattern_storage>
  <cross_project_learning>
    <!-- Search for similar phase patterns -->
    CALL: memento-mcp-semantic_search
    PARAMETERS:
      - query: "phase workflow {phase_name} patterns"
      - entity_types: ["phase_patterns"]
      - limit: 10
    
    <!-- Create cross-project relationships -->
    FOR_EACH: similar_pattern
      CREATE_RELATION: 
        FROM: "{PROJECT_NAME}-phase-{phase_number}-patterns"
        TO: "{similar_pattern_entity}"
        TYPE: "similar_workflow_pattern"
        CONFIDENCE: "{similarity_score}"
  </cross_project_learning>
</memento_integration>

## Success Criteria and Validation

<phase_checkpoint_success_criteria>
  <checkpoint_creation_success>
    - [ ] Checkpoint created at phase start
    - [ ] Checkpoint created at phase completion
    - [ ] Phase data stored in structured format
    - [ ] Strategic patterns saved to Memento
    - [ ] Cross-project relationships established
  </checkpoint_creation_success>
  <recovery_capability_success>
    - [ ] Workflow can resume from any checkpoint
    - [ ] Phase-specific error recovery procedures work
    - [ ] Data validation prevents corrupted state restoration
    - [ ] Recovery procedures handle all common failure scenarios
    - [ ] Resume commands function correctly
  </recovery_capability_success>
  <memory_integration_success>
    - [ ] Memory-Keeper stores all checkpoint data
    - [ ] Memento contains phase pattern entities
    - [ ] Cross-project pattern relationships created
    - [ ] Session state persists across interruptions
    - [ ] Knowledge accumulates across phase executions
  </memory_integration_success>
</phase_checkpoint_success_criteria>

<validation_procedures>
  <checkpoint_validation>
    1. VERIFY checkpoint metadata completeness
    2. VALIDATE phase data structure and content
    3. CONFIRM Memory-Keeper storage success
    4. CHECK Memento entity and relationship creation
    5. TEST recovery and resume functionality
  </checkpoint_validation>
  <data_integrity_validation>
    1. VALIDATE phase input/output data contracts
    2. CHECK data handoff completeness
    3. VERIFY cross-phase data consistency
    4. CONFIRM strategic decision preservation
    5. VALIDATE pattern storage and retrieval
  </data_integrity_validation>
</validation_procedures>

## Backward Compatibility

<standard_workflow_support>
  <compatibility_layer>
    <!-- Standard workflow checkpoint creation -->
    IF workflow_mode == "standard":
      CREATE_SIMPLIFIED_CHECKPOINTS: [
        "planning-start",
        "requirements-gathered", 
        "documentation-created",
        "planning-complete"
      ]
      
      STORE_STANDARD_DATA: {
        "workflow_type": "standard",
        "single_session": true,
        "phase_granularity": false
      }
  </compatibility_layer>
  <migration_support>
    <!-- Convert standard checkpoints to phase-based if needed -->
    IF convert_to_phases_requested:
      ANALYZE_STANDARD_CHECKPOINTS()
      MAP_TO_PHASE_STRUCTURE()
      CREATE_PHASE_CHECKPOINTS()
      PRESERVE_ORIGINAL_DATA()
  </migration_support>
</standard_workflow_support>

<graceful_degradation>
  <memory_system_unavailable>
    1. LOG memory system unavailability
    2. CONTINUE with file-based checkpoint simulation
    3. CREATE checkpoint summaries in project files
    4. DOCUMENT limitations for user transparency
    5. RECOMMEND memory system setup for full capability
  </memory_system_unavailable>
</graceful_degradation>

---

**Implementation Note:** This phase checkpoint system provides granular workflow control while maintaining full backward compatibility with existing standard workflows. The system enhances the Agent OS v2.0 integration by enabling sophisticated workflow management with MCP memory intelligence.