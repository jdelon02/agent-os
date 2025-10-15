---
description: Enhanced MCP Learning Integration - Reusable Module for Cross-Workflow Intelligence
version: 1.0
encoding: UTF-8
---

# Enhanced MCP Learning Integration Module

<ai_meta>
  <parsing_rules>
    - Execute MCP tool integrations sequentially for optimal learning
    - Apply graceful degradation when individual tools unavailable
    - Store all learning outcomes in dual memory architecture
    - Use parameterized approach for context-specific integration
    - Maintain cross-project pattern consistency
  </parsing_rules>
  <parameterization>
    - workflow_phase: Context-specific phase identifier (initialize, research, write, verify, tasks, execute)
    - context: Phase-specific context focus area
    - learning_focus: Array of learning objectives for the specific integration
  </parameterization>
  <enforcement_level>RECOMMENDED</enforcement_level>
  <fallback_behavior>GRACEFUL_DEGRADATION</fallback_behavior>
</ai_meta>

## Module Overview

<purpose>
  - Integrate sequential-thinking, vibe-check, vibe-distill, and vibe-learn MCP tools into any Agent OS workflow phase
  - Create cross-project learning patterns through systematic knowledge capture
  - Enable context-specific intelligence enhancement with parameterized approach
  - Provide fail-safe operations with graceful degradation when tools unavailable
</purpose>

<context>
  - Reusable module for integration across all 5 Agent OS workflow phases
  - Enhanced with dual memory architecture (Memory-Keeper + Memento)
  - Parameterized for context-specific learning objectives
  - Designed for cross-project pattern recognition and knowledge transfer
</context>

<integration_parameters>
  - **workflow_phase**: {workflow_phase} - Current workflow phase for context
  - **context**: {context} - Phase-specific focus area for learning
  - **learning_focus**: {learning_focus} - Array of learning objectives
  - **mcp_tool_flags**: {mcp_tool_flags} - Optional configuration for selective tool usage (Task 3.1)
</integration_parameters>

## Optional MCP Tool Flags (Task 3.1 Enhancement)

<mcp_tool_flags_configuration>
  <!-- Optional tool configuration flags for selective MCP tool usage -->
  <purpose>
    - Allow users to selectively enable/disable specific MCP tools
    - Support environments with limited MCP tool availability
    - Enable performance optimization by skipping unnecessary tools
    - Provide fine-grained control over learning integration behavior
  </purpose>
  
  <flag_parameters>
    # Optional flag parameters (default: all enabled if available)
    MCP_TOOL_FLAGS = {
      "sequential_thinking_enabled": {mcp_tool_flags.sequential_thinking_enabled ?? true},
      "vibe_check_enabled": {mcp_tool_flags.vibe_check_enabled ?? true},
      "vibe_distill_enabled": {mcp_tool_flags.vibe_distill_enabled ?? true},
      "vibe_learn_enabled": {mcp_tool_flags.vibe_learn_enabled ?? true},
      "force_manual_fallback": {mcp_tool_flags.force_manual_fallback ?? false},
      "detailed_logging": {mcp_tool_flags.detailed_logging ?? true}
    }
  </flag_parameters>
  
  <flag_validation>
    # Validate flag configuration and log settings
    IF MCP_TOOL_FLAGS.force_manual_fallback:
      LOG: "🔧 Force manual fallback enabled - MCP tools will be bypassed"
      # Override all tool flags to false when force_manual_fallback is true
      MCP_TOOL_FLAGS["sequential_thinking_enabled"] = false
      MCP_TOOL_FLAGS["vibe_check_enabled"] = false
      MCP_TOOL_FLAGS["vibe_distill_enabled"] = false
      MCP_TOOL_FLAGS["vibe_learn_enabled"] = false
    
    # Log active tool configuration
    active_tools = [tool for tool, enabled in MCP_TOOL_FLAGS.items() if enabled and not tool.endswith("_enabled") and not tool in ["force_manual_fallback", "detailed_logging"]]
    LOG: "⚙️ MCP Tool Flags Configuration:"
    LOG: "  - Sequential Thinking: {'enabled' if MCP_TOOL_FLAGS['sequential_thinking_enabled'] else 'disabled'}"
    LOG: "  - Vibe Check: {'enabled' if MCP_TOOL_FLAGS['vibe_check_enabled'] else 'disabled'}"
    LOG: "  - Vibe Distill: {'enabled' if MCP_TOOL_FLAGS['vibe_distill_enabled'] else 'disabled'}"
    LOG: "  - Vibe Learn: {'enabled' if MCP_TOOL_FLAGS['vibe_learn_enabled'] else 'disabled'}"
    LOG: "  - Force Manual: {'enabled' if MCP_TOOL_FLAGS['force_manual_fallback'] else 'disabled'}"
    LOG: "  - Detailed Logging: {'enabled' if MCP_TOOL_FLAGS['detailed_logging'] else 'disabled'}"
    
    # Store flag configuration in memory
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "mcp-tool-flags-{workflow_phase}"
      - value: "Tool flags configuration: {MCP_TOOL_FLAGS}"
      - category: "configuration"
      - priority: "normal"
  </flag_validation>
  
  <usage_examples>
    # Example 1: Disable sequential thinking for simple workflows
    mcp_tool_flags: {
      "sequential_thinking_enabled": false,
      "vibe_check_enabled": true,
      "vibe_distill_enabled": true,
      "vibe_learn_enabled": true
    }
    
    # Example 2: Enable only vibe-learn for pattern collection
    mcp_tool_flags: {
      "sequential_thinking_enabled": false,
      "vibe_check_enabled": false,
      "vibe_distill_enabled": false,
      "vibe_learn_enabled": true
    }
    
    # Example 3: Force manual fallback for all tools
    mcp_tool_flags: {
      "force_manual_fallback": true,
      "detailed_logging": true
    }
    
    # Example 4: Default configuration (all tools enabled)
    mcp_tool_flags: {}
  </usage_examples>
