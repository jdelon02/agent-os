# Universal Tech-Stack Detection with Project Identity

## Overview

This system detects available technology stacks by scanning `reference-docs/` directories and parsing their `tech-stack.md` files for Context7 Documentation Mappings and Trust Scores. It also generates universal canonical project identities to prevent knowledge graph namespace fragmentation.

## Universal Project Identity Resolution

### Step 0: Canonical Project Identity Generation
```markdown
# Generate deterministic, collision-safe project identity
CURRENT_DIRECTORY = get_current_working_directory()
PROJECT_BASE_NAME = basename(CURRENT_DIRECTORY)
PROJECT_ABSOLUTE_PATH = absolute_path(CURRENT_DIRECTORY)

# Create canonical project ID (deterministic)
CANONICAL_PROJECT_ID = normalize_slug(PROJECT_BASE_NAME)

# Handle potential name collisions
PROJECT_PATH_HASH = first_8_chars(sha256(PROJECT_ABSOLUTE_PATH))
IF potential_collision_risk():
  CANONICAL_PROJECT_ID = "{PROJECT_BASE_NAME}-{PROJECT_PATH_HASH}"

# Extract git repository information if available
GIT_REMOTE_ORIGIN = extract_repo_name_from_git_remote() OR "unknown"
GIT_REPO_NAME = basename(GIT_REMOTE_ORIGIN) OR "unknown"

# Build comprehensive project aliases for consolidation searches
PROJECT_ALIASES = [
  PROJECT_BASE_NAME,
  CANONICAL_PROJECT_ID,
  title_case(PROJECT_BASE_NAME),
  "{PROJECT_BASE_NAME}_project",
  "{title_case(PROJECT_BASE_NAME)} Project",
  GIT_REPO_NAME
]

# Remove duplicates and invalid entries
PROJECT_ALIASES = unique(filter(lambda x: x != "unknown" and len(x) > 0, PROJECT_ALIASES))

LOG: "Canonical project ID: {CANONICAL_PROJECT_ID}"
LOG: "Project aliases: {PROJECT_ALIASES}"
LOG: "Path hash: {PROJECT_PATH_HASH}"
```

## Tech Stack Detection Logic

### Step 1: Project Detection
```markdown
PROJECT_TECH_STACKS = []
PROJECT_TRUST_SCORES = {}
CONTEXT7_MAPPINGS = {}

# Scan reference-docs for tech-specific directories  
FOR_EACH directory in reference-docs/:
  IF directory is symlink AND directory NOT IN ["instructions", "commands", "standards", "chatmodes", "prompts"]:
    tech_name = directory_name
    
    # Check if tech-stack.md exists
    IF file_exists("reference-docs/{tech_name}/tech-stack.md"):
      PROJECT_TECH_STACKS.append(tech_name)
      
      # Parse Context7 Documentation Mappings table
      mappings = parse_context7_mappings("reference-docs/{tech_name}/tech-stack.md")
      trust_scores = extract_trust_scores(mappings)
      
      PROJECT_TRUST_SCORES[tech_name] = trust_scores
      CONTEXT7_MAPPINGS[tech_name] = mappings

LOG: "Detected tech stacks: {PROJECT_TECH_STACKS}"
LOG: "Available Context7 mappings: {sum(len(mappings) for mappings in CONTEXT7_MAPPINGS.values())} total"
```

### Step 2: Primary Tech Detection  
```markdown
# Determine primary tech stack based on project structure and available stacks
PRIMARY_TECH = detect_primary_from_available(PROJECT_TECH_STACKS)

# Logic for primary detection:
IF "laravel" in PROJECT_TECH_STACKS AND file_exists("composer.json"):
  PRIMARY_TECH = "laravel"
  PROJECT_TYPE = "web_application"
  
ELIF "wordpress" in PROJECT_TECH_STACKS AND (file_exists("wp-config.php") OR file_exists("wordpress")):
  PRIMARY_TECH = "wordpress"
  PROJECT_TYPE = "cms"
  
ELIF "drupal" in PROJECT_TECH_STACKS AND (file_exists("drupal") OR file_exists("web/sites")):
  PRIMARY_TECH = "drupal"
  PROJECT_TYPE = "cms"
  
ELIF "nextjs" in PROJECT_TECH_STACKS AND file_exists("next.config.js"):
  PRIMARY_TECH = "nextjs"
  PROJECT_TYPE = "web_application"
  
ELIF len(PROJECT_TECH_STACKS) > 0:
  PRIMARY_TECH = PROJECT_TECH_STACKS[0]  # First available tech stack
  PROJECT_TYPE = "application"
  
ELSE:
  PRIMARY_TECH = "generic"
  PROJECT_TYPE = "application"

LOG: "Primary tech stack: {PRIMARY_TECH}"
LOG: "Project type: {PROJECT_TYPE}"
```

