# Universal Error Resolution via Memory Systems

## Overview

This document provides procedures for leveraging the dual memory architecture (Memory-Keeper + Memento) to resolve development errors by searching for previous solutions and similar issues. Uses universal canonical project naming to ensure error solutions are findable across sessions and prevent knowledge fragmentation.

## Error Resolution Workflow with Canonical Identity

### Step 0: Canonical Project Identity Resolution

**PREREQUISITE**: Before error resolution, ensure canonical project identity is resolved:

```xml
<canonical_error_context>
  # Access canonical project identity from session
  CANONICAL_PROJECT_ID = get_from_detection_context("canonical_project_id")
  PROJECT_ENTITY_NAME = get_from_session("project-entity-name")
  PROJECT_ALIASES = get_from_detection_context("project_aliases")
  
  # If not available, resolve using universal identity system
  IF not CANONICAL_PROJECT_ID:
    INCLUDE: @reference-docs/instructions/tech-detection.md
    CANONICAL_PROJECT_ID = DETECTION_CONTEXT["canonical_project_id"]
    PROJECT_ENTITY_NAME = DETECTION_CONTEXT["project_name"]
    PROJECT_ALIASES = DETECTION_CONTEXT["project_aliases"]
  
  LOG: "Error resolution using canonical project identity: {PROJECT_ENTITY_NAME}"
</canonical_error_context>
```

### Step 1: Universal Error Analysis and Memory Search

When encountering any development error (test failures, compilation errors, runtime issues, etc.):

```xml
<error_resolution_workflow>
  <error_capture>
    # Store the error details immediately for analysis using canonical identity
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "current-error-{PROJECT_ENTITY_NAME}-{timestamp}"
      - value: "Error: {error_message} | Context: {error_context} | Tech: {PRIMARY_TECH} | Canonical Project: {PROJECT_ENTITY_NAME} | Project ID: {CANONICAL_PROJECT_ID}"
      - category: "error"
      - priority: "high"
  </error_capture>
  
  <universal_memory_solution_search>
    # Search Memory-Keeper for similar errors using canonical identity and aliases
    all_search_results = []
    
    # Search by canonical project identity
    CALL: mcp-memory-keeper-context_search
    PARAMETERS:
      - query: "{PROJECT_ENTITY_NAME} {error_type} {key_error_terms} {PRIMARY_TECH}"
      - searchIn: ["key", "value"]
    all_search_results.extend(search_results)
    
    # Search by project aliases for comprehensive error history
    FOR alias in PROJECT_ALIASES:
      IF alias != PROJECT_ENTITY_NAME:
        CALL: mcp-memory-keeper-context_search
        PARAMETERS:
          - query: "{alias} {error_type} {key_error_terms} {PRIMARY_TECH}"
          - searchIn: ["key", "value"]
        all_search_results.extend(search_results)
    
    # Search Memento for cross-project error solutions
    CALL: memento-mcp-semantic_search
    PARAMETERS:
      - query: "{error_type} {PRIMARY_TECH} solution resolution fix"
      - entity_types: ["implementation_blocker", "error_resolution", "debugging_solution", "breakthrough_solution"]
      - limit: 15
      - min_similarity: 0.5
    
    # Also search for successful patterns that might prevent this error
    CALL: memento-mcp-semantic_search
    PARAMETERS:
      - query: "{error_context} {PRIMARY_TECH} successful implementation"
      - entity_types: ["implementation_pattern", "task_completion", "debugging_solution"]
      - limit: 8
      - min_similarity: 0.6
      
    # Remove duplicates from consolidated search results
    unique_search_results = remove_duplicate_solutions(all_search_results)
    LOG: "Found {len(unique_search_results)} unique solutions from canonical and alias searches"
  </universal_memory_solution_search>
  
  <solution_analysis>
    IF similar_errors_found:
      previous_solutions = extract_solutions(similar_errors)
      confidence_scores = calculate_solution_confidence(previous_solutions, current_error)
      
      # Store analysis results
      CALL: mcp-memory-keeper-context_save
      PARAMETERS:
        - key: "solution-candidates-{timestamp}"
        - value: "Found {len(previous_solutions)} similar issues. Top solution: {highest_confidence_solution}"
        - category: "progress"
        - priority: "high"
    
    ELSE:
      LOG: "No similar errors found in memory systems"
      STORE: "Novel error - will document solution for future reference"
    ENDIF
  </solution_analysis>
</error_resolution_workflow>
```

### Step 2: Apply Memory-Informed Solutions