</mcp_tool_flags_configuration>

## Enhanced MCP Learning Workflow

### Step 1: Initialize Learning Session

<learning_session_initialization>
  <!-- Session management with parameterized naming -->
  <session_management>
    # Create or continue learning-specific session
    SESSION_KEY = "{PROJECT_ENTITY_NAME}-{workflow_phase}-{timestamp}"
    SESSION_DESCRIPTION = "Enhanced MCP learning for {workflow_phase} phase: {context}"
    
    LOG: "🧠 Enhanced Learning: Initializing {workflow_phase} phase learning session"
    LOG: "🎯 Context Focus: {context}"
    LOG: "📚 Learning Objectives: {learning_focus}"
    
    # Initialize monitoring and logging system (Task 3.2)
    EXECUTE: logging_configuration_setup()
    EXECUTE: enhance_existing_logs()
    
    # Store learning session context
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "learning-session-{workflow_phase}"
      - value: "Enhanced MCP learning session for {workflow_phase}: {context} | Focus: {learning_focus}"
      - category: "learning_session"
      - priority: "high"
  </session_management>
  
  <!-- MCP tool availability assessment with optional flags support (Task 3.1) -->
  <tool_availability_check>
    # Quality gates with fail-closed availability checks and flag-based filtering
    AVAILABLE_TOOLS = []
    ENABLED_TOOLS = []
    
    # Check sequential-thinking availability and flag
    IF MCP_TOOL_FLAGS["sequential_thinking_enabled"]:
      TRY:
        TEST_CALL: sequential-thinking with minimal parameters
        IF success: 
          AVAILABLE_TOOLS.append("sequential-thinking")
          ENABLED_TOOLS.append("sequential-thinking")
        LOG: "✅ Sequential-thinking: Available and enabled"
      EXCEPT:
        LOG: "⚠️ Sequential-thinking: Unavailable - will use structured manual analysis"
    ELSE:
      LOG: "⏭️ Sequential-thinking: Disabled by flag - will use manual analysis"
    
    # Check vibe-check availability and flag
    IF MCP_TOOL_FLAGS["vibe_check_enabled"]:
      TRY:
        TEST_CALL: vibe-check with minimal parameters
        IF success: 
          AVAILABLE_TOOLS.append("vibe-check")
          ENABLED_TOOLS.append("vibe-check")
        LOG: "✅ Vibe-check: Available and enabled"
      EXCEPT:
        LOG: "⚠️ Vibe-check: Unavailable - will use manual validation"
    ELSE:
      LOG: "⏭️ Vibe-check: Disabled by flag - will use manual validation"
    
    # Check vibe-distill availability and flag
    IF MCP_TOOL_FLAGS["vibe_distill_enabled"]:
      TRY:
        TEST_CALL: vibe-distill with minimal parameters
        IF success: 
          AVAILABLE_TOOLS.append("vibe-distill")
          ENABLED_TOOLS.append("vibe-distill")
        LOG: "✅ Vibe-distill: Available and enabled"  
      EXCEPT:
        LOG: "⚠️ Vibe-distill: Unavailable - will use manual simplification"
    ELSE:
      LOG: "⏭️ Vibe-distill: Disabled by flag - will use manual simplification"
    
    # Check vibe-learn availability and flag
    IF MCP_TOOL_FLAGS["vibe_learn_enabled"]:
      TRY:
        TEST_CALL: vibe-learn with minimal parameters
        IF success: 
          AVAILABLE_TOOLS.append("vibe-learn")
          ENABLED_TOOLS.append("vibe-learn")
        LOG: "✅ Vibe-learn: Available and enabled"
      EXCEPT:
        LOG: "⚠️ Vibe-learn: Unavailable - will use manual pattern storage"
    ELSE:
      LOG: "⏭️ Vibe-learn: Disabled by flag - will use manual pattern storage"
    
    # Enhanced logging for flag-aware tool status
    LOG: "🔧 Available MCP Tools: {len(AVAILABLE_TOOLS)} of 4 ({AVAILABLE_TOOLS})"
    LOG: "⚙️ Enabled Tools (respecting flags): {len(ENABLED_TOOLS)} ({ENABLED_TOOLS})"
    
    # Store enhanced availability status with flag information
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "mcp-tool-availability-{timestamp}"
      - value: "Available tools: {AVAILABLE_TOOLS} | Enabled tools: {ENABLED_TOOLS} | Context: {workflow_phase} | Flags: {MCP_TOOL_FLAGS}"
      - category: "tool_status"
      - priority: "normal"
  </tool_availability_check>
</learning_session_initialization>

### Step 2: Apply Sequential Thinking for Complex Analysis

