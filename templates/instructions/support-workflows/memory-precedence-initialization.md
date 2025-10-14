---
description: Memory Systems and Precedence Initialization - Centralized Reusable Module
globs:
alwaysApply: false
version: 1.0
encoding: UTF-8
---

# Memory Systems and Precedence Initialization Workflow

<ai_meta>
  <parsing_rules>
    - Execute precedence resolution first to establish command authority
    - Initialize memory systems before any workflow processing
    - Handle MCP availability gracefully with appropriate fallbacks
    - Store initialization results for subsequent steps
    - Apply project-specific overrides when detected
  </parsing_rules>
  <integration_points>
    - Include this workflow as Step 0 in all Agent OS commands
    - Parameterize for different command contexts and requirements
    - Leverage existing precedence rules and memory integration modules
  </integration_points>
</ai_meta>

## Overview

<purpose>
  - Provide consistent memory systems and precedence initialization across all Agent OS workflows
  - Establish command authority through precedence resolution
  - Initialize Memory-Keeper, Memento, and related MCP systems with proper fallback handling
  - Apply project-specific overrides and configuration when available
  - Set up canonical project identity and namespace consolidation
</purpose>

<context>
  - Used as Step 0 by plan-product, analyze-product, create-spec, execute-tasks workflows
  - Integrates with established precedence rules and memory integration systems
  - Provides foundation for MCP intelligence architecture throughout Agent OS
  - Part of broader workflow standardization and consistency effort
</context>

<prerequisites>
  - Access to reference-docs/instructions/precedence-rules.md and memory-integration.md files
  - MCP systems available (graceful degradation if unavailable)
  - Project directory context for namespace generation
  - Optional: project-specific override configurations
</prerequisites>

## Core Initialization Workflow

<workflow_process>

### Phase 1: Precedence Resolution

<precedence_resolution>
  <!-- Include established precedence rules -->
  <include>@reference-docs/instructions/precedence-rules.md</include>
  
  # Assert Agent OS command precedence
  AGENT_OS_COMMAND = "{command_name}"  # Parameterized: plan-product, create-spec, etc.
  CURRENT_MODE = "AGENT_OS_COMMAND_ACTIVE"
  
  # Log command activation with visual indicator
  LOG: "🔴 Agent OS {command_name} active - absolute precedence"
  
  # Establish workflow authority
  PRECEDENCE_ESTABLISHED = true
  COMMAND_AUTHORITY = "AGENT_OS_ABSOLUTE"
  
  # Override any conflicting user memories or external rules
  OVERRIDE_STATUS = "ACTIVE"
  OVERRIDE_SOURCE = "Agent OS {command_name} command workflow"
</precedence_resolution>

### Phase 2: Memory Systems Initialization

<memory_initialization>
  <!-- Include established memory integration -->
  <include>@reference-docs/instructions/memory-integration.md</include>
  
  # Execute memory integration and capture detection context
  MEMORY_INTEGRATION_RESULT = execute_memory_integration()
  
  # Extract standardized detection context variables
  PROJECT_NAME = DETECTION_CONTEXT["project_name"]
  PROJECT_ENTITY_NAME = DETECTION_CONTEXT["project_entity_name"]  # Canonical name
  PRIMARY_TECH = DETECTION_CONTEXT["primary_tech"]
  TECH_STACKS = DETECTION_CONTEXT["tech_stacks"]
  CONFIDENCE_LEVEL = DETECTION_CONTEXT["confidence_level"]
  AVAILABLE_ENTITIES = DETECTION_CONTEXT["entities"]
  NAMESPACE_STATUS = DETECTION_CONTEXT["namespace_status"]
  
  # Log successful memory initialization
  LOG: "🧠 Memory-enhanced {command_name} initialized for {PROJECT_NAME} ({PRIMARY_TECH})"
  LOG: "🏷️ Project entity: {PROJECT_ENTITY_NAME} (Status: {NAMESPACE_STATUS})"
  LOG: "📊 Confidence level: {CONFIDENCE_LEVEL}"
  
  # Store initialization results for workflow use
  MEMORY_SYSTEMS_INITIALIZED = true
  INITIALIZATION_TIMESTAMP = current_timestamp()
</memory_initialization>

### Phase 3: Project-Specific Overrides Detection