### Step 3: Trust Score Aggregation
```markdown
# Calculate overall confidence from available trust scores
IF len(PROJECT_TRUST_SCORES) > 0:
  all_scores = []
  weighted_scores = []
  
  FOR tech, scores in PROJECT_TRUST_SCORES.items():
    FOR key, score in scores.items():
      all_scores.append(score)
      
      # Weight core framework keys higher
      IF tech == PRIMARY_TECH AND "framework" in key.lower():
        weighted_scores.extend([score] * 2)  # 2x weight
      ELSE:
        weighted_scores.append(score)
  
  AVERAGE_TRUST_SCORE = sum(weighted_scores) / len(weighted_scores)
  RAW_AVERAGE = sum(all_scores) / len(all_scores)
  
ELSE:
  AVERAGE_TRUST_SCORE = 5.0  # Default low confidence
  RAW_AVERAGE = 5.0

CONFIDENCE_LEVEL = {
  "HIGH" if AVERAGE_TRUST_SCORE >= 9.0,
  "MEDIUM" if AVERAGE_TRUST_SCORE >= 8.0,
  "LOW" otherwise
}

LOG: "Average trust score: {AVERAGE_TRUST_SCORE} (raw: {RAW_AVERAGE})"
LOG: "Confidence level: {CONFIDENCE_LEVEL}"
```

## Dynamic Memory Pattern Generation

### Universal Entity Naming Patterns
```markdown
# Use canonical project ID for consistent entity naming across sessions
PROJECT_NAME = CANONICAL_PROJECT_ID  # Use canonical ID, not raw directory name

# Primary entities using canonical naming
PRIMARY_ENTITY = "{CANONICAL_PROJECT_ID}-{PRIMARY_TECH}-app"
ARCHITECTURE_ENTITY = "{CANONICAL_PROJECT_ID}-architecture"

# Secondary tech stack entities
SECONDARY_ENTITIES = []
FOR tech in PROJECT_TECH_STACKS:
  IF tech != PRIMARY_TECH:
    SECONDARY_ENTITIES.append("{CANONICAL_PROJECT_ID}-{tech}-integration")

# Universal entities (all projects get these)
UNIVERSAL_ENTITIES = [
  "{CANONICAL_PROJECT_ID}-application",
  "{CANONICAL_PROJECT_ID}-database", 
  "{CANONICAL_PROJECT_ID}-api",
  "{CANONICAL_PROJECT_ID}-decisions"
]

ALL_ENTITIES = [PRIMARY_ENTITY] + SECONDARY_ENTITIES + UNIVERSAL_ENTITIES

# Generate project alias entities for namespace consolidation
PROJECT_ALIAS_ENTITIES = []
FOR alias in PROJECT_ALIASES:
  IF alias != CANONICAL_PROJECT_ID:
    PROJECT_ALIAS_ENTITIES.append({
      "name": alias,
      "entityType": "project_alias",
      "canonical_reference": CANONICAL_PROJECT_ID
    })

LOG: "Generated canonical entities: {ALL_ENTITIES}"
LOG: "Generated alias entities: {len(PROJECT_ALIAS_ENTITIES)} aliases"
```

### Universal Relationship Patterns
```markdown
# Generate relationships based on detected architecture using canonical names
RELATIONSHIP_PATTERNS = []

# Primary relationships using canonical project ID
RELATIONSHIP_PATTERNS.append({
  "from": CANONICAL_PROJECT_ID,
  "to": PRIMARY_ENTITY,
  "relationType": "contains"
})

RELATIONSHIP_PATTERNS.append({
  "from": PRIMARY_ENTITY,
  "to": ARCHITECTURE_ENTITY,
  "relationType": "guided_by"
})

# Project alias relationships for namespace consolidation
FOR alias in PROJECT_ALIASES:
  IF alias != CANONICAL_PROJECT_ID:
    RELATIONSHIP_PATTERNS.append({
      "from": alias,
      "to": CANONICAL_PROJECT_ID,
      "relationType": "same_as",
      "strength": 1.0,
      "metadata": {"consolidation": "project_identity", "canonical_id": CANONICAL_PROJECT_ID}
    })

# Multi-database relationships (if multiple database techs detected)
database_techs = [tech for tech in PROJECT_TECH_STACKS if tech in ["mongodb", "neo4j", "redis", "mysql", "postgresql", "influxdb"]]

IF len(database_techs) > 1:
  # Create hybrid database pattern using canonical names
  primary_db = database_techs[0]
  FOR secondary_db in database_techs[1:]:
    RELATIONSHIP_PATTERNS.append({
      "from": "{CANONICAL_PROJECT_ID}-{primary_db}-integration",
      "to": "{CANONICAL_PROJECT_ID}-{secondary_db}-integration", 
      "relationType": "provides_user_ids_for"
    })

LOG: "Generated {len(RELATIONSHIP_PATTERNS)} relationship patterns with canonical naming"
```

## Context7 Integration Preparation

