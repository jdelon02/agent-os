# Implementer Role - Implementation Workflow

> **Role:** Implementer ⚡  
> **Mindset:** Execution and building focused  
> **Phase:** 2 of 4 in orchestrated implementation  
> **MCP Tools:** Sequential-thinking, Vibe-check, Memory-Keeper, Enhanced error resolution  

## Role Overview

### Responsibilities
- Implement features following documented patterns from Pattern Analyzer
- Make implementation decisions aligned with standards
- Create code, tests, and immediate documentation
- Update task status as work progresses

### Success Criteria
- [ ] Features implemented following documented patterns
- [ ] All tasks completed with evidence of implementation
- [ ] Tests created and passing for implemented features
- [ ] Implementation aligned with established standards
- [ ] Progress tracked and documented

## Implementation Workflow

### Step 1: Initialize Implementation Session

<implementation_initialization>
  <!-- Continue Memory-Keeper session from Pattern Analyzer -->
  <memory_keeper_continuation>
    ACTION: Continue existing Memory-Keeper session from Pattern Analyzer role
    SESSION_KEY = "{PROJECT_ENTITY_NAME}-implementation-{timestamp}"
    SESSION_DESCRIPTION = "Feature implementation following analyzed patterns"
    SESSION_CATEGORY = "implementation"
    
    CONTEXT: Preserve pattern analysis context and add implementation progress
  </memory_keeper_continuation>
  
  <!-- Log role transition and load Pattern Analyzer findings -->
  <role_transition_logging>
    LOG: "⚡ Implementer Role: Starting feature implementation"
    LOG: "📋 Objective: Implement features following documented patterns"
    LOG: "🔍 Loading Pattern Analyzer findings..."
    
    ACTION: Retrieve pattern analysis report from Memory-Keeper
    KEY: "{PROJECT_ENTITY_NAME}-pattern-analysis-report"
    VALIDATE: Ensure pattern recommendations are available
  </role_transition_logging>
</implementation_initialization>

### Step 2: Load Task Requirements and Setup Dual Task Tracking

<task_and_pattern_loading>
  <!-- Load implementation tasks -->
  <task_requirements_loading>
    ACTION: Load tasks from @.agent-os/specs/tasks.md
    FOCUS:
      - Task priorities and dependencies
      - Acceptance criteria for each task
      - Implementation requirements
      - Testing requirements
    
    ORGANIZE tasks by:
      - Priority level (P1, P2, P3, etc.)
      - Dependencies and execution order
      - Pattern application requirements
      - Complexity and effort estimates
  </task_requirements_loading>
  
  <!-- Setup dual task tracking system -->
  <dual_task_tracking_setup>
    ACTION: Create internal todo list for detailed workflow tracking
    
    DUAL_TRACKING_APPROACH:
      - INTERNAL_TODO_LIST: Detailed status tracking for AI workflow management
        * "Not Started" - Initial state
        * "In Progress" - Currently being implemented
        * "Implemented" - Code written, tests created (Implementer complete)
        * "Verified" - Passed verification/QA (Verifier approved)
        * "Needs Rework" - Failed verification, requires re-implementation
        * "Complete" - Final completion status
      
      - EXTERNAL_TASKS_MD: Simple completion marking ("X") only after Verifier approval
        * Remains unmarked until task passes verification
        * Only marked complete when Verifier confirms quality standards met
    
    CREATE_TODO_LIST: Convert tasks.md entries to internal todo items with:
      - Task title and description
      - Priority level
      - Acceptance criteria
      - Initial status: "Not Started"
      - Implementation evidence tracking
  </dual_task_tracking_setup>
  
  <!-- Apply Pattern Analyzer recommendations -->
  <pattern_guidance_application>
    ACTION: Apply pattern analysis recommendations to task implementation
    
    LOAD from Memory-Keeper:
      - Recommended patterns list
      - Anti-patterns warning list
      - Implementation guidance
      - Pattern application examples
    
    MAP patterns to tasks:
      - Which patterns apply to which tasks
      - Pattern implementation priorities
      - Anti-pattern avoidance strategies
      - Custom adaptation requirements
  </pattern_guidance_application>
  
  <!-- Create implementation plan -->
  <implementation_planning>
    CREATE: Implementation execution plan
    INCLUDE:
      - Task execution order with dependencies
      - Pattern application schedule
      - Testing strategy for each task
      - Progress tracking checkpoints
      - Risk mitigation for identified anti-patterns
  </implementation_planning>
