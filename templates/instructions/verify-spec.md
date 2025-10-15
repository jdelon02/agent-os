---
description: Phase 4 - Specification Validation and Review
globs:
alwaysApply: false
version: 1.0
encoding: UTF-8
---

# Phase 4: Specification Validation and Review

## ⚠️ IMMEDIATE ACTION REQUIRED ⚠️

**STOP**: Before proceeding with Phase 4, you MUST activate MCP workflow systems:

1. **ACTIVATE TOOLS**: `activate_context_management_tools`, `activate_memento_management_tools`, `activate_meilisearch_management_tools`
2. **RESOLVE PROJECT IDENTITY**: Execute universal namespace consolidation (Step 0 below)
3. **START SESSION**: Initialize Memory-Keeper session with this project directory
4. **CHECK CACHE FIRST**: Query Meilisearch for cached documentation before Context7
5. **CREATE ENTITIES**: Store project and technology entities in Memento knowledge graph using canonical names
6. **VALIDATE CONFIDENCE**: Ensure trust score ≥ 8.0 before proceeding

**Any Phase 4 work without completing these 6 steps is INVALID and must be restarted.**

## 🔧 MANDATORY MCP WORKFLOW INITIALIZATION

<include>@reference-docs/instructions/support-workflows/mandatory-mcp-initialization.md</include>

**All subsequent Phase 4 operations MUST use PROJECT_ENTITY_NAME exclusively.**

<ai_meta>
  <parsing_rules>
    - Load memory context from previous phases
    - Process validation rules systematically
    - Execute verification checks sequentially
    - Store validation results in memory systems
    - Prepare structured handoff to Phase 5
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
  - Validate specification completeness and accuracy
  - Verify technical feasibility and consistency
  - Cross-check against project scope and requirements
  - Identify gaps, contradictions, or risks before implementation
</purpose>

<context>
  - Fourth phase of 5-phase specification workflow
  - Follows Phase 3 (Write Specification)
  - Enhanced with MCP intelligence for pattern-based validation
  - Prepares validated context for Phase 5 (Create Tasks)
</context>

<prerequisites>
  - Completed Phase 1 (Initialize), Phase 2 (Research), Phase 3 (Write)
  - Access to project specification document
  - MCP memory systems with project context
  - Technical expertise for feasibility assessment
</prerequisites>

<process_flow>

<step number="0" name="memory_context_loading">

### Step 0: Load Project Context and Previous Phase Results

<memory_precedence_initialization>
  <!-- Use centralized Memory Systems and Precedence Initialization workflow -->
  <include>@reference-docs/instructions/memory-precedence-initialization.md</include>
  
  # Execute centralized initialization with verify-spec specific parameters
  EXECUTE: memory_precedence_initialization_workflow()
  PARAMETERS:
    - command_name: "verify-spec"
    - memory_requirements: "REQUIRED"  # Memory critical for validation context
    - override_categories: ["validation_rules", "quality_standards", "technical_constraints"]
    - session_description: "Agent OS Phase 4: Specification Validation"
    - fallback_behavior: "ERROR_IF_UNAVAILABLE"
  
  # Load context from previous phases
  CALL: mcp-memory-keeper-context_get
  PARAMETERS:
    - key: "project-vision"
  
  CALL: mcp-memory-keeper-context_get
  PARAMETERS:
    - key: "research-findings"
  
  CALL: mcp-memory-keeper-context_get  
  PARAMETERS:
    - key: "specification-complete"
  
  PROJECT_NAME = DETECTION_CONTEXT["project_name"]
  PROJECT_ENTITY_NAME = DETECTION_CONTEXT["project_entity_name"]
  
  LOG: "🔍 Phase 4 validation initiated - loading project context"
  LOG: "📋 Specification ready for validation: {PROJECT_NAME}"
</memory_precedence_initialization>

</step>

<step number="1" name="completeness_validation">

### Step 1: Specification Completeness Validation

<step_metadata>
  <action>verify specification covers all required areas</action>
  <purpose>ensure nothing critical is missing</purpose>
  <memory_integration>check against research requirements</memory_integration>
</step_metadata>

<completeness_checks>
  <functional_requirements>
    - Are all core features specified?
    - Do specifications include acceptance criteria?
    - Are user stories complete and testable?
    - Are edge cases and error handling covered?
  </functional_requirements>
  
  <technical_requirements>
    - Is the architecture clearly defined?
    - Are technology choices documented and justified?
    - Are performance requirements specified?
    - Are security requirements addressed?
  </technical_requirements>
  
  <interface_specifications>
    - Are all APIs and endpoints defined?
    - Is the data model complete?
    - Are user interface requirements specified?
    - Are integration points documented?
  </interface_specifications>
  
  <operational_requirements>
    - Are deployment requirements specified?
    - Is monitoring and logging addressed?
    - Are backup and recovery procedures defined?
    - Are scalability considerations documented?
  </operational_requirements>
