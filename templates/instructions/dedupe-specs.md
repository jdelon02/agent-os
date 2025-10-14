---
description: Specification Deduplication and Intelligent Feature Merging with Integrated Memory System
globs:
alwaysApply: false
version: 1.0
encoding: UTF-8
---

# Specification Deduplication and Intelligent Feature Merging

<ai_meta>
  <parsing_rules>
    - Initialize memory systems before deduplication analysis
    - Process XML blocks first for structured data
    - Execute instructions in sequential order
    - Use semantic analysis for feature similarity detection
    - Preserve all original content during merging
    - Store deduplication decisions in memory systems vs context accumulation
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
  - Analyze specification collections for feature overlap and duplication
  - Intelligently merge related specifications to prevent redundancy
  - Maintain semantic coherence while consolidating similar content
  - **Extract deduplication insights for 5-phase workflow enhancement**
  - **Build cross-project feature merging intelligence through enhanced MCP integration**
  - **Optimize merged specifications for Phase 2-5 workflow continuation**
</purpose>

<context>
  - Part of Agent OS framework - supports both standalone and 5-phase workflow integration
  - **Phase 1 Integration**: Runs as part of Step 1.5 in initialize-spec workflow (after consolidate-specs)
  - **Standalone Mode**: Can be executed independently for feature deduplication
  - **5-Phase Preparation**: Creates clean, non-redundant foundation for subsequent workflow phases
  - Enhanced with persistent MCP systems for cross-project deduplication learning
</context>

<prerequisites>
  - Existing specification content to analyze (files, folders, or structured data)
  - Write access to project root for creating merged specifications
  - Memory-keeper MCP available (optional, graceful degradation)
  - Memento MCP available for semantic pattern recognition (optional)
</prerequisites>

<process_flow>

<step number="0" name="memory_and_precedence_initialization">

### Step 0: Initialize Memory Systems and Resolve Precedence

<precedence_resolution>
  <!-- Include precedence rules -->
  <include>@reference-docs/instructions/support-workflows/precedence-rules.md</include>
  
  # Assert Agent OS command precedence
  AGENT_OS_COMMAND = "dedupe-specs"
  CURRENT_MODE = "AGENT_OS_COMMAND_ACTIVE"
  LOG: "🔴 Agent OS dedupe-specs active - absolute precedence"
</precedence_resolution>

<memory_initialization>
  <!-- Include memory integration -->
  <include>@reference-docs/instructions/support-workflows/memory-integration.md</include>
  
  # Access detected context from memory integration
  PROJECT_NAME = DETECTION_CONTEXT["project_name"]
  PRIMARY_TECH = DETECTION_CONTEXT["primary_tech"]
  TECH_STACKS = DETECTION_CONTEXT["tech_stacks"]
  CONFIDENCE_LEVEL = DETECTION_CONTEXT["confidence_level"]
  AVAILABLE_ENTITIES = DETECTION_CONTEXT["entities"]
  
  LOG: "Memory-enhanced dedupe-specs initialized for {PROJECT_NAME} ({PRIMARY_TECH})"
</memory_initialization>

</step>

<step number="1" name="specification_content_analysis">

### Step 1: Specification Content Analysis

<step_metadata>
  <action>analyze specification content for semantic similarity and overlap</action>
  <purpose>identify features that should be merged rather than treated as separate</purpose>
  <memory_integration>semantic search + pattern recognition</memory_integration>
</step_metadata>

<content_extraction>
  <semantic_indicators>
    - Feature keywords and terminology
    - Technology stack components
    - System components and modules  
    - Dependencies and integration points
    - User stories and requirements
    - Technical implementation details
  </semantic_indicators>
  <similarity_metrics>
    - Keyword overlap percentage
    - Technology stack similarity
    - Component dependency relationships
    - Implementation approach similarity
    - Scope and deliverable alignment
  </similarity_metrics>
</content_extraction>