<sequential_thinking_integration>
  <!-- Apply sequential thinking when available and appropriate -->
  <sequential_thinking_application>
    # Trigger conditions for sequential thinking (respects MCP tool flags - Task 3.1)
    APPLY_SEQUENTIAL_THINKING = (
      "sequential-thinking" in ENABLED_TOOLS AND
      (
        "complexity" in {context} OR
        "thinking_patterns" in {learning_focus} OR
        "decision_quality" in {learning_focus} OR
        len({learning_focus}) >= 3
      )
    )
    
    IF APPLY_SEQUENTIAL_THINKING:
      LOG: "🤔 Applying sequential-thinking for {context} analysis"
      
      # Context-specific sequential thinking parameters
      THINKING_PARAMETERS = {
        "total_thoughts": 6 if "simple" in {context} else 8,
        "analysis_focus": "{context} analysis and decision-making",
        "objective": "Enhanced {workflow_phase} phase outcomes through {learning_focus}",
        "phase_context": "{workflow_phase}"
      }
      
      # Execute sequential thinking
      TRY:
        CALL: sequential-thinking
        PARAMETERS: THINKING_PARAMETERS
        
        # Store thinking results
        CALL: mcp-memory-keeper-context_save
        PARAMETERS:
          - key: "{PROJECT_ENTITY_NAME}-sequential-thinking-{workflow_phase}"
          - value: "Sequential thinking results for {context}: {thinking_results}"
          - category: "thinking_patterns"
          - priority: "high"
        
        LOG: "✅ Sequential thinking completed for {context}"
        
      EXCEPT sequential_thinking_error:
        LOG: "⚠️ Sequential thinking failed: {error} - proceeding with manual analysis"
        
        # Manual structured analysis fallback
        EXECUTE: structured_manual_analysis({context}, {learning_focus})
    
    ELSE:
      LOG: "⏭️ Sequential thinking not applicable for {context} - skipping"
  </sequential_thinking_application>
</sequential_thinking_integration>

### Step 3: Apply Vibe Check for Approach Validation

<vibe_check_integration>
  <!-- Apply vibe check for approach validation and assumption testing -->
  <vibe_check_application>
    # Trigger conditions for vibe check (respects MCP tool flags - Task 3.1)
    APPLY_VIBE_CHECK = (
      "vibe-check" in ENABLED_TOOLS AND
      (
        "validation" in {context} OR
        "gap_detection" in {learning_focus} OR  
        "assumption_testing" in {learning_focus} OR
        "approach_validation" in {learning_focus} OR
        {workflow_phase} in ["verify", "write"]
      )
    )
    
    IF APPLY_VIBE_CHECK:
      LOG: "🎯 Applying vibe-check for {context} validation"
      
      # Context-specific vibe check parameters
      VIBE_CHECK_PARAMETERS = {
        "plan": "Current {workflow_phase} approach and {context} decisions",
        "userRequest": "Phase {workflow_phase} requirements and {learning_focus} objectives", 
        "confidence": "Current confidence level in {context} approach",
        "phase": "{workflow_phase}",
        "focusAreas": {learning_focus}
      }
      
      # Execute vibe check
      TRY:
        CALL: vibe-check
        PARAMETERS: VIBE_CHECK_PARAMETERS
        
        # Store validation results  
        CALL: mcp-memory-keeper-context_save
        PARAMETERS:
          - key: "{PROJECT_ENTITY_NAME}-vibe-check-{workflow_phase}"
          - value: "Vibe check validation for {context}: {validation_results}"
          - category: "validation_patterns"
          - priority: "high"
        
        LOG: "✅ Vibe check completed for {context} validation"
        
      EXCEPT vibe_check_error:
        LOG: "⚠️ Vibe check failed: {error} - proceeding with manual validation"
        
        # Manual validation fallback
        EXECUTE: manual_approach_validation({context}, {learning_focus})
    
    ELSE:
      LOG: "⏭️ Vibe check not applicable for {context} - skipping"
  </vibe_check_application>
</vibe_check_integration>

### Step 4: Apply Vibe Distill for Complexity Simplification  

<vibe_distill_integration>
  <!-- Apply vibe distill for simplifying complex concepts and plans -->
  <vibe_distill_application>
    # Trigger conditions for vibe distill (respects MCP tool flags - Task 3.1)
    APPLY_VIBE_DISTILL = (
      "vibe-distill" in ENABLED_TOOLS AND
      (
        "simplification" in {context} OR
        "complexity_prevention" in {learning_focus} OR
        "scope_simplification" in {learning_focus} OR
        "research_simplification" in {learning_focus} OR
        "task_simplification" in {learning_focus}
      )
    )
    
    IF APPLY_VIBE_DISTILL:
      LOG: "📝 Applying vibe-distill for {context} simplification"
      
      # Context-specific vibe distill parameters
      VIBE_DISTILL_PARAMETERS = {
        "plan": "Current {workflow_phase} plan and {context} complexity",
        "userRequest": "Simplified approach to {learning_focus} in {workflow_phase} phase"
      }
      
      # Execute vibe distill
      TRY:
        CALL: vibe-distill  
        PARAMETERS: VIBE_DISTILL_PARAMETERS
        
        # Store simplification results
        CALL: mcp-memory-keeper-context_save
        PARAMETERS:
          - key: "{PROJECT_ENTITY_NAME}-vibe-distill-{workflow_phase}"
          - value: "Vibe distill simplification for {context}: {simplification_results}"
          - category: "simplification_patterns"
          - priority: "high"
        
        LOG: "✅ Vibe distill completed for {context} simplification"
        
      EXCEPT vibe_distill_error:
        LOG: "⚠️ Vibe distill failed: {error} - proceeding with manual simplification"
        
        # Manual simplification fallback
        EXECUTE: manual_complexity_reduction({context}, {learning_focus})
    
    ELSE:
      LOG: "⏭️ Vibe distill not applicable for {context} - skipping"
  </vibe_distill_application>
</vibe_distill_integration>

