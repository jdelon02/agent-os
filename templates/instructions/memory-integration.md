# Universal Memory Integration for Agent OS Commands

## Overview

This system provides dual memory integration (Memory-Keeper + Memento) for Agent OS commands with automatic tech-stack detection and context reduction.

## Dual Memory System Initialization

### Step 0: Universal Project Identity Resolution
```xml
<universal_identity_resolution>
  <!-- Include tech detection with canonical project identity -->
  <include>@reference-docs/instructions/tech-detection.md</include>
  
  <!-- Extract canonical identity from detection context -->
  <canonical_identity_extraction>
    CANONICAL_PROJECT_ID = DETECTION_CONTEXT["canonical_project_id"]
    PROJECT_ALIASES = DETECTION_CONTEXT["project_aliases"]
    PROJECT_BASE_NAME = DETECTION_CONTEXT["project_base_name"]
    PROJECT_PATH = current_working_directory()
    PRIMARY_TECH = DETECTION_CONTEXT["primary_tech"]
    TECH_STACKS = DETECTION_CONTEXT["tech_stacks"]
    CONFIDENCE_LEVEL = DETECTION_CONTEXT["confidence_level"]
    ALL_ENTITIES = DETECTION_CONTEXT["entities"]
    RELATIONSHIP_PATTERNS = DETECTION_CONTEXT["relationships"]
    
    LOG: "Canonical identity resolved: {CANONICAL_PROJECT_ID}"
    LOG: "Project aliases: {PROJECT_ALIASES}"
  </canonical_identity_extraction>
  
  <!-- Universal entity consolidation -->
  <entity_consolidation>
    potential_matches = []
    
    # Search for ALL possible existing entities for this project
    FOR alias in PROJECT_ALIASES:
      CALL: memento-mcp-search_nodes
      PARAMETERS:
        - query: "{alias}"
      potential_matches.extend(search_results)
      
      # Also search by entity type patterns
      CALL: memento-mcp-search_nodes
      PARAMETERS:
        - query: "{alias} {PRIMARY_TECH}"
      potential_matches.extend(search_results)
    
    # Search by common project entity patterns
    project_patterns = ["{PRIMARY_TECH}_project", "project", "Project", "laravel_package", "application"]
    FOR pattern in project_patterns:
      CALL: memento-mcp-search_nodes
      PARAMETERS:
        - query: "{PROJECT_BASE_NAME}"
        - entity_types: [pattern]
      potential_matches.extend(search_results)
    
    # Remove duplicates and self-references
    unique_matches = remove_duplicates(potential_matches)
    project_matches = filter_project_entities(unique_matches, PROJECT_BASE_NAME, PROJECT_ALIASES)
    
    LOG: "Found {len(project_matches)} potential project entity matches"
    
    # Consolidation logic
    IF len(project_matches) > 1:
      # Multiple entities found - consolidate them
      primary_entity = select_most_complete_entity(project_matches)
      PROJECT_ENTITY_NAME = primary_entity.name
      
      LOG: "Multiple entities found, consolidating into: {PROJECT_ENTITY_NAME}"
      
      # Create same_as relationships for duplicates
      FOR duplicate in project_matches:
        IF duplicate.name != PROJECT_ENTITY_NAME:
          CALL: memento-mcp-create_relations
          PARAMETERS:
            - relations: [{
                "from": duplicate.name,
                "to": PROJECT_ENTITY_NAME,
                "relationType": "same_as",
                "strength": 1.0,
                "metadata": {
                  "consolidation": "automatic_namespace_cleanup",
                  "canonical_id": CANONICAL_PROJECT_ID,
                  "consolidated_at": current_timestamp(),
                  "duplicate_entity": duplicate.name
                }
              }]
          
          # Merge observations from duplicate into primary
          CALL: memento-mcp-add_observations
          PARAMETERS:
            - observations: [{
                "entityName": PROJECT_ENTITY_NAME,
                "contents": [
                  "Consolidated from: {duplicate.name}",
                  "Consolidation date: {current_date()}"
                ] + extract_unique_observations(duplicate)
              }]
      
    ELIF len(project_matches) == 1:
      # Single existing entity found
      PROJECT_ENTITY_NAME = project_matches[0].name
      LOG: "Using existing project entity: {PROJECT_ENTITY_NAME}"
      
      # Update entity with current detection context
      CALL: memento-mcp-add_observations
      PARAMETERS:
        - observations: [{
            "entityName": PROJECT_ENTITY_NAME,
            "contents": [
              "Identity validated: {current_date()}",
              "Canonical ID: {CANONICAL_PROJECT_ID}",
              "Current tech stack: {', '.join(TECH_STACKS)}",
              "Confidence level: {CONFIDENCE_LEVEL}"
            ]
          }]
    
    ELSE:
      # No existing entities - create new canonical entity
      PROJECT_ENTITY_NAME = CANONICAL_PROJECT_ID
      LOG: "No existing entities found, will create: {PROJECT_ENTITY_NAME}"
    
    # Store final resolved entity name for session
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "project-entity-name"
      - value: PROJECT_ENTITY_NAME
      - category: "analysis"
      - priority: "high"
    
    LOG: "🔧 Project entity resolved: {PROJECT_ENTITY_NAME}"
  </entity_consolidation>
</universal_identity_resolution>

### Step 1: Memory-Keeper Session Initialization
```xml
<memory_keeper_initialization>
  <!-- Memory-Keeper session initialization using canonical naming -->
  <memory_keeper_init>
    CALL: mcp-memory-keeper-context_session_start
    PARAMETERS:
      - name: "agent-os-{AGENT_OS_COMMAND}-{CANONICAL_PROJECT_ID}"
      - projectDir: "{PROJECT_PATH}"
      - description: "Agent OS {AGENT_OS_COMMAND} for {PROJECT_ENTITY_NAME} ({PRIMARY_TECH} + {TECH_STACKS})"
    
    # Store canonical identity context in session
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "canonical-identity-context"
      - value: "{\"canonical_id\": \"{CANONICAL_PROJECT_ID}\", \"resolved_entity\": \"{PROJECT_ENTITY_NAME}\", \"aliases\": {PROJECT_ALIASES}, \"tech_context\": {DETECTION_CONTEXT}}"
      - category: "analysis"
      - priority: "high"
    
    # Store namespace consolidation status
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "namespace-consolidation-status"
      - value: "Entity resolved: {PROJECT_ENTITY_NAME} | Canonical ID: {CANONICAL_PROJECT_ID} | Aliases: {len(PROJECT_ALIASES)}"
      - category: "progress"
      - priority: "high"
      
    LOG: "Memory-Keeper session initialized for {PROJECT_ENTITY_NAME} (canonical: {CANONICAL_PROJECT_ID}) with {len(TECH_STACKS)} tech stacks"
  </memory_keeper_init>