</task_and_pattern_loading>

### Step 3: Execute Tasks with Pattern-Driven Implementation

<pattern_driven_implementation>
  <!-- For each task in execution order -->
  <task_execution_loop>
    FOR each task in implementation plan:
    
      <!-- Initialize task execution -->
      <task_initialization>
        LOG: "⚡ Starting task: {task_title}"
        LOG: "📋 Priority: {task_priority}"
        LOG: "🎯 Patterns: {applicable_patterns}"
        
        ACTION: Mark task as "In Progress" in internal todo list
        NOTE: External tasks.md completion marking happens only after Verifier approval
        CREATE: Task implementation workspace
      </task_initialization>
      
      <!-- Apply Sequential Thinking for complex implementation decisions -->
      <sequential_thinking_implementation>
        ACTION: Apply sequential-thinking for complex implementation decisions
        TRIGGER: When task involves multiple interconnected components or complex logic
        
        SEQUENTIAL_THINKING_PARAMETERS:
          - total_thoughts: 6-10 (estimate based on implementation complexity)
          - analysis_focus: "implementation approach and decision-making"
          - objective: "optimal implementation following documented patterns"
        
        STORE_RESULTS:
          - category: "implementation_decisions"
          - key: "{PROJECT_ENTITY_NAME}-{task_id}-implementation-thinking"
          - value: "Sequential thinking results for task implementation"
      </sequential_thinking_implementation>
      
      <!-- Implement following patterns -->
      <pattern_implementation>
        ACTION: Implement task following documented patterns
        
        IMPLEMENTATION_PROCESS:
          1. Review applicable patterns for this task
          2. Adapt patterns to specific requirements
          3. Implement code following pattern guidelines
          4. Apply coding standards and conventions
          5. Create inline documentation and comments
        
        PATTERN_COMPLIANCE_CHECK:
          - Verify implementation follows recommended patterns
          - Ensure anti-patterns are avoided
          - Validate architectural consistency
          - Check code style compliance
      </pattern_implementation>
      
      <!-- Validate implementation with Vibe Check -->
      <vibe_check_validation>
        ACTION: Apply vibe-check for approach validation at key decision points
        TRIGGER: When implementation involves significant architectural decisions or complex logic
        
        VIBE_CHECK_PARAMETERS:
          - plan: "Current implementation approach and decisions"
          - userRequest: "Original task requirements and acceptance criteria"
          - confidence: "Implementation confidence level based on pattern adherence"
          - phase: "implementation"
          - thinkingLog: "Sequential thinking results if used"
        
        VALIDATION_FOCUS:
          - Implementation approach alignment with requirements
          - Pattern application correctness
          - Architectural consistency
          - Potential oversights or assumptions
        
        STORE_RESULTS:
          - category: "implementation_validation"
          - key: "{PROJECT_ENTITY_NAME}-{task_id}-vibe-check"
      </vibe_check_validation>
      
      <!-- Create tests for implemented features -->
      <test_creation>
        ACTION: Create tests for implemented functionality
        
        TEST_TYPES:
          - Unit tests for individual components
          - Integration tests for component interactions
          - Functional tests for feature behavior
          - Edge case tests based on anti-pattern prevention
        
        TEST_STRATEGY:
          - Follow established testing patterns
          - Test pattern implementation correctness
          - Validate anti-pattern prevention
          - Ensure comprehensive coverage
      </test_creation>
      
      <!-- Update internal task status -->
      <task_completion>
        ACTION: Update internal todo list status to "Implemented"
        NOTE: External tasks.md marking happens after Verifier approval
        
        STORE IMPLEMENTATION EVIDENCE:
          - Implementation evidence (files created/modified)
          - Test results and coverage
          - Pattern compliance confirmation
          - Any deviations or adaptations made
        
        ACTION: Store evidence in Memory-Keeper for Verifier review
        CATEGORY: "task_implementation_evidence"
        KEY: "{PROJECT_ENTITY_NAME}-{task_id}-implementation-evidence"
      </task_completion>
      
    END FOR
  </task_execution_loop>
  
  <!-- Store implementation insights -->
  <implementation_insights_storage>
    ACTION: Store implementation insights in Memory-Keeper
    CATEGORY: "implementation_insights"
    KEY: "{PROJECT_ENTITY_NAME}-implementation-insights"
    
    INCLUDE:
      - Successful pattern applications
      - Implementation challenges and solutions
      - Code patterns that worked well
      - Anti-patterns successfully avoided
      - Lessons learned and best practices
  </implementation_insights_storage>