<memory_enhanced_analysis>
  # Create checkpoint before analysis
  CALL: mcp-memory-keeper-context_checkpoint
  PARAMETERS:
    - name: "deduplication-start-{PROJECT_NAME}"
    - description: "Beginning specification deduplication analysis for {PROJECT_NAME}"
  
  # Analyze each specification target
  feature_analyses = []
  
  FOR_EACH: target IN input_specifications:
    # Extract comprehensive feature analysis
    feature_analysis = {
      "name": extract_feature_name(target),
      "source": target.source_path,
      "content": extract_all_content(target),
      "semantic_indicators": {
        "keywords": extract_keywords(target.content),
        "technologies": extract_technologies(target.content),
        "components": extract_components(target.content),
        "dependencies": extract_dependencies(target.content),
        "user_stories": extract_user_stories(target.content),
        "deliverables": extract_deliverables(target.content)
      },
      "metadata": {
        "creation_date": extract_date(target),
        "priority": determine_priority(target),
        "completion_status": assess_completion(target),
        "file_size": target.size,
        "complexity_score": calculate_complexity(target.content)
      }
    }
    
    feature_analyses.append(feature_analysis)
    
    # Store individual analysis in Memory-Keeper
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "feature-analysis-{target.name}"
      - value: serialize_analysis(feature_analysis)
      - category: "analysis"
      - priority: "normal"
    
    # Use Memento for semantic pattern recognition
    IF memento_available:
      CALL: memento-mcp-create_entities
      PARAMETERS:
        - entities: [{
            "name": "{PROJECT_NAME}-feature-{target.name}",
            "entityType": "specification_feature",
            "observations": [
              "Source: {target.source}",
              "Keywords: {feature_analysis.semantic_indicators.keywords}",
              "Technologies: {feature_analysis.semantic_indicators.technologies}",
              "Components: {feature_analysis.semantic_indicators.components}",
              "Status: Pending deduplication analysis"
            ]
          }]
  
  LOG: "📊 Analyzed {len(feature_analyses)} specifications for deduplication"
</memory_enhanced_analysis>

<instructions>
  ACTION: Analyze all specification content for semantic similarity
  EXTRACT: Comprehensive feature indicators for comparison
  STORE: Analysis results in Integrated Memory System
  PREPARE: Foundation for similarity detection and merging
</instructions>

</step>

<step number="2" name="similarity_detection_and_grouping">

### Step 2: Similarity Detection and Feature Grouping

<step_metadata>
  <action>detect similar features and group them for potential merging</action>
  <purpose>identify specification overlap before creating merge strategies</purpose>
  <memory_integration>cross-feature pattern matching + semantic similarity</memory_integration>
</step_metadata>

<similarity_detection_algorithm>
  <keyword_similarity>
    # Calculate keyword overlap between features
    FUNCTION calculate_keyword_similarity(feature_a, feature_b):
      keywords_a = set(feature_a.semantic_indicators.keywords)
      keywords_b = set(feature_b.semantic_indicators.keywords)
      
      intersection = keywords_a.intersection(keywords_b)
      union = keywords_a.union(keywords_b)
      
      RETURN len(intersection) / len(union) if union else 0
  </keyword_similarity>
  <technology_similarity>
    # Calculate technology stack overlap
    FUNCTION calculate_technology_similarity(feature_a, feature_b):
      tech_a = set(feature_a.semantic_indicators.technologies)
      tech_b = set(feature_b.semantic_indicators.technologies)
      
      intersection = tech_a.intersection(tech_b)
      
      RETURN len(intersection) / min(len(tech_a), len(tech_b)) if tech_a and tech_b else 0
  </technology_similarity>
  <component_similarity>
    # Calculate system component overlap
    FUNCTION calculate_component_similarity(feature_a, feature_b):
      comp_a = set(feature_a.semantic_indicators.components)
      comp_b = set(feature_b.semantic_indicators.components)
      
      intersection = comp_a.intersection(comp_b)
      union = comp_a.union(comp_b)
      
      RETURN len(intersection) / len(union) if union else 0
  </component_similarity>
</similarity_detection_algorithm>

