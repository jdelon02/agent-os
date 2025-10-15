# Verifier Role - Implementation Workflow

> **Role:** Verifier ✅  
> **Mindset:** Quality assurance and critical evaluation  
> **Phase:** 3 of 4 in orchestrated implementation  
> **MCP Tools:** Enhanced error resolution, Error-resolution-via-memory, Vibe-learn, Sequential-thinking  

## Role Overview

### Responsibilities
- Run comprehensive test suites and validate all implementations
- Verify standards compliance and pattern adherence
- Check task completion against acceptance criteria
- Identify issues, gaps, and potential improvements

### Success Criteria
- [ ] All tests passing with comprehensive coverage
- [ ] Standards compliance verified and documented
- [ ] Task completion validated against acceptance criteria
- [ ] Issues identified and resolution guidance provided
- [ ] Quality assessment completed and documented

## Verification Workflow

### Step 1: Initialize Verification Session

<verification_initialization>
  <!-- Continue Memory-Keeper session from Implementer -->
  <memory_keeper_continuation>
    ACTION: Continue existing Memory-Keeper session from Implementer role
    SESSION_KEY = "{PROJECT_ENTITY_NAME}-verification-{timestamp}"
    SESSION_DESCRIPTION = "Quality verification and standards compliance validation"
    SESSION_CATEGORY = "verification"
    
    CONTEXT: Preserve implementation context and add verification findings
  </memory_keeper_continuation>
  
  <!-- Log role transition and load Implementer findings -->
  <role_transition_logging>
    LOG: "✅ Verifier Role: Starting implementation verification"
    LOG: "📋 Objective: Validate implementation quality and standards compliance"
    LOG: "⚡ Loading Implementer findings..."
    
    ACTION: Retrieve implementation report from Memory-Keeper
    KEY: "{PROJECT_ENTITY_NAME}-task-implementation-report"
    VALIDATE: Ensure implementation evidence is available
  </role_transition_logging>
</verification_initialization>

### Step 2: Load Implementation Evidence and Continue Task Tracking

<implementation_evidence_loading>
  <!-- Load implementation artifacts -->
  <implementation_artifacts_loading>
    ACTION: Load implementation evidence from Implementer role
    
    LOAD from Memory-Keeper:
      - Task implementation report
      - Task implementation evidence for each completed task
      - Test results and coverage
      - Pattern implementation evidence
      - Error resolution outcomes
    
    LOAD from file system:
      - Created/modified code files
      - Test files and test results
      - Documentation updates
      - Configuration changes
  </implementation_artifacts_loading>
  
  <!-- Load internal todo list from Implementer -->
  <internal_todo_tracking_continuation>
    ACTION: Load internal todo list from Implementer role
    
    DUAL_TRACKING_STATUS_CHECK:
      - INTERNAL_TODO_LIST: Tasks marked as "Implemented" by Implementer
      - EXTERNAL_TASKS_MD: Still unmarked, awaiting verification approval
    
    PREPARE_FOR_VERIFICATION:
      - Review tasks currently in "Implemented" status
      - Prepare to update statuses based on verification results
      - Track verification evidence for each task
  </internal_todo_tracking_continuation>
  
  <!-- Load verification requirements -->
  <verification_requirements_loading>
    ACTION: Load verification requirements and acceptance criteria
    
    SOURCES:
      - Original task acceptance criteria from tasks.md
      - Pattern compliance requirements from Pattern Analyzer
      - Standards requirements from user preferences
      - Quality gates from project configuration
    
    CREATE verification checklist:
      - Functional requirements validation
      - Non-functional requirements verification
      - Pattern compliance validation
      - Standards adherence verification
      - Test coverage and quality assessment
  </verification_requirements_loading>
</implementation_evidence_loading>

### Step 3: Execute Comprehensive Test Suite