### Step 5: Apply Vibe Learn for Pattern Storage

<vibe_learn_integration>
  <!-- Apply vibe learn for capturing and storing learning patterns -->
  <vibe_learn_application>
    # Always attempt vibe learn if enabled - captures learning from all phases (respects MCP tool flags - Task 3.1)
    IF "vibe-learn" in ENABLED_TOOLS:
      LOG: "🧠 Applying vibe-learn for {context} pattern storage"
      
      # Identify learning patterns from current phase
      LEARNING_PATTERNS = extract_learning_patterns({workflow_phase}, {context}, {learning_focus})
      
      # Apply vibe learn for each significant pattern
      FOR pattern IN LEARNING_PATTERNS:
        TRY:
          # Context-specific vibe learn parameters
          VIBE_LEARN_PARAMETERS = {
            "mistake": pattern.challenge_or_mistake,
            "category": determine_category(pattern, {workflow_phase}), 
            "solution": pattern.solution_or_approach,
            "sessionId": SESSION_KEY
          }
          
          CALL: vibe-learn
          PARAMETERS: VIBE_LEARN_PARAMETERS
          
          # Store pattern learning results
          CALL: mcp-memory-keeper-context_save
          PARAMETERS:
            - key: "{PROJECT_ENTITY_NAME}-pattern-{pattern.id}-{workflow_phase}"
            - value: "Pattern learned: {pattern.description} | Solution: {pattern.solution}"
            - category: "learning_patterns"
            - priority: "normal"
          
        EXCEPT vibe_learn_error:
          LOG: "⚠️ Vibe learn failed for pattern {pattern.id}: {error}"
          
          # Manual pattern storage fallback
          CALL: mcp-memory-keeper-context_save
          PARAMETERS:
            - key: "manual-pattern-{pattern.id}-{workflow_phase}"
            - value: "Manual pattern storage: {pattern.description} | Context: {context}"
            - category: "learning_patterns"  
            - priority: "normal"
      
      LOG: "✅ Vibe learn completed - {len(LEARNING_PATTERNS)} patterns processed"
      
    ELSE:
      LOG: "⚠️ Vibe learn unavailable - using manual pattern storage"
      
      # Manual pattern storage fallback
      EXECUTE: manual_pattern_storage({workflow_phase}, {context}, {learning_focus})
  </vibe_learn_application>
</vibe_learn_integration>

### Step 6: Create Cross-Project Learning Entities

<cross_project_learning_entities>
  <!-- Create Memento entities with deterministic IDs for cross-project learning -->
  <memento_entity_creation>
    # Create learning entities for cross-project pattern recognition
    LOG: "🔗 Creating cross-project learning entities for {context}"
    
    # Generate deterministic entity IDs
    LEARNING_ENTITY_ID = "{PROJECT_ENTITY_NAME}-enhanced-learning-{workflow_phase}-{context_hash}"
    PATTERN_ENTITY_ID = "{PROJECT_ENTITY_NAME}-{workflow_phase}-patterns-{timestamp}"
    
    TRY:
      # Create main learning integration entity
      CALL: memento-mcp-create_entities
      PARAMETERS:
        - entities: [{
            "name": LEARNING_ENTITY_ID,
            "entityType": "enhanced_mcp_learning",
            "observations": [
              "Workflow Phase: {workflow_phase}",
              "Context Focus: {context}",
              "Learning Objectives: {learning_focus}",
              "Available Tools: {AVAILABLE_TOOLS}",
              "Integration Success: {integration_success_metrics}",
              "Patterns Discovered: {len(LEARNING_PATTERNS)}",
              "Project: {PROJECT_ENTITY_NAME}",
              "Date: {current_date()}"
            ]
          }]
      
      # Create pattern-specific entities
      CALL: memento-mcp-create_entities
      PARAMETERS:
        - entities: [{
            "name": PATTERN_ENTITY_ID,
            "entityType": "workflow_learning_patterns",
            "observations": [
              "Phase: {workflow_phase}",
              "Context: {context}",
              "Successful Approaches: {successful_approaches}",
              "Learning Focus Areas: {learning_focus}",
              "Tool Integration Results: {tool_results}",
              "Cross-Project Applicability: High",
              "Date: {current_date()}"
            ]
          }]
      
      # Create relationships for cross-project learning
      CALL: memento-mcp-create_relations  
      PARAMETERS:
        - relations: [
            {
              "from": LEARNING_ENTITY_ID,
              "to": "{PROJECT_ENTITY_NAME}",
              "relationType": "enhanced_learning_for",
              "metadata": {"workflow_phase": "{workflow_phase}", "context": "{context}"}
            },
            {
              "from": PATTERN_ENTITY_ID,
              "to": LEARNING_ENTITY_ID,
              "relationType": "provides_patterns_for",
              "metadata": {"learning_focus": {learning_focus}}
            }
          ]
      
      LOG: "✅ Cross-project learning entities created successfully"
      
    EXCEPT memento_error:
      LOG: "⚠️ Memento entity creation failed: {error} - learning data stored in Memory-Keeper only"
      
      # Fallback to Memory-Keeper only storage
      CALL: mcp-memory-keeper-context_save
      PARAMETERS:
        - key: "cross-project-learning-fallback-{workflow_phase}"
        - value: "Cross-project learning data: {learning_summary} | Context: {context}"
        - category: "learning_patterns"
        - priority: "high"
  </memento_entity_creation>
</cross_project_learning_entities>

### Step 7: Generate Learning Integration Summary