### Available Documentation Keys
```markdown
# Prepare Context7 keys for documentation retrieval
AVAILABLE_CONTEXT7_KEYS = {}

FOR tech, mappings in CONTEXT7_MAPPINGS.items():
  FOR meilisearch_key, context7_id in mappings.items():
    AVAILABLE_CONTEXT7_KEYS[meilisearch_key] = {
      "context7_id": context7_id,
      "tech_stack": tech,
      "trust_score": PROJECT_TRUST_SCORES[tech].get(meilisearch_key, 7.0)
    }

# Sort by trust score for priority documentation retrieval
PRIORITY_KEYS = sorted(
  AVAILABLE_CONTEXT7_KEYS.keys(),
  key=lambda k: AVAILABLE_CONTEXT7_KEYS[k]["trust_score"],
  reverse=True
)

LOG: "Priority Context7 keys: {PRIORITY_KEYS[:5]}"  # Top 5
```

## Universal Fallback

### No Tech Stacks Detected - Universal Fallback
```markdown
# If no tech-stack.md files found in reference-docs, use canonical naming
IF len(PROJECT_TECH_STACKS) == 0:
  PRIMARY_TECH = "generic"
  PROJECT_TYPE = "application"
  CONFIDENCE_LEVEL = "LOW"
  AVERAGE_TRUST_SCORE = 5.0
  
  # Use universal patterns with canonical project ID
  PRIMARY_ENTITY = "{CANONICAL_PROJECT_ID}-application"
  ALL_ENTITIES = [
    "{CANONICAL_PROJECT_ID}-application",
    "{CANONICAL_PROJECT_ID}-database",
    "{CANONICAL_PROJECT_ID}-api", 
    "{CANONICAL_PROJECT_ID}-frontend",
    "{CANONICAL_PROJECT_ID}-architecture"
  ]
  
  # Fallback relationships using canonical naming
  RELATIONSHIP_PATTERNS = [
    {"from": CANONICAL_PROJECT_ID, "to": "{CANONICAL_PROJECT_ID}-application", "relationType": "contains"},
    {"from": "{CANONICAL_PROJECT_ID}-application", "to": "{CANONICAL_PROJECT_ID}-architecture", "relationType": "guided_by"}
  ]
  
  # Add alias relationships for fallback too
  FOR alias in PROJECT_ALIASES:
    IF alias != CANONICAL_PROJECT_ID:
      RELATIONSHIP_PATTERNS.append({
        "from": alias,
        "to": CANONICAL_PROJECT_ID,
        "relationType": "same_as",
        "strength": 1.0,
        "metadata": {"consolidation": "fallback_identity", "canonical_id": CANONICAL_PROJECT_ID}
      })
  
  AVAILABLE_CONTEXT7_KEYS = {}  # No Context7 keys available
  
  LOG: "Using generic fallback patterns with canonical naming"
```

## Detection Results Summary

### Final Detection Context with Universal Identity
```markdown
DETECTION_CONTEXT = {
  # Universal project identity
  "canonical_project_id": CANONICAL_PROJECT_ID,
  "project_name": CANONICAL_PROJECT_ID,  # Use canonical ID as primary project name
  "project_base_name": PROJECT_BASE_NAME,
  "project_aliases": PROJECT_ALIASES,
  "project_path_hash": PROJECT_PATH_HASH,
  "git_repo_name": GIT_REPO_NAME,
  
  # Technology detection results
  "primary_tech": PRIMARY_TECH, 
  "project_type": PROJECT_TYPE,
  "tech_stacks": PROJECT_TECH_STACKS,
  "confidence_level": CONFIDENCE_LEVEL,
  "average_trust_score": AVERAGE_TRUST_SCORE,
  
  # Entity and relationship patterns (using canonical names)
  "entities": ALL_ENTITIES,
  "relationships": RELATIONSHIP_PATTERNS,
  "project_alias_entities": PROJECT_ALIAS_ENTITIES,
  
  # Documentation context
  "context7_keys": AVAILABLE_CONTEXT7_KEYS,
  "priority_keys": PRIORITY_KEYS
}

# This context is available to memory integration and Agent OS commands
STORE_IN_SESSION: DETECTION_CONTEXT
LOG: "Detection context generated with universal project identity"
```

## Usage in Agent OS Commands

Agent OS commands can access this detection context via:

```markdown
# Include this file to get all detection variables
INCLUDE: @reference-docs/instructions/tech-detection.md

# Use the detected context for memory patterns with canonical identity
CANONICAL_PROJECT_ID = DETECTION_CONTEXT["canonical_project_id"]
PROJECT_ALIASES = DETECTION_CONTEXT["project_aliases"]
PRIMARY_TECH = DETECTION_CONTEXT["primary_tech"]
ALL_ENTITIES = DETECTION_CONTEXT["entities"] 
CONFIDENCE_LEVEL = DETECTION_CONTEXT["confidence_level"]

# Critical: Use canonical project ID for all Memento operations
PROJECT_ENTITY_NAME = CANONICAL_PROJECT_ID
```

This provides dynamic, reliable tech-stack detection with universal project identity resolution, preventing knowledge graph namespace fragmentation while maintaining flexibility for any project structure.