</completeness_checks>

<completeness_validation>
  # Check against original research findings
  CALL: mcp-memory-keeper-context_search
  PARAMETERS:
    - query: "research requirements phase2"
  
  # Cross-project completeness pattern matching
  CALL: memento-mcp-semantic_search
  PARAMETERS:
    - query: "{PRIMARY_TECH} specification completeness checklist"
    - entity_types: ["specification", "best_practice", "checklist"]
    - limit: 5
  
  # Store completeness assessment
  CALL: mcp-memory-keeper-context_save
  PARAMETERS:
    - key: "completeness-validation"
    - value: "{completeness_assessment_summary}"
    - category: "progress"
    - priority: "high"
</completeness_validation>

</step>

<step number="2" name="consistency_validation">

### Step 2: Internal Consistency Validation

<step_metadata>
  <action>verify specification internal consistency</action>
  <purpose>eliminate contradictions and conflicts</purpose>
  <memory_integration>pattern matching for common consistency issues</memory_integration>
</step_metadata>

<consistency_checks>
  <data_consistency>
    - Do data models align across different sections?
    - Are field names and types consistent?
    - Do database schemas match API specifications?
    - Are relationships properly defined?
  </data_consistency>
  
  <workflow_consistency>
    - Do user workflows connect logically?
    - Are state transitions clearly defined?
    - Do business rules align across features?
    - Are permissions and access controls consistent?
  </workflow_consistency>
  
  <technical_consistency>
    - Are technology choices consistent throughout?
    - Do architectural patterns align?
    - Are naming conventions followed consistently?
    - Do performance requirements align with architecture?
  </technical_consistency>
  
  <requirement_consistency>
    - Do functional requirements align with business goals?
    - Are acceptance criteria consistent with user stories?
    - Do technical constraints align with requirements?
    - Are dependencies properly resolved?
  </requirement_consistency>
</consistency_checks>

<consistency_validation>
  # Search for common consistency patterns and pitfalls
  CALL: memento-mcp-semantic_search
  PARAMETERS:
    - query: "specification consistency validation {PRIMARY_TECH}"
    - entity_types: ["validation_rule", "common_error", "best_practice"]
    - limit: 5
  
  # Store consistency assessment
  CALL: mcp-memory-keeper-context_save
  PARAMETERS:
    - key: "consistency-validation"
    - value: "{consistency_assessment_summary}"
    - category: "progress" 
    - priority: "high"
</consistency_validation>

</step>

<step number="3" name="feasibility_validation">

### Step 3: Technical Feasibility Validation

<step_metadata>
  <action>verify technical implementation feasibility</action>
  <purpose>identify technical risks and constraints</purpose>
  <memory_integration>leverage cross-project technical knowledge</memory_integration>
</step_metadata>

<feasibility_checks>
  <technology_feasibility>
    - Are chosen technologies mature and stable?
    - Do technology combinations work well together?
    - Are there known limitations or compatibility issues?
    - Are licensing and cost considerations addressed?
  </technology_feasibility>
  
  <performance_feasibility>
    - Are performance requirements realistic?
    - Does the architecture support required scale?
    - Are there potential bottlenecks identified?
    - Are resource requirements reasonable?
  </performance_feasibility>
  
  <integration_feasibility>
    - Are external integrations well-documented and available?
    - Are API rate limits and constraints considered?
    - Are authentication and authorization mechanisms feasible?
    - Are data migration requirements realistic?
  </integration_feasibility>
  
  <timeline_feasibility>
    - Are development estimates realistic?
    - Are dependencies and blockers identified?
    - Are team skills aligned with technology choices?
    - Are testing and deployment timelines reasonable?
  </timeline_feasibility>
</feasibility_checks>

<feasibility_validation>
  # Search for similar technical implementations
  CALL: memento-mcp-semantic_search
  PARAMETERS:
    - query: "{PRIMARY_TECH} {key_technologies} implementation challenges"
    - entity_types: ["project", "technical_decision", "lesson_learned"]
    - limit: 5
  
  # Validate against documented technical patterns
  CALL: context7-get-library-docs
  PARAMETERS:
    - context7CompatibleLibraryID: "/{primary_framework_org}/{primary_framework}"
    - topic: "architecture best practices"
    - tokens: 5000
  
  # Store feasibility assessment
  CALL: mcp-memory-keeper-context_save
  PARAMETERS:
    - key: "feasibility-validation"
    - value: "{feasibility_assessment_summary}"
    - category: "decision"
    - priority: "high"
</feasibility_validation>

</step>

<step number="4" name="scope_alignment_validation">

