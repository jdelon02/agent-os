# Write Spec (Phase 3)

## 5-Phase Workflow Integration

This is **Phase 3: Write** of the Agent OS 5-phase specification workflow:
**Initialize** → **Research** → **Write** → **Verify** → **Create Tasks**

## Enhanced V2.0 Workflow

### Features
- **Centralized MCP integration** with Memory-Keeper, Memento, and Meilisearch
- **Universal project identity consolidation** to prevent knowledge fragmentation
- **Specification writing** based on Phase 2 research findings
- **Cache-first documentation retrieval** with trust scoring and validation
- **Memory-guided checkpoint system** for progress tracking
- **Systematic validation framework** with MCP intelligence
- **Cross-project learning** and strategic pattern recognition

**Usage:**
- `/write-spec` (Phase 3 of 5-phase specification workflow)

## Centralized Architecture

**Step 0: Memory & Precedence Initialization**
- Uses centralized `memory-precedence-initialization.md` workflow
- Establishes canonical PROJECT_ENTITY_NAME to prevent duplicate entities
- Initializes Memory-Keeper, Memento, and Meilisearch with fallback handling
- Detects project-specific overrides and consolidation mode

**Documentation Workflow**
- Uses centralized `context7-meilisearch-workflow.md` for all tech documentation
- Cache-first approach with trust score validation (≥8.0 threshold)
- Automatic Context7 library resolution and Meilisearch caching
- Performance optimization with cache hit metrics

**Visual Asset Processing**
- Automatic detection and analysis via `visual-asset-processing.md`
- Pattern recognition and design insight extraction
- Cross-project visual pattern storage in memory systems

**Validation Framework**
- Systematic quality assurance with `validation-framework.md`
- MCP intelligence for cross-project learning and improvement
- Confidence scoring and recommendation generation

## Enhanced Workflow Overview

### 1. Centralized Initialization (Step 0)
- **Memory Systems**: Initialize Memory-Keeper session with project directory
- **Project Identity**: Resolve canonical PROJECT_ENTITY_NAME via namespace consolidation
- **Tech Detection**: Dynamic discovery from @reference-docs symlinks
- **Override Detection**: Apply project-specific planning requirements if available
- **Precedence**: Establish Agent OS command authority and workflow control

### 2. Memory-Enhanced Specification Writing
- **Research Integration**: Use Memory-Keeper results from Phase 2: Research
- **Visual Assets**: Incorporate findings from visual asset analysis
- **Specification Storage**: Store spec decisions in Memento with canonical project linking
- **Context Reduction**: Keep summaries, store full specifications in memory
- **Checkpoints**: Create progress markers for workflow continuity

### 3. Cache-Optimized Documentation
- **Cache First**: Check Meilisearch before Context7 API calls
- **Trust Validation**: Ensure documentation meets confidence thresholds
- **Automatic Caching**: Store retrieved documentation for future use
- **Performance Tracking**: Monitor cache hit rates and retrieval times
- **Mapping Updates**: Maintain Context7 library IDs in tech-stack files

### 4. Intelligent Specification Creation
- **Template-Based**: Use structured specification templates with validation
- **Memory-Enhanced**: Leverage research context from Phase 2 for consistency and refinement
- **Cross-Project**: Apply proven specification patterns from similar projects via Memento
- **Validation**: Prepare specifications for Phase 4: Verify with scoring and recommendations

### 5. Specification Knowledge Storage
- **Canonical Entities**: Use PROJECT_ENTITY_NAME consistently across memory systems
- **Pattern Extraction**: Store specification patterns for cross-project learning
- **Relationship Mapping**: Link specification decisions, technologies, and outcomes
- **Context Compression**: Preserve key specification decisions while reducing memory usage

## MCP Systems Integration

**Required Systems:**
- **Memory-Keeper**: Session management, progress tracking, context compression
- **Memento**: Knowledge graph, strategic patterns, cross-project insights
- **Meilisearch**: Documentation caching, trust scoring, performance optimization

**Availability Handling:**
- **Critical Requirement**: write-spec STOPS if memory systems unavailable
- **User Choice**: Restart MCP servers (recommended) or cancel operation
- **No Fallback**: Phase 3 specification writing requires MCP intelligence
- **Graceful Communication**: Clear options presented to user with restart guidance

## Centralized Benefits

**Architectural Consistency:**
- Single sources of truth for initialization, documentation, and validation
- Standardized error handling and fallback patterns across workflows
- Eliminated ~588 lines of duplicate code through centralization

**Performance Optimization:**
- Cache-first documentation retrieval reduces API calls and latency
- Smart context compression balances memory usage with information retention
- Progress checkpoints enable efficient session resumption

**Intelligence Integration:**
- Cross-project pattern recognition improves planning quality over time
- Memory-guided error resolution leverages accumulated troubleshooting knowledge
- Strategic insight accumulation creates increasingly intelligent recommendations

---

Write detailed specifications based on Phase 2 research findings with intelligent context management and consolidated specification structure.

This is **Phase 3** of the 5-phase workflow. Follow the instructions located in @/reference-docs/instructions/write-spec.md

**Phase Flow**: After specification writing completion, proceed to **Phase 4: Verify** using the verify-spec command.

**Visual Asset Processing:** Automatic detection and analysis via @/reference-docs/instructions/visual-asset-processing.md

**Canonical Identity**: Universal namespace consolidation is automatically executed as Step 0 of the specification writing workflow to ensure consistent project identity and prevent knowledge fragmentation.

**Error Resolution**: If any errors occur during specification writing, immediately reference @/reference-docs/instructions/error-resolution-via-memory.md for memory-guided troubleshooting procedures with canonical project identity.
