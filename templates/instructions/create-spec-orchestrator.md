---
description: 5-Phase Specification Workflow Orchestrator
globs:
alwaysApply: false
version: 1.0
encoding: UTF-8
---

# 5-Phase Specification Workflow Orchestrator

<ai_meta>
  <parsing_rules>
    - Initialize memory systems for workflow continuity
    - Process each phase sequentially with structured handoffs
    - Execute phase templates with proper context transfer
    - Store phase completion status in memory systems
    - Provide clear workflow status and progress tracking
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
  - Orchestrate complete 5-phase specification workflow
  - Manage structured handoffs between phases
  - Track workflow progress and phase completion
  - Ensure MCP memory continuity throughout process
</purpose>

<context>
  - Master orchestrator for Agent OS specification workflow
  - Enhanced with MCP intelligence for cross-project learning
  - Integrates with existing Agent OS template architecture
  - Maintains compatibility with ProjectAI deployment system
</context>

<prerequisites>
  - Write access to project directory
  - MCP memory systems available (Memory-Keeper, Memento)
  - All 5-phase templates available in templates/instructions/
</prerequisites>

## 5-Phase Workflow Overview

<workflow_phases>
  **Phase 1: Initialize** (`initialize-spec.md`)
  - Capture and structure initial project ideas
  - Define project scope and boundaries
  - Initialize MCP memory systems for project context
  
  **Phase 2: Research** (`research-spec.md`)
  - Gather detailed requirements and constraints
  - Conduct stakeholder interviews and analysis
  - Perform visual asset detection and technical research
  
  **Phase 3: Write** (`write-spec.md`)
  - Create comprehensive project specification
  - Document architecture and technical decisions
  - Define acceptance criteria and success metrics
  
  **Phase 4: Verify** (`verify-spec.md`)
  - Validate specification completeness and accuracy
  - Verify technical feasibility and consistency
  - Cross-check against project scope and requirements
  
  **Phase 5: Create Tasks** (`create-tasks-list.md`)
  - Break down specification into actionable tasks
  - Apply test-driven development approach
  - Create implementation roadmap with priorities
</workflow_phases>

<process_flow>

<step number="0" name="orchestrator_initialization">

### Step 0: Initialize Orchestrator and Workflow Context

<orchestrator_initialization>
  <!-- Use centralized Memory Systems and Precedence Initialization workflow -->
  <include>@reference-docs/instructions/memory-precedence-initialization.md</include>
  
  # Execute centralized initialization with orchestrator specific parameters
  EXECUTE: memory_precedence_initialization_workflow()
  PARAMETERS:
    - command_name: "create-spec-orchestrator"
    - memory_requirements: "REQUIRED"  # Memory critical for workflow continuity
    - override_categories: ["workflow_preferences", "phase_customizations", "orchestration_rules"]
    - session_description: "Agent OS 5-Phase Specification Workflow"
    - fallback_behavior: "ERROR_IF_UNAVAILABLE"
  
  PROJECT_NAME = DETECTION_CONTEXT["project_name"]
  PROJECT_ENTITY_NAME = DETECTION_CONTEXT["project_entity_name"]
  PRIMARY_TECH = DETECTION_CONTEXT["primary_tech"]
  
  # Initialize workflow tracking
  CALL: mcp-memory-keeper-context_save
  PARAMETERS:
    - key: "workflow-status"
    - value: "initialized"
    - category: "progress"
    - priority: "high"
  
  # Create workflow entity in long-term memory
  CALL: memento-mcp-create_entities
  PARAMETERS:
    - entities: [{
        "name": "{PROJECT_ENTITY_NAME}-workflow",
        "entityType": "specification_workflow",
        "observations": [
          "Project: {PROJECT_NAME}",
          "Technology: {PRIMARY_TECH}",
          "Workflow Started: {current_date()}",
          "Phases: Initialize → Research → Write → Verify → Create Tasks"
        ]
      }]
  
  LOG: "🚀 5-Phase Specification Workflow Initiated"
  LOG: "📋 Project: {PROJECT_NAME} ({PRIMARY_TECH})"
  LOG: "💾 Memory systems initialized for workflow continuity"