### Step 4: Scope Alignment Validation

<step_metadata>
  <action>verify specification aligns with project scope</action>
  <purpose>prevent scope creep and ensure focus</purpose>
  <memory_integration>check against Phase 1 scope boundaries</memory_integration>
</step_metadata>

<scope_alignment_checks>
  # Load original scope boundaries from Phase 1
  CALL: mcp-memory-keeper-context_get
  PARAMETERS:
    - key: "project-scope-boundaries"
  
  <scope_compliance>
    - Are all specified features within original scope?
    - Have any out-of-scope items crept in?
    - Do complexity levels align with scope expectations?
    - Are resource requirements within scope boundaries?
  </scope_compliance>
  
  <priority_alignment>
    - Are high-priority features fully specified?
    - Are lower-priority features appropriately detailed?
    - Do feature priorities still align with business goals?
    - Are dependencies between features properly managed?
  </priority_alignment>
  
  <constraint_compliance>
    - Do specifications respect technical constraints?
    - Are time and resource constraints considered?
    - Do compliance requirements remain satisfied?
    - Are integration constraints properly addressed?
  </constraint_compliance>
</scope_alignment_checks>

<scope_validation>
  # Store scope alignment assessment
  CALL: mcp-memory-keeper-context_save
  PARAMETERS:
    - key: "scope-alignment-validation"
    - value: "{scope_alignment_summary}"
    - category: "decision"
    - priority: "high"
</scope_validation>

</step>

<step number="5" name="quality_standards_validation">

### Step 5: Quality Standards Validation

<step_metadata>
  <action>verify specification meets quality standards</action>
  <purpose>ensure specification supports successful implementation</purpose>
  <memory_integration>apply cross-project quality patterns</memory_integration>
</step_metadata>

<quality_checks>
  <clarity_and_precision>
    - Are requirements clearly and unambiguously stated?
    - Are technical terms defined and used consistently?
    - Are acceptance criteria specific and measurable?
    - Are assumptions and constraints explicitly stated?
  </clarity_and_precision>
  
  <testability>
    - Can each requirement be tested?
    - Are acceptance criteria verifiable?
    - Are performance metrics measurable?
    - Are error conditions testable?
  </testability>
  
  <maintainability>
    - Is the specification well-organized and navigable?
    - Are diagrams and documentation current?
    - Are references and links valid?
    - Is versioning and change tracking in place?
  </maintainability>
  
  <completeness_for_implementation>
    - Do developers have sufficient detail to implement?
    - Are design decisions explained and justified?
    - Are alternative approaches documented?
    - Are risk mitigation strategies included?
  </completeness_for_implementation>
</quality_checks>

<quality_validation>
  # Apply cross-project quality patterns
  CALL: memento-mcp-semantic_search
  PARAMETERS:
    - query: "specification quality standards best practices"
    - entity_types: ["quality_standard", "best_practice", "checklist"]
    - limit: 3
  
  # Store quality assessment
  CALL: mcp-memory-keeper-context_save
  PARAMETERS:
    - key: "quality-validation"
    - value: "{quality_assessment_summary}"
    - category: "progress"
    - priority: "high"
</quality_validation>

</step>

<step number="5.8" name="enhanced_mcp_learning_integration">

### Step 5.8: Enhanced MCP Learning Integration

<step_metadata>
  <purpose>Apply sequential-thinking, vibe-check, vibe-distill, and vibe-learn MCP tools for intelligent validation pattern analysis</purpose>
  <enhances>specification validation with cross-project learning patterns</enhances>
  <creates>
    - learning session data in Memory-Keeper
    - cross-project knowledge entities in Memento
    - pattern recognition for validation workflows
  </creates>
</step_metadata>

<enhanced_mcp_integration>
  <!-- Include the reusable enhanced MCP learning integration module -->
  <include>@templates/instructions/support-workflows/enhanced-mcp-learning-integration.md</include>
  
  <!-- Phase-specific parameters for verify-spec validation -->
  <integration_parameters>
    <workflow_phase>verify</workflow_phase>
    <context>validation_patterns</context>
    <learning_focus>[
      "gap_detection",
      "assumption_testing",
      "validation_thoroughness",
      "quality_assessment_patterns",
      "consistency_checking",
      "feasibility_analysis"
    ]</learning_focus>
  </integration_parameters>
  
  <!-- Verify-spec specific learning objectives -->
  <learning_objectives>
    - Analyze gap detection effectiveness and validation completeness patterns
    - Test assumptions in specification validation and quality assessment approaches
    - Validate consistency checking methodologies and feasibility analysis techniques
    - Identify validation blind spots and improvement opportunities
    - Capture validation decision patterns for future specification reviews
    - Build cross-project knowledge for similar validation workflows
  </learning_objectives>
  
  <!-- Integration success validation -->
  <validation_criteria>
    - Sequential thinking applied to complex validation decision processes
    - Vibe check validates validation methodology assumptions and approaches
    - Vibe distill simplifies overly complex validation frameworks
    - Vibe learn captures validation patterns and quality assessment insights
    - Cross-project entities created for validation knowledge transfer
    - Learning patterns stored for future verify-spec workflows
  </validation_criteria>
