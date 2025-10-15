---
description: Orchestrated Task Execution for Agent OS - Role Coordination Architecture
globs:
alwaysApply: false
version: 3.0
encoding: UTF-8
---

# Orchestrated Task Execution - Role Coordination Architecture

## ⚠️ IMMEDIATE ACTION REQUIRED ⚠️

**STOP**: Before proceeding, you MUST activate MCP workflow systems:

1. **ACTIVATE TOOLS**: `activate_context_management_tools`, `activate_memento_management_tools`, `activate_meilisearch_management_tools`
2. **RESOLVE PROJECT IDENTITY**: Execute universal namespace consolidation (Step 0 below)
3. **START SESSION**: Initialize Memory-Keeper session with this project directory
4. **CHECK CACHE FIRST**: Query Meilisearch for cached documentation before Context7
5. **CREATE ENTITIES**: Store project and technology entities in Memento knowledge graph using canonical names
6. **VALIDATE CONFIDENCE**: Ensure trust score ≥ 8.0 before proceeding

**Any work without completing these 6 steps is INVALID and must be restarted.**

## 🔧 MANDATORY MCP WORKFLOW INITIALIZATION

<include>@reference-docs/instructions/support-workflows/mandatory-mcp-initialization.md</include>

**All subsequent operations MUST use PROJECT_ENTITY_NAME exclusively.**

<ai_meta>
  <parsing_rules>
    - Initialize memory systems before orchestrator execution
    - Process XML blocks first for structured data
    - Execute role transitions in sequential order
    - Use role-specific instruction templates as exact patterns
    - Maintain context continuity across role transitions
    - Store progress and results in memory systems for cross-role access
    - Use context reduction throughout orchestrated workflow
  </parsing_rules>
  <file_conventions>
    - encoding: UTF-8
    - line_endings: LF
    - indent: 2 spaces
    - markdown_headers: no indentation
  </file_conventions>
</ai_meta>

## Orchestrator Overview

<purpose>
  - Coordinate single-agent progression through specialized implementation roles
  - Maintain memory continuity and context preservation across role transitions
  - Ensure comprehensive implementation with pattern-driven approach
  - Integrate MCP tools optimally for each role's specific responsibilities
  - Enable cross-project learning through systematic knowledge capture
</purpose>

<context>
  - Part of Agent OS framework with orchestrated architecture
  - Executed after spec planning is complete (Phase 5 of 5-phase workflow)
  - Coordinates 4 specialized roles: Pattern Analyzer → Implementer → Verifier → Documenter
  - Enhanced with role-specific MCP tool integration and cross-role memory systems
</context>

<orchestrator_architecture>
  - **Single-Agent Role Progression**: One agent transitions through specialized roles
  - **Memory Continuity**: Context preserved via Memory-Keeper across all transitions
  - **Role Specialization**: Each role optimized for specific MCP tool combinations
  - **Cross-Project Learning**: Memento knowledge graph stores patterns for future reuse
</orchestrator_architecture>

## Prerequisites

<prerequisites>
  - Completed Phase 5 (Create Tasks List) with tasks.md
  - Spec documentation exists in @.agent-os/specs/
  - Tasks defined in spec's tasks.md with acceptance criteria
  - Development environment configured and ready
  - Git repository initialized for implementation tracking
  - Role-specific instruction files available in templates/instructions/implementation/
  - MCP memory systems available (Memory-Keeper, Memento)
  - Write access to project directory for implementation artifacts
</prerequisites>

<role_instruction_files>
  - analyze-patterns.md: Pattern Analyzer role (Phase 1)
  - implement-features.md: Implementer role (Phase 2)  
  - verify-implementation.md: Verifier role (Phase 3)
  - document-implementation.md: Documenter role (Phase 4)
</role_instruction_files>

<mcp_tool_availability>
  - Memory-Keeper: RECOMMENDED (graceful degradation if unavailable)
  - Memento MCP: RECOMMENDED (cross-project learning benefits)
  - Sequential Thinking: RECOMMENDED (complex decision support)
  - Vibe Check Tools: RECOMMENDED (validation and learning)
  - Enhanced Error Resolution: RECOMMENDED (implementation blockers)
