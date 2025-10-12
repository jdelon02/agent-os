---
description: Specification Consolidation with Integrated Memory System
globs:
alwaysApply: false
version: 1.0
encoding: UTF-8
---

# Specification Consolidation with Integrated Memory System

<ai_meta>
  <parsing_rules>
    - Initialize memory systems before consolidation
    - Process XML blocks first for structured data
    - Execute instructions in sequential order
    - Use templates as exact patterns
    - Preserve all existing specification content
    - Store consolidation progress in memory systems vs context accumulation
    - Use context reduction throughout workflow
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
  - Migrate existing date-prefixed specification folders to consolidated structure
  - Preserve all specification content and relationships
  - Create unified spec.md, tasks.md, and sub-specs structure
  - Integrate memory-keeper for enhanced migration tracking and pattern recognition
</purpose>

<context>
  - Part of Agent OS framework
  - Used to migrate legacy specification structures to new consolidated approach
  - Builds on existing specification content without data loss
  - Enhanced with persistent Integrated Memory System for informed migration
</context>

<prerequisites>
  - Existing .agent-os/specs/ directory with date-prefixed folders
  - Write access to project root
  - Memory-keeper MCP available (optional, graceful degradation)
</prerequisites>

<process_flow>

<step number="0" name="memory_and_precedence_initialization">

### Step 0: Initialize Memory Systems and Resolve Precedence

<precedence_resolution>
  <!-- Include precedence rules -->
  <include>@reference-docs/instructions/precedence-rules.md</include>
  
  # Assert Agent OS command precedence
  AGENT_OS_COMMAND = "consolidate-specs"
  CURRENT_MODE = "AGENT_OS_COMMAND_ACTIVE"
  LOG: "🔴 Agent OS consolidate-specs active - absolute precedence"
</precedence_resolution>

<memory_initialization>
  <!-- Include memory integration -->
  <include>@reference-docs/instructions/memory-integration.md</include>
  
  # Access detected context from memory integration
  PROJECT_NAME = DETECTION_CONTEXT["project_name"]
  PRIMARY_TECH = DETECTION_CONTEXT["primary_tech"]
  TECH_STACKS = DETECTION_CONTEXT["tech_stacks"]
  CONFIDENCE_LEVEL = DETECTION_CONTEXT["confidence_level"]
  AVAILABLE_ENTITIES = DETECTION_CONTEXT["entities"]
  
  LOG: "Memory-enhanced consolidate-specs initialized for {PROJECT_NAME} ({PRIMARY_TECH})"
</memory_initialization>

</step>

<step number="1" name="catalog_existing_specifications">

### Step 1: Catalog Existing Specifications (Structure-Based Detection)

<step_metadata>
  <action>scan and catalog non-consolidated specification structures</action>
  <purpose>identify any folder structure that doesn't match expected consolidated format</purpose>
  <memory_integration>context reduction + pattern recognition</memory_integration>
  <detection_method>structure-based rather than naming-pattern-based</detection_method>
</step_metadata>

<expected_consolidated_structure>
  <target_structure>
    .agent-os/specs/
    ├── spec.md                    # Single master specification file
    ├── tasks.md                   # Single master tasks file  
    └── sub-specs/                 # Feature-based sub-specifications folder
        ├── [feature-name]/        # Feature-specific folders
        │   ├── technical-spec.md
        │   ├── api-spec.md
        │   ├── database-schema.md
        │   └── tests.md
        └── [another-feature]/     # Additional feature folders
  </target_structure>
  <consolidation_indicators>
    - Single spec.md file exists in root
    - Single tasks.md file exists in root
    - sub-specs/ folder contains feature-based subdirectories (not individual files)
    - No loose specification folders in root level
  </consolidation_indicators>
</expected_consolidated_structure>

<structure_detection_logic>
  <consolidation_check>
    # Determine if specs directory is already consolidated
    is_consolidated = (
      file_exists(".agent-os/specs/spec.md") AND
      file_exists(".agent-os/specs/tasks.md") AND
      directory_exists(".agent-os/specs/sub-specs/") AND
      sub_specs_contains_only_feature_folders() AND
      no_loose_spec_folders_in_root()
    )
    
    IF is_consolidated:
      LOG: "✅ Specifications already consolidated - no action needed"
      SKIP: remaining consolidation steps
      EXIT: with success status
  </consolidation_check>
  <non_consolidated_detection>
    # Find all folders/files that need consolidation using recursive scanning
    consolidation_targets = []
    
    # Recursive function to scan all directories for specifications
    FUNCTION scan_directory_recursively(directory_path, max_depth=10, current_depth=0):
      IF current_depth > max_depth:
        LOG: "⚠️ Maximum depth {max_depth} reached at {directory_path}"
        RETURN []
      
      found_targets = []
      
      FOR_EACH: item IN list_directory(directory_path):
        item_path = join_path(directory_path, item.name)
        relative_path = make_relative_to_specs_root(item_path)
        
        # Skip consolidated structure items at root level only
        IF current_depth == 0:
          IF item.name == "sub-specs":
            SKIP: # This is the expected consolidated sub-specs structure
          
          IF item.name IN ["spec.md", "tasks.md"]:
            SKIP: # These ARE the consolidated structure (root-level master files)
        
        IF item.is_directory:
          # Analyze this directory for specifications
          folder_analysis = analyze_folder_for_specs_recursive(item_path, relative_path)
          
          # Add to targets if it contains specifications
          IF folder_analysis.contains_specifications:
            found_targets.append(folder_analysis)
            LOG: "🔍 Found non-consolidated folder: {relative_path} (depth {current_depth})"
          
          # Recursively scan subdirectories
          subdirectory_targets = scan_directory_recursively(item_path, max_depth, current_depth + 1)
          found_targets.extend(subdirectory_targets)
        
        ELIF item.is_file AND item.name.endswith('.md'):
          # Skip root-level consolidated files
          IF current_depth == 0 AND item.name IN ["spec.md", "tasks.md"]:
            SKIP: # Already handled above
          ELSE:
            # Analyze loose specification file at any depth
            file_analysis = analyze_loose_spec_file_recursive(item_path, relative_path)
            found_targets.append(file_analysis)
            LOG: "🔍 Found loose specification file: {relative_path} (depth {current_depth})"
      
      RETURN found_targets
    
    # Start recursive scan from specs root
    consolidation_targets = scan_directory_recursively(".agent-os/specs/", max_depth=10, current_depth=0)
  </non_consolidated_detection>