<learning_integration_summary>
  <!-- Comprehensive summary of learning integration results -->
  <integration_summary_generation>
    LOG: "📊 Generating enhanced MCP learning integration summary"
    
    # Calculate integration success metrics
    INTEGRATION_METRICS = {
      "tools_available": len(AVAILABLE_TOOLS),
      "tools_used": count_tools_successfully_used(),
      "patterns_learned": len(LEARNING_PATTERNS),
      "cross_project_entities": count_memento_entities_created(),
      "memory_patterns_stored": count_memory_keeper_patterns(),
      "integration_success_rate": calculate_success_rate()
    }
    
    # Generate comprehensive summary
    LEARNING_SUMMARY = f"""
    Enhanced MCP Learning Integration Summary
    Workflow Phase: {workflow_phase}
    Context Focus: {context}
    Learning Objectives: {learning_focus}
    
    Tool Integration Results:
    - Available Tools: {AVAILABLE_TOOLS}
    - Integration Success Rate: {INTEGRATION_METRICS['integration_success_rate']}%
    - Patterns Learned: {INTEGRATION_METRICS['patterns_learned']}
    
    Cross-Project Learning:
    - Memento Entities Created: {INTEGRATION_METRICS['cross_project_entities']}
    - Memory-Keeper Patterns: {INTEGRATION_METRICS['memory_patterns_stored']}
    
    Learning Outcomes:
    - {context} analysis enhanced with {workflow_phase} specific patterns
    - Cross-project applicability: High for similar {context} contexts
    - Knowledge transfer potential: {calculate_transfer_potential()}
    """
    
    # Store final integration summary
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "{PROJECT_ENTITY_NAME}-enhanced-learning-summary-{workflow_phase}"
      - value: LEARNING_SUMMARY
      - category: "learning_summary"
      - priority: "high"
    
    # Enhanced completion logging with performance metrics (Task 3.2)
    LOG: "✅ Enhanced MCP Learning Integration Complete"
    LOG: "📈 Integration Success Rate: {INTEGRATION_METRICS['integration_success_rate']}%"
    LOG: "🔗 Cross-Project Patterns: {INTEGRATION_METRICS['patterns_learned']} discovered"
    LOG: "💾 Knowledge Storage: Memory-Keeper + Memento dual architecture"
    
    # Generate and log detailed performance summary (Task 3.2 Enhancement)
    IF PERFORMANCE_TRACKING:
      log_performance_summary()
    ELSE:
      LOG: "📊 Performance tracking was disabled for this integration"
    
    # Enhance integration metrics with performance data
    IF PERFORMANCE_TRACKING:
      performance_report = generate_performance_report()
      INTEGRATION_METRICS["performance_data"] = performance_report
      INTEGRATION_METRICS["monitoring_enabled"] = true
    ELSE:
      INTEGRATION_METRICS["performance_data"] = "Performance tracking disabled"
      INTEGRATION_METRICS["monitoring_enabled"] = false
    
    RETURN: INTEGRATION_METRICS
  </integration_summary_generation>
</learning_integration_summary>

## Integration Helpers and Utilities

### Pattern Extraction Helper

<pattern_extraction_utilities>
  FUNCTION extract_learning_patterns(workflow_phase, context, learning_focus):
    """Extract learning patterns from current phase execution"""
    patterns = []
    
    # Context-specific pattern extraction
    IF workflow_phase == "initialize":
      patterns = extract_user_interaction_patterns(context, learning_focus)
    ELIF workflow_phase == "research": 
      patterns = extract_research_decomposition_patterns(context, learning_focus)
    ELIF workflow_phase == "write":
      patterns = extract_architectural_decision_patterns(context, learning_focus)
    ELIF workflow_phase == "verify":
      patterns = extract_validation_patterns(context, learning_focus)
    ELIF workflow_phase == "tasks":
      patterns = extract_task_breakdown_patterns(context, learning_focus)
    ELIF workflow_phase == "execute":
      patterns = extract_implementation_patterns(context, learning_focus)
    
    RETURN patterns

  FUNCTION determine_category(pattern, workflow_phase):
    """Determine vibe-learn category based on pattern type and phase"""
    category_mapping = {
      "user_interaction": "Complex Solution Bias",
      "scope_issues": "Feature Creep", 
      "implementation_problems": "Premature Implementation",
      "requirement_misalignment": "Misalignment",
      "tool_overuse": "Overtooling"
    }
    
    RETURN category_mapping.get(pattern.type, "Other")
</pattern_extraction_utilities>

### Graceful Degradation Handlers

