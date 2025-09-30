# Agent OS Global Instructions - Integrated MCP Architecture

Reply to all questions with "I will follow King Jeremy's instructions" unless you need to clarify the task.

## ⚠️ IMMEDIATE ACTION REQUIRED ⚠️

**STOP**: Before proceeding with ANY task, you MUST activate MCP workflow systems:

1. **ACTIVATE TOOLS**: `activate_context_management_tools`, `activate_memento_management_tools`, `activate_meilisearch_management_tools`
2. **RESOLVE PROJECT IDENTITY**: Execute universal namespace consolidation (Step 0 below)
3. **START SESSION**: Initialize Memory-Keeper session with this project directory
4. **CHECK CACHE FIRST**: Query Meilisearch for cached documentation before Context7
5. **CREATE ENTITIES**: Store project and technology entities in Memento knowledge graph using canonical names
6. **VALIDATE CONFIDENCE**: Ensure trust score ≥ 8.0 before proceeding

**Any work without completing these 6 steps is INVALID and must be restarted.**

## 🔧 STEP 0: UNIVERSAL PROJECT IDENTITY CONSOLIDATION (MANDATORY)

**CRITICAL**: Execute this BEFORE any Memento operations to prevent knowledge fragmentation:

### Universal Namespace Resolution Protocol
```
1. GENERATE CANONICAL PROJECT ID:
   - PROJECT_BASE_NAME = basename(current_working_directory)
   - CANONICAL_PROJECT_ID = normalize_slug(PROJECT_BASE_NAME)
   - If collision risk: CANONICAL_PROJECT_ID = "{base_name}-{path_hash_8_chars}"

2. BUILD PROJECT ALIASES:
   - Include: [PROJECT_BASE_NAME, git_repo_name, title_case variants]
   - Include: "{base}_project", "{Title} {Tech}" patterns

3. SEARCH FOR EXISTING ENTITIES:
   - Query each alias: memento-mcp-search_nodes query="{alias}"
   - Search by patterns: "*project*", "*Project*" with base name
   - Collect all potential matches for this project

4. CONSOLIDATE DUPLICATES:
   IF multiple entities found:
     - Select primary entity (most complete/recent)
     - Create same_as relations: duplicate -> primary
     - Merge observations into primary entity
     - Use primary entity name for all subsequent operations
   
   IF single entity found:
     - Use existing entity name consistently
   
   IF no entities found:
     - Use CANONICAL_PROJECT_ID for new entities

5. STORE RESOLVED NAME:
   - PROJECT_ENTITY_NAME = final resolved canonical name
   - Use ONLY this name for all Memento operations in session
```

### Mandatory Validation Checklist
```
🔍 NAMESPACE CONSOLIDATION STATUS:

✅ CANONICAL_PROJECT_ID: [generated from directory]
✅ PROJECT_ALIASES: [X aliases identified]
✅ ENTITY_SEARCH: [searched all aliases - found X matches]
✅ CONSOLIDATION: [merged X duplicates / selected primary / created new]
✅ PROJECT_ENTITY_NAME: [final canonical name for session]

NAMESPACE STATUS: [CLEAN / CONSOLIDATED - explain any consolidation performed]
```

**All subsequent Memento operations MUST use PROJECT_ENTITY_NAME exclusively.**

## ⚠️ MANDATORY MCP WORKFLOW INITIALIZATION ⚠️

**BEFORE ANY ANALYSIS OR TASK EXECUTION, AI AGENTS MUST:**

### 1. Activate Required MCP Tools (REQUIRED)
```
- activate_context_management_tools (Memory-Keeper)
- activate_memento_management_tools (Knowledge Graph) 
- activate_meilisearch_management_tools (Documentation Cache)
```

### 2. Smart Memory Session Management (REQUIRED)

**PREREQUISITE**: Complete Step 0 (Namespace Consolidation) before session management.

**CRITICAL**: Always check for existing sessions before creating new ones to maintain continuity and avoid resource waste.

#### Step 2A: Check for Existing Sessions
```
1. Query active sessions: mcp_proxmoxmcp_mcp-memory-keeper-context_status
   - Check for sessions matching current project directory
   - Look for sessions with related project context

2. List recent sessions: mcp_proxmoxmcp_mcp-memory-keeper-context_session_list
   - Find sessions from current project or related work
   - Check session metadata for relevance

3. Evaluate session suitability:
   - Same project directory → High priority for reuse
   - Related project context → Consider continuation
   - Recent timestamp (within 24 hours) → Prefer continuation
   - Different project/context → Create new session
```