</structure_detection_logic>

<catalog_areas>
  <directory_scanning>
    - Scan .agent-os/specs/ for ANY subfolder (except sub-specs)
    - Detect subfolders containing spec.md or tasks.md files that need consolidation  
    - Identify standalone specification files in root directory (excluding root spec.md and tasks.md)
    - Catalog sub-specs/ files that aren't in feature-based folder structure
    - Find any non-consolidated specification content including _archive folders
  </directory_scanning>
  <content_analysis>
    - Parse spec.md files from ANY source folder for feature names and descriptions
    - Extract task breakdowns from ANY tasks.md files found
    - Analyze sub-specs files regardless of their current organization
    - Identify cross-references between specifications across different structures
  </content_analysis>
  <relationship_mapping>
    - Map dependencies between specifications regardless of current folder structure
    - Identify shared components and features across different organizations
    - Track decision references and architectural choices from any source
    - Document completion status indicators from all found specifications
  </relationship_mapping>
</catalog_areas>

<recursive_analysis_functions>
  # Implementation of recursive analysis functions for comprehensive scanning
  
  FUNCTION analyze_folder_for_specs_recursive(folder_path, relative_path):
    # Comprehensive analysis of a folder to determine if it contains specifications
    folder_analysis = {
      "path": folder_path,
      "relative_path": relative_path,
      "name": extract_folder_name(folder_path),
      "type": "folder",
      "depth": count_path_separators(relative_path),
      "contains_specifications": false,
      "spec_files": [],
      "task_files": [],
      "sub_spec_files": [],
      "loose_md_files": [],
      "subdirectories": [],
      "feature_indicators": [],
      "estimated_complexity": "unknown"
    }
    
    # Scan immediate contents of folder
    FOR_EACH: item IN list_directory(folder_path):
      item_path = join_path(folder_path, item.name)
      
      IF item.is_file:
        IF item.name == "spec.md":
          folder_analysis.spec_files.append(item_path)
          folder_analysis.contains_specifications = true
          
          # Extract feature indicators from spec content
          spec_content = read_file_safely(item_path)
          IF spec_content:
            folder_analysis.feature_indicators = extract_feature_indicators(spec_content)
            folder_analysis.estimated_complexity = estimate_spec_complexity(spec_content)
        
        ELIF item.name == "tasks.md":
          folder_analysis.task_files.append(item_path)
          folder_analysis.contains_specifications = true
        
        ELIF item.name.endswith(".md") AND item.name NOT IN ["README.md", "CHANGELOG.md"]:
          # Other markdown files that might be specifications
          folder_analysis.loose_md_files.append(item_path)
          
          # Analyze content to see if it's a specification
          md_content = read_file_safely(item_path)
          IF is_specification_content(md_content):
            folder_analysis.contains_specifications = true
      
      ELIF item.is_directory:
        folder_analysis.subdirectories.append(item.name)
        
        # Check for common sub-spec directories
        IF item.name IN ["sub-specs", "technical-specs", "api-specs", "database-schemas"]:
          folder_analysis.contains_specifications = true
          
          # Scan sub-spec directory for files
          FOR_EACH: sub_spec_file IN list_files(item_path, "*.md"):
            folder_analysis.sub_spec_files.append(sub_spec_file)
    
    RETURN folder_analysis
  
  FUNCTION analyze_loose_spec_file_recursive(file_path, relative_path):
    # Analysis of a loose markdown file to determine if it's a specification
    file_analysis = {
      "path": file_path,
      "relative_path": relative_path,
      "name": extract_filename(file_path),
      "type": "loose_file",
      "depth": count_path_separators(relative_path),
      "is_specification": false,
      "feature_indicators": [],
      "estimated_complexity": "unknown",
      "content_type": "unknown"
    }
    
    # Analyze file content to determine if it's a specification
    file_content = read_file_safely(file_path)
    IF file_content:
      file_analysis.is_specification = is_specification_content(file_content)
      file_analysis.feature_indicators = extract_feature_indicators(file_content)
      file_analysis.estimated_complexity = estimate_spec_complexity(file_content)
      file_analysis.content_type = determine_content_type(file_content)
    
    RETURN file_analysis
  
  FUNCTION is_specification_content(content):
    # Determine if markdown content represents a specification document
    specification_indicators = [
      "## Overview", "# Spec Requirements", "## User Stories", 
      "## Spec Scope", "## Expected Deliverable", "## Technical Specification",
      "## API Specification", "## Database Schema", "## Implementation Plan",
      "Status: Planning", "Status: In Progress", "Status: Complete"
    ]
    
    indicator_count = 0
    FOR_EACH: indicator IN specification_indicators:
      IF indicator IN content:
        indicator_count += 1
    
    # Consider it a specification if it has 2+ indicators
    RETURN indicator_count >= 2
  
  FUNCTION extract_feature_indicators(content):
    # Extract key feature indicators from specification content
    indicators = []
    
    # Extract feature name from headers
    feature_name_matches = regex_find_all(r"#{1,2}\s*Feature[:\s]+(.+)", content)
    IF feature_name_matches:
      indicators.extend(feature_name_matches)
    
    # Extract technology mentions
    tech_keywords = ["Laravel", "MongoDB", "Neo4j", "MySQL", "Redis", "InfluxDB", "React", "Next.js"]
    FOR_EACH: keyword IN tech_keywords:
      IF keyword IN content:
        indicators.append("tech:" + keyword)
    
    # Extract component mentions
    component_matches = regex_find_all(r"\*\*([A-Z][a-zA-Z\s]+)\*\*[\s]*-", content)
    IF component_matches:
      FOR_EACH: component IN component_matches:
        indicators.append("component:" + component.strip())
    
    RETURN unique(indicators)
  
  FUNCTION estimate_spec_complexity(content):
    # Estimate specification complexity based on content analysis
    content_length = length(content)
    section_count = count_occurrences(content, "##")
    task_count = count_occurrences(content, "- [ ]")
    
    IF content_length > 10000 OR section_count > 15 OR task_count > 30:
      RETURN "XL"
    ELIF content_length > 5000 OR section_count > 10 OR task_count > 15:
      RETURN "L"
    ELIF content_length > 2000 OR section_count > 5 OR task_count > 5:
      RETURN "M"
    ELSE:
      RETURN "S"