</mcp_tool_availability>

<process_flow>

<step number="0" name="orchestrator_and_memory_systems_initialization">

### Step 0: Initialize Orchestrator and Memory Systems

<step_metadata>
  <action>initialize orchestrator and activate MCP workflow systems</action>
  <purpose>establish memory continuity and project context for role coordination</purpose>
  <memory_integration>centralized memory systems with orchestrator session tracking</memory_integration>
</step_metadata>

<orchestrator_initialization>
  <!-- Use centralized Memory Systems and Precedence Initialization -->
  <memory_precedence_initialization>
    <include>@reference-docs/instructions/memory-precedence-initialization.md</include>
    
    EXECUTE: memory_precedence_initialization_workflow()
    PARAMETERS:
      - command_name: "execute-tasks-orchestrator"
      - memory_requirements: "RECOMMENDED"
      - override_categories: ["testing_requirements", "implementation_standards", "role_coordination"]
      - session_description: "Agent OS orchestrated implementation workflow"
      - fallback_behavior: "GRACEFUL_DEGRADATION"
    
    # Access standardized initialization results
    PROJECT_NAME = DETECTION_CONTEXT["project_name"]
    PROJECT_ENTITY_NAME = DETECTION_CONTEXT["project_entity_name"]
    PRIMARY_TECH = DETECTION_CONTEXT["primary_tech"]
    TECH_STACKS = DETECTION_CONTEXT["tech_stacks"]
    CONFIDENCE_LEVEL = DETECTION_CONTEXT["confidence_level"]
    NAMESPACE_STATUS = DETECTION_CONTEXT["namespace_status"]
  </memory_precedence_initialization>
  
  <!-- Initialize orchestrator-specific context -->
  <orchestrator_context_initialization>
    LOG: "🎭 Orchestrator: Initializing role-based implementation workflow"
    LOG: "🏷️ Project: {PROJECT_NAME} → {PROJECT_ENTITY_NAME} ({NAMESPACE_STATUS})"
    LOG: "🔧 Tech Stack: {PRIMARY_TECH} with {len(TECH_STACKS)} technologies"
    LOG: "📊 Confidence Level: {CONFIDENCE_LEVEL}"
    
    # Initialize orchestrator session tracking
    ORCHESTRATOR_SESSION_KEY = "{PROJECT_ENTITY_NAME}-orchestrator-{timestamp}"
    ORCHESTRATOR_START_TIME = current_timestamp()
    
    # Initialize role progression tracking
    ROLE_PROGRESSION = [
      {"name": "Pattern Analyzer", "status": "pending", "file": "analyze-patterns.md"},
      {"name": "Implementer", "status": "pending", "file": "implement-features.md"},
      {"name": "Verifier", "status": "pending", "file": "verify-implementation.md"},
      {"name": "Documenter", "status": "pending", "file": "document-implementation.md"}
    ]
    
    LOG: "🔄 Role Progression: 4 roles initialized for sequential execution"
  </orchestrator_context_initialization>
</orchestrator_initialization>

</step>

<step number="0.8" name="enhanced_mcp_learning_integration">

### Step 0.8: Enhanced MCP Learning Integration

<step_metadata>
  <purpose>Apply sequential-thinking, vibe-check, vibe-distill, and vibe-learn MCP tools for intelligent implementation pattern analysis</purpose>
  <enhances>task execution orchestration with cross-project learning patterns</enhances>
  <creates>
    - learning session data in Memory-Keeper
    - cross-project knowledge entities in Memento
    - pattern recognition for implementation workflows
  </creates>
</step_metadata>

