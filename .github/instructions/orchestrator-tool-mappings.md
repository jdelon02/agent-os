# Orchestrator Role-Specific MCP Tool Mappings

## Overview

This document defines the precise MCP tool assignments for each role in the orchestrated Agent OS workflow, ensuring optimal tool utilization and preventing conflicts during single-agent role transitions.

## Role MCP Tool Assignments

### 1. Analysis Role (`analyze-product.md`)

**PRIMARY MCP TOOLS** (Always Required):
```yaml
Memory-Keeper:
  - context_session_start     # Initialize analysis session
  - context_save             # Store analysis findings
  - context_status           # Validate session state

Meilisearch:
  - Meilisearch-search       # Check cached documentation first
  - Meilisearch-get-documents # Browse available cache
  - Meilisearch-add-documents # Cache new documentation

Context7:
  - context7-resolve-library-id  # Only if cache miss
  - context7-get-library-docs    # Fetch fresh documentation

Sequential Thinking:
  - sequentialthinking       # Analysis breakdown and planning
```

**CONDITIONAL MCP TOOLS** (Based on Confidence Routing):
```yaml
# LOW Confidence Only:
Vibe Check:
  - vibe_check              # Validate analysis approach
  - vibe_distill            # Simplify complex analysis plans

Memento:
  - memento-mcp-search_nodes    # Query for similar analysis patterns
  - memento-mcp-semantic_search # Find related project contexts
```

**HANDOFF ARTIFACTS**:
- Analysis findings in Memory-Keeper with key: `{project}-analysis-findings`
- Technology documentation cached in Meilisearch  
- Initial project entities in Memento knowledge graph
- Confidence assessment for downstream roles

### 2. Planning Role (`plan-product.md`)

**PRIMARY MCP TOOLS** (Always Required):
```yaml
Memory-Keeper:
  - context_get             # Retrieve analysis context
  - context_save            # Store planning decisions
  - context_checkpoint      # Create planning milestone

Memento:
  - memento-mcp-search_nodes        # Find similar project patterns
  - memento-mcp-semantic_search     # Discover relevant architectures
  - memento-mcp-create_entities     # Store architectural decisions
  - memento-mcp-create_relations    # Link decision relationships

Sequential Thinking:
  - sequentialthinking      # Multi-phase planning breakdown
```

**CONDITIONAL MCP TOOLS** (Based on Confidence Routing):
```yaml
# MEDIUM/LOW Confidence:
Vibe Check:
  - vibe_check              # Validate plan against patterns
  - vibe_distill            # Simplify over-complex plans

# LOW Confidence Only:
Meilisearch:
  - Meilisearch-search      # Additional architecture documentation
```

**HANDOFF ARTIFACTS**:
- Validated implementation plan in Memory-Keeper with key: `{project}-planning-decisions`
- Architectural decisions stored in Memento with confidence scores
- Pattern relationships established for downstream roles

### 3. Specification Role (`create-spec.md`)

**PRIMARY MCP TOOLS** (Always Required):
```yaml
Memory-Keeper:
  - context_get             # Retrieve planning context
  - context_save            # Store specification details
  - context_checkpoint      # Create specification milestone

Memento:
  - memento-mcp-open_nodes          # Access planning decisions
  - memento-mcp-create_entities     # Store technical specifications
  - memento-mcp-create_relations    # Link spec components

Sequential Thinking:
  - sequentialthinking      # Systematic spec development
```

**CONDITIONAL MCP TOOLS** (Based on Confidence Routing):
```yaml
# MEDIUM/LOW Confidence:
Meilisearch:
  - Meilisearch-search      # Technical specification docs
  - Meilisearch-get-documents # Browse spec templates

Context7:
  - context7-resolve-library-id  # Technical documentation
  - context7-get-library-docs    # Detailed API references

# LOW Confidence Only:
Vibe Check:
  - vibe_check              # Validate specification approach
```

**HANDOFF ARTIFACTS**:
- Complete technical specifications in Memory-Keeper with key: `{project}-specifications`
- Technical entity relationships in Memento
- Implementation-ready task breakdown

### 4. Execution Role (`execute-tasks.md`)

**PRIMARY MCP TOOLS** (Always Required):
```yaml
Memory-Keeper:
  - context_get             # Retrieve specification context
  - context_save            # Track implementation progress
  - context_checkpoint      # Regular progress checkpoints
  - context_git_commit      # Automatic context save on commits

Memento:
  - memento-mcp-open_nodes          # Access specifications
  - memento-mcp-create_entities     # Store implementation decisions
  - memento-mcp-add_observations    # Track implementation outcomes
  - memento-mcp-create_relations    # Link implementation patterns
```