<comprehensive_testing>
  <!-- Run all test suites -->
  <test_suite_execution>
    ACTION: Execute all available test suites
    
    TEST_CATEGORIES:
      - Unit tests (individual component testing)
      - Integration tests (component interaction testing)
      - Functional tests (feature behavior testing)
      - Regression tests (existing functionality protection)
      - Performance tests (if applicable)
      - Security tests (if applicable)
    
    EXECUTION_PROCESS:
      1. Run test suites in appropriate order
      2. Capture all test results and outputs
      3. Document any test failures with details
      4. Measure test coverage and completeness
      5. Identify gaps in test coverage
  </test_suite_execution>
  
  <!-- Analyze test results with Enhanced Error Resolution -->
  <test_failure_analysis>
    ACTION: Apply enhanced error resolution for any test failures
    TRIGGER: When tests fail or coverage is insufficient
    
    <!-- Include enhanced error resolution workflow -->
    <include>@reference-docs/instructions/error-resolution-via-memory.md</include>
    
    ERROR_RESOLUTION_PARAMETERS:
      - error_context: "Test failures and coverage gaps"
      - implementation_context: "Current implementation and patterns used"
      - verification_context: "Quality requirements and acceptance criteria"
      - session_context: "Memory-Keeper session with implementation history"
    
    RESOLUTION_FOCUS:
      - Root cause analysis of test failures
      - Pattern compliance validation
      - Coverage gap identification and remediation
      - Quality improvement recommendations
  </test_failure_analysis>
  
  <!-- Store test results and analysis -->
  <test_results_storage>
    ACTION: Store comprehensive test results in Memory-Keeper
    CATEGORY: "verification_results"
    KEY: "{PROJECT_ENTITY_NAME}-test-results"
    
    INCLUDE:
      - Test suite execution results
      - Coverage measurements and gaps
      - Failure analysis and root causes
      - Quality assessment metrics
      - Improvement recommendations
  </test_results_storage>
</comprehensive_testing>

### Step 4: Verify Standards Compliance and Pattern Adherence

<standards_compliance_verification>
  <!-- Verify coding standards compliance -->
  <coding_standards_verification>
    ACTION: Verify implementation against coding standards
    
    VERIFICATION_AREAS:
      - Code style and formatting consistency
      - Naming conventions compliance
      - Documentation standards adherence
      - Error handling pattern compliance
      - Security best practices implementation
    
    STANDARDS_SOURCES:
      - User preference files and standards
      - Technology-specific best practices
      - Pattern guidelines from Pattern Analyzer
      - Industry standards and conventions
  </coding_standards_verification>
  
  <!-- Verify pattern implementation correctness -->
  <pattern_adherence_verification>
    ACTION: Verify pattern implementation against Pattern Analyzer recommendations
    
    VERIFICATION_PROCESS:
      1. Compare implementation with recommended patterns
      2. Validate anti-pattern avoidance strategies
      3. Check pattern adaptation appropriateness
      4. Assess architectural consistency
      5. Verify cross-project pattern compatibility
    
    PATTERN_COMPLIANCE_CHECK:
      - Pattern implementation accuracy
      - Anti-pattern prevention effectiveness
      - Architectural consistency maintenance
      - Cross-project compatibility validation
  </pattern_adherence_verification>
  
  <!-- Use Sequential Thinking for complex compliance issues -->
  <sequential_thinking_compliance>
    ACTION: Apply sequential-thinking for complex compliance analysis
    TRIGGER: When multiple interconnected compliance issues are identified
    
    SEQUENTIAL_THINKING_PARAMETERS:
      - total_thoughts: 6-8
      - analysis_focus: "standards compliance and pattern adherence issues"
      - objective: "comprehensive compliance assessment and resolution strategies"
    
    STORE_RESULTS:
      - category: "compliance_analysis"
      - key: "{PROJECT_ENTITY_NAME}-compliance-analysis"
  </sequential_thinking_compliance>
</standards_compliance_verification>

### Step 5: Validate Task Completion Against Acceptance Criteria

