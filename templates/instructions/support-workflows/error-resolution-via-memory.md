# Universal Error Resolution via Memory Systems

## Overview

This document provides procedures for leveraging the dual memory architecture (Memory-Keeper + Memento) to resolve **ALL TYPES OF ERRORS** - both development/code errors AND instruction-following failures - by searching for previous solutions and similar issues. Uses universal canonical project naming to ensure error solutions are findable across sessions and prevent knowledge fragmentation.

## Error Types Covered

### Development Errors (Original Scope)
- Test failures, compilation errors, runtime issues
- Dependency conflicts, configuration problems
- Performance issues, deployment failures

### Instruction-Following Errors (New Scope) 
- AI agents skipping required user interaction steps
- Missing mandatory workflow checkpoints
- Incorrect template execution order
- Bypassing validation requirements
- Failing to follow phase-specific instructions

## Mandatory Error Detection Points

### 5-Phase Workflow Error Detection
Each phase MUST include error detection for:
- **Phase 1 (Initialize)**: Skipping user questions, missing idea capture
- **Phase 2 (Research)**: Insufficient stakeholder engagement, incomplete investigation  
- **Phase 3 (Write)**: Missing specifications, inadequate detail
- **Phase 4 (Verify)**: Skipping validation checks, incomplete reviews
- **Phase 5 (Tasks)**: Missing task breakdown, insufficient planning

### Universal Instruction Compliance Check
Before ANY AI agent proceeds with technical work, validate:
```
INSTRUCTION_COMPLIANCE_CHECK:
✅ All required user interactions completed?
✅ All mandatory checkpoints passed? 
✅ All prerequisite steps verified?
✅ All phase-specific requirements met?

IF ANY ❌: TRIGGER ERROR RESOLUTION WORKFLOW
```

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

### Step 0.5: Instruction-Following Error Detection and Immediate Halt

**CRITICAL**: This step must be executed BEFORE any technical error resolution to catch instruction-following failures:

```xml
<instruction_compliance_validation>
  # Detect if AI agent has failed to follow instructions
  INSTRUCTION_ERRORS = []
  
  # Check for common instruction-following failures
  IF current_phase == "initialize" AND user_questions_not_asked:
    INSTRUCTION_ERRORS.append("CRITICAL: Skipped mandatory user interaction in Phase 1")
  
  IF workflow_checkpoints_bypassed:
    INSTRUCTION_ERRORS.append("ERROR: Bypassed mandatory workflow checkpoints")
  
  IF required_validations_skipped:
    INSTRUCTION_ERRORS.append("ERROR: Skipped required validation steps")
    
  IF user_confirmation_not_obtained AND user_confirmation_required:
    INSTRUCTION_ERRORS.append("ERROR: Proceeded without required user confirmation")
  
  # If instruction errors detected, IMMEDIATELY halt and resolve
  IF len(INSTRUCTION_ERRORS) > 0:
    LOG: "🚨 INSTRUCTION-FOLLOWING ERROR DETECTED - HALTING EXECUTION"
    
    # Store instruction error immediately
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "instruction-error-{PROJECT_ENTITY_NAME}-{timestamp}"
      - value: "AI AGENT ERROR: {'; '.join(INSTRUCTION_ERRORS)} | Phase: {current_phase} | Template: {current_template}"
      - category: "error"
      - priority: "critical"
    
    # Search memory for similar instruction-following failures and their resolutions
    CALL: mcp-memory-keeper-context_search
    PARAMETERS:
      - query: "instruction error workflow failure {current_phase} resolution"
      - searchIn: ["key", "value"]
    
    CALL: memento-mcp-semantic_search
    PARAMETERS:
      - query: "AI agent instruction following error {current_phase} workflow compliance"
      - entity_types: ["workflow_error", "instruction_failure", "compliance_fix"]
      - limit: 10
      - min_similarity: 0.4
    
    # Apply instruction error resolution protocol
    EXECUTE: instruction_error_resolution_protocol(INSTRUCTION_ERRORS)
    
    # DO NOT PROCEED until instruction compliance is achieved
    HALT_EXECUTION: true
    REQUIRE_USER_ACKNOWLEDGMENT: true
  ENDIF
</instruction_compliance_validation>
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

### Step 1.5: Sequential Thinking for Complex Error Analysis

When encountering complex errors that require multi-step analysis:

```xml
<sequential_thinking_error_analysis>
  <!-- Apply sequential thinking for complex error patterns -->
  <complex_error_detection>
    # Trigger conditions for sequential thinking in error analysis
    APPLY_SEQUENTIAL_THINKING = (
      len(error_symptoms) >= 3 OR
      error_involves_multiple_systems OR
      error_context_complexity == "high" OR
      similar_errors_found == 0 OR
      previous_solutions_failed >= 2
    )
    
    IF APPLY_SEQUENTIAL_THINKING:
      LOG: "🤔 Applying sequential-thinking for complex error analysis"
      
      # Sequential thinking parameters for error analysis
      THINKING_PARAMETERS = {
        "total_thoughts": 8 if error_context_complexity == "high" else 6,
        "analysis_focus": "complex error analysis and systematic troubleshooting",
        "objective": "Identify root cause and optimal solution path for {error_type}",
        "error_context": error_context
      }
      
      # Execute sequential thinking for error analysis
      TRY:
        CALL: sequential-thinking
        PARAMETERS: THINKING_PARAMETERS
        
        # Store sequential thinking results for error analysis
        CALL: mcp-memory-keeper-context_save
        PARAMETERS:
          - key: "{PROJECT_ENTITY_NAME}-error-analysis-thinking-{timestamp}"
          - value: "Sequential thinking for error analysis: {error_type} | Results: {thinking_results}"
          - category: "error_patterns"
          - priority: "high"
        
        # Extract enhanced analysis insights
        enhanced_error_analysis = extract_insights_from_thinking(thinking_results)
        
        # Update solution search strategy based on thinking results
        IF enhanced_error_analysis.suggests_different_search_strategy:
          # Refine search terms based on sequential thinking insights
          refined_search_terms = enhanced_error_analysis.refined_search_terms
          
          # Re-search with enhanced terms
          CALL: mcp-memory-keeper-context_search
          PARAMETERS:
            - query: "{PROJECT_ENTITY_NAME} {refined_search_terms} {PRIMARY_TECH}"
            - searchIn: ["key", "value"]
          
          CALL: memento-mcp-semantic_search
          PARAMETERS:
            - query: "{refined_search_terms} {PRIMARY_TECH} solution"
            - entity_types: ["error_resolution", "debugging_solution"]
            - limit: 10
            - min_similarity: 0.6
        
        LOG: "✅ Sequential thinking enhanced error analysis completed"
        
      EXCEPT sequential_thinking_error:
        LOG: "⚠️ Sequential thinking failed: {error} - proceeding with standard analysis"
        
        # Fallback to structured manual analysis
        EXECUTE: manual_structured_error_analysis(error_context, error_symptoms)
    
    ELSE:
      LOG: "⏭️ Sequential thinking not needed for this error complexity - using standard analysis"
  </complex_error_detection>
</sequential_thinking_error_analysis>
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

### Step 2.5: Vibe Check for Error Solution Validation

Before applying solutions, validate the approach with vibe-check for error resolution:

```xml
<vibe_check_solution_validation>
  <!-- Apply vibe check before attempting solutions -->
  <solution_validation>
    # Trigger conditions for vibe check in error resolution
    APPLY_VIBE_CHECK = (
      len(solution_candidates) >= 2 OR
      highest_confidence_solution < 0.8 OR
      error_is_critical OR
      error_affects_multiple_systems OR
      solution_requires_significant_changes
    )
    
    IF APPLY_VIBE_CHECK:
      LOG: "🎯 Applying vibe-check for error solution validation"
      
      # Prepare vibe check parameters for solution validation
      SOLUTION_PLAN = f"""
      Error Resolution Plan:
      - Error Type: {error_type}
      - Error Context: {error_context}
      - Top Solution Candidate: {highest_confidence_solution.approach}
      - Alternative Solutions: {[s.approach for s in solution_candidates[1:3]]}
      - Estimated Risk: {solution_risk_assessment}
      - Implementation Approach: {solution_implementation_plan}
      """
      
      USER_REQUEST = f"""
      Resolve {error_type} error in {PRIMARY_TECH} project:
      Error: {error_message}
      Context: {error_context}
      Requirement: Safe, effective resolution without introducing new issues
      """
      
      VIBE_CHECK_PARAMETERS = {
        "plan": SOLUTION_PLAN,
        "userRequest": USER_REQUEST,
        "confidence": current_solution_confidence,
        "phase": "error_resolution",
        "focusAreas": ["solution_safety", "implementation_risk", "side_effects"]
      }
      
      # Execute vibe check for solution validation
      TRY:
        CALL: vibe-check
        PARAMETERS: VIBE_CHECK_PARAMETERS
        
        # Store vibe check validation results
        CALL: mcp-memory-keeper-context_save
        PARAMETERS:
          - key: "{PROJECT_ENTITY_NAME}-solution-validation-{timestamp}"
          - value: "Vibe check solution validation for {error_type}: {validation_results}"
          - category: "error_patterns"
          - priority: "high"
        
        # Process vibe check feedback
        validation_feedback = parse_vibe_check_results(validation_results)
        
        IF validation_feedback.suggests_different_approach:
          LOG: "⚠️ Vibe check suggests reconsidering solution approach"
          
          # Adjust solution strategy based on vibe check insights
          IF validation_feedback.recommends_safer_approach:
            # Prioritize lower-risk solutions
            solution_candidates = prioritize_safe_solutions(solution_candidates)
            LOG: "Reordered solutions to prioritize safer approaches"
          
          IF validation_feedback.identifies_missing_considerations:
            # Add additional validation steps
            additional_checks = validation_feedback.suggested_checks
            LOG: f"Adding validation steps: {additional_checks}"
        
        ELIF validation_feedback.confirms_approach:
          LOG: "✅ Vibe check confirms solution approach is sound"
        
        # Store validation insights for future error resolution
        CALL: mcp-memory-keeper-context_save
        PARAMETERS:
          - key: "{PROJECT_ENTITY_NAME}-solution-insights-{timestamp}"
          - value: "Solution validation insights: {validation_feedback.key_insights}"
          - category: "error_patterns"
          - priority: "normal"
        
        LOG: "✅ Vibe check solution validation completed"
        
      EXCEPT vibe_check_error:
        LOG: "⚠️ Vibe check failed: {error} - proceeding with standard solution validation"
        
        # Fallback to manual solution validation
        EXECUTE: manual_solution_risk_assessment(solution_candidates, error_context)
    
    ELSE:
      LOG: "⏭️ Vibe check not needed for this solution validation - proceeding with solutions"
  </solution_validation>
</vibe_check_solution_validation>
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

### Step 3.5: Vibe Learn for Error Pattern Storage

Capture error resolution patterns and learnings using vibe-learn:

```xml
<vibe_learn_error_patterns>
  <!-- Apply vibe learn to capture error resolution patterns -->
  <error_pattern_learning>
    # Always attempt vibe learn after error resolution for pattern storage
    IF error_resolved:
      LOG: "🧠 Applying vibe-learn for error resolution pattern storage"
      
      # Identify key learning patterns from the error resolution process
      ERROR_RESOLUTION_PATTERNS = extract_error_learning_patterns(
        error_type, error_context, solution_applied, resolution_outcome
      )
      
      # Apply vibe learn for each significant error pattern
      FOR pattern IN ERROR_RESOLUTION_PATTERNS:
        TRY:
          # Determine appropriate error category for vibe learn
          ERROR_CATEGORY = determine_error_category(pattern, error_type)
          
          # Prepare vibe learn parameters for error patterns
          VIBE_LEARN_PARAMETERS = {
            "mistake": pattern.error_or_challenge,
            "category": ERROR_CATEGORY,
            "solution": pattern.resolution_approach,
            "sessionId": f"{PROJECT_ENTITY_NAME}-error-resolution-{timestamp}"
          }
          
          CALL: vibe-learn
          PARAMETERS: VIBE_LEARN_PARAMETERS
          
          # Store vibe learn results for error patterns
          CALL: mcp-memory-keeper-context_save
          PARAMETERS:
            - key: "{PROJECT_ENTITY_NAME}-error-pattern-{pattern.id}-learned"
            - value: "Error pattern learned: {pattern.description} | Solution: {pattern.resolution_approach}"
            - category: "error_patterns"
            - priority: "normal"
          
          LOG: f"✅ Error pattern learned: {pattern.description}"
          
        EXCEPT vibe_learn_error:
          LOG: f"⚠️ Vibe learn failed for error pattern {pattern.id}: {error}"
          
          # Manual pattern storage fallback
          CALL: mcp-memory-keeper-context_save
          PARAMETERS:
            - key: "manual-error-pattern-{pattern.id}-{timestamp}"
            - value: "Manual error pattern storage: {pattern.description} | Context: {error_context}"
            - category: "error_patterns"
            - priority: "normal"
      
      # Store summary of error learning session
      CALL: mcp-memory-keeper-context_save
      PARAMETERS:
        - key: "{PROJECT_ENTITY_NAME}-error-learning-summary-{timestamp}"
        - value: "Error learning session: {len(ERROR_RESOLUTION_PATTERNS)} patterns captured for {error_type}"
        - category: "error_patterns"
        - priority: "high"
      
      LOG: f"✅ Vibe learn error pattern storage completed - {len(ERROR_RESOLUTION_PATTERNS)} patterns processed"
      
    ELSE:
      LOG: "⚠️ Error not yet resolved - skipping vibe learn pattern storage"
  </error_pattern_learning>
  
  <!-- Helper function for error category determination -->
  <error_category_mapping>
    FUNCTION determine_error_category(pattern, error_type):
      """Map error patterns to appropriate vibe-learn categories"""
      category_mapping = {
        "over_complex_solution": "Complex Solution Bias",
        "scope_creep_during_fix": "Feature Creep",
        "premature_implementation": "Premature Implementation", 
        "misaligned_solution": "Misalignment",
        "tool_overuse": "Overtooling",
        "insufficient_analysis": "Complex Solution Bias",
        "rushed_resolution": "Premature Implementation"
      }
      
      RETURN category_mapping.get(pattern.type, "Other")
    
    FUNCTION extract_error_learning_patterns(error_type, error_context, solution_applied, resolution_outcome):
      """Extract learning patterns from error resolution process"""
      patterns = []
      
      # Common error resolution patterns
      IF resolution_outcome.required_multiple_attempts:
        patterns.append({
          "id": f"multi-attempt-{error_type}",
          "type": "insufficient_analysis",
          "description": f"Multiple attempts required for {error_type}",
          "error_or_challenge": f"Initial analysis insufficient for {error_type}",
          "resolution_approach": "Enhanced analysis with sequential thinking before solution attempts"
        })
      
      IF resolution_outcome.solution_had_side_effects:
        patterns.append({
          "id": f"side-effects-{error_type}",
          "type": "insufficient_validation", 
          "description": f"Solution for {error_type} had unexpected side effects",
          "error_or_challenge": f"Solution validation insufficient for {error_type}",
          "resolution_approach": "Comprehensive solution validation with vibe-check before implementation"
        })
      
      IF resolution_outcome.required_novel_approach:
        patterns.append({
          "id": f"novel-solution-{error_type}",
          "type": "breakthrough_discovery",
          "description": f"Novel solution discovered for {error_type}",
          "error_or_challenge": f"Standard solutions ineffective for {error_type}",
          "resolution_approach": solution_applied.approach_description
        })
      
      RETURN patterns
  </error_category_mapping>
