---
description: Context7 + Meilisearch Documentation Workflow - Centralized Reusable Module
globs:
alwaysApply: false
version: 1.0
encoding: UTF-8
---

# Context7 + Meilisearch Documentation Workflow

<ai_meta>
  <parsing_rules>
    - Execute documentation workflow before any technical analysis
    - Always check Meilisearch cache before Context7 API calls
    - Parse existing tech-stack.md mappings first
    - Store retrieved documentation with trust scores
    - Use established Meilisearch keys from project tech-stack files
  </parsing_rules>
  <integration_points>
    - Include this workflow in all Agent OS commands that need documentation
    - Parameterize for different contexts (planning, analysis, implementation)
    - Leverage existing Context7 Documentation Mappings in tech-stack files
  </integration_points>
</ai_meta>

## Overview

<purpose>
  - Provide consistent Context7 + Meilisearch integration across all Agent OS workflows
  - Implement cache-first documentation retrieval with trust score validation
  - Leverage existing Context7 Documentation Mappings from tech-stack.md files
  - Optimize performance by avoiding unnecessary API calls
</purpose>

<context>
  - Used by plan-product, analyze-product, create-spec, execute-tasks workflows
  - Integrates with established trust scoring system (7-10 scale)
  - References pre-configured Meilisearch keys and Context7 library IDs
  - Part of broader MCP intelligence architecture
</context>

<prerequisites>
  - MCP systems available: Meilisearch, Context7 (via MCP tools)
  - Project tech stack identified
  - Access to reference-docs/{tech}/tech-stack.md files (via symlinks)
</prerequisites>

## Core Documentation Workflow

<workflow_process>

### Step 1: Dynamic Technology Detection

<technology_discovery>
  1. **Project Detection**: 
     - Scan for tech-stack.md in project root or .agent-os/{tech}/ directories
     - Check reference-docs/{tech}/tech-stack.md files (symlinked from ~/.agent-os/{tech}/)
     - Identify primary and secondary technologies from project structure
  
  2. **Parse Context7 Documentation Mappings**:
     - Extract "Context7 Documentation Mappings" tables from tech-stack.md files
     - Load Meilisearch keys, Context7 library IDs, descriptions, versions, trust scores
     - Build technology documentation map for current project
  
  3. **Key Selection Priority**:
     - Core framework keys (highest priority): 2x weight in confidence calculation
     - Feature-specific keys (match current task domain): 1x weight
     - Development/testing tools: 0.5x weight unless specifically needed
</technology_discovery>

### Step 2: Cache-First Documentation Retrieval

<cache_first_process>
  FOR EACH technology in identified_tech_stack:
    
    # Step 2a: Check Meilisearch Cache First
    1. GENERATE Meilisearch key from technology mappings table
    2. CALL: Meilisearch-search
       PARAMETERS:
         - query: "{technology_name} documentation"
         - indexUid: "context7_docs" (or appropriate index)
    
    3. IF cached documentation exists AND is not stale (< 30 days old):
       - RETRIEVE documentation from Meilisearch
       - EXTRACT trust score from cached metadata
       - LOG: "📋 Cache HIT for {technology_name} (trust: {trust_score})"
       - CONTINUE to next technology
    
    # Step 2b: Context7 API Call (Cache Miss)
    4. IF NO cached documentation OR cache is stale:
       - LOG: "📋 Cache MISS for {technology_name} - fetching from Context7"
       
       a. RESOLVE library ID:
          IF library_id exists in tech-stack.md mappings:
            - USE existing Context7 library ID from mappings table
          ELSE:
            - CALL: context7-resolve-library-id
            - PARAMETERS: libraryName: "{technology_name}"
       
       b. FETCH documentation:
          - CALL: context7-get-library-docs
          - PARAMETERS:
              - context7CompatibleLibraryID: "{library_id_from_step_a}"
              - tokens: 5000 (or appropriate for context)
              - topic: "{focused_topic}" (optional)
       
       c. CACHE results immediately:
          - CALL: Meilisearch-add-documents
          - PARAMETERS:
              - indexUid: "context7_docs"
              - documents: [{
                  id: "{meilisearch_key}",
                  library_id: "{context7_library_id}",
                  title: "Documentation for {technology_name}",
                  content: "{full_documentation_content}",
                  fetch_date: "{current_date_YYYY_MM_DD}",
                  tokens: "{tokens_retrieved}",
                  topic: "{topic_used}",
                  version: "{library_version}",
                  trust_score: "{calculated_trust_score}",
                  source: "context7_api"
                }]
          - LOG: "💾 Cached {technology_name} documentation (trust: {trust_score})"
    
    # Step 2c: Process Retrieved Documentation
    5. EXTRACT key architectural patterns and best practices
    6. VERIFY version compatibility with other project components
    7. RECORD documentation source (cache hit vs API call) for transparency
</cache_first_process>

### Step 3: Trust Score Processing

<trust_score_calculation>
  1. **Aggregate Trust Scores**:
     - Weighted average based on key importance and task relevance
     - Core framework keys: 2x weight
     - Feature-specific keys: 1x weight  
     - Development tools: 0.5x weight
  
  2. **Apply Bonuses and Penalties**:
     - Missing critical key penalty: -1.0 from average confidence
     - Version mismatch penalty: -0.5 for non-matching version documentation
     - Cache hit bonus: +0.2 for documentation already in Meilisearch
  
  3. **Determine Confidence Level**:
     - HIGH CONFIDENCE: Average trust score ≥ 9.0 across relevant keys
     - MEDIUM CONFIDENCE: Average trust score 8.0-8.9
     - LOW CONFIDENCE: Average trust score < 8.0 or missing critical documentation
  
  4. **Log Final Assessment**:
     - LOG: "🎯 Documentation confidence: {confidence_level} (score: {final_score})"
     - LOG: "📊 Sources: {cache_hits} cached, {api_calls} fetched from Context7"
