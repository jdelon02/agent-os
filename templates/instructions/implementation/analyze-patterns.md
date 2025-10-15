# Pattern Analyzer Role - Implementation Workflow

> **Role:** Pattern Analyzer 🔍  
> **Mindset:** Research and discovery focused  
> **Phase:** 1 of 4 in orchestrated implementation  
> **MCP Tools:** Memento queries, Sequential-thinking, Memory-Keeper storage  

## Role Overview

### Responsibilities
- Search for existing patterns in codebase and standards
- Query Memento for cross-project implementation patterns
- Analyze spec requirements for pattern applicability
- Document patterns to follow and anti-patterns to avoid

### Success Criteria
- [ ] Documented applicable patterns from existing codebase
- [ ] Retrieved cross-project patterns from Memento
- [ ] Identified anti-patterns to avoid
- [ ] Created pattern analysis report for Implementer role

## Pattern Analysis Workflow

### Step 1: Initialize Pattern Analysis Session

<pattern_analysis_initialization>
  <!-- Initialize Memory-Keeper session for pattern analysis -->
  <memory_keeper_session>
    SESSION_KEY = "{PROJECT_ENTITY_NAME}-pattern-analysis-{timestamp}"
    SESSION_DESCRIPTION = "Pattern analysis for implementation tasks"
    SESSION_CATEGORY = "pattern_analysis"
    
    ACTION: Initialize or continue Memory-Keeper session
    CONTEXT: Store pattern discoveries and analysis insights
  </memory_keeper_session>
  
  <!-- Log role transition and objectives -->
  <role_logging>
    LOG: "🔍 Pattern Analyzer Role: Starting pattern discovery and analysis"
    LOG: "📋 Objective: Find applicable patterns for implementation tasks"
    LOG: "🎯 Success criteria: Document patterns, retrieve cross-project knowledge, identify anti-patterns"
  </role_logging>
</pattern_analysis_initialization>

### Step 2: Analyze Spec Requirements for Pattern Applicability

<spec_pattern_analysis>
  <!-- Review spec.md for pattern indicators -->
  <spec_analysis>
    ACTION: Examine @.agent-os/specs/spec.md for pattern requirements
    FOCUS: 
      - Technical implementation patterns mentioned
      - Architectural approaches specified
      - Technology stack implications
      - Integration requirements
    
    ANALYSIS POINTS:
      - What patterns are explicitly mentioned in the spec?
      - What architectural approaches are implied?
      - What technology-specific patterns are needed?
      - What integration patterns are required?
  </spec_analysis>
  
  <!-- Use Sequential Thinking for complex pattern analysis -->
  <sequential_thinking_integration>
    <!-- Use Sequential Thinking MCP tool for complex pattern analysis -->
    ACTION: Apply sequential-thinking for systematic pattern requirement analysis
    TRIGGER: When spec requirements involve multiple interconnected patterns
    
    SEQUENTIAL_THINKING_PARAMETERS:
      - total_thoughts: 5-8 (estimate based on pattern complexity)
      - analysis_focus: "pattern requirements and relationships"
      - objective: "identify all applicable patterns from spec analysis"
    
    <!-- Store sequential thinking results -->
    MEMORY_STORAGE:
      - category: "pattern_analysis"
      - key: "{PROJECT_ENTITY_NAME}-spec-pattern-analysis"
      - value: "Sequential thinking results for spec pattern requirements"
  </sequential_thinking_integration>
  
  <!-- Document findings -->
  <findings_documentation>
    CREATE: Pattern requirements analysis
    INCLUDE:
      - Explicit patterns mentioned in spec
      - Implied architectural patterns
      - Technology-specific pattern needs
      - Integration pattern requirements
      - Pattern complexity assessment
  </findings_documentation>
</spec_pattern_analysis>

### Step 3: Search Existing Codebase for Applicable Patterns