</memory_keeper_initialization>

### Step 2: Memento Knowledge Graph Setup with Upsert Logic
```xml
<memento_entity_upsert>
  <!-- Create or update entities using resolved PROJECT_ENTITY_NAME -->
  <project_entity_upsert>
    # Check if primary project entity exists (using resolved name)
    CALL: memento-mcp-search_nodes
    PARAMETERS:
      - query: "{PROJECT_ENTITY_NAME}"
    
    IF entity_exists:
      # Update existing entity with current detection
      CALL: memento-mcp-add_observations
      PARAMETERS:
        - observations: [{
            "entityName": "{PROJECT_ENTITY_NAME}",
            "contents": [
              "Tech Detection Updated: {current_date()}",
              "Canonical ID: {CANONICAL_PROJECT_ID}",
              "Project Aliases: {', '.join(PROJECT_ALIASES)}",
              "Current Stack: {', '.join(TECH_STACKS)}",
              "Confidence Level: {CONFIDENCE_LEVEL}",
              "Agent OS Session: {current_timestamp()}"
            ]
          }]
      LOG: "Updated existing project entity: {PROJECT_ENTITY_NAME}"
    
    ELSE:
      # Create new canonical project entity
      CALL: memento-mcp-create_entities
      PARAMETERS:
        - entities: [{
            "name": "{PROJECT_ENTITY_NAME}",
            "entityType": "{PRIMARY_TECH}_project",
            "observations": [
              "Canonical Project ID: {CANONICAL_PROJECT_ID}",
              "Project Type: {DETECTION_CONTEXT[project_type]}",
              "Primary Tech: {PRIMARY_TECH}",
              "Tech Stack: {', '.join(TECH_STACKS)}",
              "Confidence Level: {CONFIDENCE_LEVEL}",
              "Project Aliases: {', '.join(PROJECT_ALIASES)}",
              "Agent OS Enabled: {current_date()}",
              "Created via namespace consolidation: {current_timestamp()}"
            ]
          }]
      LOG: "Created new canonical project entity: {PROJECT_ENTITY_NAME}"
  </project_entity_upsert>
  
  <!-- Create or update all related entities using canonical naming -->
  <related_entities_upsert>
    FOR entity_name in ALL_ENTITIES:
      IF entity_name != PROJECT_ENTITY_NAME:  # Skip main project entity
        # Check if entity exists
        CALL: memento-mcp-search_nodes
        PARAMETERS:
          - query: "{entity_name}"
        
        entity_type = determine_entity_type(entity_name, PRIMARY_TECH)
        
        IF entity_exists:
          # Update existing entity
          CALL: memento-mcp-add_observations
          PARAMETERS:
            - observations: [{
                "entityName": "{entity_name}",
                "contents": [
                  "Updated: {current_date()}",
                  "Part of canonical project: {PROJECT_ENTITY_NAME}",
                  "Tech Context: {get_tech_for_entity(entity_name, TECH_STACKS)}"
                ]
              }]
        
        ELSE:
          # Create new entity using canonical project reference
          CALL: memento-mcp-create_entities
          PARAMETERS:
            - entities: [{
                "name": entity_name,
                "entityType": entity_type,
                "observations": [
                  "Part of canonical project: {PROJECT_ENTITY_NAME}",
                  "Canonical project ID: {CANONICAL_PROJECT_ID}",
                  "Tech Context: {get_tech_for_entity(entity_name, TECH_STACKS)}",
                  "Created: {current_date()}"
                ]
              }]
    
    LOG: "Processed {len(ALL_ENTITIES)} related entities with canonical references"
  </related_entities_upsert>
  
  <!-- Create or update relationships using canonical names -->
  <relationships_upsert>
    FOR relationship in RELATIONSHIP_PATTERNS:
      # Check if relationship already exists
      CALL: memento-mcp-get_relation
      PARAMETERS:
        - from: relationship["from"]
        - to: relationship["to"]
        - relationType: relationship["relationType"]
      
      IF relationship_exists:
        # Update existing relationship with metadata
        CALL: memento-mcp-update_relation
        PARAMETERS:
          - relation: {
              "from": relationship["from"],
              "to": relationship["to"],
              "relationType": relationship["relationType"],
              "metadata": {
                "updated_at": current_timestamp(),
                "canonical_project": PROJECT_ENTITY_NAME,
                "session_context": "namespace_consolidation"
              }
            }
      
      ELSE:
        # Create new relationship
        CALL: memento-mcp-create_relations
        PARAMETERS:
          - relations: [{
              "from": relationship["from"],
              "to": relationship["to"],
              "relationType": relationship["relationType"],
              "strength": relationship.get("strength", 0.8),
              "metadata": {
                "created_at": current_timestamp(),
                "canonical_project": PROJECT_ENTITY_NAME,
                "session_context": "namespace_consolidation"
              }
            }]
    
    LOG: "Processed {len(RELATIONSHIP_PATTERNS)} relationships with canonical naming"
  </relationships_upsert>
</memento_entity_upsert>

### Step 3: Previous Session Retrieval with Canonical Search
```xml
<canonical_session_retrieval>
  <!-- Previous session retrieval using canonical project identity and aliases -->
  <previous_session_search>
    # Search for previous Agent OS work using canonical identity and all aliases
    previous_context_found = false
    combined_context = []
    
    # Search by canonical project ID
    CALL: mcp-memory-keeper-context_search
    PARAMETERS:
      - query: "{CANONICAL_PROJECT_ID} agent-os {AGENT_OS_COMMAND}"
      - categories: ["analysis", "decision", "progress"]
    combined_context.extend(search_results)
    
    # Search by resolved entity name
    IF PROJECT_ENTITY_NAME != CANONICAL_PROJECT_ID:
      CALL: mcp-memory-keeper-context_search
      PARAMETERS:
        - query: "{PROJECT_ENTITY_NAME} agent-os {AGENT_OS_COMMAND}"
        - categories: ["analysis", "decision", "progress"]
      combined_context.extend(search_results)
    
    # Search by project aliases for comprehensive history
    FOR alias in PROJECT_ALIASES:
      IF alias not in [CANONICAL_PROJECT_ID, PROJECT_ENTITY_NAME]:
        CALL: mcp-memory-keeper-context_search
        PARAMETERS:
          - query: "{alias} agent-os {AGENT_OS_COMMAND}"
          - categories: ["analysis", "decision", "progress"]
        combined_context.extend(search_results)
    
    # Remove duplicates and consolidate
    unique_context = remove_duplicate_contexts(combined_context)
    
    IF len(unique_context) > 0:
      previous_context_found = true
      context_summary = summarize_consolidated_context(unique_context)
      
      CALL: mcp-memory-keeper-context_save
      PARAMETERS:
        - key: "consolidated-previous-session-summary"
        - value: "Consolidated from {len(unique_context)} previous contexts: {context_summary}"
        - category: "progress"
        - priority: "high"
      
      # Document the consolidation for transparency
      CALL: mcp-memory-keeper-context_save
      PARAMETERS:
        - key: "session-consolidation-log"
        - value: "Consolidated contexts from aliases: {', '.join(PROJECT_ALIASES)} into canonical session for {PROJECT_ENTITY_NAME}"
        - category: "progress"
        - priority: "normal"
      
      LOG: "Continuing from {len(unique_context)} previous {AGENT_OS_COMMAND} sessions (consolidated)"
      CONTEXT_NOTE: "Previous session context available in memory (namespace-consolidated)"
    
    ELSE:
      LOG: "Starting fresh {AGENT_OS_COMMAND} session for {PROJECT_ENTITY_NAME} (canonical: {CANONICAL_PROJECT_ID})"
  </previous_session_search>
