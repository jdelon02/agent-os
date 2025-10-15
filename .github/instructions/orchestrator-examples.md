# Orchestrator Practical Usage Examples

## Overview

This document provides real-world examples of using the Agent OS Orchestrator system, demonstrating immediate practical applications that users can run today.

## Prerequisites

Before using the orchestrator, ensure you have:
- ✅ Main instructions properly configured in `~/.agent-os/instructions/main.instructions.md`
- ✅ MCP tools available (Memory-Keeper, Memento, Meilisearch, Sequential Thinking, Vibe Check)
- ✅ Project initialized with `.github/instructions/main.instructions.md` referencing global instructions

## Example 1: Full Orchestrated Workflow - Authentication System

**Command:**
```bash
/orchestrate "Create a complete user authentication system with OAuth2 integration for the agent-os project"
```

**Expected Orchestrator Flow:**
```markdown
🔄 ORCHESTRATOR EXECUTING: Multi-Role Workflow
├── 🔍 ANALYSIS ROLE (analyze-product.md)
│   ├── MCP Tools: Memory-Keeper session_start, Meilisearch cache, Sequential Thinking
│   ├── Output: Authentication requirements analysis, security considerations
│   └── Handoff: Analysis findings → Planning Role
├── 📋 PLANNING ROLE (plan-product.md) 
│   ├── MCP Tools: Memento pattern search, Sequential Thinking, Vibe Check validation
│   ├── Output: Multi-phase implementation plan, architectural decisions
│   └── Handoff: Implementation plan → Specification Role
├── 📝 SPECIFICATION ROLE (create-spec.md)
│   ├── MCP Tools: Context7 tech docs, Memento spec patterns, Sequential Thinking
│   ├── Output: Detailed technical specifications, API definitions
│   └── Handoff: Complete specifications → Execution Role
├── ⚙️ EXECUTION ROLE (execute-tasks.md)
│   ├── MCP Tools: Memory-Keeper checkpoints, Memento implementation patterns
│   ├── Output: Working authentication system with tests
│   └── Result: Production-ready OAuth2 implementation
└── ✅ WORKFLOW COMPLETE: Full authentication system delivered
```

**Expected Confidence Routing:**
- **HIGH Confidence**: If cached OAuth documentation + established auth patterns in Memento
- **MEDIUM Confidence**: If partial documentation + some similar patterns
- **LOW Confidence**: If new tech stack + no similar auth implementations

## Example 2: Resume from Specific Role - Continue Planning

**Command:**
```bash
/plan-product --orchestrated "Continue planning the microservices architecture from previous analysis"
```

**Expected Orchestrator Behavior:**
```markdown
🔄 ORCHESTRATOR RESUMING: From Planning Role
├── 🔍 CONTEXT VALIDATION
│   ├── ✅ Memory-Keeper: Retrieved analysis findings from session
│   ├── ✅ Memento: Found related microservices patterns 
│   └── ✅ Confidence: MEDIUM (partial patterns, good documentation)
├── 📋 PLANNING ROLE EXECUTION
│   ├── Context: Analysis findings loaded from Memory-Keeper
│   ├── Patterns: Similar microservices projects found in Memento
│   ├── Sequential Thinking: Applied for systematic planning
│   └── Output: Detailed implementation plan with service boundaries
└── 🎯 READY FOR NEXT ROLE: Specifications ready for create-spec
```

## Example 3: Single Role with Orchestrator Intelligence

**Command:**
```bash
/execute-tasks --orchestrated
```

**Expected Orchestrator Enhancement:**
```markdown
🔄 ORCHESTRATOR-ENHANCED EXECUTION
├── 🔍 CROSS-ROLE CONTEXT LOADING
│   ├── Memory-Keeper: Analysis + Planning + Specification context loaded
│   ├── Memento: Implementation patterns from similar projects
│   └── Confidence: HIGH (complete context + proven patterns)
├── ⚙️ OPTIMIZED EXECUTION
│   ├── Pattern-Guided: Using established implementation approaches
│   ├── Smart Checkpoints: Memory-Keeper optimized for this pattern type
│   ├── Error Prevention: Memento provides similar implementation pitfalls
│   └── Minimal Validation: High confidence enables streamlined execution
└── 📊 PERFORMANCE GAIN: 40% faster execution via pattern reuse
```