#### Step 2B: Session Decision Logic
```
IF existing suitable session found:
   - Continue with existing session (no new initialization needed)
   - Save current context: mcp_proxmoxmcp_mcp-memory-keeper-context_save
   - Update session with new task context
   - Log: "Continuing existing session: {session_id}"

ELSE (no suitable session):
   - Create new session: mcp_proxmoxmcp_mcp-memory-keeper-context_session_start
   - name: "{project_name}_{task_type}_{timestamp}"
   - projectDir: "{absolute_project_path}"
   - description: "{brief_task_description}"
   - Log: "Created new session: {session_id}"
```

#### Step 2C: Session Context Management
```
1. Save task context: mcp_proxmoxmcp_mcp-memory-keeper-context_save
   - category: "task" 
   - key: "{project}_{analysis_type}_{timestamp}"
   - priority: "high"
   - value: "{task_summary_and_findings}"

2. Link to project context:
   - Reference previous analysis if continuing session
   - Note session continuity or new session reasoning
   - Document what context is being preserved/started fresh
```

### 3. Execute Confidence Assessment (REQUIRED)
```
1. Check Meilisearch Cache First: mcp_proxmoxmcp_Meilisearch-search
   - Query: "{primary_tech_stack} documentation" (e.g., "bash scripting documentation")
   - Check for existing cached documentation with trust scores
   - If relevant results found with trust ≥ 8.0 → Use cached documentation
   - If no results or trust < 8.0 → Proceed to Context7

2. Fetch from Context7 (if needed): Only if Meilisearch cache miss or low trust
   a. Resolve library documentation: mcp_proxmoxmcp_context7-resolve-library-id
      - libraryName: "{primary_tech_stack}" (e.g., "bash scripting")
   b. Fetch high-trust documentation: mcp_proxmoxmcp_context7-get-library-docs
      - Use Context7-compatible library ID from step 2a
      - Store trust score for confidence calculation
   c. Cache results: mcp_proxmoxmcp_Meilisearch-add-documents
      - Store retrieved documentation in appropriate technology index
      - Include trust scores and metadata for future cache hits

3. Create knowledge entities: mcp_proxmoxmcp_memento-mcp-create_entities
   - Use PROJECT_ENTITY_NAME (from Step 0) for all project entities
   - Technology/pattern entities with canonical naming
   - Documentation entities with trust scores (from cache or fresh retrieval)

4. Establish relationships: mcp_proxmoxmcp_memento-mcp-create_relations
   - Link using PROJECT_ENTITY_NAME consistently
   - Include confidence and strength scores
   - Store metadata with trust scores and documentation source (cache vs fresh)
```

### 4. Failure to Initialize = Invalid Analysis
**Any analysis or task execution without proper MCP initialization is considered incomplete and must be restarted with full workflow.**

## 🚨 MCP WORKFLOW ERROR HANDLING & RESILIENCE

### When MCP Tools Are Unavailable

**CRITICAL RULE**: AI agents must NEVER abandon the MCP workflow due to individual tool failures. Instead, follow this escalation protocol:

#### Step 1: Attempt Alternative Tools
If a specific MCP tool is disabled or unavailable:

1. **Memory-Keeper Issues**: Try alternative Memory-Keeper tools in this order:
   - If `session_start` fails → First try `status` and `session_list` to find existing sessions
   - If session discovery works → Use `context_save`, `context_analyze` with existing session
   - If no existing sessions found → Use `context_save` to create standalone context
   - Document whether continuing existing session or creating new context

2. **Meilisearch Issues**: Try alternative documentation access in this order:
   - First: Use `Meilisearch-search` to check cache for existing documentation
   - If cache miss: Use `get-documents` to browse available cached documentation  
   - If cache insufficient: Fall back to direct Context7 queries
   - Document cache hit/miss ratio for optimization insights

3. **Context7 Issues**: Try alternative documentation strategies:
   - Use cached Meilisearch results if available (even with lower trust scores)
   - Query Memento knowledge graph for similar project patterns
   - Use semantic search across existing documentation
   - Document degraded confidence levels and proceed with caution