</trust_score_calculation>

### Step 4: Documentation Integration

<documentation_output>
  1. **Generate Documentation Summary**:
     
     ## Technology Documentation Summary
     
     **Confidence Level**: {HIGH/MEDIUM/LOW} (Trust Score: {calculated_score})
     
     ### Documentation Sources
     
     | Technology | Source | Trust Score | Last Updated | Meilisearch Key |
     |------------|--------|-------------|--------------|-----------------|
     | {TECH_NAME} | {CACHE/API} | {SCORE} | {DATE} | {KEY} |
     
     ### Key Architectural Insights
     - **{TECH_1}**: {KEY_PATTERNS_AND_BEST_PRACTICES}
     - **{TECH_2}**: {KEY_PATTERNS_AND_BEST_PRACTICES}
     
     ### Version Compatibility
     - {COMPATIBILITY_ANALYSIS_ACROSS_STACK}
     
     ### Performance Metrics
     - Cache Hit Rate: {PERCENTAGE}% ({hits}/{total} requests)
     - Total Retrieval Time: {time}ms
     - Documentation Freshness: {average_age} days
  
  2. **Update Project Tech-Stack Documentation**:
     - Verify mappings in tech-stack.md are current
     - Add new Meilisearch keys if technologies were discovered
     - Update trust scores based on successful retrieval
     - Document any missing mappings for future enhancement
  
  3. **Store Workflow Results**:
     - Save documentation summary for reference by consuming workflow
     - Cache aggregated trust scores for confidence routing decisions
     - Log cache performance metrics for optimization
</documentation_output>

</workflow_process>

## Integration Parameters

<workflow_parameters>
  <for_planning_workflows>
    - focus_areas: ["core_framework", "database", "frontend"]
    - documentation_depth: "architectural_patterns"
    - cache_preference: "prefer_cache"
    - trust_threshold: 8.0
  </for_planning_workflows>
  
  <for_analysis_workflows>
    - focus_areas: ["all_detected_technologies"]
    - documentation_depth: "comprehensive"
    - cache_preference: "fresh_if_stale"
    - trust_threshold: 8.5
  </for_analysis_workflows>
  
  <for_implementation_workflows>
    - focus_areas: ["implementation_specific"]
    - documentation_depth: "code_examples_and_apis"
    - cache_preference: "prefer_fresh"
    - trust_threshold: 9.0
  </for_implementation_workflows>
</workflow_parameters>

## Error Handling

<error_scenarios>
  <context7_unavailable>
    1. ATTEMPT: Use cached documentation even if slightly stale
    2. FALLBACK: Reference existing tech-stack.md mappings for library IDs
    3. LOG: "⚠️ Context7 unavailable - using cached documentation"
    4. CONTINUE: With degraded confidence level
  </context7_unavailable>
  
  <meilisearch_unavailable>
    1. SKIP: Cache operations
    2. PROCEED: Directly to Context7 API calls
    3. LOG: "⚠️ Meilisearch unavailable - no caching available"
    4. NOTE: Performance impact and missing optimization
  </meilisearch_unavailable>
  
  <no_tech_mappings>
    1. GENERATE: Basic Meilisearch keys from technology names
    2. RESOLVE: Library IDs using context7-resolve-library-id
    3. CREATE: Temporary mappings for session use
    4. RECOMMEND: Adding mappings to tech-stack.md files
  </no_tech_mappings>
</error_scenarios>

## Success Criteria

<validation_checklist>
  - [ ] All project technologies identified and documented
  - [ ] Cache checked before any Context7 API calls
  - [ ] Trust scores calculated and confidence level determined
  - [ ] Documentation summary generated with source tracking
  - [ ] Cache performance metrics logged
  - [ ] New documentation cached for future use
  - [ ] Error conditions handled gracefully
  - [ ] Integration parameters respected
</validation_checklist>

<performance_targets>
  - Cache hit rate: >70% for established projects
  - Documentation retrieval: <5 seconds total
  - Trust score calculation: <1 second
  - API calls minimized: Use cache when available
</performance_targets>

## Usage Examples

<include_example>
  <!-- In plan-product.md -->
  <context7_workflow>
    <include>@reference-docs/instructions/context7-meilisearch-workflow.md</include>
    EXECUTE: context7_documentation_workflow()
    PARAMETERS:
      - workflow_type: "planning"
      - focus_areas: ["core_framework", "database", "frontend"] 
      - trust_threshold: 8.0
    RESULT: documentation_confidence_assessment
  </context7_workflow>
</include_example>

<integration_pattern>
  <!-- Standard integration pattern for all workflows -->
  1. INCLUDE: This workflow file
  2. EXECUTE: Documentation retrieval process
  3. EVALUATE: Trust scores and confidence level
  4. ROUTE: Subsequent workflow based on confidence assessment
  5. STORE: Results in appropriate memory systems
</integration_pattern>

---

**This workflow implements the established Context7 → Meilisearch trust scoring architecture and should be included in all Agent OS commands that require technology documentation.**