</recursive_analysis_functions>

<memory_enhanced_cataloging>
  # Create checkpoint before cataloging
  CALL: mcp-memory-keeper-context_checkpoint
  PARAMETERS:
    - name: "consolidation-start-{PROJECT_NAME}"
    - description: "Beginning structure-based specification consolidation for {PROJECT_NAME}"
  
  # Check if already consolidated
  consolidation_status = check_consolidation_status(".agent-os/specs/")
  
  IF consolidation_status.is_consolidated:
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "consolidation-status"
      - value: "Specifications already consolidated - no action needed"
      - category: "analysis"
      - priority: "high"
    
    LOG: "✅ Specifications already consolidated - exiting"
    RETURN: {"status": "already_consolidated", "action": "none"}
  
  # Scan for non-consolidated structures using recursive algorithm
  specs_directory = ".agent-os/specs/"
  
  # Execute recursive scan to find all specification sources
  consolidation_targets = scan_directory_recursively(specs_directory, max_depth=10, current_depth=0)
  
  # Store each target in Memory-Keeper for workflow continuity
  FOR_EACH: target IN consolidation_targets:
    # Determine appropriate key based on target type
    target_key = CASE target.type:
      "folder" -> "consolidation-folder-{sanitize_path(target.relative_path)}"
      "loose_file" -> "consolidation-file-{sanitize_path(target.relative_path)}"
      DEFAULT -> "consolidation-target-{sanitize_path(target.relative_path)}"
    
    # Store target analysis in Memory-Keeper
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: target_key
      - value: serialize_target_analysis(target)
      - category: "analysis"
      - priority: "normal"
    
    LOG: "📁 Cataloged {target.type}: {target.relative_path} (depth: {target.depth})"
  
  # Store patterns in Memento for each target
  FOR_EACH: target IN consolidation_targets:
    CALL: memento-mcp-create_entities
    PARAMETERS:
      - entities: [{
          "name": "{PROJECT_NAME}-spec-{target.name}",
          "entityType": "specification_pattern",
          "observations": [
            "Source: {target.name}",
            "Type: {target.type}",
            "Features: {target.features}",
            "Structure: {target.structure}",
            "Status: Non-consolidated format"
          ]
        }]
  
  # Analyze consolidation requirements
  consolidation_plan = create_consolidation_plan(consolidation_targets)
  
  CALL: mcp-memory-keeper-context_save
  PARAMETERS:
    - key: "consolidation-plan"
    - value: consolidation_plan
    - category: "decision"
    - priority: "high"
  
  LOG: "📊 Found {len(consolidation_targets)} specification sources to consolidate"
  LOG: "🎯 Consolidation targets: {[t.name for t in consolidation_targets]}"
</memory_enhanced_cataloging>

<catalog_template>
  ## Specification Catalog
  
  Found the following non-consolidated specifications:
  
  ### Consolidation Targets by Type
  
  #### Folders with Specifications
  - **[FOLDER_NAME]** ([SOURCE_TYPE]): [FEATURE_SUMMARY]
    - Spec: [SPEC_STATUS]
    - Tasks: [TASK_COUNT] tasks
    - Sub-specs: [SUB_SPEC_LIST]
    - Structure: [DETECTED_STRUCTURE]
  
  #### Loose Specification Files
  - **[FILE_NAME]**: [FILE_SUMMARY]
    - Type: [FILE_TYPE]
    - Content: [CONTENT_SUMMARY]
  
  #### Legacy Dated Directories
  - **[DATED_FOLDER_NAME]**: [FEATURE_SUMMARY]
    - Original Date: [EXTRACTED_DATE]
    - Spec: [SPEC_STATUS]
    - Tasks: [TASK_COUNT] tasks
  
  ### Consolidation Requirements
  - Total Sources: [SOURCE_COUNT]
  - Total Features: [FEATURE_COUNT]
  - Total Tasks: [TASK_COUNT]
  - Sub-spec Files: [SUB_SPEC_COUNT]
  - Cross-references: [REFERENCE_COUNT]
</catalog_template>

