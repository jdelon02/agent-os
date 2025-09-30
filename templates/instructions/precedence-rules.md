# Agent OS Instruction Precedence Rules

## Overview

This file defines the conflict resolution hierarchy when Agent OS commands interact with project-specific instructions, ensuring workflow integrity while allowing project customization.

## Precedence Hierarchy (Highest to Lowest Priority)

### 1. 🔴 Active Agent OS Command Workflow (ABSOLUTE PRIORITY)
**Scope**: During Agent OS command execution (`/analyze-product`, `/plan-product`, `/create-spec`, `/execute-tasks`)
**Rule**: Agent OS command workflow maintains complete control over its execution sequence
**Rationale**: Ensures command integrity, prevents workflow corruption, maintains memory system consistency

```markdown
WHEN: Agent OS command is executing
THEN: Agent OS workflow takes absolute precedence
OVERRIDE: All other instructions defer to command workflow
EXCEPTION: None - this precedence cannot be overridden
```

### 2. 🟠 Memory System State (HIGH PRIORITY)
**Scope**: Memory-Keeper session state, Memento knowledge graph consistency
**Rule**: Memory system operations and state preservation take precedence over conflicting instructions
**Rationale**: Maintains cross-session continuity, prevents data corruption, enables context reduction

```markdown
WHEN: Memory systems are active
THEN: Memory operations complete before other instructions
PRESERVE: Session state, entity relationships, cached context
PROTECT: Cross-project learning patterns
```

### 3. 🟡 Project-Specific Agent OS Overrides (MEDIUM-HIGH PRIORITY)
**Scope**: `.github/instructions/main.instructions.md` - Agent OS command override sections
**Rule**: Project can enhance Agent OS commands at designated integration points
**Limitation**: Cannot override core workflow structure or memory system operations

```markdown
INTEGRATION_POINTS:
  - Pre-analysis documentation requirements
  - Custom validation criteria  
  - Additional context gathering steps
  - Project-specific memory preferences
  - Technology-specific implementation patterns

CANNOT_OVERRIDE:
  - Command workflow sequence
  - Memory system initialization  
  - Context reduction patterns
  - Cross-project learning mechanisms
```

### 4. 🟢 Tech Stack Specific Guidance (MEDIUM PRIORITY)
**Scope**: `@reference-docs/{tech-stack}/` files (laravel, mongodb, etc.)
**Rule**: Technology-specific patterns and practices for implementation details
**Application**: During implementation phases, not workflow control

```markdown
APPLIES_TO:
  - Implementation patterns and best practices
  - Technology-specific memory entity naming
  - Documentation priority and trust scores
  - Integration patterns between technologies

DEFERS_TO:
  - Agent OS command workflow structure
  - Project-specific overrides
  - Memory system requirements
```

### 5. 🔵 Global MCP Intelligence Routing (MEDIUM PRIORITY)
**Scope**: `@reference-docs/instructions/main.instructions.md` - MCP workflow intelligence
**Rule**: Confidence-based routing applies to internal Agent OS command decisions
**Integration**: Agent OS commands can use confidence assessment for optimization

```markdown
APPLIES_TO:
  - Documentation retrieval confidence thresholds
  - Internal command decision making
  - Context7 → Meilisearch optimization
  - Sequential thinking and vibe check triggers

INTEGRATED_WITH:
  - Agent OS command execution
  - Memory system confidence tracking
  - Cross-project pattern validation
```

### 6. 🟣 Project Implementation Standards (LOW-MEDIUM PRIORITY)
**Scope**: `.github/instructions/main.instructions.md` - non-Agent OS sections
**Rule**: General project standards, coding practices, and development guidelines
**Application**: During implementation, testing, and deployment phases

```markdown
INCLUDES:
  - Development environment configuration
  - Database connection requirements
  - Testing and validation standards
  - Code quality and formatting rules

TIMING:
  - Applied during task execution
  - Not during Agent OS workflow planning
  - Integrated with tech stack guidance
```

### 7. ⚪ Global Agent OS Standards (LOWEST PRIORITY)
**Scope**: `@reference-docs/standards/` directory
**Rule**: Universal fallback standards when no higher precedence rule applies
**Usage**: Default patterns for unknown scenarios

## Conflict Resolution Matrix

| Scenario | Active Element | Resolution Strategy |
|----------|----------------|-------------------|
| **Agent OS command executing** | Command workflow | **Agent OS absolute precedence** - all others wait |
| **Memory system operations** | Memory state | **Complete memory ops first** - then apply other rules |
| **Project override vs tech pattern** | Both valid | **Project override wins** - tech provides implementation guidance |
| **MCP routing vs project standard** | Both applicable | **MCP routing for decisions** - project standard for implementation |
| **Cross-project pattern vs local preference** | Pattern + preference | **Validate pattern against local** - prefer proven successful patterns |

## Implementation Strategy

### Agent OS Command Integration Points