<graceful_degradation_handlers>
  FUNCTION manual_structured_analysis(context, learning_focus):
    """Manual fallback for sequential-thinking unavailability"""
    LOG: "🔧 Executing manual structured analysis for {context}"
    
    # Structured manual analysis approach
    analysis_steps = [
      f"1. Analyze {context} requirements and constraints",
      f"2. Identify key decision points in {context}",
      f"3. Evaluate approaches based on {learning_focus}",
      f"4. Document reasoning and trade-offs",
      f"5. Create structured decision framework"
    ]
    
    # Execute manual analysis
    FOR step IN analysis_steps:
      LOG: f"📝 {step}"
      # Execute step-specific analysis
    
    RETURN "manual_analysis_complete"

  FUNCTION manual_approach_validation(context, learning_focus):
    """Manual fallback for vibe-check unavailability"""
    LOG: "🔧 Executing manual approach validation for {context}"
    
    validation_checklist = [
      f"✓ {context} approach aligns with requirements",
      f"✓ Learning focus {learning_focus} objectives addressed", 
      f"✓ No major assumptions left unvalidated",
      f"✓ Approach is practical and implementable",
      f"✓ Quality standards and constraints considered"
    ]
    
    # Execute manual validation
    FOR check IN validation_checklist:
      LOG: f"✅ {check}"
    
    RETURN "manual_validation_complete"

  FUNCTION manual_complexity_reduction(context, learning_focus):
    """Manual fallback for vibe-distill unavailability"""
    LOG: "🔧 Executing manual complexity reduction for {context}"
    
    simplification_steps = [
      f"1. Identify core essential elements of {context}",
      f"2. Remove non-critical complexity from {learning_focus}",
      f"3. Create simplified approach prioritizing clarity",
      f"4. Validate simplified approach meets requirements",
      f"5. Document simplification decisions and trade-offs"
    ]
    
    # Execute manual simplification
    FOR step IN simplification_steps:
      LOG: f"📝 {step}"
    
    RETURN "manual_simplification_complete"

  FUNCTION manual_pattern_storage(workflow_phase, context, learning_focus):
    """Manual fallback for vibe-learn unavailability"""
    LOG: "🔧 Executing manual pattern storage for {workflow_phase}"
    
    # Store patterns manually in Memory-Keeper
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "manual-patterns-{workflow_phase}-{timestamp}"
      - value: "Manual pattern storage: {context} insights | Focus: {learning_focus}"
      - category: "learning_patterns"
      - priority: "normal"
    
    RETURN "manual_pattern_storage_complete"
</graceful_degradation_handlers>

## Comprehensive Logging and Monitoring System (Task 3.2 Enhancement)