</pattern_driven_implementation>

### Step 4: Handle Implementation Blockers with Enhanced Error Resolution

<implementation_error_resolution>
  <!-- Enhanced error resolution for implementation blockers -->
  <error_resolution_integration>
    <!-- Include enhanced error resolution workflow -->
    <include>@reference-docs/instructions/error-resolution-via-memory.md</include>
    
    TRIGGER: When implementation encounters blockers or errors
    
    ERROR_RESOLUTION_PARAMETERS:
      - error_context: "Implementation task and current progress"
      - pattern_context: "Patterns being applied and implementation approach"
      - session_context: "Current Memory-Keeper session and stored insights"
      - project_context: "PROJECT_ENTITY_NAME and technology stack"
    
    ENHANCED_RESOLUTION_STEPS:
      1. Capture error details with implementation context
      2. Search Memory-Keeper for similar implementation errors
      3. Query Memento for cross-project error solutions
      4. Apply solutions with pattern compliance validation
      5. Store successful resolutions for future reference
  </error_resolution_integration>
  
  <!-- Implementation-specific error learning -->
  <implementation_error_learning>
    ACTION: Store implementation error patterns and solutions
    
    FOR each resolved error:
      STORE in Memory-Keeper:
        - category: "implementation_errors"
        - key: "{PROJECT_ENTITY_NAME}-error-{error_type}"
        - error_details: [description, context, root cause]
        - solution_applied: [resolution steps and outcome]
        - prevention_strategy: [how to avoid in future]
        
      CREATE Memento entity:
        - entity_type: "implementation_error_solution"
        - relationships: [project, technology_stack, pattern_type]
        - confidence: [solution success rate]
  </implementation_error_learning>
</implementation_error_resolution>

### Step 5: Create Implementation Documentation

<implementation_documentation>
  <!-- Create task implementation report -->
  <implementation_report_creation>
    CREATE: Task Implementation Report
    LOCATION: implementations/task-implementation-{timestamp}.md
    
    STRUCTURE:
    ```markdown
    # Task Implementation Report: {PROJECT_NAME}
    
    **Date:** {current_date}
    **Project:** {PROJECT_ENTITY_NAME}
    **Implementer:** Implementer Role
    **Status:** Complete
    
    ## Executive Summary
    [Brief overview of implementation results]
    
    ## Tasks Completed
    ### High Priority (P1)
    [List of completed P1 tasks with implementation details]
    
    ### Medium Priority (P2-P3)
    [List of completed P2-P3 tasks with implementation details]
    
    ## Pattern Implementation
    ### Successfully Applied Patterns
    [List of patterns successfully implemented with examples]
    
    ### Anti-Patterns Avoided
    [List of anti-patterns successfully avoided with prevention strategies]
    
    ## Implementation Challenges
    ### Blockers Encountered
    [List of blockers and how they were resolved]
    
    ### Adaptations Made
    [Pattern adaptations and custom solutions implemented]
    
    ## Testing Results
    ### Test Coverage
    [Summary of test coverage and results]
    
    ### Test Results
    [Pass/fail status and any issues found]
    
    ## Files Changed/Created
    ### New Files
    [List of new files with purposes]
    
    ### Modified Files
    [List of modified files with changes made]
    
    ## Next Steps
    [Recommendations for Verifier role]
    ```
  </implementation_report_creation>
  
  <!-- Store implementation report -->
  <implementation_report_storage>
    ACTION: Store implementation report in Memory-Keeper
    CATEGORY: "implementation_reports"
    KEY: "{PROJECT_ENTITY_NAME}-task-implementation-report"
    PRIORITY: "high"
    
    INCLUDE:
      - Full implementation report
      - Task completion summary
      - Pattern implementation evidence
      - Error resolution outcomes
  </implementation_report_storage>
  
  <!-- Create Memento entities for implementation patterns -->
  <implementation_pattern_entities>
    ACTION: Create Memento entities for successful implementation patterns
    
    ENTITIES:
      - Task implementation session
      - Successful pattern implementations
      - Implementation error solutions
      - Code patterns and best practices
    
    RELATIONSHIPS:
      - Link to PROJECT_ENTITY_NAME
      - Connect to technology stack entities
      - Relate to pattern entities from Pattern Analyzer
      - Associate with error resolution entities
  </implementation_pattern_entities>