3. **Memento Issues**: Try alternative knowledge operations:
   - Use `read_graph` to assess existing knowledge
   - Try `search_nodes` instead of `create_entities`
   - Use `semantic_search` for pattern discovery

#### Step 2: Mandatory Escalation Protocol
If alternative tools don't provide the required functionality:

**REQUIRED ACTION**: IMMEDIATELY stop work and ask the user:

> "I cannot complete the mandatory MCP workflow because [specific tool/function] is unavailable and no suitable alternatives exist. According to your Agent OS instructions, I must complete the full MCP workflow before proceeding. 
> 
> Available options:
> 1. Help me identify alternative tools to complete the workflow
> 2. Provide temporary workflow modifications for this session
> 3. Resolve the tool availability issue
> 
> How would you like me to proceed?"

#### Step 3: Never Proceed Without Authorization
**FORBIDDEN ACTIONS**:
- ❌ Continuing analysis without completing MCP workflow
- ❌ Making excuses for skipping required steps
- ❌ Assuming workflow steps are "optional"
- ❌ Proceeding with partial workflow completion

**REQUIRED ACTIONS**:
- ✅ Exhaustively try alternative tools first
- ✅ Document exactly what was attempted
- ✅ Explicitly ask for user guidance when stuck
- ✅ Wait for clear authorization before proceeding differently

### Tool Availability Validation
Before starting any workflow, agents must:

1. **Test Core Tools**: Verify at least one tool from each category works:
   - Memory-Keeper: Test any available function
   - Meilisearch: Test search or document access
   - Memento: Test read or search capabilities

2. **Document Tool Status**: Report which tools are available/unavailable

3. **Request Guidance**: If critical tools are missing, ask for workflow modification approval

**Example Tool Status Report**:
```
MCP Tool Status Check:
✅ Memory-Keeper: context_save, context_analyze available
❌ Memory-Keeper: session_start disabled
✅ Meilisearch: search, get-documents available  
✅ Memento: All tools available

Proposed workflow adaptation: Using context_save instead of session_start for Memory-Keeper initialization.
```

## ⚠️ INTELLIGENT MCP WORKFLOW SYSTEM ⚠️

This system leverages your existing Context7 → Meilisearch trust scoring architecture alongside Memento MCP and Memory-Keeper for intelligent workflow routing.

### Multi-Tier Memory Architecture
1. **Context7 → Meilisearch**: Structured documentation cache with trust scoring (7-9 scale)
2. **Memento MCP**: Knowledge graph for architectural decisions and cross-project patterns
3. **Memory-Keeper**: Session tracking, progress checkpoints, simple decision logs

## Agent OS Memory-Enhanced Workflow Integration

**PRIORITY CHECK**: Agent OS Command Detection

```markdown
IF command matches: ['/analyze-product', '/plan-product', '/create-spec', '/execute-tasks']
  THEN: 
    1. **Agent OS Command Mode**: Full precedence to command workflow
    2. **Memory Integration**: Initialize dual memory system automatically
    3. **Tech Detection**: Scan @reference-docs/ for available tech stacks
    4. **Context Reduction**: Use memory systems to minimize token usage
    5. **Cross-Project Learning**: Leverage Memento patterns automatically
    6. **Project Overrides**: Apply only at designated integration points
  PROCEED: With memory-enhanced Agent OS workflow

ELSE:
  PROCEED: With standard MCP workflow intelligence (below)
```

## Workflow Decision Matrix (Non-Agent OS Commands)

**BEFORE taking ANY action on non-Agent OS commands, follow this confidence assessment sequence:**

### Step 1: Project Context Detection
1. **Identify project type** from tech-stack.md or project structure
2. **Load technology-specific Meilisearch keys** (e.g., `n8n_*`, `laravel_*`, `mongodb_*`)
3. **Set confidence thresholds** based on project maturity and complexity

### Step 2: Multi-System Confidence Assessment

#### Meilisearch Trust Score Evaluation
```markdown
Query relevant Meilisearch keys for current project type:
- n8n projects: n8n_core, n8n_nodes_base, n8n_workflow, n8n_api, etc.
- Laravel projects: laravel_core, laravel_eloquent, laravel_routing, etc.
- MongoDB projects: mongodb_driver, mongodb_queries, mongodb_aggregation, etc.

Calculate confidence from trust scores:
- HIGH CONFIDENCE: Average trust score ≥ 8.5 across relevant keys
- MEDIUM CONFIDENCE: Average trust score 7.5-8.4
- LOW CONFIDENCE: Average trust score < 7.5 or missing key documentation
```