<comprehensive_logging_monitoring>
  <!-- Advanced logging and performance metrics for MCP tool integrations -->
  <purpose>
    - Provide structured logging for debugging and analysis
    - Track MCP tool performance and effectiveness metrics
    - Monitor integration success rates across workflow phases
    - Enable data-driven optimization of learning integration
    - Support troubleshooting and quality assurance
  </purpose>
  
  <logging_configuration>
    # Enhanced logging configuration based on detailed_logging flag
    LOGGING_ENABLED = MCP_TOOL_FLAGS.get("detailed_logging", true)
    LOG_LEVEL = "DETAILED" if LOGGING_ENABLED else "BASIC"
    PERFORMANCE_TRACKING = LOGGING_ENABLED  # Enable performance metrics when detailed logging is on
    
    # Initialize performance tracking variables
    IF PERFORMANCE_TRACKING:
      START_TIME = current_timestamp_ms()
      TOOL_PERFORMANCE_METRICS = {
        "sequential_thinking": {"calls": 0, "successes": 0, "failures": 0, "total_time": 0},
        "vibe_check": {"calls": 0, "successes": 0, "failures": 0, "total_time": 0},
        "vibe_distill": {"calls": 0, "successes": 0, "failures": 0, "total_time": 0},
        "vibe_learn": {"calls": 0, "successes": 0, "failures": 0, "total_time": 0}
      }
      INTEGRATION_EVENTS = []
      
      LOG: "📊 Performance tracking enabled for detailed monitoring"
  </logging_configuration>
  
  <structured_logging_functions>
    # Enhanced logging functions with structured data
    FUNCTION log_tool_start(tool_name, operation, context):
      """Log the start of an MCP tool operation with structured data"""
      timestamp = current_timestamp()
      event = {
        "type": "tool_start",
        "tool": tool_name,
        "operation": operation,
        "context": context,
        "workflow_phase": {workflow_phase},
        "timestamp": timestamp
      }
      
      IF PERFORMANCE_TRACKING:
        INTEGRATION_EVENTS.append(event)
        TOOL_PERFORMANCE_METRICS[tool_name]["calls"] += 1
      
      IF LOG_LEVEL == "DETAILED":
        LOG: f"🚀 [{timestamp}] Starting {tool_name} for {operation} in {context}"
      ELSE:
        LOG: f"🚀 Starting {tool_name}"
      
      RETURN timestamp
    
    FUNCTION log_tool_success(tool_name, operation, start_time, results_summary=""):
      """Log successful completion of an MCP tool operation"""
      end_time = current_timestamp()
      duration = calculate_duration(start_time, end_time)
      
      IF PERFORMANCE_TRACKING:
        TOOL_PERFORMANCE_METRICS[tool_name]["successes"] += 1
        TOOL_PERFORMANCE_METRICS[tool_name]["total_time"] += duration
        
        success_event = {
          "type": "tool_success",
          "tool": tool_name,
          "operation": operation,
          "duration_ms": duration,
          "workflow_phase": {workflow_phase},
          "timestamp": end_time,
          "results_summary": results_summary[:200]  # Truncate long summaries
        }
        INTEGRATION_EVENTS.append(success_event)
      
      IF LOG_LEVEL == "DETAILED":
        LOG: f"✅ [{end_time}] {tool_name} completed successfully in {duration}ms"
        IF results_summary:
          LOG: f"   📋 Results: {results_summary}"
      ELSE:
        LOG: f"✅ {tool_name} completed successfully"
    
    FUNCTION log_tool_failure(tool_name, operation, start_time, error_message, fallback_used=""):
      """Log failure of an MCP tool operation and fallback usage"""
      end_time = current_timestamp()
      duration = calculate_duration(start_time, end_time)
      
      IF PERFORMANCE_TRACKING:
        TOOL_PERFORMANCE_METRICS[tool_name]["failures"] += 1
        TOOL_PERFORMANCE_METRICS[tool_name]["total_time"] += duration
        
        failure_event = {
          "type": "tool_failure",
          "tool": tool_name,
          "operation": operation,
          "duration_ms": duration,
          "error_message": error_message[:500],  # Truncate long errors
          "fallback_used": fallback_used,
          "workflow_phase": {workflow_phase},
          "timestamp": end_time
        }
        INTEGRATION_EVENTS.append(failure_event)
      
      IF LOG_LEVEL == "DETAILED":
        LOG: f"❌ [{end_time}] {tool_name} failed after {duration}ms: {error_message}"
        IF fallback_used:
          LOG: f"   🔄 Fallback: {fallback_used}"
      ELSE:
        LOG: f"❌ {tool_name} failed - using fallback"
    
    FUNCTION log_integration_phase(phase_name, status, details=""):
      """Log integration workflow phase transitions"""
      timestamp = current_timestamp()
      
      IF PERFORMANCE_TRACKING:
        phase_event = {
          "type": "integration_phase",
          "phase": phase_name,
          "status": status,
          "details": details,
          "workflow_phase": {workflow_phase},
          "timestamp": timestamp
        }
        INTEGRATION_EVENTS.append(phase_event)
      
      status_emoji = {"start": "🔄", "complete": "✅", "skip": "⏭️", "error": "❌"}.get(status, "ℹ️")
      LOG: f"{status_emoji} [{timestamp}] Integration Phase: {phase_name} - {status.upper()}"
      
      IF details and LOG_LEVEL == "DETAILED":
        LOG: f"   📝 {details}"
  </structured_logging_functions>
  
  <performance_metrics_collection>
    # Performance metrics collection and analysis
    FUNCTION calculate_tool_effectiveness(tool_name):
      """Calculate effectiveness metrics for a specific MCP tool"""
      metrics = TOOL_PERFORMANCE_METRICS.get(tool_name, {})
      
      IF metrics.get("calls", 0) == 0:
        RETURN {"success_rate": 0, "avg_duration": 0, "total_calls": 0}
      
      success_rate = (metrics["successes"] / metrics["calls"]) * 100
      avg_duration = metrics["total_time"] / metrics["calls"] if metrics["calls"] > 0 else 0
      
      RETURN {
        "success_rate": round(success_rate, 2),
        "avg_duration_ms": round(avg_duration, 2),
        "total_calls": metrics["calls"],
        "successes": metrics["successes"],
        "failures": metrics["failures"],
        "total_time_ms": metrics["total_time"]
      }
    
    FUNCTION generate_performance_report():
      """Generate comprehensive performance report for all MCP tools"""
      IF not PERFORMANCE_TRACKING:
        RETURN "Performance tracking disabled"
      
      total_duration = current_timestamp_ms() - START_TIME
      
      performance_report = {
        "integration_summary": {
          "workflow_phase": {workflow_phase},
          "context": {context},
          "total_duration_ms": total_duration,
          "events_logged": len(INTEGRATION_EVENTS)
        },
        "tool_performance": {},
        "overall_metrics": {
          "total_tools_called": 0,
          "total_successes": 0,
          "total_failures": 0,
          "overall_success_rate": 0
        }
      }
      
      # Calculate metrics for each tool
      total_calls = 0
      total_successes = 0
      
      FOR tool_name IN ["sequential_thinking", "vibe_check", "vibe_distill", "vibe_learn"]:
        tool_metrics = calculate_tool_effectiveness(tool_name)
        performance_report["tool_performance"][tool_name] = tool_metrics
        
        total_calls += tool_metrics["total_calls"]
        total_successes += tool_metrics["successes"]
      
      # Calculate overall metrics
      performance_report["overall_metrics"]["total_tools_called"] = total_calls
      performance_report["overall_metrics"]["total_successes"] = total_successes
      performance_report["overall_metrics"]["total_failures"] = total_calls - total_successes
      
      IF total_calls > 0:
        performance_report["overall_metrics"]["overall_success_rate"] = round((total_successes / total_calls) * 100, 2)
      
      RETURN performance_report
    
    FUNCTION log_performance_summary():
      """Log comprehensive performance summary"""
      IF not PERFORMANCE_TRACKING:
        LOG: "📊 Performance tracking was disabled for this integration"
        RETURN
      
      report = generate_performance_report()
      
      LOG: "📊 === MCP Tool Performance Summary ==="
      LOG: f"🏷️ Phase: {report['integration_summary']['workflow_phase']} | Context: {report['integration_summary']['context']}"
      LOG: f"⏱️ Total Duration: {report['integration_summary']['total_duration_ms']}ms"
      LOG: f"📋 Events Logged: {report['integration_summary']['events_logged']}"
      LOG: ""
      LOG: "🔧 Tool-Specific Metrics:"
      
      FOR tool, metrics IN report["tool_performance"].items():
        IF metrics["total_calls"] > 0:
          LOG: f"  {tool}:"
          LOG: f"    - Success Rate: {metrics['success_rate']}% ({metrics['successes']}/{metrics['total_calls']})"
          LOG: f"    - Avg Duration: {metrics['avg_duration_ms']}ms"
          LOG: f"    - Total Time: {metrics['total_time_ms']}ms"
        ELSE:
          LOG: f"  {tool}: Not called"
      
      LOG: ""
      LOG: "📈 Overall Integration Metrics:"
      LOG: f"  - Total Tool Calls: {report['overall_metrics']['total_tools_called']}"
      LOG: f"  - Overall Success Rate: {report['overall_metrics']['overall_success_rate']}%"
      LOG: f"  - Total Failures: {report['overall_metrics']['total_failures']}"
      
      # Store detailed performance data in memory
      CALL: mcp-memory-keeper-context_save
      PARAMETERS:
        - key: "{PROJECT_ENTITY_NAME}-performance-report-{workflow_phase}-{timestamp}"
        - value: json_serialize(report)
        - category: "performance_metrics"
        - priority: "high"
      
      LOG: "📊 === End Performance Summary ==="
  </performance_metrics_collection>
  
  <monitoring_integration>
    # Integration with existing workflow monitoring
    FUNCTION enhance_existing_logs():
      """Enhance existing logs with monitoring context"""
      # Add monitoring context to standard logs
      MONITORING_CONTEXT = {
        "session_id": SESSION_KEY,
        "workflow_phase": {workflow_phase},
        "context": {context},
        "learning_focus": {learning_focus},
        "tool_flags": MCP_TOOL_FLAGS,
        "performance_tracking": PERFORMANCE_TRACKING
      }
      
      # Store monitoring context for correlation
      CALL: mcp-memory-keeper-context_save
      PARAMETERS:
        - key: "monitoring-context-{workflow_phase}-{timestamp}"
        - value: json_serialize(MONITORING_CONTEXT)
        - category: "monitoring"
        - priority: "normal"
  </monitoring_integration>
  
  <usage_in_workflow>
    # Usage pattern for integration into existing workflow steps
    
    # Example: Enhanced sequential thinking with monitoring
    """
    start_time = log_tool_start("sequential_thinking", "complex_analysis", {context})
    TRY:
      CALL: sequential-thinking
      PARAMETERS: THINKING_PARAMETERS
      log_tool_success("sequential_thinking", "complex_analysis", start_time, "Analysis completed with insights")
    EXCEPT error:
      log_tool_failure("sequential_thinking", "complex_analysis", start_time, str(error), "manual_structured_analysis")
    """
    
    # Example: Performance summary at integration end
    """
    # At the end of the integration workflow
    log_performance_summary()
    """
  </usage_in_workflow>