<civildiy_example_scenarios>
  # Examples of what the enhanced recursive consolidate-specs would find in civildiy project
  
  ## Current Civildiy Structure Detection (Recursive)
  
  ### Scenario 1: Current Civildiy Archive Structure (FIXED with Recursive Scanning)
  ```
  .agent-os/specs/
  └── _archive/                              # ← DETECTED: folder at depth 0
      ├── specs-original-2025-10-09/         # ← DETECTED: folder at depth 1
      │   ├── civility_technical_spec.md     # ← DETECTED: spec file at depth 2
      │   ├── mongodb_integration_phase2a_spec.md # ← DETECTED: spec file at depth 2
      │   ├── redis-configuration.md         # ← DETECTED: spec file at depth 2
      │   └── relationships_technical_spec.md # ← DETECTED: spec file at depth 2
      ├── phase7/                            # ← DETECTED: folder at depth 1
      │   └── analytics/                     # ← DETECTED: folder at depth 2
      │       └── spec.md                    # ← DETECTED: spec file at depth 3
      ├── phase2/                            # ← DETECTED: folder at depth 1
      │   ├── activity-modules/              # ← DETECTED: folder at depth 2
      │   │   └── spec.md                    # ← DETECTED: spec file at depth 3
      │   ├── hybrid-database-architecture/  # ← DETECTED: folder at depth 2
      │   │   └── spec.md                    # ← DETECTED: spec file at depth 3
      │   └── phase1-to-phase2-transition/   # ← DETECTED: folder at depth 2
      │       └── spec.md                    # ← DETECTED: spec file at depth 3
      ├── dated-directories/                 # ← DETECTED: folder at depth 1
      │   ├── 2025-08-16-core-platform-foundation/ # ← DETECTED: folder at depth 2
      │   │   └── spec.md                    # ← DETECTED: spec file at depth 3
      │   └── 2025-08-27-mongodb-activity-modules/ # ← DETECTED: folder at depth 2
      │       └── spec.md                    # ← DETECTED: spec file at depth 3
      ├── phase1.md                          # ← DETECTED: loose file at depth 1
      ├── phase2.md                          # ← DETECTED: loose file at depth 1
      └── index.md                           # ← DETECTED: loose file at depth 1
  ```
  **Detection Result**: ~15+ consolidation targets found (ALL specification content recursively detected)
  
  ### Scenario 2: Mixed Legacy Structure
  ```
  .agent-os/specs/
  ├── phase1.md                              # ← DETECTED: loose spec file
  ├── phase2.md                              # ← DETECTED: loose spec file
  ├── index.md                               # ← DETECTED: loose spec file
  ├── feature-auth/                          # ← DETECTED: feature folder
  │   ├── spec.md
  │   └── tasks.md
  ├── feature-dashboard/                     # ← DETECTED: feature folder
  │   ├── spec.md
  │   └── sub-specs/
  │       └── api-spec.md
  └── 2025-10-01-new-feature/                # ← DETECTED: dated folder
      └── spec.md
  ```
  **Detection Result**: 6 consolidation targets found
  
  ### Scenario 3: Already Consolidated
  ```
  .agent-os/specs/
  ├── spec.md                                # ✓ SKIPPED: This IS the consolidated file
  ├── tasks.md                               # ✓ SKIPPED: This IS the consolidated file
  ├── sub-specs/                             # ✓ SKIPPED: Expected consolidated structure
  │   ├── core-platform/
  │   │   ├── technical-spec.md
  │   │   └── api-spec.md
  │   └── mongodb-modules/
  │       └── database-schema.md
  └── _archive/                              # ✓ SKIPPED: Expected archive location
  ```
  **Detection Result**: Already consolidated, no action needed
  
  ### Scenario 4: Mixed with Existing Consolidated Structure
  ```
  .agent-os/specs/
  ├── spec.md                                # ✓ SKIPPED: Existing consolidated file
  ├── tasks.md                               # ✓ SKIPPED: Existing consolidated file
  ├── new-feature.md                         # ← DETECTED: loose file
  ├── legacy-feature/                        # ← DETECTED: folder with specs
  │   └── spec.md
  ├── sub-specs/                             # ✓ SKIPPED: Expected structure
  │   └── existing-feature/
  └── _archive/                              # ✓ SKIPPED: Expected archive
  ```
  **Detection Result**: 2 consolidation targets found (will append to existing files)
</civildiy_example_scenarios>

<instructions>
  ACTION: Recursively scan and catalog ALL existing specifications at any depth with memory integration
  DEPTH: Search up to 10 levels deep to find all nested specification content
  ANALYZE: Content structure and relationships between specifications regardless of folder depth
  STORE: Complete catalog results in Integrated Memory System for comprehensive migration planning
  PLAN: Create comprehensive migration strategy preserving all content from all discovered sources
  GUARANTEE: No specification content is missed due to nested folder structures
</instructions>

</step>

<step number="2" name="prepare_consolidated_structure">

### Step 2: Prepare Consolidated Structure

<step_metadata>
  <action>create consolidated directory structure</action>
  <purpose>prepare target structure for specification migration</purpose>
</step_metadata>

<structure_preparation>
  <directory_creation>
    - Ensure .agent-os/specs/ base directory exists
    - Create .agent-os/specs/sub-specs/ directory if not exists
    - Prepare backup directory for original specifications
  </directory_creation>
  <file_initialization>
    - Create consolidated spec.md if not exists with proper header
    - Create consolidated tasks.md if not exists with proper header  
    - Prepare sub-specs files for content consolidation
  </file_initialization>
</structure_preparation>

<consolidated_spec_template>
  <header>
    # Project Specifications
    
    > Last Updated: [CURRENT_DATE]
    > Version: 1.0.0
    > Status: Consolidated from legacy dated folders
    
    This document consolidates all feature specifications previously stored in dated folders.
  </header>
</consolidated_spec_template>

<consolidated_tasks_template>
  <header>
    # Project Tasks
    
    These are the tasks to be completed for all features detailed in @.agent-os/specs/spec.md
    
    > Last Updated: [CURRENT_DATE]
    > Status: Consolidated from legacy dated folders
    
    ## Effort Scale
    
    Tasks are estimated using the following effort scale:
    
    | Scale | Estimated Effort |
    |-------|------------------|
    | XS    | 1 hour           |
    | S     | 2 hours          |
    | M     | 4 hours          |
    | L     | 8 hours          |
    | XL    | 12+ hours        |
  </header>
</consolidated_tasks_template>

<instructions>
  ACTION: Create consolidated directory structure and initialize base files
  PREPARE: Target structure for specification content migration
  BACKUP: Preserve original specifications for rollback capability
</instructions>

</step>

<step number="3" name="feature_deduplication_via_dedupe_specs">

### Step 3: Feature Deduplication via Dedupe-Specs Integration

<step_metadata>
  <action>leverage dedicated dedupe-specs command for intelligent feature merging</action>
  <purpose>prevent duplicate features and merge related specifications using proven deduplication workflows</purpose>
  <memory_integration>inherits dedupe-specs enhanced memory patterns and cross-project learning</memory_integration>
  <integration>calls dedupe-specs command for specification analysis and merging</integration>
  <prevents>duplicate tasks, conflicting specs, redundant documentation</prevents>
</step_metadata>

<dedupe_specs_integration_benefits>
  <separation_of_concerns>
    - Consolidate-specs focuses on structure migration
    - Dedupe-specs handles intelligent feature merging
    - Each command optimized for its specific purpose
  </separation_of_concerns>
  <reusability>
    - Dedupe-specs can be used independently for other deduplication needs
    - Proven deduplication algorithms available across Agent OS
    - Cross-project learning through dedicated deduplication patterns
  </reusability>
  <maintainability>
    - Single codebase for deduplication logic
    - Enhancements to dedupe-specs automatically improve consolidation
    - Reduced complexity in consolidate-specs workflow
  </maintainability>