<enhanced_mcp_integration>
  <!-- Include the reusable enhanced MCP learning integration module -->
  <include>@templates/instructions/support-workflows/enhanced-mcp-learning-integration.md</include>
  
  <!-- Phase-specific parameters for execute-tasks implementation -->
  <integration_parameters>
    <workflow_phase>execute</workflow_phase>
    <context>task_implementation</context>
    <learning_focus>[
      "implementation_decisions",
      "error_resolution",
      "role_coordination",
      "pattern_application",
      "quality_validation",
      "cross_role_learning"
    ]</learning_focus>
  </integration_parameters>
  
  <!-- Execute-tasks specific learning objectives -->
  <learning_objectives>
    - Analyze implementation decision effectiveness and error resolution patterns
    - Validate role coordination assumptions and pattern application strategies
    - Test assumptions in quality validation and cross-role learning approaches
    - Identify orchestration blind spots and role transition improvement opportunities
    - Capture implementation execution patterns for future project workflows
    - Build cross-project knowledge for similar execution orchestration workflows
  </learning_objectives>
  
  <!-- Integration success validation -->
  <validation_criteria>
    - Sequential thinking applied to complex implementation decision processes
    - Vibe check validates orchestration methodology assumptions and role transitions
    - Vibe distill simplifies overly complex implementation frameworks
    - Vibe learn captures implementation patterns and execution insights
    - Cross-project entities created for implementation knowledge transfer
    - Learning patterns stored for future execute-tasks workflows
  </validation_criteria>
</enhanced_mcp_integration>

<instructions>
  EXECUTE: Enhanced MCP learning integration with execute-tasks parameters
  CONTEXT: Task implementation and orchestration analysis
  LEARNING: Focus on implementation decisions, error resolution, and role coordination
  STORAGE: Store patterns in Memory-Keeper + Memento dual architecture
  FALLBACK: Graceful degradation if individual MCP tools unavailable
</instructions>

</step>

<step number="1" name="execute_pattern_analyzer_role">

### Step 1: Execute Pattern Analyzer Role

<step_metadata>
  <action>analyze implementation patterns and discover cross-project knowledge</action>
  <purpose>identify reusable patterns and anti-patterns for implementation guidance</purpose>
  <memory_integration>search Memento for similar patterns and store discoveries</memory_integration>
</step_metadata>

<pattern_analyzer_execution>
  <!-- Role transition preparation -->
  <role_transition_preparation>
    LOG: "🎭 Orchestrator: Transitioning to Pattern Analyzer Role 🔍"
    LOG: "📋 Objective: Discover and analyze implementation patterns"
    
    ROLE_PROGRESSION[0]["status"] = "active"
    ROLE_PROGRESSION[0]["start_time"] = current_timestamp()
    
    # Prepare Pattern Analyzer context
    PATTERN_ANALYZER_CONTEXT = {
      "project_entity_name": PROJECT_ENTITY_NAME,
      "specs_location": "@.agent-os/specs/",
      "memory_session": ORCHESTRATOR_SESSION_KEY,
      "technology_stacks": TECH_STACKS,
      "confidence_level": CONFIDENCE_LEVEL
    }
  </role_transition_preparation>
  
  <!-- Execute Pattern Analyzer role -->
  <pattern_analyzer_role_execution>
    <!-- Include Pattern Analyzer role instructions -->
    <include>@templates/instructions/implementation/analyze-patterns.md</include>
    
    ROLE_EXECUTION_PARAMETERS:
      - PROJECT_ENTITY_NAME: {PROJECT_ENTITY_NAME}
      - ORCHESTRATOR_SESSION: {ORCHESTRATOR_SESSION_KEY}
      - ROLE_CONTEXT: {PATTERN_ANALYZER_CONTEXT}
      - MCP_TOOLS_AVAILABLE: [Memento, Sequential-thinking, Memory-Keeper]
    
    # Execute Pattern Analyzer workflow
    EXECUTE: Pattern Analyzer Role Workflow
    
    # Capture role completion status
    PATTERN_ANALYZER_RESULTS = {
      "patterns_discovered": retrieve_from_memory("discovered_patterns"),
      "cross_project_patterns": retrieve_from_memory("cross_project_patterns"),
      "anti_patterns": retrieve_from_memory("anti_pattern_analysis"),
      "analysis_report": retrieve_from_memory("pattern-analysis-report")
    }
  </pattern_analyzer_role_execution>
  
  <!-- Role completion and handoff validation -->
  <pattern_analyzer_completion>
    # Validate Pattern Analyzer completion
    VALIDATE_COMPLETION:
      - [ ] Pattern analysis report created and stored
      - [ ] Recommended patterns documented with examples
      - [ ] Anti-patterns identified with prevention strategies  
      - [ ] Cross-project knowledge integrated from Memento
      - [ ] Memory-Keeper context updated with discoveries
    
    IF completion_validation_passed:
      ROLE_PROGRESSION[0]["status"] = "complete"
      ROLE_PROGRESSION[0]["completion_time"] = current_timestamp()
      LOG: "✅ Pattern Analyzer Role: Complete - Ready for Implementer handoff"
    ELSE:
      LOG: "❌ Pattern Analyzer Role: Incomplete - Validation failed"
      EXECUTE: Error resolution and completion retry
  </pattern_analyzer_completion>