<project_overrides_detection>
  # Check for project-specific overrides in main instructions
  PROJECT_OVERRIDES_AVAILABLE = false
  PROJECT_OVERRIDES = {}
  
  IF file_exists(".github/instructions/main.instructions.md"):
    # Parse project-specific Agent OS overrides
    project_overrides_raw = parse_agent_os_overrides(".github/instructions/main.instructions.md")
    
    # Extract command-specific overrides
    command_overrides_key = "has_{command_name}_overrides"  # e.g., has_plan_product_overrides
    
    IF project_overrides_raw[command_overrides_key]():
      PROJECT_OVERRIDES_AVAILABLE = true
      
      # Extract relevant override categories based on command type
      <command_specific_overrides>
        <plan_product>
          IF command_name == "plan-product":
            PROJECT_OVERRIDES = {
              "planning_requirements": project_overrides_raw.get_planning_requirements(),
              "documentation_standards": project_overrides_raw.get_documentation_standards(),
              "tech_stack_preferences": project_overrides_raw.get_tech_stack_preferences()
            }
        </plan_product>
        
        <create_spec>
          IF command_name == "create-spec":
            PROJECT_OVERRIDES = {
              "specification_standards": project_overrides_raw.get_specification_standards(),
              "testing_requirements": project_overrides_raw.get_testing_requirements(),
              "implementation_patterns": project_overrides_raw.get_implementation_patterns()
            }
        </create_spec>
        
        <execute_tasks>
          IF command_name == "execute-tasks":
            PROJECT_OVERRIDES = {
              "testing_requirements": project_overrides_raw.get_testing_requirements(),
              "implementation_standards": project_overrides_raw.get_implementation_standards(),
              "deployment_requirements": project_overrides_raw.get_deployment_requirements()
            }
        </execute_tasks>
        
        <analyze_product>
          IF command_name == "analyze-product":
            PROJECT_OVERRIDES = {
              "additional_documentation": project_overrides_raw.get_additional_documentation(),
              "custom_analysis_areas": project_overrides_raw.get_custom_analysis_areas(),
              "analysis_scope_preferences": project_overrides_raw.get_analysis_scope_preferences()
            }
        </analyze_product>
      </command_specific_overrides>
      
      # Log override detection
      LOG: "🟠 Project overrides detected for {command_name}: {len(PROJECT_OVERRIDES)} categories"
      
      # Schedule override application at appropriate workflow steps
      OVERRIDE_APPLICATION_SCHEDULED = true
      
    ELSE:
      LOG: "📋 No specific overrides found for {command_name} in project instructions"
  
  ELSE:
    LOG: "📂 No project-specific instructions found (.github/instructions/main.instructions.md)"
</project_overrides_detection>

### Phase 4: Consolidation Mode Detection

<consolidation_mode_detection>
  # Check if running in consolidation mode (specific to create-spec)
  CONSOLIDATION_MODE = false
  
  IF command_name == "create-spec" AND parameters.mode == "consolidation":
    CONSOLIDATION_MODE = true
    CONSOLIDATION_CONFIG = {
      "skip_interactive": parameters.skip_interactive || true,
      "source_data": parameters.source_data,
      "append_mode": parameters.append_to_existing || true,
      "memory_context": parameters.memory_context || "consolidation",
      "preserve_metadata": parameters.preserve_original_metadata || true
    }
    
    LOG: "🔄 {command_name} running in consolidation mode for {CONSOLIDATION_CONFIG.source_data.feature_name}"
    LOG: "📁 Source: {CONSOLIDATION_CONFIG.source_data.original_folder} → Consolidated structure"
    
  ELSE:
    LOG: "🆕 {command_name} running in standard interactive mode"
</consolidation_mode_detection>

### Phase 5: Legacy Knowledge Base Support (Deprecated)