<feature_grouping_process>
  # Group features by similarity
  feature_groups = []
  similarity_threshold = 0.6  # Configurable threshold
  
  FOR_EACH: feature IN feature_analyses:
    # Calculate similarity with existing groups
    best_group = None
    best_similarity = 0
    
    FOR_EACH: group IN feature_groups:
      group_similarity = calculate_group_similarity(feature, group)
      
      IF group_similarity > similarity_threshold AND group_similarity > best_similarity:
        best_group = group
        best_similarity = group_similarity
    
    IF best_group:
      # Add to existing group
      best_group.add_feature(feature, best_similarity)
      
      # Store grouping decision in Memory-Keeper
      CALL: mcp-memory-keeper-context_save
      PARAMETERS:
        - key: "feature-grouped-{feature.name}"
        - value: "Added to group: {best_group.name} (similarity: {best_similarity:.2f})"
        - category: "decision"
        - priority: "high"
      
      LOG: "🔗 Grouped {feature.name} with {best_group.name} (similarity: {best_similarity:.2f})"
    ELSE:
      # Create new group
      new_group = create_feature_group(feature)
      feature_groups.append(new_group)
      
      LOG: "🆕 Created new group: {feature.name}"
  
  # Store final grouping results
  CALL: mcp-memory-keeper-context_save
  PARAMETERS:
    - key: "deduplication-grouping-results"
    - value: serialize_groups(feature_groups)
    - category: "analysis"
    - priority: "high"
  
  LOG: "🎯 Created {len(feature_groups)} feature groups from {len(feature_analyses)} original features"
</feature_grouping_process>

<instructions>
  ACTION: Detect similar features using multi-dimensional similarity analysis
  GROUP: Features by semantic similarity above threshold
  STORE: Grouping decisions and rationale in Integrated Memory System
  PREPARE: Feature groups for merge strategy determination
</instructions>

</step>

<step number="3" name="merge_strategy_determination">

### Step 3: Merge Strategy Determination

<step_metadata>
  <action>determine optimal merge strategy for each feature group</action>
  <purpose>decide how to best combine similar specifications</purpose>
  <memory_integration>pattern-based strategy selection + decision tracking</memory_integration>
</step_metadata>

<merge_strategies>
  <primary_with_supplements>
    <description>One primary feature with supplementary content from others</description>
    <use_case>When one specification is significantly more complete</use_case>
    <selection_criteria>
      - One feature has 80%+ more content than others
      - One feature has clear completion advantage
      - Others provide mainly supplementary details
    </selection_criteria>
  </primary_with_supplements>
  <chronological_evolution>
    <description>Merge features by timeline showing evolution</description>
    <use_case>When features represent evolution of same concept over time</use_case>
    <selection_criteria>
      - Features have clear chronological progression
      - Later versions build on earlier versions
      - Requirements evolved rather than conflicted
    </selection_criteria>
  </chronological_evolution>
  <component_integration>
    <description>Merge by combining complementary technical components</description>
    <use_case>When features cover different aspects of same system</use_case>
    <selection_criteria>
      - Features cover different technical layers
      - Components are complementary not conflicting
      - Integration creates more complete system
    </selection_criteria>
  </component_integration>
  <scope_consolidation>
    <description>Merge overlapping scopes into unified comprehensive scope</description>
    <use_case>When features have significant scope overlap</use_case>
    <selection_criteria>
      - High keyword and deliverable overlap
      - Similar user stories and requirements
      - Redundant task breakdowns detected
    </selection_criteria>
  </scope_consolidation>
</merge_strategies>

<strategy_selection_process>
  FOR_EACH: group IN feature_groups:
    IF group.feature_count == 1:
      # Single feature - no merging needed
      group.merge_strategy = "no_merge_needed"
      SKIP: strategy analysis
    
    # Analyze group characteristics for strategy selection
    group_analysis = {
      "content_variance": calculate_content_variance(group.features),
      "chronological_progression": assess_chronological_progression(group.features),
      "component_complementarity": assess_component_complementarity(group.features),
      "scope_overlap": calculate_scope_overlap(group.features),
      "completion_status_variance": assess_completion_variance(group.features)
    }
    
    # Select optimal merge strategy
    strategy_scores = {
      "primary_with_supplements": score_primary_supplement_strategy(group_analysis),
      "chronological_evolution": score_chronological_strategy(group_analysis),
      "component_integration": score_component_strategy(group_analysis),
      "scope_consolidation": score_scope_strategy(group_analysis)
    }
    
    best_strategy = max(strategy_scores.items(), key=lambda x: x[1])
    group.merge_strategy = best_strategy[0]
    group.strategy_confidence = best_strategy[1]
    
    # Store strategy decision in Memory-Keeper
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "merge-strategy-{group.name}"
      - value: "Selected: {group.merge_strategy} (confidence: {group.strategy_confidence:.2f})"
      - category: "decision"
      - priority: "high"
    
    # Store strategy patterns in Memento for future learning
    IF memento_available:
      CALL: memento-mcp-create_relations
      PARAMETERS:
        - relations: [{
            "from": "{PROJECT_NAME}-feature-group-{group.name}",
            "to": "merge-strategy-{group.merge_strategy}",
            "relationType": "uses_merge_strategy",
            "confidence": group.strategy_confidence
          }]
    
    LOG: "🔄 Selected merge strategy for {group.name}: {group.merge_strategy} (confidence: {group.strategy_confidence:.2f})"