</pattern_analyzer_execution>

</step>

<step number="2" name="execute_implementer_role">

### Step 2: Execute Implementer Role

<step_metadata>
  <action>implement features following discovered patterns from Pattern Analyzer</action>
  <purpose>execute actual implementation using pattern guidance and MCP tool support</purpose>
  <memory_integration>apply patterns from Step 1 and store implementation decisions</memory_integration>
</step_metadata>

<implementer_execution>
  <!-- Role transition with context handoff -->
  <implementer_role_transition>
    LOG: "🎭 Orchestrator: Transitioning to Implementer Role ⚡"
    LOG: "📋 Objective: Implement features following discovered patterns"
    
    # Validate Pattern Analyzer handoff
    VALIDATE_HANDOFF:
      - Pattern analysis report available
      - Recommended patterns list accessible
      - Anti-patterns warning list prepared
      - Memory-Keeper session continuous
    
    ROLE_PROGRESSION[1]["status"] = "active" 
    ROLE_PROGRESSION[1]["start_time"] = current_timestamp()
    
    # Prepare Implementer context with Pattern Analyzer results
    IMPLEMENTER_CONTEXT = {
      "project_entity_name": PROJECT_ENTITY_NAME,
      "pattern_analysis_results": PATTERN_ANALYZER_RESULTS,
      "memory_session": ORCHESTRATOR_SESSION_KEY,
      "tasks_location": "@.agent-os/specs/tasks.md",
      "implementation_guidance": retrieve_from_memory("implementation_guidance")
    }
  </implementer_role_transition>
  
  <!-- Execute Implementer role -->
  <implementer_role_execution>
    <!-- Include Implementer role instructions -->
    <include>@templates/instructions/implementation/implement-features.md</include>
    
    ROLE_EXECUTION_PARAMETERS:
      - PROJECT_ENTITY_NAME: {PROJECT_ENTITY_NAME}
      - ORCHESTRATOR_SESSION: {ORCHESTRATOR_SESSION_KEY}
      - ROLE_CONTEXT: {IMPLEMENTER_CONTEXT}
      - MCP_TOOLS_AVAILABLE: [Sequential-thinking, Vibe-check, Memory-Keeper, Enhanced-error-resolution]
      - PATTERN_GUIDANCE: {PATTERN_ANALYZER_RESULTS}
    
    # Execute Implementer workflow
    EXECUTE: Implementer Role Workflow
    
    # Capture implementation results
    IMPLEMENTER_RESULTS = {
      "tasks_completed": retrieve_from_memory("task_completion_status"),
      "implementation_report": retrieve_from_memory("task-implementation-report"), 
      "pattern_applications": retrieve_from_memory("implementation_insights"),
      "error_resolutions": retrieve_from_memory("implementation_errors")
    }
  </implementer_role_execution>
  
  <!-- Implementer completion validation -->
  <implementer_completion>
    # Validate Implementer completion
    VALIDATE_COMPLETION:
      - [ ] All prioritized tasks implemented with evidence
      - [ ] Implementation report created with pattern compliance
      - [ ] Tests created for implemented functionality
      - [ ] Error resolutions documented and applied
      - [ ] Memory-Keeper context updated with implementation insights
    
    IF completion_validation_passed:
      ROLE_PROGRESSION[1]["status"] = "complete"
      ROLE_PROGRESSION[1]["completion_time"] = current_timestamp()
      LOG: "✅ Implementer Role: Complete - Ready for Verifier handoff"
    ELSE:
      LOG: "❌ Implementer Role: Incomplete - Validation failed"
      EXECUTE: Error resolution and completion retry
  </implementer_completion>