</dedupe_specs_integration_benefits>

<deduplication_via_command>
  # Check if deduplication is needed (more than one consolidation target)
  IF len(consolidation_targets) <= 1:
    LOG: "⚡ Single consolidation target - skipping deduplication"
    deduplicated_targets = consolidation_targets
  ELSE:
    # Call dedupe-specs command for intelligent feature merging
    LOG: "🔍 Running dedupe-specs for {len(consolidation_targets)} consolidation targets"
    
    # Store consolidation targets for dedupe-specs processing
    temp_input_data = serialize_consolidation_targets(consolidation_targets)
    
    # Execute dedupe-specs command with appropriate parameters
    dedupe_command = build_dedupe_command({
      "input_data": temp_input_data,
      "similarity_threshold": 0.6,  # Configurable threshold
      "output_format": "json",
      "merge_strategy": "auto",
      "memory_integration": True,
      "interactive": False
    })
    
    # Store deduplication context in Memory-Keeper
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "deduplication-initiated"
      - value: "Running dedupe-specs for {len(consolidation_targets)} targets"
      - category: "progress"
      - priority: "high"
    
    # Execute deduplication
    deduplication_result = execute_command(dedupe_command)
    
    IF deduplication_result.success:
      deduplicated_targets = parse_deduplication_output(deduplication_result.output)
      
      # Store successful deduplication results
      CALL: mcp-memory-keeper-context_save
      PARAMETERS:
        - key: "deduplication-results"
        - value: "Reduced {len(consolidation_targets)} to {len(deduplicated_targets)} merged features"
        - category: "progress"
        - priority: "high"
      
      LOG: "✅ Deduplication complete: {len(consolidation_targets)} → {len(deduplicated_targets)} features"
    ELSE:
      # Deduplication failed - proceed with original targets
      deduplicated_targets = consolidation_targets
      
      # Store deduplication failure
      CALL: mcp-memory-keeper-context_save
      PARAMETERS:
        - key: "deduplication-failed"
        - value: "Deduplication failed: {deduplication_result.error}"
        - category: "error"
        - priority: "high"
      
      LOG: "❌ Deduplication failed - proceeding with original targets: {deduplication_result.error}"
</deduplication_via_command>

<step number="4" name="migrate_specifications_via_create_spec">

### Step 4: Migrate Specifications via Create-Spec Integration

<step_metadata>
  <action>leverage create-spec command for consistent specification migration</action>
  <purpose>consolidate all specification content using proven create-spec workflows</purpose>
  <memory_integration>inherits create-spec's enhanced memory patterns</memory_integration>
  <integration>calls create-spec in consolidation mode for each feature group (not individual targets)</integration>
  <deduplication>processes merged feature groups to prevent duplication</deduplication>
</step_metadata>

<create_spec_integration_benefits>
  <consistency>
    - All consolidated specs use identical format and structure
    - Memory integration patterns are unified across commands
    - Context7 documentation verification applies to consolidated content
  </consistency>
  <maintainability>
    - Single source of truth for spec generation logic
    - Enhancements to create-spec automatically improve consolidation
    - Reduced code duplication and maintenance overhead
  </maintainability>
  <memory_enhancement>
    - Consolidated specs receive full memory-keeper treatment
    - Cross-references between original and consolidated content
    - Pattern recognition applies consolidation learnings to future specs
  </memory_enhancement>
</create_spec_integration_benefits>

<migration_via_create_spec>
  <feature_data_extraction>
    - Parse each dated folder for feature information
    - Extract spec.md content and metadata
    - Gather tasks.md content and task breakdowns
    - Collect sub-specs content by type and feature
    - Preserve original dates and folder references
  </feature_data_extraction>
  <create_spec_invocation>
    - Call create-spec in "consolidation" mode for each feature
    - Pass extracted feature data as structured input
    - Enable append mode for building unified spec.md
    - Skip interactive steps for automated processing
    - Maintain memory context for each feature migration
  </create_spec_invocation>
  <unified_output>
    - Single spec.md with all features consolidated
    - Single tasks.md with all task breakdowns
    - Feature-based sub-specs organization maintained
    - Consistent cross-references and documentation structure
  </unified_output>
</migration_via_create_spec>

<create_spec_enhanced_migration>
  # Process each consolidation target via create-spec
  FOR_EACH: target IN sorted(consolidation_targets, by_priority_and_date):
    # Create checkpoint before migrating each target
    CALL: mcp-memory-keeper-context_checkpoint
    PARAMETERS:
      - name: "consolidate-{target.name}"
      - description: "Consolidating {target.name} ({target.type}) via create-spec integration"
    
    # Extract feature data for create-spec input
    feature_data = extract_feature_data_structure(target)
    
    # Store feature data structure for create-spec
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "feature-data-{target.name}"
      - value: serialize_feature_data(feature_data)
      - category: "analysis"
      - priority: "normal"
    
    # Call create-spec in consolidation mode
    INVOKE: create-spec
    PARAMETERS:
      - mode: "consolidation"
      - source_data: feature_data
      - append_to_existing: true
      - skip_interactive: true
      - memory_context: "consolidation-{target.name}"
      - preserve_original_metadata: true
    
    # Verify create-spec execution
    consolidation_result = verify_create_spec_execution(target.name)
    
    # Store consolidation progress
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "consolidated-{target.name}"
      - value: "Feature consolidated via create-spec: {consolidation_result.status}"
      - category: "progress"
      - priority: "high"
    
    # Track overall migration progress
    migration_progress = calculate_migration_progress(consolidation_targets, current_target)
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "consolidation-progress"
      - value: "Consolidated {migration_progress.completed}/{migration_progress.total} targets via create-spec"
      - category: "progress"
      - priority: "high"
    
    LOG: "✅ Consolidated {target.name} ({target.type}) via create-spec integration"
</create_spec_enhanced_migration>