<codebase_pattern_search>
  <!-- Search for established patterns in current codebase -->
  <existing_pattern_search>
    ACTION: Search codebase for established implementation patterns
    TARGETS:
      - Similar feature implementations
      - Established architectural patterns
      - Coding conventions and styles
      - Test patterns and strategies
      - Error handling approaches
    
    SEARCH_LOCATIONS:
      - Source code directories for similar features
      - Test directories for testing patterns  
      - Configuration files for setup patterns
      - Documentation for architectural decisions
      - Standards files for conventions
  </existing_pattern_search>
  
  <!-- Document discovered patterns -->
  <pattern_documentation>
    FOR each discovered pattern:
      DOCUMENT:
        - Pattern type and location
        - Pattern purpose and benefits
        - How it applies to current implementation
        - Code examples and references
        - Usage guidelines and constraints
        
    CATEGORIES:
      - Architectural patterns (MVC, service layer, etc.)
      - Code patterns (factory, observer, etc.)
      - Testing patterns (mocks, fixtures, etc.)
      - Error handling patterns
      - Configuration patterns
  </pattern_documentation>
  
  <!-- Store patterns in Memory-Keeper -->
  <memory_storage>
    ACTION: Store discovered patterns in Memory-Keeper
    CATEGORY: "discovered_patterns"
    KEY: "{PROJECT_ENTITY_NAME}-codebase-patterns"
    
    STRUCTURE:
      - pattern_name: [descriptive name]
      - pattern_type: [architectural/code/testing/etc.]
      - location: [file paths or directories]
      - applicability: [how it applies to current tasks]
      - examples: [code examples or references]
      - constraints: [limitations or considerations]
  </memory_storage>
</codebase_pattern_search>

### Step 4: Query Memento for Cross-Project Implementation Patterns

<cross_project_pattern_query>
  <!-- Query Memento for similar implementation patterns -->
  <memento_pattern_query>
    ACTION: Query Memento knowledge graph for cross-project patterns
    
    <!-- Search for similar project patterns -->
    MEMENTO_QUERIES:
      1. Search for projects with similar technology stacks
      2. Find entities related to current implementation domain
      3. Look for successful implementation patterns
      4. Query for architectural decisions in similar contexts
    
    QUERY_PARAMETERS:
      - entity_types: ["project", "implementation", "architecture", "pattern"]
      - search_terms: [technology stack keywords, domain keywords]
      - relationship_types: ["implements", "uses", "follows", "succeeded_with"]
      - confidence_threshold: 0.7
  </memento_pattern_query>
  
  <!-- Analyze retrieved patterns for applicability -->
  <pattern_applicability_analysis>
    FOR each retrieved pattern:
      ANALYZE:
        - Pattern relevance to current implementation
        - Success rate and confidence scores
        - Adaptation requirements
        - Technology stack compatibility
        - Risk factors and considerations
        
    PRIORITIZE by:
      - Relevance to current requirements
      - Historical success rate
      - Implementation complexity
      - Team familiarity
  </pattern_applicability_analysis>
  
  <!-- Store cross-project patterns -->
  <cross_project_storage>
    ACTION: Store applicable cross-project patterns in Memory-Keeper
    CATEGORY: "cross_project_patterns"
    KEY: "{PROJECT_ENTITY_NAME}-memento-patterns"
    
    INCLUDE:
      - Source project information
      - Pattern description and purpose
      - Success metrics and confidence scores
      - Adaptation notes for current context
      - Implementation recommendations
  </cross_project_storage>
</cross_project_pattern_query>

### Step 5: Identify Anti-Patterns and Risks

<anti_pattern_identification>
  <!-- Search for anti-patterns to avoid -->
  <anti_pattern_search>
    ACTION: Identify anti-patterns and implementation risks
    
    SOURCES:
      - Known anti-patterns in technology stack
      - Failed approaches in similar projects (via Memento)
      - Standards and best practices violations
      - Common mistakes in current domain
    
    CATEGORIES:
      - Architectural anti-patterns
      - Code anti-patterns
      - Performance anti-patterns
      - Security anti-patterns
      - Maintenance anti-patterns
  </anti_pattern_search>
  
  <!-- Use Sequential Thinking for complex anti-pattern analysis -->
  <sequential_thinking_anti_patterns>
    ACTION: Apply sequential-thinking for comprehensive anti-pattern analysis
    TRIGGER: When multiple interconnected risks are identified
    
    SEQUENTIAL_THINKING_PARAMETERS:
      - total_thoughts: 4-6
      - analysis_focus: "anti-pattern identification and mitigation"
      - objective: "comprehensive risk assessment and prevention strategies"
    
    STORE_RESULTS:
      - category: "risk_analysis"
      - key: "{PROJECT_ENTITY_NAME}-anti-pattern-analysis"
  </sequential_thinking_anti_patterns>
  
  <!-- Document anti-patterns and mitigation strategies -->
  <anti_pattern_documentation>
    FOR each identified anti-pattern:
      DOCUMENT:
        - Anti-pattern description and why to avoid
        - Common triggers or conditions
        - Historical examples and consequences
        - Prevention strategies and alternatives
        - Detection methods and warning signs
  </anti_pattern_documentation>
</anti_pattern_identification>

### Step 6: Create Pattern Analysis Report