</strategy_selection_process>

<instructions>
  ACTION: Analyze each feature group to determine optimal merge strategy
  SCORE: Each strategy based on group characteristics
  SELECT: Highest-scoring strategy for each group
  STORE: Strategy decisions and confidence scores in Integrated Memory System
</instructions>

</step>

<step number="4" name="intelligent_content_merging">

### Step 4: Intelligent Content Merging

<step_metadata>
  <action>execute merge strategies to create unified features</action>
  <purpose>combine similar specifications while preserving all valuable content</purpose>
  <memory_integration>merge execution tracking + content preservation validation</memory_integration>
</step_metadata>

<merge_execution>
  <primary_with_supplements_execution>
    FUNCTION merge_primary_with_supplements(group):
      # Identify primary feature (most complete)
      primary_feature = identify_primary_feature(group)
      supplement_features = group.features - {primary_feature}
      
      merged_feature = copy_feature(primary_feature)
      
      # Enhance primary with supplementary content
      FOR_EACH: supplement IN supplement_features:
        merged_feature.content = enhance_with_supplement(
          merged_feature.content, 
          supplement.content
        )
        merged_feature.metadata.sources.append(supplement.source)
      
      RETURN merged_feature
  </primary_with_supplements_execution>
  <chronological_evolution_execution>
    FUNCTION merge_chronological_evolution(group):
      # Sort features by chronological order
      sorted_features = sort_by_date(group.features)
      
      merged_feature = create_evolution_feature(sorted_features)
      
      # Structure content as evolution timeline
      merged_feature.content.structure = "chronological_evolution"
      FOR_EACH: feature IN sorted_features:
        evolution_phase = {
          "date": feature.metadata.creation_date,
          "source": feature.source,
          "content": feature.content,
          "changes": identify_changes_from_previous(feature, previous_feature)
        }
        merged_feature.content.evolution_phases.append(evolution_phase)
      
      RETURN merged_feature
  </chronological_evolution_execution>
  <component_integration_execution>
    FUNCTION merge_component_integration(group):
      merged_feature = create_integrated_feature(group)
      
      # Organize by technical components
      component_map = {}
      FOR_EACH: feature IN group.features:
        FOR_EACH: component IN feature.semantic_indicators.components:
          IF component NOT IN component_map:
            component_map[component] = []
          component_map[component].append(feature)
      
      # Create integrated specification by component
      FOR_EACH: component, features IN component_map.items():
        integrated_content = integrate_component_content(features)
        merged_feature.content.components[component] = integrated_content
      
      RETURN merged_feature
  </component_integration_execution>
  <scope_consolidation_execution>
    FUNCTION merge_scope_consolidation(group):
      merged_feature = create_consolidated_feature(group)
      
      # Consolidate overlapping scopes
      merged_feature.content.scope = consolidate_scopes(group.features)
      merged_feature.content.user_stories = consolidate_user_stories(group.features)
      merged_feature.content.deliverables = consolidate_deliverables(group.features)
      merged_feature.content.tasks = deduplicate_and_merge_tasks(group.features)
      
      RETURN merged_feature
  </scope_consolidation_execution>
</merge_execution>