## Example 4: Error Recovery Workflow

**Scenario:** Implementation fails during execution phase

**Orchestrator Recovery:**
```markdown
🚨 ERROR DETECTED IN EXECUTION ROLE
├── 🔍 ERROR ANALYSIS
│   ├── Memory-Keeper: Error context captured automatically  
│   ├── Memento: Searching for similar error patterns
│   └── Pattern Found: "OAuth token validation failure" (confidence: 0.8)
├── 🛠️ MEMORY-GUIDED RECOVERY
│   ├── Solution Pattern: Update token verification endpoint
│   ├── Previous Success: Applied in 3 similar projects
│   └── Confidence Boost: Recovery pattern has 90% success rate
├── 🔄 AUTOMATIC RETRY
│   ├── Apply proven solution from Memento patterns
│   ├── Continue execution with enhanced error monitoring
│   └── Update Memento with resolution details
└── ✅ RECOVERY SUCCESSFUL: Error resolved via memory-guided solution
```

## Example 5: New Project Bootstrap

**Command:**
```bash
/orchestrate "Bootstrap a new Next.js application with TypeScript and Tailwind CSS"
```

**New Project Flow:**
```markdown
🔄 ORCHESTRATOR: New Project Mode
├── 🆕 PROJECT INITIALIZATION  
│   ├── Step 0: Universal Project Identity Consolidation
│   ├── Memory-Keeper: New session created for project
│   └── Memento: Search for Next.js + TypeScript patterns
├── 🔍 ANALYSIS ROLE
│   ├── Meilisearch: Check cached Next.js documentation (trust score: 8.5)
│   ├── Pattern Match: Found 5 similar bootstrap projects in Memento
│   └── Confidence: HIGH (excellent documentation + proven patterns)
├── 📋 PLANNING ROLE (Streamlined)
│   ├── Template Selection: Use established Next.js + TypeScript template
│   ├── Customization Planning: Tailwind integration approach
│   └── Rapid Planning: Skip extensive analysis due to high confidence
├── 📝 SPECIFICATION ROLE (Template-Driven)
│   ├── Spec Generation: Use proven Next.js project specification template
│   ├── Customization: Tailwind-specific configurations
│   └── Fast Track: High confidence enables template-based approach
└── ⚙️ EXECUTION ROLE (Pattern-Based)
    ├── Bootstrap Execution: Apply established Next.js setup pattern
    ├── Automated Setup: TypeScript config, Tailwind integration
    └── Result: Production-ready Next.js app in <30 minutes
```

## Confidence Level Examples

### HIGH Confidence Scenario
```yaml
Project: "Add user authentication to existing Express.js API"
Documentation Trust Score: 9.2 (Express + Auth patterns well-documented)
Memento Patterns: 8 similar successful implementations
Memory-Keeper History: Recent auth work in related projects

Orchestrator Behavior:
- Analysis: Skip detailed research, use cached patterns
- Planning: Apply proven architectural patterns
- Specification: Use established auth spec templates  
- Execution: Streamlined implementation with minimal validation
- Timeline: 2-3 hours vs typical 6-8 hours
```

### MEDIUM Confidence Scenario  
```yaml
Project: "Implement GraphQL API with custom authorization"
Documentation Trust Score: 7.8 (GraphQL documented, custom auth less so)
Memento Patterns: 3 similar projects, mixed success rates
Memory-Keeper History: Some GraphQL experience, no custom auth

Orchestrator Behavior:
- Analysis: Sequential Thinking for custom auth analysis
- Planning: Full planning with Vibe Check validation
- Specification: Detailed spec development with pattern validation
- Execution: Regular checkpoints, error monitoring enhanced
- Timeline: 6-8 hours with comprehensive validation
```