```xml
<memory_guided_troubleshooting>
  <solution_priority_order>
    # Try solutions in order of confidence/success rate
    FOR_EACH: solution_candidate IN ordered_by_confidence(previous_solutions):
      
      LOG: "Attempting solution from {solution_candidate.project} (confidence: {solution_candidate.confidence})"
      
      # Apply the solution approach
      ATTEMPT: solution_candidate.approach
      
      IF solution_successful:
        # Store successful resolution
        CALL: mcp-memory-keeper-context_save
        PARAMETERS:
          - key: "error-resolved-{timestamp}"
          - value: "Successfully resolved using approach from {solution_candidate.project}"
          - category: "progress"
          - priority: "high"
        
        # Update Memento with successful resolution using canonical naming
        CALL: memento-mcp-create_entities
        PARAMETERS:
          - entities: [{
              "name": "{PROJECT_ENTITY_NAME}-error-resolution-{timestamp}",
              "entityType": "error_resolution",
              "observations": [
                "Error Type: {error_type}",
                "Error Details: {error_message}",
                "Solution Applied: {solution_candidate.approach}",
                "Source Project: {solution_candidate.project}",
                "Tech Stack: {PRIMARY_TECH}",
                "Canonical Project: {PROJECT_ENTITY_NAME}",
                "Canonical ID: {CANONICAL_PROJECT_ID}",
                "Project Aliases: {', '.join(PROJECT_ALIASES)}",
                "Resolution Time: {resolution_duration}",
                "Success: true",
                "Date: {current_date()}"
              ]
            }]
        
        # Link to canonical project entity and original problem pattern
        CALL: memento-mcp-create_relations
        PARAMETERS:
          - relations: [
              {
                "from": "{PROJECT_ENTITY_NAME}-error-resolution-{timestamp}",
                "to": "{PROJECT_ENTITY_NAME}",
                "relationType": "resolved_for",
                "metadata": {"canonical_project": PROJECT_ENTITY_NAME, "resolution_success": true}
              },
              {
                "from": "{PROJECT_ENTITY_NAME}-error-resolution-{timestamp}",
                "to": solution_candidate.source_entity,
                "relationType": "adapted_solution_from",
                "metadata": {"canonical_project": PROJECT_ENTITY_NAME}
              }
            ]
        
        BREAK  # Exit solution attempt loop
      
      ELSE:
        LOG: "Solution from {solution_candidate.project} did not resolve issue"
        CONTINUE  # Try next solution
      ENDIF
    ENDFOR
  </solution_priority_order>
  
  <novel_error_handling>
    # If no memory solutions work, document the novel error
    IF all_memory_solutions_failed:
      CALL: mcp-memory-keeper-context_save
      PARAMETERS:
        - key: "novel-error-investigation-{timestamp}"
        - value: "Novel error requiring research. Tried {len(previous_solutions)} memory solutions."
        - category: "error"
        - priority: "high"
      
      # Proceed with standard troubleshooting but document for memory
      INITIATE: standard_debugging_workflow
      DOCUMENT_FOR_MEMORY: true
      
      # When novel solution is found, store it immediately
      WHEN novel_solution_discovered:
        CALL: mcp-memory-keeper-context_save
        PARAMETERS:
          - key: "novel-solution-discovered-{timestamp}"
          - value: "BREAKTHROUGH: {novel_solution_description} - resolved {error_type}"
          - category: "progress"
          - priority: "high"
        
        # Store novel solution in Memento for cross-project learning using canonical naming
        CALL: memento-mcp-create_entities
        PARAMETERS:
          - entities: [{
              "name": "{PROJECT_ENTITY_NAME}-novel-solution-{timestamp}",
              "entityType": "breakthrough_solution",
              "observations": [
                "Novel Error: {original_error_message}",
                "Research Process: {investigation_steps}",
                "Solution Discovery: {how_solution_was_found}", 
                "Final Solution: {novel_solution_approach}",
                "Tech Stack: {PRIMARY_TECH}",
                "Canonical Project: {PROJECT_ENTITY_NAME}",
                "Canonical ID: {CANONICAL_PROJECT_ID}",
                "Investigation Time: {total_research_time}",
                "Difficulty Level: {difficulty_assessment}",
                "Resources Used: {documentation_sources}",
                "Date: {current_date()}"
              ]
            }]
        
        # Link novel solution to canonical project and error patterns for future searches
        CALL: memento-mcp-create_relations
        PARAMETERS:
          - relations: [
              {
                "from": "{PROJECT_ENTITY_NAME}-novel-solution-{timestamp}",
                "to": "{PROJECT_ENTITY_NAME}",
                "relationType": "breakthrough_for",
                "metadata": {"canonical_project": PROJECT_ENTITY_NAME, "novel_discovery": true}
              },
              {
                "from": "{PROJECT_ENTITY_NAME}-novel-solution-{timestamp}",
                "to": "{PRIMARY_TECH}-error-patterns",
                "relationType": "expands_knowledge_of",
                "metadata": {"canonical_project": PROJECT_ENTITY_NAME}
              }
            ]
    ENDIF
    
    # Store failed solution attempts for learning
    FOR_EACH: failed_solution IN failed_memory_solutions:
      CALL: mcp-memory-keeper-context_save
      PARAMETERS:
        - key: "solution-failure-{timestamp}-{failed_solution.id}"
        - value: "FAILED: {failed_solution.approach} did not resolve {error_type} - context may have been different"
        - category: "error"
        - priority: "normal"
      
      # Update Memento with failure context using canonical naming to improve future confidence scoring
      CALL: memento-mcp-create_entities
      PARAMETERS:
        - entities: [{
            "name": "{PROJECT_ENTITY_NAME}-solution-failure-{timestamp}",
            "entityType": "solution_failure",
            "observations": [
              "Failed Solution: {failed_solution.approach}",
              "Original Context: {failed_solution.original_context}",
              "Current Context: {current_error_context}",
              "Difference Analysis: {context_difference_analysis}",
              "Tech Stack: {PRIMARY_TECH}",
              "Canonical Project: {PROJECT_ENTITY_NAME}",
              "Canonical ID: {CANONICAL_PROJECT_ID}",
              "Reason for Failure: {failure_analysis}",
              "Date: {current_date()}"
            ]
          }]
      
      # Link failure to canonical project for learning
      CALL: memento-mcp-create_relations
      PARAMETERS:
        - relations: [{
            "from": "{PROJECT_ENTITY_NAME}-solution-failure-{timestamp}",
            "to": "{PROJECT_ENTITY_NAME}",
            "relationType": "failure_context_for",
            "metadata": {"canonical_project": PROJECT_ENTITY_NAME, "learning_value": "negative_signal"}
          }]
  </novel_error_handling>
</memory_guided_troubleshooting>
```