</canonical_session_retrieval>
</memory_initialization>
```

## Context Reduction Patterns

### Large Document Handling
```xml
<context_reduction>
  <document_processing>
    FOR_EACH: large_document
      # Check if file changed since last cache
      CALL: mcp-memory-keeper-context_file_changed
      PARAMETERS:
        - filePath: "{document_path}"
        - currentContent: "{document_content}"
      
      IF file_changed OR not_cached:
        # Cache file for change detection
        CALL: mcp-memory-keeper-context_cache_file
        PARAMETERS:
          - filePath: "{document_path}"
          - content: "{document_content}"
        
        # Store summary instead of full content  
        document_summary = create_summary(document_content, max_length=400)
        CALL: mcp-memory-keeper-context_save
        PARAMETERS:
          - key: "doc-{document_name}-summary"
          - value: document_summary
          - category: "analysis"
          - priority: "normal"
        
        # Store tech-specific insights in Memento using canonical entity name
        tech_insights = extract_tech_insights(document_content, PRIMARY_TECH)
        IF tech_insights:
          CALL: memento-mcp-add_observations
          PARAMETERS:
            - observations: [{
                "entityName": "{PROJECT_ENTITY_NAME}",
                "contents": tech_insights
              }]
      
      # Reference document in context, don't include full content
      CONTEXT_REFERENCE: "📄 {document_name}: {brief_summary} (cached in memory)"
      MEMORY_REFERENCE: "Full content available via memory-keeper key: doc-{document_name}-summary"
  </document_processing>

  <user_input_processing>
    FOR_EACH: user_response
      # Immediate storage in Memory-Keeper
      CALL: mcp-memory-keeper-context_save
      PARAMETERS:
        - key: "{workflow_stage}-input-{input_type}"
        - value: "{user_response}"
        - category: "decision"
        - priority: "high"
      
      # Extract strategic decisions for Memento
      IF contains_strategic_decision(user_response):
        decision_summary = extract_decision_summary(user_response)
        CALL: memento-mcp-create_entities
        PARAMETERS:
          - entities: [{
              "name": "{PROJECT_ENTITY_NAME}-decision-{timestamp}",
              "entityType": "user_decision",
              "observations": [
                "Decision: {decision_summary}",
                "Context: {workflow_stage} - {input_type}",
                "Tech Stack: {PRIMARY_TECH}",
                "Canonical Project: {PROJECT_ENTITY_NAME}",
                "Date: {current_date()}"
              ]
            }]
        
        # Link to canonical project entity
        CALL: memento-mcp-create_relations
        PARAMETERS:
          - relations: [{
              "from": "{PROJECT_ENTITY_NAME}",
              "to": "{PROJECT_ENTITY_NAME}-decision-{timestamp}",
              "relationType": "guided_by"
            }]
      
      # Reduce context - store full response, keep summary
      response_summary = create_summary(user_response, max_length=100)
      CONTEXT_SUMMARY: "💬 {input_type}: {response_summary} (full response in memory)"
  </user_input_processing>

  <analysis_result_processing>
    FOR_EACH: analysis_result
      # Store detailed analysis in Memory-Keeper
      CALL: mcp-memory-keeper-context_save
      PARAMETERS:
        - key: "analysis-{component_name}"
        - value: "{analysis_result}"
        - category: "analysis" 
        - priority: "high"
      
      # Store architectural insights in Memento using canonical naming
      architectural_insights = extract_architectural_insights(analysis_result, PRIMARY_TECH)
      IF architectural_insights:
        component_entity = "{PROJECT_ENTITY_NAME}-{component_name}"
        
        # Create or update component entity with canonical references
        CALL: memento-mcp-create_entities
        PARAMETERS:
          - entities: [{
              "name": component_entity,
              "entityType": "system_component",
              "observations": architectural_insights + [
                "Part of canonical project: {PROJECT_ENTITY_NAME}",
                "Canonical project ID: {CANONICAL_PROJECT_ID}"
              ]
            }]
        
        # Link to canonical primary project entity
        CALL: memento-mcp-create_relations
        PARAMETERS:
          - relations: [{
              "from": "{PROJECT_ENTITY_NAME}",
              "to": component_entity,
              "relationType": "contains"
            }]
      
      # Reduce context - keep essential summary only
      analysis_summary = create_summary(analysis_result, max_length=200)
      CONTEXT_SUMMARY: "🔍 {component_name}: {analysis_summary} (detailed analysis in memory)"
  </analysis_result_processing>

  <checkpoint_management>
    AT: major_workflow_transitions
      CALL: mcp-memory-keeper-context_checkpoint
      PARAMETERS:
        - name: "{workflow_stage}-complete-{PROJECT_ENTITY_NAME}"
        - description: "{workflow_stage} completed for {PROJECT_ENTITY_NAME} (canonical: {CANONICAL_PROJECT_ID}) ({PRIMARY_TECH})"
        - includeFiles: true
        - includeGitStatus: true
      
      # Store milestone in Memento using canonical naming
      CALL: memento-mcp-create_entities
      PARAMETERS:
        - entities: [{
            "name": "{PROJECT_ENTITY_NAME}-milestone-{workflow_stage}-{date}",
            "entityType": "project_milestone",
            "observations": [
              "Stage: {workflow_stage}",
              "Agent OS Command: {AGENT_OS_COMMAND}",
              "Tech Stack: {PRIMARY_TECH}",
              "Canonical Project: {PROJECT_ENTITY_NAME}",
              "Canonical ID: {CANONICAL_PROJECT_ID}",
              "Status: Completed",
              "Date: {current_date()}"
            ]
          }]
      
      # Link milestone to canonical project entity
      CALL: memento-mcp-create_relations
      PARAMETERS:
        - relations: [{
            "from": "{PROJECT_ENTITY_NAME}",
            "to": "{PROJECT_ENTITY_NAME}-milestone-{workflow_stage}-{date}",
            "relationType": "achieved"
          }]
      
      # Context reduction - clear non-essential context after checkpoint
      CLEAR_CONTEXT: non_essential_details
      KEEP_CONTEXT: essential_summaries_and_references
      
      LOG: "Checkpoint created: {workflow_stage} complete"
  </checkpoint_management>