### LOW Confidence Scenario
```yaml
Project: "Build real-time collaboration system with WebRTC"
Documentation Trust Score: 6.2 (WebRTC complex, limited trusted sources)
Memento Patterns: 1 partial match, uncertain success
Memory-Keeper History: No previous WebRTC implementations

Orchestrator Behavior:
- Analysis: Full Sequential Thinking + Vibe Check analysis
- Planning: Comprehensive planning with multiple validation points
- Specification: Detailed research, multiple documentation sources
- Execution: Frequent checkpoints, conservative approach, extensive testing
- Timeline: 12-16 hours with maximum validation and risk mitigation
```

## Command Detection Integration

### Adding /orchestrate Command

The orchestrator integrates with the existing Agent OS command detection:

```markdown
# In main.instructions.md - Command Detection Pattern:

IF command matches: ['/orchestrate'] OR multi-role workflow detected:
  THEN:
    1. **Orchestrator Mode**: Full orchestrator.md workflow with role coordination
    2. **MCP Workflow Initialization**: Complete all 6 required steps
    3. **Role Transition Management**: Coordinate single-agent progression
    4. **Cross-Role Memory Continuity**: Maintain context across boundaries
    5. **MCP Tool Specialization**: Apply role-specific tool combinations
  PROCEED: With orchestrated Agent OS workflow
```

### Usage Patterns

```bash
# Full orchestration
/orchestrate "Project description and requirements"

# Role-specific with orchestrator intelligence  
/analyze-product --orchestrated "Focus area"
/plan-product --orchestrated "Given analysis..."
/create-spec --orchestrated "Based on planning..."
/execute-tasks --orchestrated

# Resume from interruption
/orchestrate --resume --from=planning
/orchestrate --continue --session=abc123

# Testing and validation
/orchestrate --test memory-continuity
/orchestrate --validate integration
```

## Performance Benchmarks

### Expected Improvements with Orchestrator

```yaml
Traditional Single-Role Execution:
- Context Setup: 5-10 minutes per role
- Documentation Lookup: 15-20 minutes per role  
- Decision Making: 10-15 minutes per role
- Total Time: 2-4 hours for full workflow

Orchestrated Multi-Role Execution:
- Context Continuity: <1 minute between roles
- Cached Documentation: <2 minutes via Meilisearch
- Pattern-Guided Decisions: 2-5 minutes via Memento
- Total Time: 1-2 hours for full workflow (50-60% improvement)

Confidence-Based Optimization:
- HIGH Confidence: 70-80% time reduction
- MEDIUM Confidence: 40-50% time reduction  
- LOW Confidence: 20-30% time reduction (added validation time)
```

## Troubleshooting Guide

### Common Issues and Solutions

**Issue: MCP Tools Unavailable**
```markdown
Error: "Memory-Keeper session_start failed"
Solution: Orchestrator automatically falls back to manual context management
Impact: Reduced efficiency but maintains functionality
```

**Issue: Confidence Assessment Fails**  
```markdown
Error: "Cannot determine confidence routing"
Solution: Defaults to LOW confidence (maximum validation)
Impact: Slower execution but maintains safety
```

**Issue: Role Transition Failure**
```markdown
Error: "Required context missing for planning role"  
Solution: Orchestrator requests missing context or reruns previous role
Recovery: Automatic backtrack and retry with enhanced context capture
```

**Issue: Pattern Recognition Failure**
```markdown
Error: "No similar patterns found in Memento"
Solution: Falls back to documentation-driven approach
Enhancement: Pattern gets stored for future similar projects
```

## Next Steps for Users

1. **Start Small**: Try single enhanced role commands (`/execute-tasks --orchestrated`)
2. **Test Full Workflow**: Use `/orchestrate` with a simple, familiar project type  
3. **Build Patterns**: Let the system learn from your successful workflows
4. **Optimize**: Review confidence routing and adjust thresholds for your domain
5. **Scale Up**: Apply orchestrator to larger, more complex multi-role projects

The orchestrator transforms Agent OS from individual role execution into an intelligent, memory-enhanced workflow system that learns and improves with every project.