</implementer_execution>

</step>

<step number="3" name="execute_verifier_role">

### Step 3: Execute Verifier Role

<step_metadata>
  <action>verify implementation quality and validate against acceptance criteria</action>
  <purpose>ensure implementation meets standards and requirements before documentation</purpose>
  <memory_integration>validate implementation evidence and store quality assessments</memory_integration>
</step_metadata>

<verifier_execution>
  <!-- Role transition with implementation handoff -->
  <verifier_role_transition>
    LOG: "🎭 Orchestrator: Transitioning to Verifier Role ✅"
    LOG: "📋 Objective: Verify implementation quality and standards compliance"
    
    # Validate Implementer handoff
    VALIDATE_HANDOFF:
      - Implementation report available
      - Task completion evidence accessible
      - Test results and coverage documented
      - Memory-Keeper session continuous
    
    ROLE_PROGRESSION[2]["status"] = "active"
    ROLE_PROGRESSION[2]["start_time"] = current_timestamp()
    
    # Prepare Verifier context with implementation results
    VERIFIER_CONTEXT = {
      "project_entity_name": PROJECT_ENTITY_NAME,
      "implementation_results": IMPLEMENTER_RESULTS,
      "pattern_analysis": PATTERN_ANALYZER_RESULTS,
      "memory_session": ORCHESTRATOR_SESSION_KEY,
      "quality_requirements": retrieve_from_memory("quality_requirements")
    }
  </verifier_role_transition>
  
  <!-- Execute Verifier role -->
  <verifier_role_execution>
    <!-- Include Verifier role instructions -->
    <include>@templates/instructions/implementation/verify-implementation.md</include>
    
    ROLE_EXECUTION_PARAMETERS:
      - PROJECT_ENTITY_NAME: {PROJECT_ENTITY_NAME}
      - ORCHESTRATOR_SESSION: {ORCHESTRATOR_SESSION_KEY}
      - ROLE_CONTEXT: {VERIFIER_CONTEXT}
      - MCP_TOOLS_AVAILABLE: [Enhanced-error-resolution, Vibe-learn, Sequential-thinking]
      - IMPLEMENTATION_EVIDENCE: {IMPLEMENTER_RESULTS}
    
    # Execute Verifier workflow
    EXECUTE: Verifier Role Workflow
    
    # Capture verification results
    VERIFIER_RESULTS = {
      "test_results": retrieve_from_memory("verification_results"),
      "quality_assessment": retrieve_from_memory("quality_assessment"),
      "compliance_verification": retrieve_from_memory("compliance_analysis"),
      "verification_report": retrieve_from_memory("verification-report"),
      "issues_identified": retrieve_from_memory("issue_identification")
    }
  </verifier_role_execution>
  
  <!-- Verifier completion validation -->
  <verifier_completion>
    # Validate Verifier completion
    VALIDATE_COMPLETION:
      - [ ] All test suites executed with results documented
      - [ ] Standards compliance verified and assessed
      - [ ] Task completion validated against acceptance criteria
      - [ ] Issues identified, prioritized, and documented
      - [ ] Quality assessment completed with recommendations
      - [ ] Verification report created with comprehensive findings
    
    IF completion_validation_passed:
      ROLE_PROGRESSION[2]["status"] = "complete"
      ROLE_PROGRESSION[2]["completion_time"] = current_timestamp()
      LOG: "✅ Verifier Role: Complete - Ready for Documenter handoff"
    ELSE:
      LOG: "❌ Verifier Role: Incomplete - Validation failed"
      EXECUTE: Error resolution and completion retry
  </verifier_completion>