<pattern_analysis_report>
  <!-- Compile comprehensive pattern analysis -->
  <report_compilation>
    CREATE: Pattern Analysis Report
    LOCATION: implementations/pattern-analysis-{timestamp}.md
    
    STRUCTURE:
    ```markdown
    # Pattern Analysis Report: {PROJECT_NAME}
    
    **Date:** {current_date}
    **Project:** {PROJECT_ENTITY_NAME}
    **Analyzer:** Pattern Analyzer Role
    **Status:** Complete
    
    ## Executive Summary
    [Brief overview of pattern analysis findings]
    
    ## Recommended Patterns
    ### From Existing Codebase
    [List of applicable patterns found in current codebase]
    
    ### From Cross-Project Knowledge
    [List of applicable patterns from Memento queries]
    
    ## Anti-Patterns to Avoid
    [List of identified anti-patterns and risks]
    
    ## Implementation Recommendations
    [Prioritized recommendations for Implementer role]
    
    ## Pattern Application Guide
    [Specific guidance on how to apply recommended patterns]
    ```
  </report_compilation>
  
  <!-- Store report in Memory-Keeper -->
  <report_storage>
    ACTION: Store pattern analysis report in Memory-Keeper
    CATEGORY: "analysis_reports"
    KEY: "{PROJECT_ENTITY_NAME}-pattern-analysis-report"
    PRIORITY: "high"
    
    INCLUDE:
      - Full report content
      - Key recommendations summary
      - Anti-patterns warning list
      - Implementation priority matrix
  </report_storage>
  
  <!-- Create Memento entities for cross-project learning -->
  <memento_entity_creation>
    ACTION: Create Memento entities for pattern discoveries
    
    ENTITIES:
      - Pattern analysis session
      - Discovered patterns (reusable)
      - Anti-pattern warnings (preventive)
      - Implementation recommendations
    
    RELATIONSHIPS:
      - Link to PROJECT_ENTITY_NAME
      - Connect patterns to technology stack entities
      - Relate anti-patterns to risk categories
      - Associate recommendations with implementation phases
  </memento_entity_creation>
</pattern_analysis_report>

### Step 7: Prepare Handoff to Implementer Role

<implementer_handoff_preparation>
  <!-- Prepare context for Implementer role -->
  <handoff_preparation>
    COMPILE_HANDOFF_PACKAGE:
      - Pattern analysis report
      - Recommended patterns list
      - Anti-patterns warning list
      - Implementation guidance
      - Memory-Keeper session context
    
    VALIDATE_COMPLETENESS:
      - [ ] Patterns documented with examples
      - [ ] Anti-patterns identified with prevention strategies
      - [ ] Cross-project knowledge integrated
      - [ ] Implementation recommendations prioritized
      - [ ] Memory context preserved
  </handoff_preparation>
  
  <!-- Log completion and transition readiness -->
  <completion_logging>
    LOG: "🔍 Pattern Analyzer Role: Analysis complete"
    LOG: "📊 Patterns discovered: {count_of_recommended_patterns}"
    LOG: "⚠️ Anti-patterns identified: {count_of_anti_patterns}"  
    LOG: "📋 Report stored: implementations/pattern-analysis-{timestamp}.md"
    LOG: "🔄 Ready for handoff to Implementer Role"
  </completion_logging>
</implementer_handoff_preparation>

## Role Completion Checklist

- [ ] **Pattern Requirements Analysis**: Spec analyzed for pattern needs
- [ ] **Codebase Pattern Search**: Existing patterns discovered and documented
- [ ] **Cross-Project Knowledge**: Memento queried for applicable patterns
- [ ] **Anti-Pattern Identification**: Risks and anti-patterns documented
- [ ] **Pattern Analysis Report**: Comprehensive report created
- [ ] **Memory Storage**: All discoveries stored in Memory-Keeper and Memento
- [ ] **Implementer Handoff**: Context and recommendations prepared

## Error Handling

### MCP Tool Unavailability
- **Sequential-thinking unavailable**: Use manual structured analysis approach
- **Memento unavailable**: Focus on codebase patterns and standards
- **Memory-Keeper unavailable**: Document findings in report files

### Pattern Discovery Failures
- **No existing patterns found**: Document need for new pattern establishment
- **Conflicting patterns discovered**: Use Sequential Thinking to resolve conflicts
- **Insufficient cross-project data**: Rely on standards and best practices

### Quality Gates
- **Minimum pattern requirements**: At least 3 applicable patterns documented
- **Anti-pattern coverage**: At least 1 anti-pattern identified and documented
- **Report completeness**: All required sections completed with actionable recommendations

---

**Role Transition Ready**: When all checklist items complete and handoff package prepared, proceed to **Implementer Role** ⚡