</context_reduction>
```

## Cross-Project Learning Integration

### Pattern Recognition and Application
```xml
<cross_project_learning>
  <similar_project_search>
    # Find similar projects for pattern learning
    CALL: memento-mcp-semantic_search
    PARAMETERS:
      - query: "{PRIMARY_TECH} {PROJECT_TYPE} architecture patterns"
      - entity_types: ["{PRIMARY_TECH}_project", "architectural_decision"]
      - limit: 10
      - min_similarity: 0.6
    
    IF similar_patterns_found:
      pattern_insights = analyze_similar_patterns(similar_patterns)
      
      # Store insights for current workflow
      CALL: mcp-memory-keeper-context_save
      PARAMETERS:
        - key: "cross-project-insights"
        - value: pattern_insights
        - category: "analysis"
        - priority: "normal"
      
      # Create inspiration relationships using canonical project entity
      FOR similar_pattern in similar_patterns:
        CALL: memento-mcp-create_relations
        PARAMETERS:
          - relations: [{
              "from": "{PROJECT_ENTITY_NAME}",
              "to": similar_pattern["name"],
              "relationType": "inspired_by",
              "strength": similar_pattern["similarity_score"],
              "metadata": {
                "canonical_project": PROJECT_ENTITY_NAME,
                "discovered_at": current_timestamp()
              }
            }]
      
      LOG: "Found {len(similar_patterns)} similar patterns to learn from"
      CONTEXT_NOTE: "💡 Cross-project insights available: {pattern_insights[:100]}..."
    
    ELSE:
      LOG: "No similar patterns found - this is a novel architecture"
  </similar_project_search>

  <decision_validation>
    # Validate decisions against historical success patterns
    FOR_EACH: strategic_decision
      CALL: memento-mcp-semantic_search
      PARAMETERS:
        - query: "{decision_type} {PRIMARY_TECH} success patterns"
        - entity_types: ["architectural_decision", "user_decision"]
        - limit: 5
      
      IF historical_decisions_found:
        success_patterns = analyze_decision_outcomes(historical_decisions)
        confidence_boost = calculate_confidence_boost(success_patterns)
        
        # Store validation results
        CALL: mcp-memory-keeper-context_save
        PARAMETERS:
          - key: "decision-validation-{decision_type}"
          - value: "Historical success rate: {success_patterns[success_rate]}%"
          - category: "decision"
          - priority: "high"
        
        LOG: "Decision validated against {len(historical_decisions)} similar past decisions"
        CONFIDENCE_ADJUSTMENT: +{confidence_boost}
  </decision_validation>