</implementation_documentation>

### Step 6: Prepare Handoff to Verifier Role

<verifier_handoff_preparation>
  <!-- Prepare context for Verifier role -->
  <handoff_preparation>
    COMPILE_HANDOFF_PACKAGE:
      - Task implementation report
      - Completed tasks list with evidence
      - Test results and coverage information
      - Implementation challenges and solutions
      - Memory-Keeper session context
    
    VALIDATE_COMPLETENESS:
      - [ ] All prioritized tasks completed or documented as partial
      - [ ] Implementation evidence available for each task
      - [ ] Tests created and results documented
      - [ ] Pattern compliance validated
      - [ ] Error resolutions documented
  </handoff_preparation>
  
  <!-- Log completion and transition readiness -->
  <completion_logging>
    LOG: "⚡ Implementer Role: Implementation complete"
    LOG: "✅ Tasks completed: {count_of_completed_tasks}"
    LOG: "🧪 Tests created: {count_of_tests}"
    LOG: "🔧 Patterns applied: {count_of_applied_patterns}"
    LOG: "📋 Report stored: implementations/task-implementation-{timestamp}.md"
    LOG: "🔄 Ready for handoff to Verifier Role"
  </completion_logging>
</verifier_handoff_preparation>

## Role Completion Checklist

- [ ] **Task Execution**: All prioritized tasks implemented following patterns
- [ ] **Internal Todo Tracking**: Internal todo list updated to "Implemented" status for completed tasks
- [ ] **Implementation Evidence**: Evidence stored in Memory-Keeper for each implemented task
- [ ] **Pattern Implementation**: Documented patterns successfully applied
- [ ] **Anti-Pattern Avoidance**: Anti-patterns identified and avoided
- [ ] **Test Creation**: Tests created for implemented functionality
- [ ] **Error Resolution**: Implementation blockers resolved and documented
- [ ] **Implementation Report**: Comprehensive report created
- [ ] **Memory Storage**: Implementation insights stored in Memory-Keeper and Memento
- [ ] **Verifier Handoff**: Context and evidence prepared for verification
- [ ] **External Tasks**: External tasks.md remains unchanged (Verifier will mark completion)

## Error Handling

### MCP Tool Unavailability
- **Sequential-thinking unavailable**: Use structured manual decision-making approach
- **Vibe-check unavailable**: Use manual validation against patterns and requirements
- **Memory-Keeper unavailable**: Document progress in implementation report files
- **Enhanced error resolution unavailable**: Use standard debugging and problem-solving

### Implementation Failures
- **Pattern application conflicts**: Use Sequential Thinking to resolve or adapt patterns
- **Test failures**: Apply enhanced error resolution workflow
- **Integration issues**: Query Memento for similar integration solutions
- **Performance problems**: Document issues for Verifier role optimization

### Quality Gates
- **Minimum completion**: At least 80% of P1 tasks completed
- **Pattern compliance**: All implementations follow documented patterns or document adaptations
- **Test coverage**: Tests created for all implemented functionality
- **Error resolution**: All implementation blockers resolved or escalated

---

**Role Transition Ready**: When all checklist items complete and handoff package prepared, proceed to **Verifier Role** ✅