<merge_process_execution>
  merged_features = []
  
  FOR_EACH: group IN feature_groups:
    IF group.merge_strategy == "no_merge_needed":
      # Single feature - pass through unchanged
      merged_features.append(group.features[0])
    ELSE:
      # Execute appropriate merge strategy
      merged_feature = execute_merge_strategy(group, group.merge_strategy)
      
      # Validate merge preserved all content
      content_validation = validate_content_preservation(group.features, merged_feature)
      
      IF content_validation.passed:
        merged_features.append(merged_feature)
        
        # Store successful merge in Memory-Keeper
        CALL: mcp-memory-keeper-context_save
        PARAMETERS:
          - key: "successful-merge-{group.name}"
          - value: "Merged {len(group.features)} features using {group.merge_strategy}"
          - category: "progress"
          - priority: "high"
        
        LOG: "✅ Successfully merged {group.name} using {group.merge_strategy}"
      ELSE:
        # Merge failed validation - keep separate
        merged_features.extend(group.features)
        
        # Store merge failure for analysis
        CALL: mcp-memory-keeper-context_save
        PARAMETERS:
          - key: "failed-merge-{group.name}"
          - value: "Merge failed validation: {content_validation.issues}"
          - category: "error"
          - priority: "high"
        
        LOG: "❌ Merge failed for {group.name}: {content_validation.issues}"
  
  # Store final merge results
  CALL: mcp-memory-keeper-context_save
  PARAMETERS:
    - key: "deduplication-results"
    - value: "Reduced {len(feature_analyses)} features to {len(merged_features)} merged features"
    - category: "progress"
    - priority: "high"
  
  LOG: "🎯 Deduplication complete: {len(feature_analyses)} → {len(merged_features)} features"
</merge_process_execution>

<instructions>
  ACTION: Execute merge strategies for each feature group
  VALIDATE: Content preservation during merging process
  PRESERVE: All original content and metadata
  STORE: Merge execution results in Integrated Memory System
</instructions>

</step>

<step number="5" name="output_generation_and_validation">

### Step 5: Output Generation and Validation

<step_metadata>
  <action>generate deduplicated specification output</action>
  <purpose>provide clean, merged specifications ready for consolidation</purpose>
  <memory_integration>output validation + quality assurance tracking</memory_integration>
</step_metadata>

<output_structure>
  <merged_specifications>
    # Structure for deduplicated output
    deduplicated_output = {
      "merged_features": merged_features,
      "deduplication_summary": {
        "original_count": len(feature_analyses),
        "final_count": len(merged_features),
        "reduction_percentage": calculate_reduction_percentage(),
        "merge_strategies_used": get_strategies_used(),
        "content_preservation_validated": True
      },
      "merge_audit_trail": {
        "groups_created": len(feature_groups),
        "successful_merges": count_successful_merges(),
        "failed_merges": count_failed_merges(),
        "validation_results": get_validation_summary()
      }
    }
  </merged_specifications>
</output_structure>

<validation_process>
  # Comprehensive validation of deduplication results
  validation_results = {
    "content_preservation": validate_all_content_preserved(feature_analyses, merged_features),
    "no_information_loss": validate_no_information_loss(feature_analyses, merged_features),
    "semantic_coherence": validate_semantic_coherence(merged_features),
    "merge_quality": validate_merge_quality(merged_features),
    "integration_readiness": validate_integration_readiness(merged_features)
  }
  
  overall_validation = all(validation_results.values())
  
  # Store validation results
  CALL: mcp-memory-keeper-context_save
  PARAMETERS:
    - key: "deduplication-validation"
    - value: serialize_validation(validation_results)
    - category: "analysis"
    - priority: "high"
  
  IF overall_validation:
    LOG: "✅ Deduplication validation passed - output ready"
  ELSE:
    LOG: "❌ Deduplication validation issues detected"
    LOG: "Issues: {[k for k, v in validation_results.items() if not v]}"
</validation_process>

<instructions>
  ACTION: Generate deduplicated specification output with full audit trail
  VALIDATE: Content preservation and merge quality
  PROVIDE: Clean, merged specifications ready for further processing
  STORE: Complete validation and audit information in Integrated Memory System
</instructions>

</step>

<step number="5.5" name="extract_5_phase_workflow_context">

### Step 5.5: Extract Context for 5-Phase Workflow

<step_metadata>
  <action>extract valuable deduplication insights for future workflow phases</action>
  <purpose>optimize merged specifications for Phase 2-5 continuation</purpose>
  <memory_integration>cross-phase context preparation from deduplication results</memory_integration>
  <condition>enhanced context extraction for workflow intelligence</condition>