</enhanced_mcp_integration>

<instructions>
  EXECUTE: Enhanced MCP learning integration with verify-spec parameters
  CONTEXT: Validation patterns and quality assessment analysis
  LEARNING: Focus on gap detection, assumption testing, and validation thoroughness
  STORAGE: Store patterns in Memory-Keeper + Memento dual architecture
  FALLBACK: Graceful degradation if individual MCP tools unavailable
</instructions>

</step>

<step number="6" name="validation_summary_and_phase5_prep">

### Step 6: Validation Summary and Phase 5 Preparation

<step_metadata>
  <action>consolidate validation results and prepare next phase</action>
  <purpose>provide clear validation outcome and task creation context</purpose>
  <memory_integration>prepare comprehensive context for task breakdown</memory_integration>
</step_metadata>

<validation_summary>
  <validation_results>
    - Completeness validation score and findings
    - Consistency validation results and issues resolved
    - Feasibility assessment and risk mitigation plans
    - Scope alignment confirmation and adjustments
    - Quality standards compliance and improvements
  </validation_results>
  
  <critical_issues>
    - High-priority issues requiring resolution
    - Medium-priority recommendations
    - Nice-to-have improvements
    - Risks requiring monitoring during implementation
  </critical_issues>
  
  <validation_approval>
    - Overall specification quality rating
    - Readiness for implementation (Go/No-Go)
    - Key strengths of the specification
    - Areas requiring attention during implementation
  </validation_approval>
</validation_summary>

<phase5_preparation>
  # Prepare comprehensive context for task creation
  CALL: mcp-memory-keeper-context_save
  PARAMETERS:
    - key: "phase5-task-creation-context"
    - value: "{task_context_summary}"
    - category: "task"
    - priority: "high"
  
  # Store validation completion milestone
  CALL: memento-mcp-add_observations
  PARAMETERS:
    - observations: [{
        "entityName": "{PROJECT_ENTITY_NAME}",
        "contents": [
          "Phase 4 Complete: Specification validated and approved",
          "Ready for Phase 5: Task breakdown and planning",
          "Validation Score: {overall_validation_score}",
          "Critical Issues: {critical_issues_count}",
          "Completion Date: {current_date()}"
        ]
      }]
  
  LOG: "✅ Phase 4 Complete: Specification validation successful"
  LOG: "📊 Validation Score: {overall_validation_score}"
  LOG: "➡️ Ready for Phase 5: Task Creation and Planning"
  LOG: "🎯 Next: Execute create-tasks-list.md with validated specification"
</phase5_preparation>

</step>

</process_flow>

## Phase 4 Output Requirements

<deliverables>
  <validation_report>
    - Completeness assessment with gap analysis
    - Consistency validation with issue resolution
    - Technical feasibility analysis with risk assessment
    - Scope alignment confirmation with adjustments
    - Quality standards compliance with improvement recommendations
  </validation_report>
  
  <validation_scorecard>
    - Overall validation score and rating
    - Individual category scores and analysis
    - Critical issues identification and prioritization
    - Implementation readiness assessment
  </validation_scorecard>
  
  <phase5_context>
    - Validated specification ready for task breakdown
    - Risk areas requiring special attention
    - Priority guidelines for task creation
    - Implementation constraints and considerations
  </phase5_context>
</deliverables>

<success_metrics>
  - [ ] Specification completeness validated and gaps addressed
  - [ ] Internal consistency confirmed and conflicts resolved
  - [ ] Technical feasibility assessed and risks identified
  - [ ] Scope alignment verified and adjustments made
  - [ ] Quality standards met and improvements implemented
  - [ ] Overall validation approval achieved
  - [ ] Phase 5 context prepared and stored
</success_metrics>

## Integration with Agent OS Framework

<framework_integration>
  - Validates specifications against Agent OS quality standards
  - Leverages MCP intelligence for comprehensive validation
  - Maintains continuity with previous phase contexts
  - Integrates with existing Agent OS template architecture
  - Prepares validated foundation for task creation phase
</framework_integration>

<next_phase>
  **Phase 5 Trigger**: Execute `create-tasks-list.md` with validated specification
  **Context Transfer**: All validation results available in Memory-Keeper session
  **Quality Assurance**: Validated specification ensures high-quality task breakdown
</next_phase>