<feature_data_structure>
  # Structure for passing data to create-spec consolidation mode
  # Supports various source types: folders, loose files, etc.
  feature_data = {
    "feature_name": extract_feature_name_from_target(target),
    "feature_priority": determine_feature_priority(target),
    "original_source": target.name,
    "source_type": target.type, # "folder", "loose_file", "dated_folder", etc.
    "original_date": extract_date_from_target(target),
    "consolidation_date": current_date(),
    "spec_content": extract_spec_content_from_target(target),
    "tasks_content": extract_tasks_content_from_target(target),
    "sub_specs_content": extract_sub_specs_content_from_target(target),
    "status_information": {
      "completion_status": determine_completion_status(target),
      "implementation_notes": extract_implementation_notes(target)
    },
    "metadata": {
      "source_path": target.path,
      "detected_structure": target.structure,
      "consolidation_strategy": determine_consolidation_strategy(target)
    }
  }
  
  # Extraction functions handle different source types
  FUNCTION extract_spec_content_from_target(target):
    IF target.type == "folder":
      spec_file = find_spec_md_in_folder(target.path)
      IF spec_file EXISTS:
        RETURN {
          "overview": extract_overview_section(spec_file),
          "user_stories": extract_user_stories_section(spec_file),
          "spec_scope": extract_scope_section(spec_file),
          "out_of_scope": extract_out_of_scope_section(spec_file),
          "expected_deliverable": extract_deliverable_section(spec_file)
        }
    ELIF target.type == "loose_file" AND target.name.endswith("spec.md"):
      RETURN {
        "overview": extract_overview_section(target.path),
        "user_stories": extract_user_stories_section(target.path),
        "spec_scope": extract_scope_section(target.path),
        "out_of_scope": extract_out_of_scope_section(target.path),
        "expected_deliverable": extract_deliverable_section(target.path)
      }
    ELSE:
      RETURN generate_default_spec_content(target)
  
  FUNCTION extract_tasks_content_from_target(target):
    IF target.type == "folder":
      tasks_file = find_tasks_md_in_folder(target.path)
      IF tasks_file EXISTS:
        RETURN extract_all_tasks(tasks_file)
    ELIF target.type == "loose_file" AND target.name.endswith("tasks.md"):
      RETURN extract_all_tasks(target.path)
    ELSE:
      RETURN generate_default_tasks_content(target)
  
  FUNCTION extract_sub_specs_content_from_target(target):
    IF target.type == "folder":
      sub_specs_dir = target.path + "/sub-specs/"
      IF directory_exists(sub_specs_dir):
        RETURN {
          "technical_spec": read_if_exists(sub_specs_dir + "technical-spec.md"),
          "api_spec": read_if_exists(sub_specs_dir + "api-spec.md"),
          "database_schema": read_if_exists(sub_specs_dir + "database-schema.md"),
          "tests": read_if_exists(sub_specs_dir + "tests.md")
        }
    ELSE:
      RETURN {}
</feature_data_structure>

<consolidation_feature_section_template>
  ## Feature: [FEATURE_NAME]
  
  > Originally: [ORIGINAL_FOLDER_NAME]
  > Added: [ORIGINAL_DATE]
  > Consolidated: [CONSOLIDATION_DATE]
  > Status: [CURRENT_STATUS] 
  > Priority: [FEATURE_PRIORITY]
  
  ### Overview
  [SOURCE_DATA.spec_content.overview]
  
  ### User Stories
  [SOURCE_DATA.spec_content.user_stories]
  
  ### Spec Scope
  [SOURCE_DATA.spec_content.spec_scope]
  
  ### Out of Scope
  [SOURCE_DATA.spec_content.out_of_scope]
  
  ### Expected Deliverable
  [SOURCE_DATA.spec_content.expected_deliverable]
  
  #### Documentation References
  - Tasks: @.agent-os/specs/tasks.md
  - Technical Specification: @.agent-os/specs/sub-specs/[FEATURE_FOLDER]/technical-spec.md
  - API Specification: @.agent-os/specs/sub-specs/[FEATURE_FOLDER]/api-spec.md
  - Database Schema: @.agent-os/specs/sub-specs/[FEATURE_FOLDER]/database-schema.md
  - Tests Specification: @.agent-os/specs/sub-specs/[FEATURE_FOLDER]/tests.md
  
  ---
</consolidation_feature_section_template>

<template_usage_note>
  # This template is used by create-spec in consolidation mode
  # It ensures consistent formatting between new specs and consolidated specs
  # The [FEATURE_FOLDER] is derived from the original folder name for sub-specs organization
</template_usage_note>

<instructions>
  ACTION: Leverage create-spec command for consistent specification consolidation
  INTEGRATE: Each dated folder processed through create-spec consolidation mode
  PRESERVE: All original content, dates, and status information via create-spec templating
  TRACK: Migration progress in Integrated Memory System through create-spec memory integration
  VALIDATE: Ensure no specification content is lost during create-spec processing
  BENEFIT: Unified spec generation logic ensures consistency between new and consolidated specs
</instructions>

</step>

<step number="4" name="update_cross_references">

### Step 4: Update Cross-References and Links

<step_metadata>
  <action>update all cross-references to use consolidated structure</action>
  <purpose>ensure all links work with new consolidated file structure</purpose>
</step_metadata>

<reference_update_process>
  <path_updates>
    - Update @.agent-os/specs/YYYY-MM-DD-*/spec.md references to @.agent-os/specs/spec.md
    - Update @.agent-os/specs/YYYY-MM-DD-*/tasks.md references to @.agent-os/specs/tasks.md
    - Update sub-specs path references to @.agent-os/specs/sub-specs/
  </path_updates>
  <internal_links>
    - Update internal specification links to use feature section anchors
    - Fix task references to point to consolidated task sections
    - Update decision references to use consolidated decision tracking
  </internal_links>
  <external_references>
    - Update any project documentation that references old spec structure
    - Check CLAUDE.md for specification path references
    - Update README or other documentation files if needed
  </external_references>
</reference_update_process>

<instructions>
  ACTION: Update all cross-references to use consolidated structure
  VERIFY: All links and references work correctly after migration
  DOCUMENT: Any external files that may need manual updates