<legacy_kb_support>
  # Legacy knowledge base initialization (maintained for backward compatibility)
  # This section provides graceful fallback for older workflow patterns
  
  <step_metadata>
    <action>initialize project knowledge base (legacy)</action>
    <purpose>backward compatibility with older Agent OS versions</purpose>
    <status>deprecated - use memory integration instead</status>
  </step_metadata>
  
  <kb_namespace>
    <project_name>derived from current directory name</project_name>
    <namespace_format>kb_{sanitized_project_name}</namespace_format>
    <session_description>Agent OS {command_name} operation</session_description>
  </kb_namespace>
  
  <kb_initialization_process>
    <availability_check>
      1. CHECK if memory-keeper MCP is available
      2. IF available AND memory_integration_failed: PROCEED with legacy KB initialization
      3. IF memory integration successful: SKIP legacy KB (use modern approach)
      4. IF unavailable: Apply appropriate fallback based on command requirements
    </availability_check>
    
    <namespace_setup>
      1. GENERATE project namespace from directory name
      2. START new context session with project directory path
      3. SET session description: "Agent OS {command_name} operation"
      4. LOG successful legacy KB initialization
    </namespace_setup>
    
    <fallback_behavior>
      <plan_product_fallback>
        IF command_name == "plan-product" AND memory_systems_unavailable:
          STOP_AND_ASK_USER: "Restart MCP servers or cancel"
        ELSE:
          GRACEFUL_DEGRADATION: "Continue with available memory systems"
      </plan_product_fallback>
      
      <other_commands_fallback>
        IF command_name IN ["create-spec", "execute-tasks", "analyze-product"] AND memory_systems_unavailable:
          LOG: "Memory systems unavailable - using standard file-based workflow"
          GRACEFUL_DEGRADATION: "Continue without memory enhancement"
        ELSE:
          USE_AVAILABLE_SYSTEMS: "Proceed with partial memory integration"
      </other_commands_fallback>
    </fallback_behavior>
  </kb_initialization_process>
</legacy_kb_support>

</workflow_process>

## Integration Parameters

<workflow_parameters>
  <for_plan_product>
    <command_name>plan-product</command_name>
    <memory_requirements>CRITICAL</memory_requirements>
    <override_categories>
      - planning_requirements
      - documentation_standards
      - tech_stack_preferences
    </override_categories>
    <session_description>Agent OS plan-product operation</session_description>
    <fallback_behavior>STOP_AND_ASK</fallback_behavior>
  </for_plan_product>
  
  <for_create_spec>
    <command_name>create-spec</command_name>
    <memory_requirements>RECOMMENDED</memory_requirements>
    <override_categories>
      - specification_standards
      - testing_requirements
      - implementation_patterns
    </override_categories>
    <session_description>Agent OS create-spec operation</session_description>
    <consolidation_support>true</consolidation_support>
    <fallback_behavior>GRACEFUL_DEGRADATION</fallback_behavior>
  </for_create_spec>
  
  <for_execute_tasks>
    <command_name>execute-tasks</command_name>
    <memory_requirements>RECOMMENDED</memory_requirements>
    <override_categories>
      - testing_requirements
      - implementation_standards
      - deployment_requirements
    </override_categories>
    <session_description>Agent OS execute-tasks operation</session_description>
    <fallback_behavior>GRACEFUL_DEGRADATION</fallback_behavior>
  </for_execute_tasks>
  
  <for_analyze_product>
    <command_name>analyze-product</command_name>
    <memory_requirements>RECOMMENDED</memory_requirements>
    <override_categories>
      - additional_documentation
      - custom_analysis_areas
      - analysis_scope_preferences
    </override_categories>
    <session_description>Agent OS analyze-product operation</session_description>
    <fallback_behavior>GRACEFUL_DEGRADATION</fallback_behavior>
  </for_analyze_product>
</workflow_parameters>

## Error Handling