</orchestrator_initialization>

</step>

<step number="1" name="execute_phase1_initialize">

### Step 1: Execute Phase 1 - Initialize Specification

<phase_execution>
  # Check if Phase 1 already completed
  CALL: mcp-memory-keeper-context_get
  PARAMETERS:
    - key: "phase1-complete"
  
  IF phase1_not_complete:
    LOG: "🚀 Starting Phase 1: Project Initialization"
    
    # Execute Phase 1 template
    EXECUTE_TEMPLATE: templates/instructions/initialize-spec.md
    
    # Verify Phase 1 completion
    CALL: mcp-memory-keeper-context_get
    PARAMETERS:
      - key: "phase2-research-context"
    
    IF phase1_context_prepared:
      CALL: mcp-memory-keeper-context_save
      PARAMETERS:
        - key: "phase1-complete"
        - value: "✅ Phase 1 completed successfully"
        - category: "progress"
        - priority: "high"
      
      LOG: "✅ Phase 1 Complete: Project foundation established"
      LOG: "➡️ Ready for Phase 2: Requirements Research"
    ELSE:
      ERROR: "Phase 1 incomplete - missing Phase 2 context preparation"
  ELSE:
    LOG: "✅ Phase 1 already completed, proceeding to Phase 2"
</phase_execution>

</step>

<step number="2" name="execute_phase2_research">

### Step 2: Execute Phase 2 - Research Specification

<phase_execution>
  # Verify Phase 1 completion
  CALL: mcp-memory-keeper-context_get
  PARAMETERS:
    - key: "phase1-complete"
  
  IF phase1_complete:
    # Check if Phase 2 already completed
    CALL: mcp-memory-keeper-context_get
    PARAMETERS:
      - key: "phase2-complete"
    
    IF phase2_not_complete:
      LOG: "🔍 Starting Phase 2: Requirements Research"
      
      # Execute Phase 2 template
      EXECUTE_TEMPLATE: templates/instructions/research-spec.md
      
      # Verify Phase 2 completion
      CALL: mcp-memory-keeper-context_get
      PARAMETERS:
        - key: "phase3-write-context"
      
      IF phase2_context_prepared:
        CALL: mcp-memory-keeper-context_save
        PARAMETERS:
          - key: "phase2-complete"
          - value: "✅ Phase 2 completed successfully"
          - category: "progress"
          - priority: "high"
        
        LOG: "✅ Phase 2 Complete: Requirements research finished"
        LOG: "➡️ Ready for Phase 3: Write Specification"
      ELSE:
        ERROR: "Phase 2 incomplete - missing Phase 3 context preparation"
    ELSE:
      LOG: "✅ Phase 2 already completed, proceeding to Phase 3"
  ELSE:
    ERROR: "Cannot start Phase 2 - Phase 1 not completed"
</phase_execution>

</step>

<step number="3" name="execute_phase3_write">

### Step 3: Execute Phase 3 - Write Specification

<phase_execution>
  # Verify Phase 2 completion
  CALL: mcp-memory-keeper-context_get
  PARAMETERS:
    - key: "phase2-complete"
  
  IF phase2_complete:
    # Check if Phase 3 already completed
    CALL: mcp-memory-keeper-context_get
    PARAMETERS:
      - key: "phase3-complete"
    
    IF phase3_not_complete:
      LOG: "📝 Starting Phase 3: Write Specification"
      
      # Execute Phase 3 template
      EXECUTE_TEMPLATE: templates/instructions/write-spec.md
      
      # Verify Phase 3 completion
      CALL: mcp-memory-keeper-context_get
      PARAMETERS:
        - key: "phase4-verify-context"
      
      IF phase3_context_prepared:
        CALL: mcp-memory-keeper-context_save
        PARAMETERS:
          - key: "phase3-complete"
          - value: "✅ Phase 3 completed successfully"
          - category: "progress"
          - priority: "high"
        
        LOG: "✅ Phase 3 Complete: Specification written"
        LOG: "➡️ Ready for Phase 4: Verify Specification"
      ELSE:
        ERROR: "Phase 3 incomplete - missing Phase 4 context preparation"
    ELSE:
      LOG: "✅ Phase 3 already completed, proceeding to Phase 4"
  ELSE:
    ERROR: "Cannot start Phase 3 - Phase 2 not completed"