**CONDITIONAL MCP TOOLS** (Based on Error Conditions):
```yaml
# Error Resolution:
Memory-Keeper:
  - context_search          # Find similar error patterns
  - context_analyze         # Analyze error context

Memento:
  - memento-mcp-semantic_search     # Find solution patterns
  - memento-mcp-get_entity_history  # Track decision evolution

# LOW Confidence Implementation:
Sequential Thinking:
  - sequentialthinking      # Break down complex implementations

Vibe Check:
  - vibe_check              # Validate critical implementation decisions
```

**HANDOFF ARTIFACTS**:
- Implementation progress in Memory-Keeper with key: `{project}-execution-progress`
- Implementation patterns stored in Memento with success metrics
- Error resolution patterns for future reference

### 5. Validation Role (Future Enhancement)

**PRIMARY MCP TOOLS** (All Systems Integration):
```yaml
Memory-Keeper:
  - context_get             # Retrieve all role contexts
  - context_analyze         # Comprehensive context analysis
  - context_summarize       # Create validation summary

Memento:
  - memento-mcp-read_graph          # Full knowledge graph review
  - memento-mcp-get_decayed_graph   # Time-weighted pattern analysis
  - memento-mcp-semantic_search     # Validation pattern discovery

Vibe Check:
  - vibe_check              # Final assumption validation
  - vibe_learn              # Store validation patterns

Meilisearch:
  - Meilisearch-search      # Validation documentation
  - Meilisearch-get-stats   # Cache efficiency analysis
```

## MCP Tool Coordination Protocols

### 1. Session Management Across Roles

**Session Continuity Pattern**:
```yaml
Role Entry Protocol:
  1. Check Memory-Keeper session status
  2. Validate required context from previous role
  3. Update session description with current role
  4. Activate role-specific MCP tool configuration

Role Exit Protocol:
  1. Save role outputs to Memory-Keeper with structured keys
  2. Update Memento entities with role-specific observations
  3. Create checkpoint for downstream role consumption
  4. Document role completion status
```

**Memory-Keeper Context Key Structure**:
```yaml
Format: "{project}-{role}-{artifact_type}"
Examples:
  - "agent-os-analysis-findings"
  - "agent-os-planning-decisions" 
  - "agent-os-specifications"
  - "agent-os-execution-progress"
```

### 2. Memento Knowledge Graph Coordination

**Entity Naming Convention**:
```yaml
Project Entities: "{CANONICAL_PROJECT_ID}-{component}"
Decision Entities: "{project}-{role}-{decision_type}"
Pattern Entities: "{pattern_category}-{pattern_name}"
Technology Entities: "{tech_stack}-{component}"
```

**Relationship Types**:
```yaml
Cross-Role: "feeds_into", "builds_upon", "validates"
Within-Role: "implements", "defines", "uses"
Pattern: "similar_to", "improved_by", "replaced_by"
Success: "succeeded_in", "failed_in", "optimized_by"
```

### 3. Tool Unavailability Protocols

**Memory-Keeper Unavailable**:
```yaml
Fallback Strategy:
  - Use structured comments in code for context storage
  - Create CONTEXT.md files for manual context management
  - Document progress in commit messages
  - Log limitation in orchestrator status

Impact Assessment:
  - CRITICAL: Lose cross-role context continuity
  - MODERATE: Manual effort required for context management
  - MINOR: Still functional with reduced efficiency
```

**Memento Unavailable**:
```yaml
Fallback Strategy:
  - Use Memory-Keeper for pattern storage (flat structure)
  - Create PATTERNS.md for manual pattern documentation
  - Increase Sequential Thinking usage for pattern analysis
  - Document architectural decisions in Memory-Keeper notes

Impact Assessment:
  - CRITICAL: Lose cross-project pattern recognition
  - MODERATE: Reduced architectural intelligence
  - MINOR: Single-project execution still effective
```

**Sequential Thinking Unavailable**:
```yaml
Fallback Strategy:
  - Use structured manual breakdown in Memory-Keeper
  - Increase Vibe Check usage for validation
  - Create detailed step-by-step documentation
  - Apply more conservative confidence routing

Impact Assessment:
  - MODERATE: Lose systematic problem breakdown
  - MINOR: Manual structuring still possible
  - NEGLIGIBLE: Other MCP tools can compensate
```