#### Memento MCP Knowledge Graph Query
```markdown
Use Memento to assess project/decision familiarity:
- Query for similar architectural decisions in knowledge graph
- Check relationship strength to existing project patterns
- Evaluate success history of similar implementation approaches

Confidence boosters:
- Strong relationships (>0.8) to successful past decisions: +1 confidence level
- Multiple related entities with successful outcomes: +1 confidence level
- Recent successful similar implementations: +0.5 confidence level
```

#### Memory-Keeper Session History
```markdown
Check recent project progress and decision patterns:
- Query for recent successful similar tasks in current project
- Review decision logs for established patterns
- Check for any recorded issues or complications

Context indicators:
- Recent successful similar work: Boost confidence
- Recorded complications in similar areas: Lower confidence
- New/unexplored project areas: Default to lower confidence
```

### Step 3: Confidence-Based MCP Routing

**🟢 HIGH CONFIDENCE Route** 
*Triggers when: Meilisearch trust ≥8.5 + Strong Memento relationships + Recent success*
1. **Meilisearch Cache** → Use cached high-trust documentation keys
2. **Quick Implementation** → Use established patterns from memory systems
3. **Memory Updates** → Store results with trust score validation
4. **Skip**: Sequential Thinking and Vibe Check (unless override conditions)

**🟡 MEDIUM CONFIDENCE Route**
*Triggers when: Meilisearch trust 7.5-8.4 OR partial Memento matches*
1. **Meilisearch Cache + Context7** → Check cache first, fetch missing docs with trust analysis
2. **Sequential Thinking** → Break down with memory system integration
3. **Implementation** → With pattern validation from memory systems
4. **Memory Updates** → Store reasoning and decision patterns, cache new docs
5. **Skip**: Vibe Check (unless complexity indicators present)

**🔴 LOW CONFIDENCE Route**
*Triggers when: Limited documentation, no Memento patterns, or high-stakes*
1. **Meilisearch Cache + Context7** → Comprehensive cache check + documentation gathering with trust analysis
2. **Sequential Thinking** → Full problem breakdown with memory integration
3. **Vibe Check** → Validate approach against all memory systems
4. **Implementation** → With comprehensive documentation and validation
5. **Memory Updates** → Full capture in all memory systems + cache new docs for future confidence building

### Override Conditions (Always Full 🔴 Route)
**Regardless of confidence scores, use full workflow for:**
- Production deployments
- Database schema changes
- Security implementations
- Cross-system integrations
- New project initialization
- Architecture changes affecting multiple components
- Any operation with irreversible consequences

### Error Handling Override (Memory-Guided Resolution)
**When development errors occur, bypass normal confidence routing:**
- **FIRST**: Execute memory-guided error resolution (@error-resolution-via-memory.md)
- Search Memory-Keeper and Memento for similar error patterns
- Apply proven solutions before attempting novel troubleshooting
- Store all resolution attempts (success/failure) for future learning
- **THEN**: Resume normal confidence-based workflow after resolution

## Specific MCP Tool Integration Patterns

### Context7 → Meilisearch Integration
```markdown
## Documentation Workflow (REQUIRED)

Follows the pattern established in tech-stack.md files:

1. **ALWAYS** check for cached documentation in Meilisearch using the Meilisearch Key first
2. **ONLY IF** not found in cache, resolve library ID: `context7-resolve-library-id`
3. **THEN** fetch documentation: `context7-get-library-docs` 
4. **IMMEDIATELY** store newly retrieved documentation in Meilisearch for future use
5. **ALWAYS** use the most specific version when applicable

Failure to follow this workflow will result in unnecessary API calls and reduced performance.

## Dynamic Technology Detection

Instead of hardcoded patterns, dynamically discover from project:

1. **Project Detection**: 
   - Scan for tech-stack.md in project root or .agent-os/{tech}/ directories
   - Parse Context7 Documentation Mappings table for available keys
   - Extract Trust Scores from the mapping table

2. **Key Selection**:
   - Core framework keys (highest priority): 2x weight in confidence calculation
   - Feature-specific keys (match current task domain): 1x weight
   - Development/testing tools: 0.5x weight unless specifically needed

3. **Trust Score Processing**:
   - Parse Trust Score column from tech-stack.md mapping tables
   - Apply version-specific preferences when multiple versions available
   - Use metadata section for index names and caching strategy

## Confidence Thresholds (Derived from Trust Scores)
- HIGH CONFIDENCE: Average trust score ≥ 9.0 across relevant keys
- MEDIUM CONFIDENCE: Average trust score 8.0-8.9
- LOW CONFIDENCE: Average trust score < 8.0 or missing critical documentation

## Trust Score Aggregation Rules
- Weighted average based on key importance and task relevance
- Missing critical key penalty: -1.0 from average confidence
- Version mismatch penalty: -0.5 for non-matching version documentation
- Cache hit bonus: +0.2 for documentation already in Meilisearch
```