</verifier_execution>

</step>

<step number="4" name="execute_documenter_role">

### Step 4: Execute Documenter Role

<step_metadata>
  <action>create comprehensive documentation and capture cross-project learning</action>
  <purpose>document implementation decisions and create knowledge transfer artifacts</purpose>
  <memory_integration>consolidate all role results into permanent knowledge entities</memory_integration>
</step_metadata>

<documenter_execution>
  <!-- Role transition with verification handoff -->
  <documenter_role_transition>
    LOG: "🎭 Orchestrator: Transitioning to Documenter Role 📋"
    LOG: "📋 Objective: Create comprehensive documentation and capture cross-project learning"
    
    # Validate Verifier handoff
    VALIDATE_HANDOFF:
      - Verification report available  
      - Quality assessment accessible
      - Issue identification completed
      - All role contexts preserved in Memory-Keeper
    
    ROLE_PROGRESSION[3]["status"] = "active"
    ROLE_PROGRESSION[3]["start_time"] = current_timestamp()
    
    # Prepare Documenter context with all role results
    DOCUMENTER_CONTEXT = {
      "project_entity_name": PROJECT_ENTITY_NAME,
      "pattern_analysis": PATTERN_ANALYZER_RESULTS,
      "implementation_results": IMPLEMENTER_RESULTS,
      "verification_results": VERIFIER_RESULTS,
      "memory_session": ORCHESTRATOR_SESSION_KEY,
      "orchestrator_context": ROLE_PROGRESSION
    }
  </documenter_role_transition>
  
  <!-- Execute Documenter role -->
  <documenter_role_execution>
    <!-- Include Documenter role instructions -->
    <include>@templates/instructions/implementation/document-implementation.md</include>
    
    ROLE_EXECUTION_PARAMETERS:
      - PROJECT_ENTITY_NAME: {PROJECT_ENTITY_NAME}
      - ORCHESTRATOR_SESSION: {ORCHESTRATOR_SESSION_KEY}
      - ROLE_CONTEXT: {DOCUMENTER_CONTEXT}
      - MCP_TOOLS_AVAILABLE: [Memory-Keeper, Memento, Vibe-distill, Sequential-thinking]
      - ALL_ROLE_RESULTS: {PATTERN_ANALYZER_RESULTS, IMPLEMENTER_RESULTS, VERIFIER_RESULTS}
    
    # Execute Documenter workflow
    EXECUTE: Documenter Role Workflow
    
    # Capture documentation results
    DOCUMENTER_RESULTS = {
      "comprehensive_documentation": retrieve_from_memory("comprehensive_documentation"),
      "decision_catalog": retrieve_from_memory("decision_documentation"),
      "lessons_learned": retrieve_from_memory("lessons_learned"),
      "cross_project_entities": retrieve_from_memory("cross_project_entities"),
      "executive_summary": retrieve_from_memory("final_summary")
    }
  </documenter_role_execution>
  
  <!-- Documenter completion validation -->
  <documenter_completion>
    # Validate Documenter completion
    VALIDATE_COMPLETION:
      - [ ] Comprehensive implementation documentation created
      - [ ] Decision catalog with trade-off analysis completed
      - [ ] Lessons learned and best practices documented
      - [ ] Cross-project learning entities created in Memento
      - [ ] Executive summary prepared for stakeholders
      - [ ] Knowledge transfer artifacts created
    
    IF completion_validation_passed:
      ROLE_PROGRESSION[3]["status"] = "complete"
      ROLE_PROGRESSION[3]["completion_time"] = current_timestamp()
      LOG: "✅ Documenter Role: Complete - All roles successfully executed"
    ELSE:
      LOG: "❌ Documenter Role: Incomplete - Validation failed"
      EXECUTE: Error resolution and completion retry
  </documenter_completion>