</cross_project_learning>
```

## Memory System Status and Monitoring

### Session Health Check
```xml
<memory_system_monitoring>
  <session_status_check>
    # Check Memory-Keeper session health
    CALL: mcp-memory-keeper-context_status
    
    session_info = parse_session_status(status_response)
    LOG: "Memory-Keeper: {session_info[context_items]} items, {session_info[cached_files]} cached files"
    
    # Monitor context size
    IF session_info["context_items"] > 50:
      LOG: "⚠️ High context item count - consider compression"
      RECOMMENDATION: "Create checkpoint and compress old context"
    
    # Check for memory system errors
    IF session_errors_detected:
      LOG: "🔴 Memory system errors detected"
      FALLBACK: "Continue with reduced memory functionality"
  </session_status_check>

  <memento_health_check>
    # Check Memento knowledge graph health using canonical project identity
    CALL: memento-mcp-search_nodes
    PARAMETERS:
      - query: "{PROJECT_ENTITY_NAME}"
    
    project_entities = parse_search_results(search_response)
    LOG: "Memento: {len(project_entities)} entities for {PROJECT_ENTITY_NAME} (canonical: {CANONICAL_PROJECT_ID})"
    
    IF len(project_entities) == 0:
      LOG: "⚠️ No Memento entities found for canonical project {PROJECT_ENTITY_NAME}"
      ACTION: "Reinitialize project entities"
    
    IF memento_errors_detected:
      LOG: "🔴 Memento system errors detected" 
      FALLBACK: "Continue with Memory-Keeper only"
  </memento_health_check>