</phase_execution>

</step>

<step number="4" name="execute_phase4_verify">

### Step 4: Execute Phase 4 - Verify Specification

<phase_execution>
  # Verify Phase 3 completion
  CALL: mcp-memory-keeper-context_get
  PARAMETERS:
    - key: "phase3-complete"
  
  IF phase3_complete:
    # Check if Phase 4 already completed
    CALL: mcp-memory-keeper-context_get
    PARAMETERS:
      - key: "phase4-complete"
    
    IF phase4_not_complete:
      LOG: "🔍 Starting Phase 4: Verify Specification"
      
      # Execute Phase 4 template
      EXECUTE_TEMPLATE: templates/instructions/verify-spec.md
      
      # Verify Phase 4 completion
      CALL: mcp-memory-keeper-context_get
      PARAMETERS:
        - key: "phase5-task-creation-context"
      
      IF phase4_context_prepared:
        CALL: mcp-memory-keeper-context_save
        PARAMETERS:
          - key: "phase4-complete"
          - value: "✅ Phase 4 completed successfully"
          - category: "progress"
          - priority: "high"
        
        LOG: "✅ Phase 4 Complete: Specification validated"
        LOG: "➡️ Ready for Phase 5: Create Tasks"
      ELSE:
        ERROR: "Phase 4 incomplete - missing Phase 5 context preparation"
    ELSE:
      LOG: "✅ Phase 4 already completed, proceeding to Phase 5"
  ELSE:
    ERROR: "Cannot start Phase 4 - Phase 3 not completed"
</phase_execution>

</step>

<step number="5" name="execute_phase5_create_tasks">

### Step 5: Execute Phase 5 - Create Tasks List

<phase_execution>
  # Verify Phase 4 completion
  CALL: mcp-memory-keeper-context_get
  PARAMETERS:
    - key: "phase4-complete"
  
  IF phase4_complete:
    # Check if Phase 5 already completed
    CALL: mcp-memory-keeper-context_get
    PARAMETERS:
      - key: "phase5-complete"
    
    IF phase5_not_complete:
      LOG: "📋 Starting Phase 5: Create Tasks List"
      
      # Execute Phase 5 template
      EXECUTE_TEMPLATE: templates/instructions/create-tasks-list.md
      
      # Verify Phase 5 completion
      CALL: mcp-memory-keeper-context_get
      PARAMETERS:
        - key: "tasks-list-complete"
      
      IF phase5_context_prepared:
        CALL: mcp-memory-keeper-context_save
        PARAMETERS:
          - key: "phase5-complete"
          - value: "✅ Phase 5 completed successfully"
          - category: "progress"
          - priority: "high"
        
        LOG: "✅ Phase 5 Complete: Tasks list created"
        LOG: "🎯 Ready for implementation with execute-tasks.md"
      ELSE:
        ERROR: "Phase 5 incomplete - tasks list not properly created"
    ELSE:
      LOG: "✅ Phase 5 already completed"
  ELSE:
    ERROR: "Cannot start Phase 5 - Phase 4 not completed"
</phase_execution>

</step>

<step number="6" name="workflow_completion">

### Step 6: Workflow Completion and Summary