</documenter_execution>

</step>

<step number="5" name="complete_orchestrator_workflow">

### Step 5: Complete Orchestrator Workflow

<step_metadata>
  <action>finalize orchestrated workflow and generate completion report</action>
  <purpose>complete orchestrator execution with comprehensive metrics and reporting</purpose>
  <memory_integration>create orchestrator completion entities and final cross-project knowledge</memory_integration>
</step_metadata>

<orchestrator_completion>
  <!-- Final workflow validation -->
  <final_workflow_validation>
    LOG: "🎭 Orchestrator: Completing orchestrated implementation workflow"
    
    # Calculate orchestrator metrics
    ORCHESTRATOR_END_TIME = current_timestamp()
    TOTAL_EXECUTION_TIME = ORCHESTRATOR_END_TIME - ORCHESTRATOR_START_TIME
    
    ORCHESTRATOR_METRICS = {
      "total_execution_time": TOTAL_EXECUTION_TIME,
      "roles_completed": count_completed_roles(ROLE_PROGRESSION),
      "quality_score": VERIFIER_RESULTS["quality_assessment"]["overall_score"],
      "patterns_discovered": len(PATTERN_ANALYZER_RESULTS["patterns_discovered"]),
      "tasks_completed": len(IMPLEMENTER_RESULTS["tasks_completed"]),
      "issues_resolved": len(VERIFIER_RESULTS["issues_identified"])
    }
    
    # Final validation checklist
    VALIDATE_ORCHESTRATOR_COMPLETION:
      - [ ] All 4 roles completed successfully
      - [ ] Memory continuity maintained across all role transitions
      - [ ] Cross-project learning entities created in Memento
      - [ ] Comprehensive documentation package available
      - [ ] Quality assessment meets acceptance criteria
      - [ ] Implementation evidence supports all completed tasks
  </final_workflow_validation>
  
  <!-- Generate orchestrator completion report -->
  <orchestrator_completion_report>
    CREATE: Orchestrator Completion Report
    LOCATION: implementations/orchestrator-completion-{timestamp}.md
    
    STRUCTURE:
    ```markdown
    # Orchestrator Completion Report: {PROJECT_NAME}
    
    **Date:** {current_date}
    **Project:** {PROJECT_ENTITY_NAME}
    **Orchestrator:** Role Coordination Architecture v3.0
    **Status:** Workflow Complete
    
    ## Execution Summary
    **Total Time:** {TOTAL_EXECUTION_TIME}
    **Roles Completed:** {ORCHESTRATOR_METRICS["roles_completed"]}/4
    **Quality Score:** {ORCHESTRATOR_METRICS["quality_score"]}/10
    
    ## Role Execution Timeline
    [Detailed timeline of role transitions and completion times]
    
    ## Key Achievements
    - Patterns Discovered: {ORCHESTRATOR_METRICS["patterns_discovered"]}
    - Tasks Completed: {ORCHESTRATOR_METRICS["tasks_completed"]}
    - Issues Resolved: {ORCHESTRATOR_METRICS["issues_resolved"]}
    - Cross-Project Entities: [count from Memento]
    
    ## Quality Assessment
    [Summary of verification results and quality metrics]
    
    ## Knowledge Assets Created
    [Summary of patterns, documentation, and learning captured]
    
    ## Recommendations for Future Orchestrations
    [Insights for improving future orchestrated workflows]
    ```
    
    STORE in Memory-Keeper:
      - category: "orchestrator_completion"
      - key: "{PROJECT_ENTITY_NAME}-orchestrator-completion"
      - priority: "critical"
  </orchestrator_completion_report>
  
  <!-- Final orchestrator logging -->
  <orchestrator_final_logging>
    LOG: "🎉 Orchestrator: Implementation workflow successfully completed!"
    LOG: "📊 Execution Time: {TOTAL_EXECUTION_TIME}"
    LOG: "✅ Roles Completed: {ORCHESTRATOR_METRICS['roles_completed']}/4"
    LOG: "🏆 Quality Score: {ORCHESTRATOR_METRICS['quality_score']}/10"
    LOG: "🧠 Cross-Project Learning: Enhanced knowledge graph with implementation patterns"
    LOG: "📋 Documentation: Comprehensive implementation documentation package created"
    LOG: "🚀 Ready for deployment or next development phase"
  </orchestrator_final_logging>