</instructions>

</step>

<step number="5" name="validate_consolidation">

### Step 5: Validate Consolidation Results

<step_metadata>
  <action>verify consolidation completed successfully</action>
  <purpose>ensure all content migrated correctly and structure is functional</purpose>
</step_metadata>

<validation_checklist>
  - [ ] All dated specification folders have been processed
  - [ ] Consolidated spec.md contains all feature specifications
  - [ ] Consolidated tasks.md contains all task breakdowns
  - [ ] Sub-specs files contain all technical specifications
  - [ ] Cross-references updated to use consolidated paths
  - [ ] No specification content lost during migration
  - [ ] Backup of original specifications created
  - [ ] Migration progress stored in Integrated Memory System
</validation_checklist>

<validation_process>
  <content_verification>
    - Compare original specification count with migrated feature count
    - Verify all tasks migrated to consolidated tasks.md
    - Check all sub-specs content present in consolidated files
    - Validate cross-reference links work correctly
  </content_verification>
  <structure_verification>
    - Confirm consolidated directory structure matches expected layout
    - Verify file permissions and accessibility
    - Test that new create-spec command will work with consolidated structure
  </structure_verification>
</validation_process>

<instructions>
  ACTION: Validate all aspects of the consolidation
  VERIFY: No content loss and all functionality preserved
  CONFIRM: Structure ready for ongoing consolidated specification workflow
</instructions>

</step>

<step number="6" name="cleanup_and_archive">

### Step 6: Cleanup and Archive Legacy Structure

<step_metadata>
  <action>archive original specifications and clean up legacy structure</action>
  <purpose>maintain clean consolidated structure while preserving history</purpose>
</step_metadata>

<cleanup_process>
  <archival>
    - Create .agent-os/specs/archive/ directory
    - Move original dated folders to archive for historical reference
    - Create archive manifest documenting original structure
  </archival>
  <cleanup>
    - Remove empty directories from specs root
    - Clean up any temporary migration files
    - Update .gitignore if necessary for archive directory
  </cleanup>
</cleanup_process>

<archive_manifest_template>
  # Specification Archive Manifest
  
  > Archived: [CURRENT_DATE]
  > Original Structure: Date-prefixed specification folders
  > Consolidated To: Unified spec.md, tasks.md, and sub-specs structure
  
  ## Archived Specifications
  - [FOLDER_1]: [FEATURE_SUMMARY]
  - [FOLDER_2]: [FEATURE_SUMMARY]
  
  ## Migration Notes
  - All content preserved in consolidated structure
  - Cross-references updated to new paths
  - Rollback possible using archived content
</archive_manifest_template>

<instructions>
  ACTION: Archive original specifications and clean up structure
  PRESERVE: Historical record of original specification structure
  MAINTAIN: Clean consolidated directory for ongoing development
</instructions>

</step>

<step number="7" name="memory_system_persistence">

### Step 7: Integrated Memory System Persistence

<step_metadata>
  <action>capture and store consolidation insights</action>
  <purpose>build persistent knowledge for future consolidations</purpose>
  <stores>consolidation patterns, migration strategies, decision outcomes</stores>
  <condition>only if memory-keeper available</condition>
</step_metadata>

<memory_persistence_categories>
  <consolidation_patterns>
    - Migration strategies that worked effectively
    - Content preservation techniques applied
    - Cross-reference update patterns
    - Validation approaches used
  </consolidation_patterns>
  <project_evolution>
    - Specification structure transformation
    - Feature organization improvements
    - Workflow efficiency gains
    - Team collaboration enhancements
  </project_evolution>
  <lessons_learned>
    - Challenges encountered during migration
    - Solutions applied to overcome obstacles
    - Best practices discovered
    - Future consolidation recommendations
  </lessons_learned>
</memory_persistence_categories>

<memory_persistence_process>
  <insight_extraction>
    1. ANALYZE consolidation session for key migration insights and patterns
    2. EXTRACT successful consolidation strategies and techniques
    3. CATEGORIZE findings by persistence category
    4. PRIORITIZE information by future consolidation relevance
  </insight_extraction>
  <knowledge_storage>
    1. SAVE consolidation patterns and strategies to memory-keeper
    2. STORE migration techniques and validation approaches
    3. TAG entries with relevant consolidation context and keywords
    4. LINK to consolidated specification files and migration artifacts
  </knowledge_storage>
  <pattern_establishment>
    1. CREATE consolidation pattern entities in Memento
    2. ESTABLISH relationships between consolidation approaches
    3. UPDATE cross-project consolidation knowledge
    4. DOCUMENT proven migration strategies for future use
  </pattern_establishment>
  <fallback_behavior>
    1. IF memory-keeper unavailable: SKIP memory persistence
    2. DOCUMENT key consolidation insights in session summary
    3. RECOMMEND manual knowledge capture in project documentation
  </fallback_behavior>
</memory_persistence_process>

<persistence_template>
  ## Consolidation Knowledge Captured
  
  The following insights have been stored in the Integrated Memory System:
  
  ### Consolidation Patterns
  - **Migration Strategy**: [CAPTURED_MIGRATION_APPROACH]
  - **Content Preservation**: [CAPTURED_PRESERVATION_TECHNIQUES]
  - **Reference Updates**: [CAPTURED_UPDATE_PATTERNS]
  - **Validation Methods**: [CAPTURED_VALIDATION_APPROACHES]
  
  ### Project Evolution
  - **Structure Transformation**: [CAPTURED_STRUCTURAL_IMPROVEMENTS]
  - **Feature Organization**: [CAPTURED_ORGANIZATIONAL_BENEFITS]
  - **Workflow Enhancement**: [CAPTURED_EFFICIENCY_GAINS]
  - **Collaboration Benefits**: [CAPTURED_TEAM_IMPROVEMENTS]
  
  ### Lessons Learned
  - **Challenges Overcome**: [CAPTURED_CHALLENGE_SOLUTIONS]
  - **Best Practices**: [CAPTURED_EFFECTIVE_TECHNIQUES]
  - **Future Recommendations**: [CAPTURED_IMPROVEMENT_SUGGESTIONS]
  - **Cross-Project Insights**: [CAPTURED_REUSABLE_PATTERNS]