<error_scenarios>
  <memory_systems_unavailable>
    <condition>MCP systems (Memory-Keeper, Memento, Meilisearch) are not available</condition>
    
    <plan_product_behavior>
      <condition>command_name == "plan-product"</condition>
      <action>
        STOP_EXECUTION()
        PRESENT_USER_OPTIONS: [
          "⚠️ Memory systems (Memory-Keeper, Memento, Meilisearch) are unavailable.",
          "The enhanced V2.0 workflow requires these systems for optimal functionality.",
          "",
          "🔄 Usually restarting MCP servers fixes this issue.",
          "",
          "Options:",
          "a) Wait while you restart MCP servers (recommended)",
          "c) Cancel and retry later",
          "",
          "What would you like to do?"
        ]
        AWAIT_USER_RESPONSE()
      </action>
    </plan_product_behavior>
    
    <other_commands_behavior>
      <condition>command_name IN ["create-spec", "execute-tasks", "analyze-product"]</condition>
      <action>
        LOG: "⚠️ Memory systems unavailable - using standard file-based workflow"
        FALLBACK_MODE = "STANDARD_FILE_BASED"
        MEMORY_ENHANCEMENT = false
        CONTINUE_EXECUTION()
        DOCUMENT_LIMITATION: "This session operates without memory enhancement"
      </action>
    </other_commands_behavior>
  </memory_systems_unavailable>
  
  <partial_memory_availability>
    <condition>Some but not all memory systems are available</condition>
    <action>
      LOG: "🟡 Partial memory systems available - proceeding with reduced functionality"
      
      FOR_EACH unavailable_system:
        DISABLE_FEATURES: features_requiring_system(unavailable_system)
        LOG: "- {unavailable_system}: {disabled_features} disabled"
      
      CONTINUE_WITH_AVAILABLE_SYSTEMS: true
    </action>
  </partial_memory_availability>
  
  <project_override_errors>
    <condition>Error parsing project-specific overrides</condition>
    <action>
      LOG: "⚠️ Error parsing project overrides: {error_details}"
      LOG: "Continuing with standard Agent OS workflow patterns"
      PROJECT_OVERRIDES_AVAILABLE = false
      CONTINUE_EXECUTION()
    </action>
  </project_override_errors>
</error_scenarios>

## Success Criteria

<validation_checklist>
  <verify>
    - [ ] Precedence established and Agent OS command authority asserted
    - [ ] Memory integration executed successfully (or appropriate fallback applied)
    - [ ] Project identity and namespace consolidation completed
    - [ ] Project-specific overrides detected and scheduled for application
    - [ ] Consolidation mode detected and configured (if applicable)
    - [ ] Initialization results stored for subsequent workflow steps
    - [ ] Error conditions handled gracefully with appropriate user feedback
    - [ ] Legacy compatibility maintained where necessary
  </verify>
</validation_checklist>

<performance_targets>
  <memory_system_initialization>2 seconds</memory_system_initialization>
  <project_override_detection>1 second</project_override_detection>
  <namespace_consolidation>3 seconds</namespace_consolidation>
  <total_initialization_time>5 seconds</total_initialization_time>
</performance_targets>

## Usage Examples

<include_example>
  <memory_precedence_initialization>
    <include>@reference-docs/instructions/memory-precedence-initialization.md</include>
    EXECUTE: memory_precedence_initialization_workflow()
    PARAMETERS:
      - command_name: "{current_command}"
      - memory_requirements: "{CRITICAL|RECOMMENDED}"
      - session_description: "Agent OS {command_name} operation"
    
    RESULT: {
      PROJECT_NAME,
      PROJECT_ENTITY_NAME,
      PRIMARY_TECH,
      TECH_STACKS,
      CONFIDENCE_LEVEL,
      PROJECT_OVERRIDES,
      MEMORY_SYSTEMS_INITIALIZED
    }
  </memory_precedence_initialization>
</include_example>

<integration_pattern>
  <step number="0" name="memory_and_precedence_initialization">
    
    ### Step 0: Initialize Memory Systems and Resolve Precedence
    
    <!-- Use centralized workflow -->
    <include>@reference-docs/instructions/memory-precedence-initialization.md</include>
    
    # Execute centralized initialization with command-specific parameters
    EXECUTE: memory_precedence_initialization_workflow()
    PARAMETERS: {command_specific_parameters}
    
    # Workflow provides standardized initialization results for subsequent steps
  </step>
</integration_pattern>

## Migration Notes

<migration_guidance>
  <from_legacy_patterns>
    1. REPLACE: Individual precedence resolution blocks with centralized include
    2. REPLACE: Manual memory-keeper initialization with memory integration include
    3. UPDATE: Variable names to use standardized DETECTION_CONTEXT outputs
    4. REMOVE: Duplicate precedence logging and command assertion code
    5. CONSOLIDATE: Project override detection into centralized pattern
  </from_legacy_patterns>
  
  <backward_compatibility>
    1. PRESERVE: Legacy KB initialization patterns as fallback
    2. MAINTAIN: Existing variable names in DETECTION_CONTEXT
    3. SUPPORT: Graceful degradation for projects not using new patterns
    4. DOCUMENT: Any breaking changes in workflow behavior
  </backward_compatibility>
</migration_guidance>

---

**This workflow implements the standardized Memory Systems and Precedence Initialization pattern and should be included as Step 0 in all Agent OS command workflows.**