**Vibe Check Unavailable**:
```yaml
Fallback Strategy:
  - Increase checkpoint frequency in Memory-Keeper
  - Use Memento pattern validation more heavily
  - Apply more conservative implementation approach
  - Manual assumption documentation required

Impact Assessment:
  - MODERATE: Lose assumption validation capability
  - MINOR: Pattern-based validation still available
  - NEGLIGIBLE: Conservative approach mitigates risk
```

## Confidence-Based Tool Usage Matrix

### HIGH Confidence Route
```yaml
Analysis Role:
  - Memory-Keeper: context_session_start, context_save
  - Meilisearch: Meilisearch-search (cache hits expected)
  - Context7: SKIP (use cached documentation)
  - Sequential Thinking: SKIP (use established patterns)
  - Vibe Check: SKIP
  - Memento: memento-mcp-search_nodes (pattern reuse)

Planning Role:
  - Memory-Keeper: context_get, context_save
  - Memento: memento-mcp-search_nodes, memento-mcp-create_entities
  - Sequential Thinking: LIMITED (pattern-guided)
  - Vibe Check: SKIP

Specification Role:
  - Memory-Keeper: context_get, context_save
  - Memento: memento-mcp-open_nodes, memento-mcp-create_entities
  - Sequential Thinking: LIMITED (template-guided)
  - Meilisearch: SKIP (use cached patterns)

Execution Role:
  - Memory-Keeper: Full usage with automated checkpoints
  - Memento: Pattern-based implementation selection
  - Sequential Thinking: SKIP
  - Vibe Check: SKIP
```

### MEDIUM Confidence Route
```yaml
Analysis Role:
  - Memory-Keeper: Full session management
  - Meilisearch: Meilisearch-search + selective fetch
  - Context7: LIMITED (fill documentation gaps)
  - Sequential Thinking: SELECTIVE (key decision points)
  - Vibe Check: SKIP
  - Memento: Full pattern analysis

Planning Role:
  - Memory-Keeper: Full context management
  - Memento: Comprehensive pattern search
  - Sequential Thinking: FULL (systematic planning)
  - Vibe Check: SELECTIVE (key decisions)

Specification Role:
  - Memory-Keeper: Full context management
  - Memento: Full pattern utilization
  - Sequential Thinking: FULL (systematic spec development)
  - Meilisearch: Additional documentation fetch

Execution Role:
  - Memory-Keeper: Full usage with frequent checkpoints
  - Memento: Pattern validation + decision tracking
  - Sequential Thinking: CONDITIONAL (complex implementations)
```

### LOW Confidence Route
```yaml
All Roles:
  - Memory-Keeper: COMPREHENSIVE (maximum context preservation)
  - Memento: FULL (comprehensive pattern analysis)
  - Sequential Thinking: FULL (systematic breakdown)
  - Vibe Check: FULL (comprehensive validation)
  - Meilisearch + Context7: COMPREHENSIVE (maximum documentation)
```

## Performance Optimization Guidelines

### 1. MCP Tool Call Efficiency
```yaml
Batch Operations:
  - Group Memento operations (create multiple entities/relations together)
  - Batch Meilisearch queries when possible
  - Use Memory-Keeper checkpoints strategically

Cache Strategy:
  - Prioritize Meilisearch cache hits
  - Store frequently accessed patterns in Memento
  - Use Memory-Keeper for session-level caching

Parallel Execution:
  - Non-dependent MCP tool calls can be parallelized
  - Documentation queries independent of memory operations
  - Pattern searches can run while context is being saved
```

### 2. Context Size Management
```yaml
Memory-Keeper:
  - Use structured keys to avoid context bloat
  - Leverage checkpoints to compress old context
  - Store only essential artifacts for role handoffs

Memento:
  - Focus on high-value patterns and decisions
  - Use confidence scores to filter noise
  - Periodic graph cleanup for performance

Token Optimization:
  - Use MCP memory systems to reduce context window usage
  - Query specific artifacts rather than full context dumps
  - Leverage semantic search for targeted information retrieval
```

## Testing and Validation

### 1. Tool Integration Tests
```bash
# Test Memory-Keeper session continuity
/orchestrate --test memory-continuity

# Test Memento pattern recognition
/orchestrate --test pattern-matching

# Test confidence routing
/orchestrate --test confidence-levels

# Test tool unavailability handling
/orchestrate --test degraded-mode
```

### 2. Role Transition Validation
```yaml
Validation Points:
  - Context handoff completeness
  - MCP tool configuration correctness  
  - Artifact availability for downstream roles
  - Performance metrics within acceptable ranges
```

This comprehensive mapping ensures each role operates with optimal MCP tool utilization while maintaining orchestrator coordination integrity.