</step_metadata>

<context_extraction_for_phases>
  <phase_2_research_context>
    # Extract insights that will inform Phase 2: Research
    research_insights = {
      "feature_relationships": analyze_merged_feature_patterns(merged_features),
      "similarity_patterns": extract_successful_similarity_indicators(feature_groups),
      "component_dependencies": map_component_relationships(merge_results),
      "technology_integration": analyze_tech_stack_patterns(merged_specifications),
      "user_story_patterns": extract_consolidated_user_needs(merged_content)
    }
    
    # Store for Phase 2 Research enhancement
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "phase2-research-dedup-context"
      - value: serialize_context(research_insights)
      - category: "progress"
      - priority: "high"
    
    # Create Memento entities for cross-project research patterns
    CALL: memento-mcp-create_entities
    PARAMETERS:
      - entities: [{
          "name": "{PROJECT_ENTITY_NAME}-dedup-research-insights",
          "entityType": "research_foundation",
          "observations": [
            "Feature Relationships: {research_insights.feature_relationships[:3]}",
            "Similarity Patterns: {research_insights.similarity_patterns[:3]}",
            "Component Dependencies: {research_insights.component_dependencies[:3]}",
            "Tech Integration: {research_insights.technology_integration}",
            "User Story Patterns: {research_insights.user_story_patterns[:3]}"
          ]
        }]
  </phase_2_research_context>
  
  <phase_3_write_context>
    # Extract specification writing patterns from successful merges
    write_insights = {
      "merge_documentation_patterns": analyze_successful_merge_structures(merged_features),
      "feature_organization_success": extract_effective_grouping_strategies(feature_groups),
      "content_integration_methods": analyze_content_merge_techniques(merge_results),
      "semantic_coherence_patterns": extract_coherence_maintenance_strategies(validation_results),
      "specification_quality_metrics": define_quality_standards(successful_merges)
    }
    
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "phase3-write-dedup-context"
      - value: serialize_context(write_insights)
      - category: "progress"
      - priority: "high"
  </phase_3_write_context>
  
  <phase_4_verify_context>
    # Extract verification patterns from deduplication validation
    verify_insights = {
      "content_preservation_validation": extract_validation_techniques(validation_results),
      "merge_quality_assessment": analyze_quality_validation_patterns(merge_audit_trail),
      "semantic_coherence_checks": extract_coherence_validation_methods(merged_features),
      "integration_readiness_criteria": define_integration_validation_standards(output_validation),
      "quality_assurance_patterns": document_qa_approaches(successful_validations)
    }
    
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "phase4-verify-dedup-context"
      - value: serialize_context(verify_insights)
      - category: "progress"
      - priority: "high"
  </phase_4_verify_context>
  
  <phase_5_tasks_context>
    # Extract task breakdown patterns from merged specifications
    task_insights = {
      "merged_task_patterns": analyze_consolidated_task_structures(merged_features),
      "dependency_relationships": map_task_dependencies_from_merges(component_dependencies),
      "implementation_sequences": extract_execution_patterns(merged_deliverables),
      "complexity_assessments": analyze_merged_complexity_patterns(feature_analyses),
      "integration_task_patterns": identify_cross_feature_integration_tasks(merge_results)
    }
    
    CALL: mcp-memory-keeper-context_save
    PARAMETERS:
      - key: "phase5-tasks-dedup-context"
      - value: serialize_context(task_insights)
      - category: "progress"
      - priority: "high"
  </phase_5_tasks_context>
  
  <cross_phase_deduplication_intelligence>
    # Create comprehensive deduplication intelligence for all phases
    dedup_intelligence = {
      "merge_effectiveness_summary": create_merge_summary(deduplication_results),
      "feature_consolidation_map": map_original_to_merged_features(merge_audit_trail),
      "similarity_detection_insights": synthesize_similarity_patterns(feature_groups),
      "content_preservation_standards": establish_preservation_benchmarks(validation_results),
      "workflow_optimization_recommendations": generate_workflow_recommendations(dedup_session)
    }
    
    # Store comprehensive deduplication context
    CALL: memento-mcp-add_observations
    PARAMETERS:
      - observations: [{
          "entityName": "{PROJECT_ENTITY_NAME}",
          "contents": [
            "Feature Deduplication: {dedup_intelligence.merge_effectiveness_summary}",
            "Similarity Intelligence: {dedup_intelligence.similarity_detection_insights}",
            "Content Standards: {dedup_intelligence.content_preservation_standards}",
            "Optimization Insights: {dedup_intelligence.workflow_optimization_recommendations}",
            "5-Phase Enhanced: Deduplication context prepared for all phases"
          ]
        }]
  </cross_phase_deduplication_intelligence>