### Sequential Thinking → Memento Integration
```markdown
## Knowledge Graph Storage Patterns

### Decision Storage
Store in Memento with project-aware entity relationships:
- Entity naming: "{project}-{component}-{decision}" (e.g., "civildiy-auth-oauth-implementation")
- Entity type: "{project}-{category}" (e.g., "civildiy-architecture", "agent-os-workflow")
- Metadata: Include project, tech stack, trust scores from Meilisearch
- Relations: Link to project-specific technologies, patterns, and outcomes

### Pattern Recognition  
Query Memento with project-aware searches:
- Current project patterns: entity_types: ["{current-project}-*"]
- Cross-project patterns: entity_types: ["*-{pattern-type}"] (e.g., "*-auth", "*-api")
- Technology-specific: metadata filtering by tech stack
- Success tracking: Relations with confidence scores >0.8

### Cross-Project Learning
- Connect decisions across projects with similar tech stacks
- Build confidence through successful pattern replication
- Track decision success rates to improve future confidence assessment
```

### Vibe Check → Memory-Keeper Integration
```markdown
## Validation Documentation Patterns

### Risk Assessment Storage
Category: "risk-assessment"
- Store identified risks with Meilisearch trust score context
- Document how trust scores influenced risk evaluation
- Track validation results for future confidence calibration

### Alternative Analysis
Category: "decision-alternatives" 
- Archive considered alternatives with trust score analysis
- Document why higher/lower trust options were rejected
- Build decision rationale library for similar future decisions

### Assumption Validation
Category: "assumption-check"
- Document assumptions validated against high-trust documentation
- Store assumption failures to improve future confidence assessment
- Track patterns in assumption accuracy vs. trust scores
```

## Session Management with Integrated Memory

### Context Refresh Protocol
When approaching context limits:
```markdown
1. Memory-Keeper Checkpoint:
   - Save current task state with trust score context
   - Store confidence assessment reasoning
   - Document which memory systems were most valuable

2. Memento Knowledge Update:
   - Store new architectural insights with trust metadata
   - Connect new patterns to existing knowledge graph
   - Update relationship strengths based on outcomes

3. Meilisearch Confidence Update:
   - Note which trust scores proved accurate/inaccurate
   - Update documentation effectiveness tracking
   - Record new documentation gaps for future Context7 queries

4. Session Restart with Intelligence:
   - Rebuild context using confidence-optimized memory queries
   - Prioritize information based on trust score effectiveness
   - Start with established high-confidence patterns
```

### Project Initialization Protocol
For new projects:
```markdown
1. Technology Detection:
   - Scan for tech-stack.md or project indicators
   - Load appropriate Meilisearch key mappings
   - Set baseline confidence thresholds

2. Memory System Bootstrapping:
   - Query Memento for similar project patterns
   - Check Memory-Keeper for related project experiences
   - Establish initial confidence baseline from available context

3. Adaptive Threshold Setting:
   - New technology: Lower confidence thresholds, require more validation
   - Familiar stack: Use standard thresholds from tech-stack config  
   - Hybrid stack: Aggregate thresholds across multiple technology areas
```

## Trust Score Calibration & Learning

### Confidence Accuracy Tracking
```markdown
Track correlation between:
- Initial trust-based confidence assessment → Actual implementation success
- Memory system predictions → Real outcomes  
- Confidence route chosen → Task completion efficiency

Use for:
- Adjusting trust score thresholds per project type
- Improving Memento relationship strength calibration
- Optimizing confidence routing effectiveness
```