### Step 3: Post-Resolution Memory Update

```xml
<post_resolution_memory_update>
  <successful_resolution_storage>
    # If error was resolved (whether via memory or novel approach)
    IF error_resolved:
      
      # Store comprehensive resolution details using canonical naming
      CALL: memento-mcp-create_entities
      PARAMETERS:
        - entities: [{
            "name": "{PROJECT_ENTITY_NAME}-debugging-success-{timestamp}",
            "entityType": "debugging_solution",
            "observations": [
              "Error: {original_error_message}",
              "Context: {error_context}",
              "Solution: {final_solution_approach}",
              "Source: {solution_source}", # memory_guided or novel_research
              "Investigation Time: {total_time_spent}",
              "Tech Stack: {PRIMARY_TECH}",
              "Canonical Project: {PROJECT_ENTITY_NAME}",
              "Canonical ID: {CANONICAL_PROJECT_ID}",
              "Files Changed: {list_of_modified_files}",
              "Testing: {verification_approach}",
              "Date: {current_date()}"
            ]
          }]
      
      # Link to canonical project and tech stack for future reference
      CALL: memento-mcp-create_relations
      PARAMETERS:
        - relations: [
            {
              "from": "{PROJECT_ENTITY_NAME}",
              "to": "{PROJECT_ENTITY_NAME}-debugging-success-{timestamp}",
              "relationType": "resolved_error_using",
              "metadata": {"canonical_project": PROJECT_ENTITY_NAME, "success": true}
            },
            {
              "from": "{PRIMARY_TECH}-best-practices",
              "to": "{PROJECT_ENTITY_NAME}-debugging-success-{timestamp}",
              "relationType": "validated_by",
              "metadata": {"canonical_project": PROJECT_ENTITY_NAME}
            }
          ]
      
      # Create checkpoint after successful error resolution using canonical naming
      CALL: mcp-memory-keeper-context_checkpoint
      PARAMETERS:
        - name: "error-resolved-{PROJECT_ENTITY_NAME}-{timestamp}"
        - description: "Successfully resolved {error_type} for {PROJECT_ENTITY_NAME} (canonical: {CANONICAL_PROJECT_ID}) using {solution_source} approach"
    ENDIF
  </successful_resolution_storage>
</post_resolution_memory_update>
```

## Error-Specific Memory Search Patterns

### Test Failures
```xml
<test_failure_memory_search>
  SEARCH_QUERIES: [
    "test failure {test_framework} {PRIMARY_TECH} fix",
    "failing tests {specific_test_name} solution",
    "{test_error_type} resolution {PRIMARY_TECH}"
  ]
  ENTITY_TYPES: ["test_fix", "debugging_solution", "implementation_pattern"]
</test_failure_memory_search>
```