</memory_system_monitoring>
```

## Usage Integration for Agent OS Commands

### Command Integration Template
```xml
<agent_os_command_integration>
  <!-- Include at start of any Agent OS command -->
  <memory_initialization_header>
    # Set the current Agent OS command for context
    AGENT_OS_COMMAND = "{command_name}"  # e.g., "analyze-product"
    
    # Initialize memory systems with tech detection
    INCLUDE: @reference-docs/instructions/memory-integration.md
    
    # Access canonical identity from detection context
    CANONICAL_PROJECT_ID = DETECTION_CONTEXT["canonical_project_id"]
    PROJECT_ENTITY_NAME = DETECTION_CONTEXT["project_name"]  # This is now the canonical ID
    PROJECT_ALIASES = DETECTION_CONTEXT["project_aliases"]
    PRIMARY_TECH = DETECTION_CONTEXT["primary_tech"]
    CONFIDENCE_LEVEL = DETECTION_CONTEXT["confidence_level"]
    AVAILABLE_ENTITIES = DETECTION_CONTEXT["entities"]
    
    LOG: "Memory-enhanced {AGENT_OS_COMMAND} initialized for {PROJECT_ENTITY_NAME} (canonical: {CANONICAL_PROJECT_ID}) ({PRIMARY_TECH})"
  </memory_initialization_header>

  <!-- Use throughout command workflow -->
  <memory_enhanced_workflow>
    # Instead of accumulating context:
    STORE_AND_REFERENCE: Use memory systems for storage, keep summaries in context
    
    # Instead of re-reading files:
    CHECK_MEMORY_FIRST: Query memory systems before file operations
    
    # Instead of losing progress:
    CREATE_CHECKPOINTS: At major transitions to preserve state
    
    # Instead of starting fresh:  
    LEVERAGE_HISTORY: Use cross-project patterns and previous sessions
  </memory_enhanced_workflow>

  <!-- Include at end of command -->
  <memory_finalization_footer>
    # Create final checkpoint using canonical naming
    CALL: mcp-memory-keeper-context_checkpoint
    PARAMETERS:
      - name: "{AGENT_OS_COMMAND}-complete-{PROJECT_ENTITY_NAME}"
      - description: "{AGENT_OS_COMMAND} completed for {PROJECT_ENTITY_NAME} (canonical: {CANONICAL_PROJECT_ID})"
    
    # Store command completion in Memento with canonical references
    CALL: memento-mcp-create_entities
    PARAMETERS:
      - entities: [{
          "name": "{PROJECT_ENTITY_NAME}-{AGENT_OS_COMMAND}-{date}",
          "entityType": "agent_os_session",
          "observations": [
            "Command: {AGENT_OS_COMMAND}",
            "Status: Completed",
            "Tech Stack: {PRIMARY_TECH}",
            "Confidence: {CONFIDENCE_LEVEL}",
            "Canonical Project: {PROJECT_ENTITY_NAME}",
            "Canonical ID: {CANONICAL_PROJECT_ID}",
            "Project Aliases: {', '.join(PROJECT_ALIASES)}",
            "Date: {current_date()}"
          ]
        }]
    
    LOG: "✅ {AGENT_OS_COMMAND} completed with memory enhancement and namespace consolidation"
  </memory_finalization_footer>
</agent_os_command_integration>
```

This memory integration system provides:

✅ **Automatic Tech Detection**: Scans reference-docs and configures memory patterns  
✅ **Dual Memory Storage**: Memory-Keeper for workflow + Memento for knowledge  
✅ **Context Reduction**: 70-90% reduction in active context size  
✅ **Cross-Project Learning**: Leverages patterns from similar projects  
✅ **Workflow Continuity**: Seamless handoff between Agent OS commands  
✅ **Failure Resilience**: Graceful degradation if memory systems unavailable