<workflow_completion>
  # Verify all phases completed
  phases_status = {}
  
  FOR phase IN ["phase1", "phase2", "phase3", "phase4", "phase5"]:
    CALL: mcp-memory-keeper-context_get
    PARAMETERS:
      - key: "{phase}-complete"
    phases_status[phase] = result.found
  
  IF all_phases_complete:
    # Update workflow status
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "workflow-status"
      - value: "complete"
      - category: "progress"
      - priority: "high"
    
    # Store workflow completion in long-term memory
    CALL: memento-mcp-add_observations
    PARAMETERS:
      - observations: [{
          "entityName": "{PROJECT_ENTITY_NAME}-workflow",
          "contents": [
            "5-Phase Specification Workflow Complete",
            "All phases successfully executed",
            "Project ready for implementation",
            "Completion Date: {current_date()}"
          ]
        }]
    
    # Provide workflow summary
    CALL: mcp-memory-keeper-context_summarize
    PARAMETERS:
      - categories: ["progress", "decision", "task"]
      - maxLength: 2000
    
    LOG: "🎉 5-Phase Specification Workflow Complete!"
    LOG: "📊 All phases successfully executed"
    LOG: "🚀 Project {PROJECT_NAME} ready for implementation"
    LOG: "📋 Next: Execute tasks using execute-tasks.md"
    
    # Display completion summary
    DISPLAY: workflow_completion_summary(phases_status, PROJECT_NAME, PRIMARY_TECH)
    
  ELSE:
    incomplete_phases = [phase for phase, status in phases_status.items() if not status]
    LOG: "⚠️ Workflow incomplete - missing phases: {incomplete_phases}"
    LOG: "🔄 Run orchestrator again to complete remaining phases"
</workflow_completion>

</step>

</process_flow>

## Workflow Progress Tracking

<progress_tracking>
  <phase_status_check>
    # Function to check current workflow status
    FUNCTION: get_workflow_status()
      phases = ["phase1", "phase2", "phase3", "phase4", "phase5"]
      status = {}
      
      FOR phase IN phases:
        CALL: mcp-memory-keeper-context_get
        PARAMETERS:
          - key: "{phase}-complete"
        status[phase] = "✅" if result.found else "⏳"
      
      RETURN: status
  </phase_status_check>
  
  <resumable_workflow>
    - Workflow can be interrupted and resumed at any phase
    - Memory systems maintain continuity between sessions
    - Each phase validates prerequisites before execution
    - Context is properly handed off between phases
  </resumable_workflow>
</progress_tracking>

## Integration with Agent OS Framework

<framework_integration>
  - Orchestrates existing Agent OS templates in structured workflow
  - Maintains MCP memory continuity throughout all phases
  - Integrates with existing template architecture and conventions
  - Compatible with ProjectAI deployment system
  - Preserves all Agent OS intelligence enhancements
</framework_integration>

<usage_guidelines>
  **To start new project specification:**
  ```
  Execute: templates/instructions/create-spec-orchestrator.md
  ```
  
  **To resume incomplete workflow:**
  ```
  Execute: templates/instructions/create-spec-orchestrator.md
  # Orchestrator will detect completed phases and resume from next phase
  ```
  
  **To check workflow status:**
  ```
  Use Memory-Keeper context_get to check phase completion status
  ```
</usage_guidelines>

## Success Criteria

<success_metrics>
  - [ ] All 5 phases executed successfully
  - [ ] Memory continuity maintained throughout workflow
  - [ ] Proper context handoffs between phases
  - [ ] Complete specification ready for implementation
  - [ ] Tasks list created with TDD approach
  - [ ] Workflow status tracking functional
  - [ ] Resume capability verified
</success_metrics>

## Next Steps After Completion

<post_workflow>
  **Implementation Phase:**
  - Execute `execute-tasks.md` with created tasks list
  - Use Memory-Keeper context for implementation continuity
  - Apply test-driven development approach from tasks breakdown
  
  **Ongoing Management:**
  - Update specification as requirements evolve
  - Track implementation progress against tasks
  - Use cross-project learning for future specifications
</post_workflow>