</orchestrator_completion>

## Orchestrator Error Handling

### Role Execution Failures

<role_failure_recovery>
  IF role_execution_fails:
    
    # Capture failure context
    FAILURE_CONTEXT = {
      "failed_role": current_role,
      "failure_point": current_step,
      "error_details": error_information,
      "memory_state": current_memory_context,
      "previous_role_results": completed_role_outputs
    }
    
    # Apply enhanced error resolution
    <include>@reference-docs/instructions/error-resolution-via-memory.md</include>
    
    ERROR_RESOLUTION_PARAMETERS:
      - error_context: FAILURE_CONTEXT
      - orchestrator_session: ORCHESTRATOR_SESSION_KEY
      - cross_role_context: all_completed_roles
    
    # Recovery strategies
    RECOVERY_OPTIONS:
      1. **Retry Role**: Re-execute failed role with enhanced context
      2. **Partial Completion**: Accept partial role completion with documentation
      3. **Alternative Approach**: Use different MCP tools or manual completion
      4. **Escalation**: Request user guidance for critical failures
    
    LOG: "🚨 Orchestrator: Role failure detected - applying recovery strategy"
</role_failure_recovery>

### MCP Tool Unavailability

<mcp_tool_degradation>
  IF critical_mcp_tools_unavailable:
    
    # Assess impact on orchestrator execution
    TOOL_IMPACT_ASSESSMENT:
      - Memory-Keeper unavailable: Reduced context continuity, manual handoffs
      - Memento unavailable: No cross-project learning, reduced pattern discovery
      - Sequential-thinking unavailable: Manual structured analysis required
      - Vibe-check tools unavailable: Manual validation processes required
    
    # Apply graceful degradation
    DEGRADATION_STRATEGY:
      - Enable manual context management between roles
      - Create file-based handoff documentation
      - Use structured manual processes where MCP tools unavailable
      - Document limitations and impact on deliverables
    
    LOG: "⚠️ Orchestrator: Graceful degradation activated - {unavailable_tools} unavailable"
</mcp_tool_degradation>

### Context Continuity Issues

<context_recovery>
  IF context_continuity_broken:
    
    # Attempt context reconstruction
    CONTEXT_RECONSTRUCTION:
      1. Check Memory-Keeper for partial context
      2. Review completed role outputs for context clues
      3. Use file-based artifacts for context recovery
      4. Request user input for missing critical context
    
    # Validate context adequacy for continuing
    CONTEXT_ADEQUACY_CHECK:
      - Required context for next role available
      - Previous role outputs accessible
      - Critical decisions and patterns preserved
    
    LOG: "🔧 Orchestrator: Context reconstruction completed - continuing workflow"
</context_recovery>

</step>

</process_flow>

## Orchestrator Quality Gates

### Role Transition Gates

- **Pattern Analyzer → Implementer**: Pattern analysis report and recommendations available
- **Implementer → Verifier**: Implementation evidence and task completion documented  
- **Verifier → Documenter**: Quality assessment and verification results completed
- **Final Completion**: All documentation and cross-project learning entities created

### Success Criteria

- [ ] **Workflow Completion**: All 4 roles executed successfully
- [ ] **Memory Continuity**: Context preserved across all role transitions  
- [ ] **Quality Achievement**: Implementation meets acceptance criteria and quality standards
- [ ] **Knowledge Capture**: Cross-project learning entities created for future benefit
- [ ] **Documentation Completeness**: Comprehensive documentation package available

---

**🎯 ORCHESTRATED IMPLEMENTATION ARCHITECTURE**: Single-agent role progression with memory continuity, pattern-driven implementation, and comprehensive cross-project learning capture.