</context_extraction_for_phases>

<workflow_preparation_benefits>
  <phase_2_enhancement>
    - Research guided by actual feature relationship patterns from successful merges
    - Component analysis informed by validated dependency mappings
    - Technology research focused on proven integration patterns
  </phase_2_enhancement>
  
  <phase_3_enhancement>
    - Specification writing leverages successful merge documentation patterns
    - Feature organization follows proven consolidation strategies
    - Content integration uses validated merge techniques
  </phase_3_enhancement>
  
  <phase_4_enhancement>
    - Verification processes use proven content preservation validation methods
    - Quality standards based on successful merge validation criteria
    - Semantic coherence checks informed by deduplication validation patterns
  </phase_4_enhancement>
  
  <phase_5_enhancement>
    - Task breakdowns informed by consolidated task patterns from merged specifications
    - Dependency mapping based on validated component relationships
    - Implementation sequences guided by successful merge execution patterns
  </phase_5_enhancement>
</workflow_preparation_benefits>

<instructions>
  ACTION: Extract valuable deduplication insights optimized for each workflow phase
  STORE: Phase-specific context from merge results in memory systems for intelligent continuation
  PREPARE: Enhanced foundation for superior Phase 2-5 execution with deduplication intelligence
  LEVERAGE: Successful merge patterns and validation techniques to guide future development decisions
</instructions>

</step>

<step number="6" name="memory_system_persistence">

### Step 6: Integrated Memory System Persistence

<step_metadata>
  <action>capture and store deduplication insights and patterns</action>
  <purpose>build persistent knowledge for future deduplication operations</purpose>
  <stores>merge strategies, similarity patterns, validation approaches</stores>
  <condition>only if memory-keeper available</condition>
</step_metadata>

<memory_persistence_categories>
  <deduplication_patterns>
    - Feature similarity indicators that worked effectively
    - Merge strategies that produced best results
    - Similarity thresholds that balanced precision and recall
    - Content preservation techniques that maintained quality
  </deduplication_patterns>
  <project_evolution>
    - Specification evolution patterns observed
    - Feature relationship mappings discovered
    - Duplication sources and common causes
    - Quality improvements through intelligent merging
  </project_evolution>
  <cross_project_learning>
    - Successful merge strategies for similar technology stacks
    - Common feature duplication patterns across projects
    - Validation approaches that caught preservation issues
    - Similarity detection improvements for future operations
  </cross_project_learning>
</memory_persistence_categories>

<memory_persistence_process>
  <pattern_extraction>
    1. ANALYZE deduplication session for effective merge patterns and strategies
    2. EXTRACT successful similarity detection approaches and thresholds
    3. CATEGORIZE findings by technology stack and project characteristics
    4. PRIORITIZE insights by cross-project applicability and success rate
  </pattern_extraction>
  <knowledge_storage>
    1. SAVE successful merge strategies and their effectiveness scores to memory-keeper
    2. STORE similarity detection patterns and threshold recommendations
    3. TAG entries with technology stack, project type, and merge success metrics
    4. LINK to created merged specifications and validation results
  </knowledge_storage>
  <cross_project_establishment>
    1. CREATE deduplication pattern entities in Memento for cross-project learning
    2. ESTABLISH relationships between merge strategies and project characteristics
    3. UPDATE cross-project deduplication knowledge with proven approaches
    4. MAINTAIN effectiveness tracking for continuous improvement
  </cross_project_establishment>
  <fallback_behavior>
    1. IF memory-keeper unavailable: SKIP memory persistence
    2. DOCUMENT key deduplication insights in session summary
    3. RECOMMEND manual knowledge capture for future deduplication operations
  </fallback_behavior>
</memory_persistence_process>