</vibe_learn_error_patterns>
```

### Step 4: Cross-Project Error Resolution Patterns

Establish cross-project error resolution patterns and knowledge entities:

```xml
<cross_project_error_patterns>
  <!-- Establish cross-project error resolution intelligence -->
  <error_pattern_consolidation>
    # After error resolution, establish cross-project learning patterns
    IF error_resolved:
      LOG: "🌐 Establishing cross-project error resolution patterns"
      
      # Identify generalizable error patterns from this resolution
      CROSS_PROJECT_PATTERNS = {
        "error_category": categorize_error_type(error_type, error_context),
        "tech_stack_patterns": extract_tech_stack_patterns(PRIMARY_TECH, error_context),
        "resolution_approach": generalize_resolution_approach(final_solution_approach),
        "prevention_strategies": identify_prevention_strategies(error_type, solution_applied),
        "diagnostic_indicators": extract_diagnostic_patterns(error_symptoms, error_context)
      }
      
      # Create cross-project error pattern entities in Memento
      FOR pattern_type, pattern_data IN CROSS_PROJECT_PATTERNS.items():
        CALL: memento-mcp-create_entities
        PARAMETERS:
          - entities: [{
              "name": f"{pattern_type}-pattern-{PRIMARY_TECH}-{timestamp}",
              "entityType": "error_resolution_pattern",
              "observations": [
                f"Pattern Type: {pattern_type}",
                f"Technology Stack: {PRIMARY_TECH}",
                f"Original Error: {error_type}",
                f"Error Context: {error_context}",
                f"Pattern Details: {pattern_data.description}",
                f"Applicability: {pattern_data.applicability_conditions}",
                f"Resolution Success Rate: {pattern_data.confidence_score}",
                f"Source Project: {PROJECT_ENTITY_NAME}",
                f"Canonical Project ID: {CANONICAL_PROJECT_ID}",
                f"Prevention Value: {pattern_data.prevention_potential}",
                f"Date Discovered: {current_date()}"
              ]
            }]
      
      # Create relationships between error patterns and tech stacks
      CALL: memento-mcp-create_relations
      PARAMETERS:
        - relations: [
            {
              "from": f"error_category-pattern-{PRIMARY_TECH}-{timestamp}",
              "to": f"{PRIMARY_TECH}-error-patterns",
              "relationType": "enhances_knowledge_of",
              "metadata": {"pattern_value": "diagnostic", "canonical_project": PROJECT_ENTITY_NAME}
            },
            {
              "from": f"resolution_approach-pattern-{PRIMARY_TECH}-{timestamp}",
              "to": PROJECT_ENTITY_NAME,
              "relationType": "discovered_by",
              "metadata": {"discovery_context": "error_resolution", "pattern_reliability": pattern_data.confidence_score}
            }
          ]
      
      LOG: f"✅ Cross-project error patterns established for {len(CROSS_PROJECT_PATTERNS)} pattern types"
      
      # Store pattern establishment summary
      CALL: mcp-memory-keeper-context_save
      PARAMETERS:
        - key: f"{PROJECT_ENTITY_NAME}-cross-project-patterns-{timestamp}"
        - value: f"Established {len(CROSS_PROJECT_PATTERNS)} cross-project error patterns for {error_type} resolution"
        - category: "error_patterns"
        - priority: "high"
  </error_pattern_consolidation>