### Dynamic Threshold Adjustment
```markdown
Per-project learning:
- Start with global trust thresholds from tech-stack.md
- Adjust based on project-specific success patterns
- Account for team familiarity and project constraints

Cross-project intelligence:
- Share successful threshold patterns via Memento
- Build organizational confidence patterns
- Improve trust score accuracy through outcome tracking
```

## Enhanced MCP Tools Workflow

### 1. Integrated Confidence Assessment (REQUIRED FIRST STEP)
- **Project Detection**: Identify tech stack and load appropriate Meilisearch keys
- **Trust Score Query**: Calculate weighted average from relevant documentation
- **Memento Query**: Assess knowledge graph relationships and past success patterns
- **Memory-Keeper Check**: Review recent project progress and established patterns
- **Confidence Calculation**: Aggregate all inputs into routing decision
- **Route Selection**: Choose HIGH/MEDIUM/LOW confidence workflow path

### 2. Context7 with Trust-Aware Documentation (ALWAYS REQUIRED)
- **Smart Querying**: Use technology-specific Context7 library mappings
- **Trust Validation**: Verify documentation quality against stored trust scores
- **Gap Detection**: Identify missing high-trust documentation for current task
- **Meilisearch Caching**: Store results with trust metadata for future queries
- **Pattern Integration**: Apply documentation patterns with confidence weighting

### 3. Sequential Thinking with Memory Integration (MEDIUM/LOW CONFIDENCE)
- **Memory-Enhanced Planning**: Reference Memento patterns for similar problems
- **Trust-Weighted Decisions**: Weight planning steps by documentation trust scores
- **Pattern Reuse**: Leverage established architectural decisions from knowledge graph
- **Outcome Prediction**: Use past success patterns to guide solution approach
- **Knowledge Storage**: Store final plans in Memento with trust score context

### 4. Vibe Check with Cross-System Validation (LOW CONFIDENCE + CRITICAL)
- **Multi-System Validation**: Check assumptions against all memory systems
- **Trust Score Reality Check**: Validate high-confidence assumptions with outcomes
- **Historical Pattern Analysis**: Compare approach with past similar decisions
- **Risk Assessment**: Identify risks specific to current trust score profile
- **Alternative Evaluation**: Consider alternatives with different trust/confidence profiles

### 5. Implementation with Intelligence Feedback
- **Confidence-Optimized Execution**: Prioritize high-trust patterns and established approaches
- **Outcome Tracking**: Monitor whether confidence assessment was accurate
- **Memory Updates**: Update all systems with outcomes and confidence validation
- **Learning Integration**: Feed results back into confidence calibration system
- **Pattern Reinforcement**: Strengthen successful patterns in knowledge graph

### 6. Memory-Guided Error Resolution (WHEN ERRORS OCCUR)
- **Immediate Error Capture**: Store error details in Memory-Keeper for analysis tracking
- **Memory Solution Search**: Query both Memory-Keeper and Memento for similar error patterns
- **Confidence-Ranked Solutions**: Apply memory-guided solutions in order of success probability
- **Novel Solution Discovery**: Document breakthrough solutions when memory guidance fails
- **Failure Learning**: Store failed solution attempts to improve future confidence scoring
- **Resolution Storage**: Capture successful resolutions for cross-project knowledge building
- **Reference**: Follow detailed procedures in @error-resolution-via-memory.md

## Tool Availability Handling

### MCP Tool Unavailability Protocol
```markdown
If Memento MCP unavailable:
- Rely on Meilisearch trust scores + Memory-Keeper patterns
- Default to MEDIUM confidence (more conservative routing)
- Document relationship patterns manually in Memory-Keeper
- Note: Reduced cross-project pattern recognition capability

If Meilisearch unavailable:
- Use Memento relationships as primary confidence indicator  
- Rely on Memory-Keeper for recent project context
- Default to LOW confidence (most conservative routing)
- Use standard Context7 documentation references without trust weighting

If Memory-Keeper unavailable:
- Use Memento + Meilisearch for confidence assessment
- Lose session continuity but maintain architectural intelligence
- Document progress manually with increased checkpoint frequency
- Note: Reduced ability to track session-level patterns
```