<task_completion_validation>
  <!-- Validate each completed task -->
  <task_by_task_validation>
    FOR each completed task:
    
      <!-- Load task acceptance criteria -->
      <acceptance_criteria_loading>
        ACTION: Load acceptance criteria for current task
        SOURCE: Original task definition in tasks.md
        
        CRITERIA_TYPES:
          - Functional requirements (what it should do)
          - Non-functional requirements (how well it should do it)
          - Quality requirements (standards and patterns)
          - Integration requirements (compatibility and interfaces)
      </acceptance_criteria_loading>
      
      <!-- Validate implementation against criteria -->
      <criteria_validation>
        ACTION: Validate implementation evidence against acceptance criteria
        
        VALIDATION_PROCESS:
          1. Check functional requirement fulfillment
          2. Verify non-functional requirement satisfaction
          3. Validate quality standards compliance
          4. Confirm integration requirement satisfaction
          5. Document any gaps or deviations
        
        EVIDENCE_SOURCES:
          - Implementation code and tests
          - Test execution results
          - Documentation and comments
          - Integration test outcomes
      </criteria_validation>
      
      <!-- Document validation results and update task status -->
      <validation_documentation_and_status_update>
        DOCUMENT for each task:
          - Acceptance criteria met/not met
          - Evidence supporting validation
          - Any gaps or issues identified
          - Quality assessment and scoring
          - Recommendations for improvement
        
        UPDATE_TASK_STATUS:
          IF all acceptance criteria met AND quality standards satisfied:
            - Update internal todo list: status = "Verified"
            - Mark external tasks.md: Add "X" or completion marker
            - Log: "✅ Task verified and marked complete: {task_title}"
          ELSE:
            - Update internal todo list: status = "Needs Rework"
            - Add verification feedback to external tasks.md:
              * Add status comment below task with verification issues
              * Include specific problems found and required actions
              * Add verification date and next steps
            - Log: "⚠️ Task requires rework: {task_title} - {issues_summary}"
            - Store rework requirements in Memory-Keeper
          
          TASK_FEEDBACK_FORMAT:
            ```markdown
            - [ ] {task_title}
              **Verification Status:** NEEDS REWORK (Verified: {date})
              **Issues Found:** {specific_issues_list}
              **Required Actions:** {specific_rework_requirements}
              **Next Step:** Return to Implementer for rework
            ```
      </validation_documentation_and_status_update>
    
    END FOR
  </task_by_task_validation>
  
  <!-- Update tasks.md with verification feedback -->
  <tasks_md_feedback_update>
    ACTION: Update external tasks.md with verification status and feedback
    
    FOR each task requiring rework:
      LOCATE task in .agent-os/specs/tasks.md
      ADD verification feedback below task entry:
      
      FORMAT:
      ```markdown
      - [ ] {Original Task Title}
        **Verification Status:** NEEDS REWORK (Verified: {current_date})
        **Issues Found:** {bullet_list_of_specific_issues}
        **Required Actions:** {bullet_list_of_required_fixes}
        **Next Step:** Return to Implementer for rework
      ```
      
    FOR each task that passed verification:
      LOCATE task in .agent-os/specs/tasks.md
      MARK checkbox: [ ] → [x]
      ADD verification confirmation:
      ```markdown
      - [x] {Original Task Title}
        **Verification Status:** VERIFIED COMPLETE (Verified: {current_date})
      ```
  </tasks_md_feedback_update>
  
  <!-- Create task completion summary with dual tracking status -->
  <completion_summary>
    CREATE: Task completion validation summary
    INCLUDE:
      - Overall completion percentage (external tasks.md)
      - Internal todo list status distribution:
        * "Verified" (passed verification)
        * "Needs Rework" (failed verification)
      - Acceptance criteria satisfaction rate
      - Quality assessment summary
      - Critical issues requiring attention
      - Rework requirements for failed tasks
      - Recommendations for next steps
    
    DUAL_TRACKING_SUMMARY:
      - External tasks.md: {verified_count} of {total_count} marked complete
      - Internal todos: {verified_count} Verified, {rework_count} Needs Rework
      - tasks.md feedback: {rework_count} tasks updated with verification issues
  </completion_summary>
</task_completion_validation>

### Step 6: Identify Issues, Gaps, and Improvement Opportunities

<issue_identification>
  <!-- Systematic issue identification -->
  <systematic_issue_analysis>
    ACTION: Systematically identify all issues and improvement opportunities
    
    ISSUE_CATEGORIES:
      - Functional defects (incorrect behavior)
      - Quality issues (poor implementation quality)
      - Performance problems (efficiency concerns)
      - Security vulnerabilities (safety concerns)
      - Maintainability issues (future development concerns)
      - Documentation gaps (knowledge transfer concerns)
    
    ANALYSIS_SOURCES:
      - Test failure analysis results
      - Standards compliance verification
      - Pattern adherence assessment
      - Code quality evaluation
      - Integration testing outcomes
  </systematic_issue_analysis>
  
  <!-- Prioritize issues by severity and impact -->
  <issue_prioritization>
    ACTION: Prioritize identified issues by severity and impact
    
    PRIORITY_LEVELS:
      - CRITICAL: Prevents functionality or causes major failures
      - HIGH: Significant impact on quality or user experience
      - MEDIUM: Moderate impact on maintainability or performance
      - LOW: Minor improvements or cosmetic issues
    
    PRIORITIZATION_CRITERIA:
      - User impact severity
      - Security implications
      - Maintenance difficulty
      - Performance impact
      - Standards compliance importance
  </issue_prioritization>
  
  <!-- Generate improvement recommendations -->
  <improvement_recommendations>
    ACTION: Generate specific improvement recommendations
    
    FOR each identified issue:
      RECOMMEND:
        - Specific remediation steps
        - Priority level and timeline
        - Resources or expertise required
        - Prevention strategies for future
        - Pattern or standard improvements
    
    RECOMMENDATION_TYPES:
      - Immediate fixes (critical issues)
      - Quality improvements (refactoring opportunities)
      - Performance optimizations (efficiency gains)
      - Security enhancements (vulnerability mitigation)
      - Documentation improvements (knowledge gaps)
  </improvement_recommendations>