</persistence_template>

<instructions>
  ACTION: Extract and categorize consolidation session insights
  STORE: Save structured knowledge to Integrated Memory System
  ESTABLISH: Consolidation patterns for future migration projects
  PREPARE: Foundation for improved consolidation workflows
</instructions>

</step>

<step number="8" name="final_summary_and_next_steps">

### Step 8: Final Summary and Next Steps

<step_metadata>
  <action>provide consolidation summary and guidance</action>
  <purpose>confirm successful consolidation and guide future workflow</purpose>
</step_metadata>

<consolidation_summary>
  ## ✅ Specification Consolidation Complete
  
  Successfully consolidated [SOURCE_COUNT] non-consolidated specification sources to unified structure:
  
  ### What Was Consolidated
  - **Sources**: [SOURCE_COUNT] specification sources processed
    - [FOLDER_COUNT] specification folders
    - [LOOSE_FILE_COUNT] loose specification files  
    - [DATED_FOLDER_COUNT] legacy dated directories
  - **Features**: [FEATURE_COUNT] specifications consolidated
  - **Tasks**: [TASK_COUNT] tasks organized by feature
  - **Sub-specs**: [SUB_SPEC_COUNT] technical specifications unified
  - **References**: [REFERENCE_COUNT] cross-references updated
  
  ### New Consolidated Structure
  - ✓ Master specification: `.agent-os/specs/spec.md`
  - ✓ Consolidated tasks: `.agent-os/specs/tasks.md`
  - ✓ Feature-based sub-specs: `.agent-os/specs/sub-specs/[feature-name]/`
  - ✓ Archive preserved: `.agent-os/specs/_archive/`
  
  ### Structure-Based Detection Benefits
  - 🔍 Intelligent detection of any non-consolidated structure
  - 📁 Handles dated folders, loose files, feature folders, and mixed structures
  - ✓ Automatic skip if already consolidated
  - 🔄 Adaptive to various legacy specification organizations
  
  ### Benefits Achieved
  - 🎯 Single source of truth for all specifications
  - 📊 Clear visibility into feature completion status
  - 🔧 Simplified maintenance and updates
  - 👥 Enhanced team collaboration capabilities
  - 🚀 Future-proof structure for ongoing development
  - ⚡ Smart detection works with any specification structure
  
  [IF MEMORY_AVAILABLE]:
  ### Integrated Memory System Benefits
  - 🧠 Consolidation patterns stored for future projects
  - 📈 Migration insights captured for continuous improvement
  - 🔄 Cross-project knowledge sharing enabled
  - ⚡ Enhanced context for future Agent OS operations
  - 📊 Structure detection patterns learned for other projects
</consolidation_summary>

<next_steps_guidance>
  ### Next Steps
  
  1. **Review Consolidated Structure**
     - Examine consolidated specifications in `.agent-os/specs/spec.md`
     - Review unified task breakdown in `.agent-os/specs/tasks.md`
     - Check technical details in `.agent-os/specs/sub-specs/`
  
  2. **Update Team Workflows**
     - Inform team of new consolidated specification structure
     - Update documentation references to use new paths
     - Train team on consolidated specification workflow
  
  3. **Future Feature Development**
     - Use consolidated create-spec workflow for new features
     - Features will be added to existing consolidated files
     - Maintain single source of truth approach
  
  4. **Archive Management**
     - Original specifications preserved in `.agent-os/specs/archive/`
     - Archive available for reference or rollback if needed
     - Consider periodic archive cleanup based on project needs
</next_steps_guidance>

<instructions>
  ACTION: Provide comprehensive consolidation summary
  GUIDE: Clear next steps for continued development
  HIGHLIGHT: Benefits and capabilities of consolidated structure
  DOCUMENT: Archive location and rollback procedures
</instructions>

</step>

</process_flow>

## Error Handling

<error_scenarios>
  <scenario name="consolidation_error_occurs">
    <condition>Any error occurs during specification consolidation or migration</condition>
    <action>Execute memory-guided error resolution procedures</action>
    <procedure>
      1. IMMEDIATE: Store error details in Memory-Keeper for tracking
      2. SEARCH: Query Memory-Keeper and Memento for similar consolidation errors
      3. APPLY: Try memory-guided solutions in confidence order
      4. DOCUMENT: Store successful resolution for future reference
      5. REFERENCE: Follow detailed procedures in @error-resolution-via-memory.md
    </procedure>
    <enhancement>Build cross-project consolidation error solution database</enhancement>
  </scenario>
  <scenario name="content_loss_detected">
    <condition>Validation detects missing or corrupted specification content</condition>
    <action>Halt consolidation and restore from backup</action>
    <fallback>Provide detailed report of missing content for manual review</fallback>
  </scenario>
  <scenario name="memory_system_unavailable">
    <condition>Integrated Memory System not available</condition>
    <action>Continue with standard consolidation, document limitation</action>
    <impact>Reduced pattern recognition but full functionality preserved</impact>
  </scenario>
</error_scenarios>

## Final Checklist

<verification_checklist>
  <verify>
    - [ ] Memory-keeper initialization attempted (if available)
    - [ ] All dated specification folders cataloged and analyzed
    - [ ] Consolidated directory structure created successfully
    - [ ] All specification content migrated without loss
    - [ ] Tasks consolidated with proper feature organization
    - [ ] Sub-specs unified with feature-specific sections
    - [ ] Cross-references updated to consolidated structure
    - [ ] Consolidation validated for completeness and accuracy
    - [ ] Original specifications archived for historical reference
    - [ ] Migration insights stored in Integrated Memory System (if available)
    - [ ] Team guidance provided for ongoing consolidated workflow
  </verify>
</verification_checklist>

<memory_system_integration_benefits>
  - Enhanced consolidation accuracy through pattern recognition
  - Reduced consolidation complexity through persistent knowledge
  - Cross-project consolidation learning and strategy sharing
  - Informed migration decisions based on historical outcomes
  - Accelerated future consolidations through proven techniques
  - Improved project evolution tracking through unified specifications
</memory_system_integration_benefits>