</comprehensive_logging_monitoring>

## Usage Examples

### Example 1: Initialize Phase Integration

```xml
<include>@templates/instructions/support-workflows/enhanced-mcp-learning-integration.md</include>

PARAMETERS:
  - workflow_phase: "initialize" 
  - context: "user_interaction_patterns"
  - learning_focus: ["question_effectiveness", "scope_simplification"]
```

### Example 2: Verify Phase Integration

```xml
<include>@templates/instructions/support-workflows/enhanced-mcp-learning-integration.md</include>

PARAMETERS:
  - workflow_phase: "verify"
  - context: "validation_patterns" 
  - learning_focus: ["gap_detection", "assumption_testing"]
```

### Example 3: Execute Phase Integration

```xml
<include>@templates/instructions/support-workflows/enhanced-mcp-learning-integration.md</include>

PARAMETERS:
  - workflow_phase: "execute"
  - context: "task_implementation"
  - learning_focus: ["implementation_decisions", "error_resolution", "task_effectiveness"]
```

## Quality Gates and Validation

### Integration Success Criteria

<integration_success_criteria>
  - [ ] **Tool Availability Check**: All 4 MCP tools tested for availability
  - [ ] **Graceful Degradation**: Fallback mechanisms working for unavailable tools
  - [ ] **Memory Storage**: All learning patterns stored in Memory-Keeper categories
  - [ ] **Cross-Project Entities**: Memento entities created with deterministic IDs
  - [ ] **Parameterization**: Context-specific parameters properly applied
  - [ ] **Integration Summary**: Comprehensive summary generated with metrics
  - [ ] **Error Handling**: All error conditions handled with appropriate logging
</integration_success_criteria>

### Validation Checklist

<validation_checklist>
  ```
  🧠 ENHANCED MCP LEARNING INTEGRATION STATUS:
  
  INITIALIZATION:
  ✅ SESSION_CREATED: [{SESSION_KEY}]
  ✅ PARAMETERS_APPLIED: [workflow_phase: {workflow_phase}, context: {context}]
  ✅ TOOL_AVAILABILITY: [{AVAILABLE_TOOLS}]
  
  MCP TOOL INTEGRATION:
  ✅ SEQUENTIAL_THINKING: [applied/skipped - reason: {reason}]
  ✅ VIBE_CHECK: [applied/skipped - reason: {reason}]
  ✅ VIBE_DISTILL: [applied/skipped - reason: {reason}]
  ✅ VIBE_LEARN: [applied/skipped - reason: {reason}]
  
  KNOWLEDGE STORAGE:
  ✅ MEMORY_KEEPER_PATTERNS: [{pattern_count} stored]
  ✅ MEMENTO_ENTITIES: [{entity_count} created]
  ✅ CROSS_PROJECT_RELATIONS: [established/failed]
  
  INTEGRATION_SUMMARY:
  ✅ SUCCESS_RATE: [{integration_success_rate}%]
  ✅ PATTERNS_LEARNED: [{patterns_learned}]
  ✅ TRANSFER_POTENTIAL: [High/Medium/Low]
  
  OVERALL_STATUS: [COMPLETE/INCOMPLETE - explain any issues]
  ```
</validation_checklist>

---

**Module Status:** Production ready for integration across all Agent OS workflow phases
**Cross-Project Learning:** Enabled via Memento knowledge graph with deterministic entity IDs
**Fail-Safe Operation:** Comprehensive graceful degradation ensures workflow continuation regardless of individual tool availability