</issue_identification>

### Step 7: Apply Vibe-Learn for Verification Pattern Capture

<vibe_learn_integration>
  <!-- Use Vibe-Learn to capture verification patterns -->
  <verification_pattern_learning>
    ACTION: Apply vibe-learn to capture effective verification patterns
    
    VIBE_LEARN_PARAMETERS:
      - mistake: [Common verification mistakes or oversights identified]
      - category: [Verification category - testing, compliance, quality, etc.]
      - solution: [Effective verification approaches and solutions discovered]
      - sessionId: [Current Memory-Keeper session]
    
    LEARNING_FOCUS:
      - Effective testing strategies discovered
      - Successful compliance verification approaches
      - Useful quality assessment techniques
      - Efficient issue identification methods
      - Valuable improvement recommendation patterns
  </verification_pattern_learning>
  
  <!-- Store verification insights -->
  <verification_insights_storage>
    ACTION: Store verification insights in Memory-Keeper
    CATEGORY: "verification_insights"
    KEY: "{PROJECT_ENTITY_NAME}-verification-insights"
    
    INCLUDE:
      - Effective verification techniques used
      - Common verification pitfalls avoided
      - Quality assessment best practices
      - Issue identification patterns
      - Successful improvement strategies
  </verification_insights_storage>
</vibe_learn_integration>

### Step 8: Create Comprehensive Verification Report

<verification_report_creation>
  <!-- Compile comprehensive verification report -->
  <report_compilation>
    CREATE: Implementation Verification Report
    LOCATION: implementations/verification-report-{timestamp}.md
    
    STRUCTURE:
    ```markdown
    # Implementation Verification Report: {PROJECT_NAME}
    
    **Date:** {current_date}
    **Project:** {PROJECT_ENTITY_NAME}
    **Verifier:** Verifier Role
    **Status:** Complete
    
    ## Executive Summary
    [Overall verification results and quality assessment]
    
    ## Test Suite Results
    ### Test Coverage
    - Unit Tests: {coverage_percentage}% ({passed}/{total})
    - Integration Tests: {coverage_percentage}% ({passed}/{total})
    - Functional Tests: {coverage_percentage}% ({passed}/{total})
    
    ### Test Results Summary
    [Overall pass/fail status and critical findings]
    
    ## Standards Compliance
    ### Coding Standards
    [Compliance assessment with specific findings]
    
    ### Pattern Adherence
    [Pattern implementation assessment and compliance]
    
    ## Task Completion Validation
    ### Verified and Complete Tasks
    [List of tasks marked "X" in tasks.md - passed verification]
    
    ### Tasks Requiring Rework
    [List of tasks marked "Needs Rework" in internal todos - failed verification]
    
    ### Task Status Summary
    - External tasks.md: {verified_count} of {total_count} marked complete
    - Internal tracking: {verified_count} Verified, {rework_count} Needs Rework
    - Overall completion rate: {completion_percentage}%
    
    ## Issues Identified
    ### Critical Issues (Immediate Action Required)
    [List of critical issues requiring immediate attention]
    
    ### High Priority Issues
    [List of high priority issues and recommended timeline]
    
    ### Medium/Low Priority Improvements
    [List of improvement opportunities and enhancement suggestions]
    
    ## Quality Assessment
    ### Overall Quality Score
    [Quality metrics and assessment summary]
    
    ### Quality Recommendations
    [Specific recommendations for quality improvement]
    
    ## Next Steps
    ### For Documenter Role
    [Recommendations for documentation and knowledge capture]
    
    ### For Future Development
    [Recommendations for ongoing development and maintenance]
    
    ## Verification Insights
    [Lessons learned and verification pattern discoveries]
    ```
  </report_compilation>
  
  <!-- Store verification report -->
  <verification_report_storage>
    ACTION: Store verification report in Memory-Keeper
    CATEGORY: "verification_reports"
    KEY: "{PROJECT_ENTITY_NAME}-verification-report"
    PRIORITY: "high"
    
    INCLUDE:
      - Complete verification report
      - Quality assessment summary
      - Issue prioritization matrix
      - Improvement recommendations
      - Verification insights and patterns
  </verification_report_storage>
  
  <!-- Create Memento entities for verification patterns -->
  <verification_pattern_entities>
    ACTION: Create Memento entities for verification patterns and insights
    
    ENTITIES:
      - Verification session and methodology
      - Quality assessment patterns
      - Issue identification techniques
      - Improvement recommendation strategies
    
    RELATIONSHIPS:
      - Link to PROJECT_ENTITY_NAME
      - Connect to technology stack entities
      - Relate to implementation patterns
      - Associate with quality metrics
  </verification_pattern_entities>