**Add to each Agent OS command file:**
```xml
<precedence_check>
  <step number="-1" name="precedence_resolution">
    ### Step -1: Resolve Instruction Precedence

    <agent_os_precedence_assertion>
      # Assert Agent OS command precedence
      CURRENT_MODE = "AGENT_OS_COMMAND_ACTIVE"
      COMMAND_NAME = "{command_name}"
      PRECEDENCE_LEVEL = "ABSOLUTE"
      
      LOG: "🔴 Agent OS command {COMMAND_NAME} active - absolute precedence"
    </agent_os_precedence_assertion>

    <project_override_integration>
      # Check for project-specific Agent OS command overrides
      IF file_exists(".github/instructions/main.instructions.md"):
        project_overrides = parse_agent_os_overrides(".github/instructions/main.instructions.md")
        
        IF project_overrides.has_overrides_for(COMMAND_NAME):
          applicable_overrides = project_overrides.get_overrides(COMMAND_NAME)
          
          # Apply overrides only at designated integration points
          FOR override in applicable_overrides:
            IF override.integration_point IN ALLOWED_INTEGRATION_POINTS:
              SCHEDULE_OVERRIDE: override at appropriate workflow step
              LOG: "🟠 Project override scheduled: {override.description}"
            ELSE:
              LOG: "⚠️ Project override ignored: {override.description} (invalid integration point)"
    </project_override_integration>

    <tech_stack_guidance_loading>
      # Load tech-stack specific guidance for implementation
      INCLUDE: @reference-docs/instructions/tech-detection.md
      
      PRIMARY_TECH = DETECTION_CONTEXT["primary_tech"]  
      TECH_STACKS = DETECTION_CONTEXT["tech_stacks"]
      
      FOR tech in TECH_STACKS:
        IF file_exists("@reference-docs/{tech}/"):
          tech_guidance = load_tech_guidance(tech)
          REGISTER_GUIDANCE: tech_guidance for implementation phases
          LOG: "🟢 Loaded {tech} guidance for implementation"
    </tech_stack_guidance_loading>

    <mcp_intelligence_integration>
      # Integrate MCP confidence routing for internal decisions
      CONFIDENCE_LEVEL = DETECTION_CONTEXT["confidence_level"]
      TRUST_SCORES = DETECTION_CONTEXT["average_trust_score"]
      
      # Configure internal command decision making
      IF CONFIDENCE_LEVEL == "HIGH":
        INTERNAL_ROUTING = "optimized"
        VALIDATION_DEPTH = "minimal"
      ELIF CONFIDENCE_LEVEL == "MEDIUM":
        INTERNAL_ROUTING = "standard"
        VALIDATION_DEPTH = "moderate"  
      ELSE:
        INTERNAL_ROUTING = "comprehensive"
        VALIDATION_DEPTH = "thorough"
      
      LOG: "🔵 MCP intelligence: {CONFIDENCE_LEVEL} confidence, {INTERNAL_ROUTING} routing"
    </mcp_intelligence_integration>

    <precedence_summary>
      LOG: "📋 Precedence resolution complete:"
      LOG: "   🔴 Agent OS workflow: ACTIVE"
      LOG: "   🟠 Project overrides: {count} scheduled"  
      LOG: "   🟢 Tech guidance: {len(TECH_STACKS)} loaded"
      LOG: "   🔵 MCP routing: {INTERNAL_ROUTING}"
    </precedence_summary>
  </step>
</precedence_check>
```

### Project Override Template

**For use in `.github/instructions/main.instructions.md`:**
```markdown
## Agent OS Command Overrides

### Memory System Configuration
- **Memory-Keeper Channel**: "{project-name}"
- **Memento Entity Prefix**: "{project-name}-"  
- **Custom Entity Types**: [specify if needed]

### /analyze-product Enhancements
```markdown
**Integration Points**: pre-analysis, post-analysis, context-gathering
**Additional Documentation**: 
  - Review @.agent-os/product/mission.md
  - Review @.agent-os/product/roadmap.md
  - Review @packages/ directory specifications

**Custom Analysis Areas**:
  - Hybrid database integration patterns
  - Cross-database relationship mappings
  - Module interdependency analysis
```

### /plan-product Enhancements  
```markdown
**Integration Points**: user-input-validation, tech-stack-customization
**Technology Standards**:
  - Laravel 12.x with hybrid database architecture
  - Local network database connections (not Docker)
  - Modular package architecture requirements
```

### /create-spec Enhancements
```markdown
**Integration Points**: spec-validation, technical-requirements
**Custom Validation**:
  - Verify cross-database relationship impact
  - Validate module boundary considerations  
  - Check hybrid architecture performance implications
```

### /execute-tasks Enhancements
```markdown
**Integration Points**: testing-requirements, implementation-standards
**Testing Requirements**:
  - Cross-database integration tests mandatory
  - Module isolation tests required
  - API consistency validation across data stores
```

### Override Integration Notes
- Overrides **enhance** Agent OS workflows at designated integration points
- Core workflow structure and memory systems remain unchanged
- Invalid integration points are logged and ignored
- Tech stack guidance provides implementation details
```

## Error Handling and Conflicts

### Precedence Violations
```markdown
IF precedence_violation_detected:
  LOG_ERROR: "Precedence violation: {violation_description}"
  
  RESOLUTION_STRATEGY:
    1. Identify conflicting instructions
    2. Apply precedence hierarchy  
    3. Log resolution decision
    4. Continue with highest precedence instruction
    5. Store conflict in memory for learning
```

### Integration Point Violations
```markdown
IF invalid_integration_point_used:
  LOG_WARNING: "Invalid integration point: {override_description}"
  
  RESOLUTION_STRATEGY:
    1. Ignore invalid override
    2. Log warning with correct integration points
    3. Continue with standard Agent OS workflow
    4. Suggest correction for project maintainer
```

### Memory System Conflicts
```markdown
IF memory_system_conflict:
  LOG_ERROR: "Memory system conflict: {conflict_description}"
  
  RESOLUTION_STRATEGY:
    1. Preserve memory system integrity
    2. Complete memory operations first
    3. Apply other instructions after memory consistency
    4. Create checkpoint if necessary
```

This precedence system ensures **Agent OS workflow integrity** while providing **flexible project customization** and **intelligent conflict resolution**.