<persistence_template>
  ## Deduplication Knowledge Captured
  
  The following insights have been stored in the Integrated Memory System:
  
  ### Merge Strategy Effectiveness
  - **Primary with Supplements**: [SUCCESS_RATE]% effective for [USE_CASES]
  - **Chronological Evolution**: [SUCCESS_RATE]% effective for [USE_CASES]
  - **Component Integration**: [SUCCESS_RATE]% effective for [USE_CASES]
  - **Scope Consolidation**: [SUCCESS_RATE]% effective for [USE_CASES]
  
  ### Similarity Detection Insights
  - **Optimal Threshold**: [THRESHOLD] balanced precision and recall effectively
  - **Key Indicators**: [EFFECTIVE_INDICATORS] proved most reliable
  - **Technology Patterns**: [TECH_PATTERNS] consistently indicated merger candidates
  - **Content Signals**: [CONTENT_SIGNALS] reliably predicted successful merges
  
  ### Project-Specific Patterns
  - **Feature Types**: [FEATURE_TYPES] most commonly duplicated
  - **Duplication Sources**: [SOURCES] primary causes of specification duplication
  - **Merge Challenges**: [CHALLENGES] encountered and solutions applied
  - **Quality Improvements**: [IMPROVEMENTS] achieved through intelligent merging
  
  ### Cross-Project Applications
  - **Reusable Strategies**: [STRATEGIES] applicable to similar technology stacks
  - **Pattern Recognition**: [PATTERNS] transferable to future deduplication operations
  - **Threshold Recommendations**: [THRESHOLDS] optimized for similar project types
  - **Validation Approaches**: [APPROACHES] proven effective for quality assurance
</persistence_template>

<instructions>
  ACTION: Extract and categorize deduplication session insights and patterns
  STORE: Save structured knowledge to Integrated Memory System for future operations
  ESTABLISH: Cross-project deduplication patterns and strategy effectiveness tracking
  PREPARE: Enhanced foundation for future intelligent specification deduplication
</instructions>

</step>

</process_flow>

## Error Handling

<error_scenarios>
  <scenario name="merge_validation_failure">
    <condition>Content preservation validation fails during merge execution</condition>
    <action>Preserve original features separately and document merge failure</action>
    <procedure>
      1. IMMEDIATE: Revert to original features for failed merge
      2. DOCUMENT: Specific validation failures and content preservation issues
      3. STORE: Failed merge analysis in memory-keeper for pattern recognition
      4. CONTINUE: Process remaining feature groups normally
      5. REPORT: Merge failures in final deduplication summary
    </procedure>
    <enhancement>Learn from merge failures to improve future strategy selection</enhancement>
  </scenario>
  <scenario name="similarity_detection_error">
    <condition>Semantic similarity analysis produces unreliable results</condition>
    <action>Fall back to conservative grouping with higher similarity thresholds</action>
    <fallback>Treat all features as separate to avoid inappropriate merging</fallback>
  </scenario>
  <scenario name="memory_system_unavailable">
    <condition>Integrated Memory System not available</condition>
    <action>Continue with standard deduplication, document limitation</action>
    <impact>Reduced pattern recognition but full functionality preserved</impact>
  </scenario>
</error_scenarios>

## Final Checklist

<verification_checklist>
  <verify>
    - [ ] Memory-keeper initialization attempted (if available)
    - [ ] All specification content analyzed for semantic similarity
    - [ ] Feature groups created based on similarity detection
    - [ ] Appropriate merge strategies selected for each group
    - [ ] Content merging executed with validation
    - [ ] All original content preserved during merging
    - [ ] Merged specifications maintain semantic coherence
    - [ ] Deduplication results validated for quality and completeness
    - [ ] Audit trail created for merge decisions and execution
    - [ ] Deduplication insights stored in Integrated Memory System (if available)
    - [ ] Output ready for integration with consolidation or standalone use
  </verify>
</verification_checklist>

<memory_system_integration_benefits>
  - Enhanced similarity detection through cross-project pattern recognition
  - Improved merge strategy selection based on historical effectiveness
  - Reduced deduplication complexity through persistent knowledge
  - Cross-project learning for better merge decision making
  - Accelerated future deduplication through proven technique reuse
  - Improved specification quality through intelligent content consolidation
</memory_system_integration_benefits>