</cross_project_error_patterns>
```

### Step 4.5: Enhanced Error Resolution Patterns in Memento

Create enhanced error resolution entities with advanced pattern recognition:

```xml
<enhanced_error_resolution_patterns>
  <!-- Create enhanced error resolution patterns using Memento -->
  <advanced_pattern_creation>
    # Create enhanced error resolution patterns for future intelligence
    IF error_resolved AND solution_source != "unknown":
      LOG: "🧠 Creating enhanced error resolution patterns in Memento"
      
      # Generate enhanced error resolution entity
      ENHANCED_RESOLUTION_ENTITY = {
        "name": f"{PROJECT_ENTITY_NAME}-enhanced-error-resolution-{error_type}-{timestamp}",
        "entityType": "enhanced_error_resolution",
        "observations": [
          f"Enhanced Error Resolution Pattern",
          f"Error Classification: {error_classification}",
          f"Error Severity: {error_severity_assessment}",
          f"Primary Technology: {PRIMARY_TECH}",
          f"Technology Version: {tech_version_info}",
          f"Error Symptoms: {'; '.join(error_symptoms)}",
          f"Root Cause Analysis: {root_cause_analysis}",
          f"Solution Category: {solution_category}",
          f"Resolution Steps: {detailed_resolution_steps}",
          f"Solution Source: {solution_source}",
          f"Investigation Duration: {total_investigation_time}",
          f"Tools Used: {', '.join(debugging_tools_used)}",
          f"Files Modified: {', '.join(files_modified)}",
          f"Testing Approach: {testing_verification_method}",
          f"Prevention Strategy: {prevention_recommendations}",
          f"Confidence Score: {resolution_confidence_score}",
          f"Reusability Score: {cross_project_reusability_score}",
          f"Canonical Project: {PROJECT_ENTITY_NAME}",
          f"Canonical ID: {CANONICAL_PROJECT_ID}",
          f"Project Context: {project_context_summary}",
          f"Environment Details: {environment_configuration}",
          f"Success Metrics: {success_validation_metrics}",
          f"Date Resolved: {current_date()}",
          f"Resolution Quality: {solution_quality_assessment}"
        ]
      }
      
      # Create enhanced error resolution entity
      CALL: memento-mcp-create_entities
      PARAMETERS:
        - entities: [ENHANCED_RESOLUTION_ENTITY]
      
      # Create comprehensive relationships for enhanced pattern matching
      ENHANCED_RELATIONS = [
        # Link to project entity
        {
          "from": ENHANCED_RESOLUTION_ENTITY["name"],
          "to": PROJECT_ENTITY_NAME,
          "relationType": "enhanced_resolution_for",
          "metadata": {
            "canonical_project": PROJECT_ENTITY_NAME,
            "resolution_quality": solution_quality_assessment,
            "reusability": cross_project_reusability_score
          }
        },
        # Link to technology stack
        {
          "from": ENHANCED_RESOLUTION_ENTITY["name"],
          "to": f"{PRIMARY_TECH}-advanced-patterns",
          "relationType": "advances_knowledge_of",
          "metadata": {
            "pattern_type": "enhanced_error_resolution",
            "tech_version": tech_version_info,
            "confidence": resolution_confidence_score
          }
        },
        # Link to error category patterns
        {
          "from": ENHANCED_RESOLUTION_ENTITY["name"],
          "to": f"error-category-{error_classification}",
          "relationType": "provides_solution_for",
          "metadata": {
            "solution_category": solution_category,
            "effectiveness": solution_effectiveness_score
          }
        }
      ]
      
      # Add relation to source pattern if solution came from memory
      IF solution_source == "memory_guided" AND source_solution_entity:
        ENHANCED_RELATIONS.append({
          "from": ENHANCED_RESOLUTION_ENTITY["name"],
          "to": source_solution_entity,
          "relationType": "enhanced_adaptation_of",
          "metadata": {
            "adaptation_type": "context_specific_enhancement",
            "original_confidence": source_solution_confidence,
            "enhanced_confidence": resolution_confidence_score
          }
        })
      
      # Add relation to prevention strategies
      IF prevention_recommendations:
        ENHANCED_RELATIONS.append({
          "from": ENHANCED_RESOLUTION_ENTITY["name"],
          "to": f"{PRIMARY_TECH}-prevention-strategies",
          "relationType": "recommends_prevention_via",
          "metadata": {
            "prevention_type": prevention_strategy_type,
            "prevention_effectiveness": prevention_confidence_score
          }
        })
      
      # Create all enhanced relations
      CALL: memento-mcp-create_relations
      PARAMETERS:
        - relations: ENHANCED_RELATIONS
      
      # Store enhanced resolution success
      CALL: mcp-memory-keeper-context_save
      PARAMETERS:
        - key: f"{PROJECT_ENTITY_NAME}-enhanced-resolution-complete-{timestamp}"
        - value: f"Enhanced error resolution pattern created with {len(ENHANCED_RELATIONS)} relationships for future intelligence"
        - category: "error_patterns"
        - priority: "critical"
      
      LOG: f"✅ Enhanced error resolution pattern created with {len(ENHANCED_RELATIONS)} relationships"
      
      # Create cross-project diagnostic indicators for future error prevention
      IF diagnostic_indicators:
        DIAGNOSTIC_ENTITY = {
          "name": f"{error_type}-diagnostic-indicators-{PRIMARY_TECH}-{timestamp}",
          "entityType": "error_diagnostic_pattern",
          "observations": [
            f"Error Type: {error_type}",
            f"Technology: {PRIMARY_TECH}",
            f"Early Warning Signs: {'; '.join(diagnostic_indicators.early_warnings)}",
            f"Symptom Patterns: {'; '.join(diagnostic_indicators.symptom_patterns)}",
            f"Context Indicators: {'; '.join(diagnostic_indicators.context_clues)}",
            f"Prevention Triggers: {'; '.join(diagnostic_indicators.prevention_triggers)}",
            f"Detection Methods: {'; '.join(diagnostic_indicators.detection_methods)}",
            f"Source Project: {PROJECT_ENTITY_NAME}",
            f"Reliability Score: {diagnostic_indicators.reliability_score}",
            f"Date Established: {current_date()}"
          ]
        }
        
        CALL: memento-mcp-create_entities
        PARAMETERS:
          - entities: [DIAGNOSTIC_ENTITY]
        
        # Link diagnostic patterns to enhanced resolution
        CALL: memento-mcp-create_relations
        PARAMETERS:
          - relations: [{
              "from": DIAGNOSTIC_ENTITY["name"],
              "to": ENHANCED_RESOLUTION_ENTITY["name"],
              "relationType": "enables_early_detection_of",
              "metadata": {
                "diagnostic_value": "preventive",
                "reliability": diagnostic_indicators.reliability_score
              }
            }]
        
        LOG: f"✅ Diagnostic indicators established for early detection of {error_type}"
      
    ELSE:
      LOG: "⏭️ Enhanced error resolution patterns skipped - error not resolved or unknown solution source"
  </advanced_pattern_creation>
  
  <!-- Helper functions for enhanced pattern creation -->
  <pattern_enhancement_functions>
    FUNCTION categorize_error_type(error_type, error_context):
      """Categorize error for enhanced pattern matching"""
      categories = {
        "compilation": ["syntax", "import", "dependency", "build"],
        "runtime": ["exception", "null", "undefined", "timeout"],
        "configuration": ["config", "env", "permission", "path"],
        "integration": ["api", "database", "service", "network"],
        "performance": ["memory", "cpu", "slow", "timeout"],
        "testing": ["test", "assertion", "mock", "fixture"]
      }
      
      FOR category, keywords IN categories.items():
        IF any(keyword in error_type.lower() or keyword in error_context.lower() for keyword in keywords):
          RETURN category
      
      RETURN "general"
    
    FUNCTION extract_diagnostic_patterns(error_symptoms, error_context):
      """Extract early warning indicators for future error prevention"""
      diagnostic_patterns = {
        "early_warnings": identify_early_warning_signs(error_symptoms, error_context),
        "symptom_patterns": analyze_symptom_progression(error_symptoms),
        "context_clues": extract_context_indicators(error_context),
        "prevention_triggers": identify_prevention_opportunities(error_symptoms, error_context),
        "detection_methods": recommend_detection_methods(error_symptoms),
        "reliability_score": calculate_diagnostic_reliability(error_symptoms, error_context)
      }
      
      RETURN diagnostic_patterns
  </pattern_enhancement_functions>