### Compilation/Build Errors
```xml
<build_error_memory_search>
  SEARCH_QUERIES: [
    "compilation error {error_code} {PRIMARY_TECH} fix",
    "build failure {build_tool} solution",
    "dependency issue {package_name} resolution"
  ]
  ENTITY_TYPES: ["build_fix", "dependency_resolution", "configuration_solution"]
</build_error_memory_search>
```

### Runtime Errors
```xml
<runtime_error_memory_search>
  SEARCH_QUERIES: [
    "runtime error {exception_type} {PRIMARY_TECH} fix",
    "production issue {error_context} solution",
    "{framework_error} debugging approach"
  ]
  ENTITY_TYPES: ["runtime_fix", "production_solution", "performance_optimization"]
</runtime_error_memory_search>
```

## Integration with Existing Error Handling

### Updates to execute-tasks.md

This error resolution workflow should be integrated into the existing error handling sections:

- **Before Step 1**: Add memory search procedure when task fails
- **In "technical_roadblocks"**: Search memory before attempting 3 approaches
- **In "test_failures"**: Check memory for similar test failure solutions
- **In "blocking_issues"**: Search memory for blocker resolution patterns

### Memory-Enhanced Debugging Protocol

1. **Immediate Error**: Capture error details in Memory-Keeper
2. **Memory Search**: Search both systems for similar issues and solutions  
3. **Solution Application**: Try memory-guided solutions in confidence order
4. **Novel Resolution**: If memory solutions fail, document novel approach
5. **Success Storage**: Store successful resolution for future reference
6. **Pattern Learning**: Build cross-project error resolution knowledge

## Benefits

- **Faster Resolution**: Leverage solutions from previous projects
- **Pattern Recognition**: Identify common error patterns across tech stacks
- **Knowledge Accumulation**: Build organizational debugging knowledge
- **Context Preservation**: Maintain debugging context across sessions
- **Cross-Project Learning**: Apply solutions from similar implementations

## Usage Example with Canonical Identity

```bash
# When test fails in bot_devops project:
1. Canonical identity resolved: PROJECT_ENTITY_NAME = "bot_devops"
2. Error captured with canonical reference in Memory-Keeper
3. System searches across canonical ID and aliases: ["bot_devops", "BOT DevOps", "bot_devops_project"]
4. Finds solution from previous "civildiy" project: "Laravel MongoDB connection pool configuration"
5. Applies solution, test passes
6. Success pattern stored with canonical reference: "bot_devops-error-resolution-{timestamp}"
7. Future sessions can find this solution regardless of project name variations
```

This creates a self-improving debugging system that gets smarter with each error resolution.

## Complete Memory Storage Summary

The system stores solutions and errors in memory at **FIVE key points**:

### **1. Initial Error Capture** (Lines 17-23)
```bash
# IMMEDIATE: When any error occurs
STORES: Error details in Memory-Keeper
CATEGORY: "error"
PURPOSE: Track all errors for analysis
```

### **2. Memory-Guided Success Storage** (Lines 85-117)
```bash
# WHEN: Memory-guided solution works
STORES: Success in BOTH Memory-Keeper + Memento
CREATES: "error_resolution" entity with source project link
PURPOSE: Track which memory solutions work
```

### **3. Novel Solution Discovery** (Lines 143-177)
```bash
# WHEN: New solution is discovered through research
STORES: Breakthrough solution in BOTH systems
CREATES: "breakthrough_solution" entity with research process
PURPOSE: Make novel solutions available for future searches
```

### **4. Solution Failure Learning** (Lines 181-204)
```bash
# WHEN: Memory-guided solutions fail
STORES: Failure context and analysis
CREATES: "solution_failure" entity with context differences
PURPOSE: Improve future confidence scoring and context matching
```

### **5. Comprehensive Post-Resolution** (Lines 232-272)
```bash
# AFTER: Any error is resolved (memory-guided OR novel)
STORES: Complete resolution details with all context
CREATES: "debugging_solution" entity with full workflow
PURPOSE: Comprehensive searchable solution database
```

## Memory Search Optimization

Each storage point includes specific search terms and relationships:

- **Error Type + Tech Stack**: Primary search terms
- **Context Details**: Environment, framework versions, specific components
- **Solution Approach**: Exact steps taken to resolve
- **Source Attribution**: Which project/approach provided the solution
- **Success Metrics**: Resolution time, difficulty, confidence scores
- **Cross-References**: Links between related solutions and patterns

## Self-Improving Intelligence

With each error resolution cycle:

1. **Pattern Recognition Improves**: Similar errors found faster
2. **Confidence Scoring Enhances**: Better solution ranking based on context
3. **Failure Learning Advances**: Failed solutions provide negative signals
4. **Cross-Project Knowledge Grows**: Solutions become available across all projects
5. **Research Efficiency Increases**: Novel solutions reduce duplicate research

**Result**: The debugging system becomes increasingly intelligent and efficient with each use.