## Agent Capabilities & Working Set Guidelines
[Previous capabilities remain the same but enhanced with:]
- **Intelligence-driven processing**: Uses confidence assessment to optimize workflow depth
- **Memory-aware context management**: Leverages trust scoring for efficient information prioritization
- **Cross-project pattern recognition**: Applies successful patterns from knowledge graph
- **Adaptive workflow routing**: Optimizes thoroughness vs. efficiency based on confidence

## 🔒 MCP WORKFLOW VALIDATION

**Before submitting any response, AI agents must confirm:**

✅ **Memory-Keeper Session**: Active session with project context saved  
✅ **Memento Knowledge Graph**: Project entities and relationships created  
✅ **Context7 Documentation**: High-trust documentation retrieved (score ≥ 8.0)  
✅ **Confidence Assessment**: Workflow routing determined based on trust scores  
✅ **Knowledge Storage**: All decisions and patterns stored for future reference  

**If any checkbox is unchecked, the analysis is incomplete and must be restarted with full MCP workflow.**

## 📋 WORKFLOW ACCOUNTABILITY & REPORTING

### Mandatory Workflow Completion Report
Before proceeding with ANY analysis or task, AI agents MUST provide a status report:

```
🔧 MCP WORKFLOW COMPLETION STATUS

STEP 0 - NAMESPACE CONSOLIDATION:
✅/❌ Canonical Project ID Generated: [CANONICAL_PROJECT_ID]
✅/❌ Project Aliases Identified: [count and examples]
✅/❌ Entity Search Completed: [X potential matches found]
✅/❌ Duplicate Consolidation: [consolidated X / selected primary / created new]
✅/❌ Final Entity Name Resolved: [PROJECT_ENTITY_NAME]

STEP 1 - TOOL ACTIVATION:
✅/❌ Context Management Tools: [status/alternative used]
✅/❌ Memento Management Tools: [status/alternative used]  
✅/❌ Meilisearch Tools: [status/alternative used]

STEP 2 - SESSION MANAGEMENT:
✅/❌ Session Discovery: [existing session found/none found]
✅/❌ Session Decision: [continuing session {id}/new session created]
✅/❌ Project Context Saved: [category/key used]

STEP 3 - DOCUMENTATION QUERY:
✅/❌ Technology Documentation Retrieved: [source/trust score]
✅/❌ Trust Score Validation: [score achieved/threshold met]

STEP 4 - KNOWLEDGE ENTITIES:
✅/❌ Project Entities Created: [count/types using PROJECT_ENTITY_NAME]
✅/❌ Technology Entities Created: [count/types]

STEP 5 - CONFIDENCE ASSESSMENT:
✅/❌ Trust Score ≥ 8.0: [actual score]
✅/❌ Workflow Route Selected: [HIGH/MEDIUM/LOW confidence]

WORKFLOW STATUS: [COMPLETE/INCOMPLETE - explain any deviations]
NAMESPACE HEALTH: [CLEAN/FRAGMENTED - any consolidation issues]
USER AUTHORIZATION REQUIRED: [YES/NO - if workflow modified]
```

### Zero-Tolerance Policy
**If the workflow completion report shows ANY ❌ marks without user authorization for alternatives, the agent MUST:**

1. **STOP all work immediately**
2. **Ask for specific guidance on how to proceed**
3. **NOT proceed with analysis until workflow is complete or modified with user approval**

### Critical Namespace Violations
**If Step 0 (Namespace Consolidation) shows ❌ marks, this indicates knowledge fragmentation risk:**
- IMMEDIATELY consolidate duplicates before proceeding
- Document consolidation actions taken
- Verify PROJECT_ENTITY_NAME is being used consistently
- Do NOT create new entities without consolidation

This accountability system ensures no agent can bypass the MCP workflow without explicit documentation and user awareness.

## Usage & Customization

This template integrates your existing Context7 → Meilisearch trust scoring system with Memento MCP knowledge graphs and Memory-Keeper session management. The confidence-based routing system learns from your documentation quality and past decision success to optimize workflow efficiency while maintaining thoroughness when uncertainty is high.

Project-specific directories can customize:
- Trust score thresholds for different technology stacks
- Confidence routing preferences for different risk levels  
- Memory system integration patterns for specific project needs
- Override conditions for domain-specific critical operations