</enhanced_error_resolution_patterns>
```

## Instruction Error Resolution Protocol

```xml
<instruction_error_resolution_protocol>
  <immediate_halt_and_acknowledge>
    # When instruction-following error is detected, immediately stop and ask user
    DISPLAY_ERROR_MESSAGE: |
      🚨 **INSTRUCTION-FOLLOWING ERROR DETECTED**
      
      I detected that I failed to follow the proper workflow instructions:
      {list_of_instruction_errors}
      
      This is exactly the type of error we're trying to prevent with the error resolution system.
      
      **What I should have done:**
      {correct_workflow_steps}
      
      **What I actually did:**
      {incorrect_actions_taken}
      
      **How to fix this:**
      1. I will restart the current phase properly
      2. I will follow ALL required steps in order
      3. I will ask required questions BEFORE proceeding
      4. I will store this error pattern to prevent future occurrences
      
      Would you like me to:
      A) Restart the current phase correctly
      B) Continue from where we are but fix the compliance issue
      C) Explain why this error occurred and how we can prevent it
    
    WAIT_FOR_USER_RESPONSE: true
    DO_NOT_PROCEED: until user guidance received
  </immediate_halt_and_acknowledge>
  
  <apply_instruction_fix>
    BASED_ON_USER_CHOICE:
      
      IF user_choice == "A" (restart):
        # Reset current phase and restart properly
        CALL: mcp-memory-keeper-context_save
        PARAMETERS:
          - key: "phase-restart-{current_phase}-{timestamp}"
          - value: "Restarting {current_phase} due to instruction compliance failure: {instruction_errors}"
          - category: "progress"
          - priority: "high"
        
        # Clear any incorrect state
        RESET_PHASE_STATE: {current_phase}
        
        # Restart phase with proper instruction adherence
        EXECUTE: {current_phase}_template_with_compliance_checks()
      
      IF user_choice == "B" (continue with fix):
        # Fix the specific compliance issue without full restart
        FOR_EACH error IN instruction_errors:
          APPLY_SPECIFIC_FIX(error)
          # e.g., if "skipped user questions" -> ask questions now
          # e.g., if "bypassed validation" -> run validation now
        
        # Store the fix approach
        CALL: mcp-memory-keeper-context_save
        PARAMETERS:
          - key: "instruction-fix-{timestamp}"
          - value: "Fixed instruction compliance: {fix_actions_taken}"
          - category: "progress"
          - priority: "high"
      
      IF user_choice == "C" (explain):
        # Provide detailed explanation of the error and prevention
        EXPLAIN_ERROR_CAUSE_AND_PREVENTION(instruction_errors)
        # Then ask for A or B choice
  </apply_instruction_fix>
  
  <store_instruction_error_learning>
    # Store this instruction error for future prevention
    CALL: memento-mcp-create_entities
    PARAMETERS:
      - entities: [{
          "name": "{PROJECT_ENTITY_NAME}-instruction-error-{timestamp}",
          "entityType": "instruction_failure",
          "observations": [
            "Phase: {current_phase}",
            "Template: {current_template}",
            "Error Type: {error_classification}",
            "Specific Errors: {'; '.join(instruction_errors)}",
            "Root Cause: {root_cause_analysis}",
            "Correct Procedure: {what_should_have_happened}",
            "Resolution: {how_it_was_fixed}",
            "Prevention: {how_to_prevent_future_occurrences}",
            "User Impact: {impact_on_user_experience}",
            "Canonical Project: {PROJECT_ENTITY_NAME}",
            "Date: {current_date()}"
          ]
        }]
    
    # Link to project and workflow patterns
    CALL: memento-mcp-create_relations
    PARAMETERS:
      - relations: [
          {
            "from": "{PROJECT_ENTITY_NAME}-instruction-error-{timestamp}",
            "to": "{PROJECT_ENTITY_NAME}",
            "relationType": "workflow_error_in",
            "metadata": {"canonical_project": PROJECT_ENTITY_NAME, "error_type": "instruction_compliance"}
          },
          {
            "from": "{current_phase}-workflow-pattern",
            "to": "{PROJECT_ENTITY_NAME}-instruction-error-{timestamp}",
            "relationType": "requires_compliance_check",
            "metadata": {"prevention_priority": "high"}
          }
        ]
  </store_instruction_error_learning>