</verification_report_creation>

### Step 9: Prepare Handoff to Documenter Role

<documenter_handoff_preparation>
  <!-- Prepare context for Documenter role -->
  <handoff_preparation>
    COMPILE_HANDOFF_PACKAGE:
      - Implementation verification report
      - Quality assessment and metrics
      - Issue identification and prioritization
      - Improvement recommendations
      - Verification insights and patterns
      - Memory-Keeper session context
    
    VALIDATE_COMPLETENESS:
      - [ ] All tests executed and results documented
      - [ ] Standards compliance verified and documented
      - [ ] Task completion validated against acceptance criteria
      - [ ] Issues identified, prioritized, and recommendations provided
      - [ ] Quality assessment completed with metrics
      - [ ] Verification patterns captured for future use
  </handoff_preparation>
  
  <!-- Log completion and transition readiness -->
  <completion_logging>
    LOG: "✅ Verifier Role: Verification complete"
    LOG: "🧪 Tests executed: {total_tests} ({passed_tests} passed, {failed_tests} failed)"
    LOG: "📊 Quality score: {overall_quality_score}"
    LOG: "🔍 Issues identified: {critical_issues} critical, {high_issues} high priority"
    LOG: "📋 Report stored: implementations/verification-report-{timestamp}.md"
    LOG: "🔄 Ready for handoff to Documenter Role"
  </completion_logging>
</documenter_handoff_preparation>

## Role Completion Checklist

- [ ] **Test Suite Execution**: All available tests executed with results documented
- [ ] **Standards Compliance**: Coding standards and pattern adherence verified
- [ ] **Task Validation**: All tasks validated against acceptance criteria
- [ ] **Internal Todo Updates**: Internal todo list updated with "Verified" or "Needs Rework" status
- [ ] **External Task Completion**: External tasks.md marked with "X" for verified tasks only
- [ ] **Verification Feedback**: External tasks.md updated with specific verification issues and rework requirements for failed tasks
- [ ] **Issue Identification**: Issues identified, prioritized, and documented
- [ ] **Quality Assessment**: Overall quality assessed with metrics and recommendations
- [ ] **Rework Requirements**: Clear requirements documented for tasks needing rework
- [ ] **Error Resolution**: Test failures and quality issues analyzed and resolved
- [ ] **Verification Report**: Comprehensive report created with all findings
- [ ] **Pattern Learning**: Verification patterns captured via Vibe-Learn
- [ ] **Memory Storage**: All verification insights stored in Memory-Keeper and Memento
- [ ] **Documenter Handoff**: Context and findings prepared for documentation

## Error Handling

### MCP Tool Unavailability
- **Enhanced error resolution unavailable**: Use standard debugging and analysis techniques
- **Vibe-learn unavailable**: Document patterns manually in Memory-Keeper
- **Sequential-thinking unavailable**: Use structured manual analysis for complex compliance issues
- **Memory-Keeper unavailable**: Document findings in verification report files

### Verification Failures
- **Test suite failures**: Apply error resolution workflow and document issues
- **Standards compliance failures**: Document deviations with justification and remediation plans
- **Pattern adherence issues**: Provide specific recommendations for pattern alignment
- **Quality gate failures**: Prioritize issues and provide clear improvement roadmap

### Quality Gates
- **Minimum test coverage**: At least 80% coverage for critical functionality
- **Critical issue resolution**: All critical issues identified and resolution guidance provided
- **Standards compliance**: Major standards violations identified and documented
- **Task completion validation**: All P1 tasks validated against acceptance criteria

---

**Role Transition Ready**: When all checklist items complete and handoff package prepared, proceed to **Documenter Role** 📋