</instruction_error_resolution_protocol>
```

## Integration Points for All 5 Phases

Each phase template MUST include this error detection at the beginning:

### Phase 1 (Initialize-Spec) Integration
```xml
# Add after MCP initialization, before Step 1
<include>@reference-docs/instructions/support-workflows/error-resolution-via-memory.md#instruction_compliance_validation</include>

# Specific Phase 1 checks:
user_questions_not_asked = (no user interaction detected in last 5 context items)
workflow_checkpoints_bypassed = (proceeded to technical work without idea capture)
```

### Phase 2 (Research-Spec) Integration  
```xml
# Add before research activities
<include>@reference-docs/instructions/support-workflows/error-resolution-via-memory.md#instruction_compliance_validation</include>

# Specific Phase 2 checks:
stakeholder_engagement_skipped = (no stakeholder identification or interview planning)
research_depth_insufficient = (less than minimum research requirements met)
```

### Phase 3 (Write-Spec) Integration
```xml
# Add before specification writing
<include>@reference-docs/instructions/support-workflows/error-resolution-via-memory.md#instruction_compliance_validation</include>

# Specific Phase 3 checks:
specifications_missing = (key specification sections not addressed)
detail_inadequate = (specifications lack sufficient detail for implementation)
```

### Phase 4 (Verify-Spec) Integration
```xml
# Add before verification activities
<include>@reference-docs/instructions/support-workflows/error-resolution-via-memory.md#instruction_compliance_validation</include>

# Specific Phase 4 checks:
validation_checks_skipped = (required validation steps not completed)
review_incomplete = (specifications not properly reviewed against criteria)
```

### Phase 5 (Create-Tasks) Integration
```xml
# Add before task creation
<include>@reference-docs/instructions/support-workflows/error-resolution-via-memory.md#instruction_compliance_validation</include>

# Specific Phase 5 checks:
task_breakdown_missing = (specifications not properly broken into tasks)
planning_insufficient = (task planning lacks required detail)
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
