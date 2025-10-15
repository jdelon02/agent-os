---
description: Role Handoff Data Templates for Agent OS Execute-Tasks Workflow Integration
globs:
alwaysApply: false
version: 1.0
encoding: UTF-8
---

# Role Handoff Data Templates

<ai_meta>
  <parsing_rules>
    - Define structured JSON schemas for all role transitions
    - Validate handoff data integrity before role transitions
    - Ensure data completeness and consistency across roles
    - Integrate with Memory-Keeper and Redis MCP storage systems
    - Support both manual validation and automated validation
  </parsing_rules>
  <handoff_integration>
    - memory_keeper: handoff data storage and retrieval
    - redis_mcp: primary handoff storage with TTL management (when available)
    - memento: pattern and decision storage from handoff data
    - validation: JSON schema validation and data integrity checks
  </handoff_integration>
</ai_meta>

## Overview

<purpose>
  - Provide structured data templates for seamless role transitions
  - Ensure data integrity and completeness across all role handoffs
  - Support both Memory-Keeper and Redis MCP storage integration
  - Enable automated validation and error detection
  - Facilitate cross-project learning through consistent data structures
</purpose>

<context>
  - Used in orchestrated execute-tasks workflow with role specialization
  - Supports 4 role transitions: Pattern Analyzer → Implementer → Verifier → Documenter
  - Integrates with execution checkpoint system for workflow reliability
  - Provides validation schemas for automated data integrity checks
</context>

<prerequisites>
  - Project canonical identity established (PROJECT_ENTITY_NAME)
  - Execution checkpoint system available
  - Memory-Keeper MCP integration active
  - Role-specific instruction templates accessible
</prerequisites>

## Role Handoff Schema Definitions

<step number="1" name="pattern_analyzer_to_implementer">

### Step 1: Pattern Analyzer → Implementer Handoff

<handoff_schema>
  <schema_name>analyzer_to_implementer_handoff</schema_name>
  <schema_version>1.0</schema_version>
  <role_transition>Pattern Analyzer → Implementer</role_transition>
  <purpose>Transfer pattern analysis results and implementation guidance</purpose>
</handoff_schema>

<json_schema>
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "Pattern Analyzer to Implementer Handoff",
  "required": [
    "handoff_id",
    "role_completion_status", 
    "pattern_analysis_results",
    "implementation_guidance",
    "validation_criteria"
  ],
  "properties": {
    "handoff_id": {
      "type": "string",
      "pattern": "^{PROJECT_ENTITY_NAME}-pa-to-impl-[0-9]{14}$",
      "description": "Unique handoff identifier with timestamp"
    },
    "role_completion_status": {
      "type": "string",
      "enum": ["completed", "partially_completed", "failed"],
      "description": "Pattern Analyzer role completion status"
    },
    "pattern_analysis_results": {
      "type": "object",
      "required": ["discovered_patterns", "cross_project_patterns", "anti_patterns"],
      "properties": {
        "discovered_patterns": {
          "type": "array",
          "minItems": 1,
          "items": {
            "type": "object",
            "required": ["pattern_name", "location", "applicability", "examples"],
            "properties": {
              "pattern_name": {"type": "string", "minLength": 1},
              "location": {"type": "string", "minLength": 1},
              "applicability": {"type": "string", "minLength": 10},
              "examples": {
                "type": "array", 
                "items": {"type": "string"},
                "minItems": 1
              },
              "confidence_score": {"type": "number", "minimum": 0, "maximum": 1},
              "pattern_source": {"type": "string"}
            }
          }
        },
        "cross_project_patterns": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["pattern_source", "success_rate", "adaptation_notes"],
            "properties": {
              "pattern_source": {"type": "string", "minLength": 1},
              "success_rate": {"type": "number", "minimum": 0, "maximum": 1},
              "adaptation_notes": {"type": "string", "minLength": 5},
              "similar_implementations": {"type": "array", "items": {"type": "string"}}
            }
          }
        },
        "anti_patterns": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["pattern_name", "warning", "prevention"],
            "properties": {
              "pattern_name": {"type": "string", "minLength": 1},
              "warning": {"type": "string", "minLength": 10},
              "prevention": {"type": "string", "minLength": 10},
              "severity": {"type": "string", "enum": ["low", "medium", "high", "critical"]}
            }
          }
        }
      }
    },
    "implementation_guidance": {
      "type": "object",
      "required": ["priority_tasks", "pattern_applications", "recommended_approach"],
      "properties": {
        "priority_tasks": {
          "type": "array",
          "items": {"type": "string", "minLength": 1},
          "minItems": 1
        },
        "pattern_applications": {"type": "string", "minLength": 10},
        "risk_areas": {
          "type": "array",
          "items": {"type": "string", "minLength": 1}
        },
        "recommended_approach": {"type": "string", "minLength": 10},
        "implementation_order": {"type": "array", "items": {"type": "string"}},
        "quality_considerations": {"type": "array", "items": {"type": "string"}}
      }
    },
    "validation_criteria": {
      "type": "object",
      "required": ["patterns_documented", "cross_project_insights", "anti_patterns_identified", "implementation_ready"],
      "properties": {
        "patterns_documented": {"type": "boolean"},
        "cross_project_insights": {"type": "boolean"},
        "anti_patterns_identified": {"type": "boolean"},
        "implementation_ready": {"type": "boolean"},
        "pattern_confidence_threshold": {"type": "number", "minimum": 0, "maximum": 1}
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "analysis_duration": {"type": "string"},
        "patterns_analyzed": {"type": "number"},
        "cross_project_sources": {"type": "number"},
        "confidence_level": {"type": "string", "enum": ["low", "medium", "high"]},
        "created_at": {"type": "string", "format": "date-time"},
        "expires_at": {"type": "string", "format": "date-time"}
      }
    }
  }
}
```
</json_schema>

<handoff_template>
```json
{
  "handoff_id": "{PROJECT_ENTITY_NAME}-pa-to-impl-{TIMESTAMP}",
  "role_completion_status": "completed",
  "pattern_analysis_results": {
    "discovered_patterns": [
      {
        "pattern_name": "{PATTERN_NAME}",
        "location": "{PATTERN_LOCATION}",
        "applicability": "{APPLICATION_GUIDANCE}",
        "examples": ["{EXAMPLE_1}", "{EXAMPLE_2}"],
        "confidence_score": 0.9,
        "pattern_source": "{SOURCE_PROJECT_OR_FRAMEWORK}"
      }
    ],
    "cross_project_patterns": [
      {
        "pattern_source": "{SOURCE_PROJECT}",
        "success_rate": 0.85,
        "adaptation_notes": "{ADAPTATION_GUIDANCE}",
        "similar_implementations": ["{SIMILAR_PROJECT_1}", "{SIMILAR_PROJECT_2}"]
      }
    ],
    "anti_patterns": [
      {
        "pattern_name": "{ANTI_PATTERN_NAME}",
        "warning": "{WARNING_DESCRIPTION}",
        "prevention": "{PREVENTION_STRATEGY}",
        "severity": "medium"
      }
    ]
  },
  "implementation_guidance": {
    "priority_tasks": ["{TASK_1}", "{TASK_2}", "{TASK_3}"],
    "pattern_applications": "{PATTERN_APPLICATION_GUIDANCE}",
    "risk_areas": ["{RISK_1}", "{RISK_2}"],
    "recommended_approach": "{IMPLEMENTATION_APPROACH}",
    "implementation_order": ["{PHASE_1}", "{PHASE_2}", "{PHASE_3}"],
    "quality_considerations": ["{QUALITY_1}", "{QUALITY_2}"]
  },
  "validation_criteria": {
    "patterns_documented": true,
    "cross_project_insights": true,
    "anti_patterns_identified": true,
    "implementation_ready": true,
    "pattern_confidence_threshold": 0.7
  },
  "metadata": {
    "analysis_duration": "{ANALYSIS_TIME}",
    "patterns_analyzed": 12,
    "cross_project_sources": 5,
    "confidence_level": "high",
    "created_at": "{ISO_TIMESTAMP}",
    "expires_at": "{EXPIRY_TIMESTAMP}"
  }
}
```
</handoff_template>

<validation_logic>
  <validation_function>
    <!-- Validate Pattern Analyzer handoff data -->
    VALIDATE_ANALYZER_HANDOFF:
      PARAMETERS: handoff_data (JSON object)
      RETURNS: validation_result (boolean), error_details (array)
      
      PROCESS:
        1. VALIDATE_SCHEMA: Check JSON schema compliance
        2. VALIDATE_COMPLETENESS: Ensure all required fields present
        3. VALIDATE_PATTERNS: Check pattern data quality
        4. VALIDATE_CROSS_PROJECT: Verify cross-project insights
        5. VALIDATE_CRITERIA: Confirm validation criteria met
        6. RETURN: validation success/failure with detailed error information
  </validation_function>
</validation_logic>

<instructions>
  ACTION: Use this schema and template for Pattern Analyzer to Implementer handoffs
  VALIDATE: Ensure all required fields are present and valid
  STORE: Handoff data in Memory-Keeper and Redis MCP with proper TTL
  LOG: Handoff validation results for debugging and optimization
</instructions>

</step>

<step number="2" name="implementer_to_verifier">

### Step 2: Implementer → Verifier Handoff

<handoff_schema>
  <schema_name>implementer_to_verifier_handoff</schema_name>
  <schema_version>1.0</schema_version>
  <role_transition>Implementer → Verifier</role_transition>
  <purpose>Transfer implementation results and quality context for verification</purpose>
</handoff_schema>

<json_schema>
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "Implementer to Verifier Handoff",
  "required": [
    "handoff_id",
    "role_completion_status",
    "implementation_results", 
    "quality_context"
  ],
  "properties": {
    "handoff_id": {
      "type": "string",
      "pattern": "^{PROJECT_ENTITY_NAME}-impl-to-ver-[0-9]{14}$",
      "description": "Unique handoff identifier with timestamp"
    },
    "role_completion_status": {
      "type": "string",
      "enum": ["completed", "partially_completed", "failed"],
      "description": "Implementer role completion status"
    },
    "implementation_results": {
      "type": "object",
      "required": ["completed_tasks", "implementation_evidence", "pattern_applications"],
      "properties": {
        "completed_tasks": {
          "type": "array",
          "minItems": 1,
          "items": {
            "type": "object",
            "required": ["task_id", "status", "evidence", "pattern_compliance"],
            "properties": {
              "task_id": {"type": "string", "minLength": 1},
              "status": {"type": "string", "enum": ["implemented", "partially_implemented", "failed"]},
              "evidence": {"type": "string", "minLength": 10},
              "pattern_compliance": {"type": "string", "minLength": 5},
              "test_coverage": {"type": "string", "pattern": "^[0-9]+%$"},
              "implementation_notes": {"type": "string"},
              "blockers_resolved": {"type": "array", "items": {"type": "string"}}
            }
          }
        },
        "implementation_evidence": {
          "type": "object",
          "required": ["files_created", "files_modified"],
          "properties": {
            "files_created": {
              "type": "array",
              "items": {"type": "string", "minLength": 1}
            },
            "files_modified": {
              "type": "array", 
              "items": {"type": "string", "minLength": 1}
            },
            "tests_created": {
              "type": "array",
              "items": {"type": "string", "minLength": 1}
            },
            "documentation_updated": {"type": "array", "items": {"type": "string"}},
            "dependencies_added": {"type": "array", "items": {"type": "string"}},
            "configuration_changes": {"type": "array", "items": {"type": "string"}}
          }
        },
        "pattern_applications": {
          "type": "array",
          "minItems": 1,
          "items": {
            "type": "object",
            "required": ["pattern_used", "implementation_location", "adherence_level"],
            "properties": {
              "pattern_used": {"type": "string", "minLength": 1},
              "implementation_location": {"type": "string", "minLength": 1},
              "adherence_level": {"type": "string", "enum": ["full", "partial", "adapted", "modified"]},
              "adaptation_rationale": {"type": "string"},
              "pattern_effectiveness": {"type": "string", "enum": ["excellent", "good", "adequate", "poor"]}
            }
          }
        }
      }
    },
    "quality_context": {
      "type": "object",
      "required": ["acceptance_criteria", "quality_standards", "verification_scope"],
      "properties": {
        "acceptance_criteria": {
          "type": "array",
          "minItems": 1,
          "items": {"type": "string", "minLength": 10}
        },
        "quality_standards": {
          "type": "array",
          "minItems": 1,
          "items": {"type": "string", "minLength": 5}
        },
        "verification_scope": {
          "type": "array",
          "minItems": 1,
          "items": {"type": "string", "minLength": 10}
        },
        "performance_requirements": {"type": "array", "items": {"type": "string"}},
        "security_considerations": {"type": "array", "items": {"type": "string"}},
        "edge_cases_handled": {"type": "array", "items": {"type": "string"}}
      }
    },
    "implementation_decisions": {
      "type": "object",
      "properties": {
        "major_decisions": {"type": "array", "items": {"type": "string"}},
        "alternative_approaches": {"type": "array", "items": {"type": "string"}},
        "trade_offs_made": {"type": "array", "items": {"type": "string"}},
        "technical_debt": {"type": "array", "items": {"type": "string"}}
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "implementation_duration": {"type": "string"},
        "lines_of_code": {"type": "number", "minimum": 0},
        "tests_written": {"type": "number", "minimum": 0},
        "patterns_applied": {"type": "number", "minimum": 0},
        "created_at": {"type": "string", "format": "date-time"},
        "expires_at": {"type": "string", "format": "date-time"}
      }
    }
  }
}
```
</json_schema>

<handoff_template>
```json
{
  "handoff_id": "{PROJECT_ENTITY_NAME}-impl-to-ver-{TIMESTAMP}",
  "role_completion_status": "completed",
  "implementation_results": {
    "completed_tasks": [
      {
        "task_id": "{TASK_ID}",
        "status": "implemented",
        "evidence": "{IMPLEMENTATION_EVIDENCE}",
        "pattern_compliance": "{PATTERN_COMPLIANCE_DESCRIPTION}",
        "test_coverage": "{COVERAGE_PERCENTAGE}%",
        "implementation_notes": "{IMPLEMENTATION_NOTES}",
        "blockers_resolved": ["{BLOCKER_1}", "{BLOCKER_2}"]
      }
    ],
    "implementation_evidence": {
      "files_created": ["{FILE_1}", "{FILE_2}", "{FILE_3}"],
      "files_modified": ["{MODIFIED_FILE_1}", "{MODIFIED_FILE_2}"],
      "tests_created": ["{TEST_FILE_1}", "{TEST_FILE_2}"],
      "documentation_updated": ["{DOC_1}", "{DOC_2}"],
      "dependencies_added": ["{DEPENDENCY_1}", "{DEPENDENCY_2}"],
      "configuration_changes": ["{CONFIG_1}", "{CONFIG_2}"]
    },
    "pattern_applications": [
      {
        "pattern_used": "{PATTERN_NAME}",
        "implementation_location": "{IMPLEMENTATION_PATH}",
        "adherence_level": "full",
        "adaptation_rationale": "{ADAPTATION_REASONING}",
        "pattern_effectiveness": "excellent"
      }
    ]
  },
  "quality_context": {
    "acceptance_criteria": [
      "{ACCEPTANCE_CRITERION_1}",
      "{ACCEPTANCE_CRITERION_2}",
      "{ACCEPTANCE_CRITERION_3}"
    ],
    "quality_standards": [
      "Code coverage > {COVERAGE_THRESHOLD}%",
      "No linting errors",
      "Pattern compliance verified",
      "{CUSTOM_QUALITY_STANDARD}"
    ],
    "verification_scope": [
      "Functional testing of all implemented features",
      "Pattern adherence validation", 
      "Performance benchmarking",
      "Security vulnerability assessment",
      "{CUSTOM_VERIFICATION_SCOPE}"
    ],
    "performance_requirements": ["{PERFORMANCE_REQ_1}", "{PERFORMANCE_REQ_2}"],
    "security_considerations": ["{SECURITY_1}", "{SECURITY_2}"],
    "edge_cases_handled": ["{EDGE_CASE_1}", "{EDGE_CASE_2}"]
  },
  "implementation_decisions": {
    "major_decisions": ["{DECISION_1}", "{DECISION_2}"],
    "alternative_approaches": ["{ALTERNATIVE_1}", "{ALTERNATIVE_2}"],
    "trade_offs_made": ["{TRADE_OFF_1}", "{TRADE_OFF_2}"],
    "technical_debt": ["{DEBT_1}", "{DEBT_2}"]
  },
  "metadata": {
    "implementation_duration": "{IMPLEMENTATION_TIME}",
    "lines_of_code": 450,
    "tests_written": 25,
    "patterns_applied": 3,
    "created_at": "{ISO_TIMESTAMP}",
    "expires_at": "{EXPIRY_TIMESTAMP}"
  }
}
```
</handoff_template>

<validation_logic>
  <validation_function>
    <!-- Validate Implementer handoff data -->
    VALIDATE_IMPLEMENTER_HANDOFF:
      PARAMETERS: handoff_data (JSON object)
      RETURNS: validation_result (boolean), error_details (array)
      
      PROCESS:
        1. VALIDATE_SCHEMA: Check JSON schema compliance
        2. VALIDATE_COMPLETENESS: Ensure all required fields present
        3. VALIDATE_EVIDENCE: Check implementation evidence quality
        4. VALIDATE_PATTERNS: Verify pattern application completeness
        5. VALIDATE_QUALITY_CONTEXT: Confirm quality standards defined
        6. VALIDATE_ACCEPTANCE_CRITERIA: Check criteria completeness
        7. RETURN: validation success/failure with detailed error information
  </validation_function>
</validation_logic>

<instructions>
  ACTION: Use this schema and template for Implementer to Verifier handoffs
  VALIDATE: Ensure implementation evidence and quality context complete
  STORE: Handoff data with implementation artifacts and verification requirements
  LOG: Implementation results and quality standards for verification planning
</instructions>

</step>

<step number="3" name="verifier_to_documenter">

### Step 3: Verifier → Documenter Handoff

<handoff_schema>
  <schema_name>verifier_to_documenter_handoff</schema_name>
  <schema_version>1.0</schema_version>
  <role_transition>Verifier → Documenter</role_transition>
  <purpose>Transfer verification results and documentation context for knowledge capture</purpose>
</handoff_schema>

<json_schema>
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object", 
  "title": "Verifier to Documenter Handoff",
  "required": [
    "handoff_id",
    "role_completion_status",
    "verification_results",
    "documentation_context"
  ],
  "properties": {
    "handoff_id": {
      "type": "string",
      "pattern": "^{PROJECT_ENTITY_NAME}-ver-to-doc-[0-9]{14}$",
      "description": "Unique handoff identifier with timestamp"
    },
    "role_completion_status": {
      "type": "string",
      "enum": ["completed", "partially_completed", "failed"],
      "description": "Verifier role completion status"
    },
    "verification_results": {
      "type": "object",
      "required": ["quality_assessment", "acceptance_validation", "test_results"],
      "properties": {
        "quality_assessment": {
          "type": "object",
          "required": ["overall_score", "test_coverage", "pattern_compliance"],
          "properties": {
            "overall_score": {"type": "string", "pattern": "^[0-9]+%$"},
            "test_coverage": {"type": "string", "pattern": "^[0-9]+%$"},
            "pattern_compliance": {"type": "string", "pattern": "^[0-9]+%$"},
            "performance_score": {"type": "string", "enum": ["A", "B", "C", "D", "F"]},
            "security_score": {"type": "string", "enum": ["excellent", "good", "adequate", "poor"]},
            "maintainability_score": {"type": "string", "enum": ["high", "medium", "low"]}
          }
        },
        "acceptance_validation": {
          "type": "object",
          "required": ["criteria_met", "criteria_total", "pass_status"],
          "properties": {
            "criteria_met": {"type": "number", "minimum": 0},
            "criteria_total": {"type": "number", "minimum": 1},
            "pass_status": {"type": "string", "enum": ["PASSED", "FAILED", "PARTIAL"]},
            "failed_criteria": {"type": "array", "items": {"type": "string"}},
            "edge_case_coverage": {"type": "string", "pattern": "^[0-9]+%$"}
          }
        },
        "test_results": {
          "type": "object",
          "required": ["unit_tests", "integration_tests"],
          "properties": {
            "unit_tests": {"type": "string", "pattern": "^[0-9]+/[0-9]+ passed$"},
            "integration_tests": {"type": "string", "pattern": "^[0-9]+/[0-9]+ passed$"},
            "e2e_tests": {"type": "string", "pattern": "^[0-9]+/[0-9]+ passed$"},
            "performance_tests": {"type": "string", "pattern": "^[0-9]+/[0-9]+ passed$"},
            "security_tests": {"type": "string", "pattern": "^[0-9]+/[0-9]+ passed$"}
          }
        },
        "identified_issues": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["issue", "severity", "status"],
            "properties": {
              "issue": {"type": "string", "minLength": 10},
              "severity": {"type": "string", "enum": ["critical", "high", "medium", "low"]},
              "status": {"type": "string", "enum": ["resolved", "documented", "deferred", "accepted"]},
              "recommendation": {"type": "string", "minLength": 10},
              "impact_assessment": {"type": "string"}
            }
          }
        }
      }
    },
    "documentation_context": {
      "type": "object",
      "required": ["implementation_summary", "key_decisions", "learning_outcomes"],
      "properties": {
        "implementation_summary": {"type": "string", "minLength": 50},
        "key_decisions": {
          "type": "array",
          "minItems": 1,
          "items": {"type": "string", "minLength": 20}
        },
        "learning_outcomes": {
          "type": "array",
          "minItems": 1,
          "items": {"type": "string", "minLength": 30}
        },
        "cross_project_patterns": {
          "type": "array",
          "items": {"type": "string", "minLength": 20}
        },
        "best_practices_validated": {"type": "array", "items": {"type": "string"}},
        "anti_patterns_avoided": {"type": "array", "items": {"type": "string"}},
        "future_considerations": {"type": "array", "items": {"type": "string"}}
      }
    },
    "quality_metrics": {
      "type": "object",
      "properties": {
        "code_quality_score": {"type": "number", "minimum": 0, "maximum": 100},
        "documentation_completeness": {"type": "string", "pattern": "^[0-9]+%$"},
        "test_effectiveness": {"type": "string", "enum": ["excellent", "good", "adequate", "poor"]},
        "pattern_adherence": {"type": "number", "minimum": 0, "maximum": 1}
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "verification_duration": {"type": "string"},
        "tests_executed": {"type": "number", "minimum": 0},
        "issues_found": {"type": "number", "minimum": 0},
        "patterns_verified": {"type": "number", "minimum": 0},
        "created_at": {"type": "string", "format": "date-time"},
        "expires_at": {"type": "string", "format": "date-time"}
      }
    }
  }
}
```
</json_schema>

<handoff_template>
```json
{
  "handoff_id": "{PROJECT_ENTITY_NAME}-ver-to-doc-{TIMESTAMP}",
  "role_completion_status": "completed",
  "verification_results": {
    "quality_assessment": {
      "overall_score": "{OVERALL_SCORE}%",
      "test_coverage": "{TEST_COVERAGE}%",
      "pattern_compliance": "{PATTERN_COMPLIANCE}%",
      "performance_score": "A",
      "security_score": "excellent",
      "maintainability_score": "high"
    },
    "acceptance_validation": {
      "criteria_met": 15,
      "criteria_total": 15,
      "pass_status": "PASSED",
      "failed_criteria": [],
      "edge_case_coverage": "{EDGE_CASE_COVERAGE}%"
    },
    "test_results": {
      "unit_tests": "{UNIT_PASSED}/{UNIT_TOTAL} passed",
      "integration_tests": "{INTEGRATION_PASSED}/{INTEGRATION_TOTAL} passed",
      "e2e_tests": "{E2E_PASSED}/{E2E_TOTAL} passed",
      "performance_tests": "{PERF_PASSED}/{PERF_TOTAL} passed",
      "security_tests": "{SEC_PASSED}/{SEC_TOTAL} passed"
    },
    "identified_issues": [
      {
        "issue": "{ISSUE_DESCRIPTION}",
        "severity": "low",
        "status": "documented",
        "recommendation": "{ISSUE_RECOMMENDATION}",
        "impact_assessment": "{IMPACT_ASSESSMENT}"
      }
    ]
  },
  "documentation_context": {
    "implementation_summary": "{IMPLEMENTATION_SUMMARY_DESCRIPTION}",
    "key_decisions": [
      "{KEY_DECISION_1}",
      "{KEY_DECISION_2}",
      "{KEY_DECISION_3}"
    ],
    "learning_outcomes": [
      "{LEARNING_OUTCOME_1}",
      "{LEARNING_OUTCOME_2}",
      "{LEARNING_OUTCOME_3}"
    ],
    "cross_project_patterns": [
      "{CROSS_PROJECT_PATTERN_1}",
      "{CROSS_PROJECT_PATTERN_2}"
    ],
    "best_practices_validated": ["{BEST_PRACTICE_1}", "{BEST_PRACTICE_2}"],
    "anti_patterns_avoided": ["{ANTI_PATTERN_1}", "{ANTI_PATTERN_2}"],
    "future_considerations": ["{CONSIDERATION_1}", "{CONSIDERATION_2}"]
  },
  "quality_metrics": {
    "code_quality_score": 92,
    "documentation_completeness": "{DOC_COMPLETENESS}%",
    "test_effectiveness": "excellent",
    "pattern_adherence": 0.95
  },
  "metadata": {
    "verification_duration": "{VERIFICATION_TIME}",
    "tests_executed": 67,
    "issues_found": 2,
    "patterns_verified": 5,
    "created_at": "{ISO_TIMESTAMP}",
    "expires_at": "{EXPIRY_TIMESTAMP}"
  }
}
```
</handoff_template>

<validation_logic>
  <validation_function>
    <!-- Validate Verifier handoff data -->
    VALIDATE_VERIFIER_HANDOFF:
      PARAMETERS: handoff_data (JSON object)
      RETURNS: validation_result (boolean), error_details (array)
      
      PROCESS:
        1. VALIDATE_SCHEMA: Check JSON schema compliance
        2. VALIDATE_COMPLETENESS: Ensure all required fields present
        3. VALIDATE_QUALITY_SCORES: Check quality assessment completeness
        4. VALIDATE_TEST_RESULTS: Verify test result format and completeness
        5. VALIDATE_ACCEPTANCE: Confirm acceptance criteria validation
        6. VALIDATE_DOCUMENTATION_CONTEXT: Check documentation context quality
        7. RETURN: validation success/failure with detailed error information
  </validation_function>
</validation_logic>

<instructions>
  ACTION: Use this schema and template for Verifier to Documenter handoffs
  VALIDATE: Ensure verification results and documentation context complete
  STORE: Handoff data with quality assessment and learning outcomes
  LOG: Verification results and documentation requirements for knowledge capture
</instructions>

</step>

</role_handoff_schema_definitions>

## Handoff Validation System

<step number="4" name="handoff_validation">

### Step 4: Handoff Data Validation Logic

<validation_framework>
  <validation_engine>
    <!-- Core validation engine for all handoff types -->
    HANDOFF_VALIDATION_ENGINE:
      PARAMETERS: handoff_data (JSON), handoff_type (string)
      RETURNS: validation_result (object)
      
      PROCESS:
        1. IDENTIFY_HANDOFF_TYPE: Determine handoff schema to use
        2. LOAD_SCHEMA: Load appropriate JSON schema definition
        3. VALIDATE_STRUCTURE: Check JSON structure compliance
        4. VALIDATE_REQUIRED_FIELDS: Ensure all required fields present
        5. VALIDATE_DATA_TYPES: Check data type compliance
        6. VALIDATE_BUSINESS_RULES: Apply role-specific validation rules
        7. VALIDATE_CROSS_REFERENCES: Check data consistency across fields
        8. GENERATE_REPORT: Create detailed validation report
        9. RETURN: comprehensive validation result
  </validation_engine>
  
  <validation_categories>
    <structural_validation>
      - JSON schema compliance
      - Required field presence
      - Data type validation
      - Field format validation (patterns, enums)
      - Array length constraints
    </structural_validation>
    <business_rule_validation>
      - Role completion status consistency
      - Pattern confidence thresholds
      - Test coverage requirements
      - Quality score ranges
      - Acceptance criteria completeness
    </business_rule_validation>
    <data_integrity_validation>
      - Cross-field consistency checks
      - Timestamp ordering validation
      - Percentage value ranges (0-100%)
      - Score normalization (0.0-1.0)
      - Reference integrity (pattern names, file paths)
    </data_integrity_validation>
  </validation_categories>
</validation_framework>

<validation_functions>
  <schema_validation>
    <!-- JSON Schema validation -->
    VALIDATE_JSON_SCHEMA:
      PARAMETERS: data (JSON), schema (JSON Schema)
      RETURNS: is_valid (boolean), errors (array)
      
      IMPLEMENTATION:
        CALL: JSON Schema Validator
        PARAMETERS: data, schema
        CATCH: validation errors
        FORMAT: error messages with field paths
        RETURN: validation result with detailed errors
  </schema_validation>
  
  <completeness_validation>
    <!-- Required field completeness validation -->
    VALIDATE_COMPLETENESS:
      PARAMETERS: data (JSON), required_fields (array)
      RETURNS: is_complete (boolean), missing_fields (array)
      
      IMPLEMENTATION:
        FOR_EACH: required_field in required_fields
          IF field not present in data:
            ADD: field to missing_fields
        RETURN: completeness result with missing field details
  </completeness_validation>
  
  <quality_validation>
    <!-- Quality threshold validation -->
    VALIDATE_QUALITY_THRESHOLDS:
      PARAMETERS: data (JSON), thresholds (object)
      RETURNS: meets_quality (boolean), quality_issues (array)
      
      IMPLEMENTATION:
        CHECK: test coverage >= minimum threshold
        CHECK: pattern compliance >= minimum threshold
        CHECK: quality scores within valid ranges
        CHECK: acceptance criteria pass rate >= threshold
        RETURN: quality validation result
  </quality_validation>
  
  <consistency_validation>
    <!-- Cross-field consistency validation -->
    VALIDATE_CONSISTENCY:
      PARAMETERS: data (JSON)
      RETURNS: is_consistent (boolean), inconsistencies (array)
      
      IMPLEMENTATION:
        CHECK: completion status matches validation criteria
        CHECK: test results align with quality scores
        CHECK: pattern applications match discovered patterns
        CHECK: timestamp ordering (created < expires)
        RETURN: consistency validation result
  </consistency_validation>
</validation_functions>

<validation_integration>
  <memory_keeper_integration>
    <!-- Store validation results in Memory-Keeper -->
    STORE_VALIDATION_RESULT:
      PARAMETERS: validation_result (object), handoff_id (string)
      
      IMPLEMENTATION:
        CALL: mcp-memory-keeper-context_save
        PARAMETERS:
          - key: "handoff-validation-{handoff_id}"
          - value: validation_result
          - category: "validation"
          - priority: "normal"
        
        IF validation_failed:
          CALL: mcp-memory-keeper-context_save
          PARAMETERS:
            - key: "handoff-validation-error-{handoff_id}"
            - value: validation_errors
            - category: "error"
            - priority: "high"
  </memory_keeper_integration>
  
  <error_handling>
    <!-- Handle validation errors -->
    HANDLE_VALIDATION_ERRORS:
      PARAMETERS: validation_errors (array), handoff_type (string)
      
      IMPLEMENTATION:
        CATEGORIZE: errors by type (schema, business rule, consistency)
        PRIORITIZE: errors by severity (critical, high, medium, low)
        GENERATE: actionable error messages with fix guidance
        LOG: validation errors for debugging
        NOTIFY: role about validation failures with correction guidance
  </error_handling>
</validation_integration>

<instructions>
  ACTION: Implement comprehensive handoff validation system
  VALIDATE: All handoff data against appropriate schemas
  STORE: Validation results in Memory-Keeper for tracking
  ERROR_HANDLE: Provide clear guidance for validation failures
  LOG: Validation metrics for continuous improvement
</instructions>

</step>

## Storage Integration

<step number="5" name="storage_integration">

### Step 5: Handoff Data Storage Integration

<memory_keeper_storage>
  <handoff_storage>
    <!-- Store handoff data in Memory-Keeper -->
    STORE_HANDOFF_DATA:
      PARAMETERS: handoff_data (JSON), handoff_type (string)
      
      IMPLEMENTATION:
        CALL: mcp-memory-keeper-context_save
        PARAMETERS:
          - key: "handoff-{handoff_type}-{timestamp}"
          - value: handoff_data
          - category: "handoff"
          - priority: "high"
        
        CALL: mcp-memory-keeper-context_checkpoint
        PARAMETERS:
          - name: "{PROJECT_ENTITY_NAME}-{handoff_type}-checkpoint"
          - description: "Role handoff checkpoint: {handoff_type}"
          - includeFiles: false
          - includeGitStatus: false
  </handoff_storage>
  
  <handoff_retrieval>
    <!-- Retrieve handoff data from Memory-Keeper -->
    RETRIEVE_HANDOFF_DATA:
      PARAMETERS: handoff_type (string), project_entity_name (string)
      RETURNS: handoff_data (JSON), found (boolean)
      
      IMPLEMENTATION:
        CALL: mcp-memory-keeper-context_search
        PARAMETERS:
          - query: "{project_entity_name} handoff {handoff_type}"
          - categories: ["handoff"]
        
        IF handoff_found:
          CALL: mcp-memory-keeper-context_get
          PARAMETERS:
            - key: "handoff-{handoff_type}-{latest_timestamp}"
          RETURN: handoff_data
        ELSE:
          RETURN: null, false
  </handoff_retrieval>
</memory_keeper_storage>

<redis_mcp_storage>
  <redis_integration>
    <!-- Store handoff data in Redis MCP when available -->
    STORE_REDIS_HANDOFF:
      PARAMETERS: handoff_data (JSON), handoff_key (string)
      
      IMPLEMENTATION:
        IF redis_mcp_available:
          REDIS_HASH_SET: handoff_key, handoff_data
          REDIS_EXPIRE: handoff_key, 48_hours
          LOG: "Handoff stored in Redis: {handoff_key}"
        ELSE:
          LOG: "Redis unavailable, using Memory-Keeper only"
  </redis_integration>
  
  <fallback_strategy>
    <!-- Graceful degradation when Redis unavailable -->
    FALLBACK_STORAGE:
      PARAMETERS: handoff_data (JSON), handoff_type (string)
      
      IMPLEMENTATION:
        IF redis_mcp_unavailable:
          STORE: handoff_data in Memory-Keeper with extended priority
          LOG: "Using Memory-Keeper fallback for handoff storage"
          NOTIFY: "Redis MCP unavailable, using Memory-Keeper backup"
        
        ENSURE: handoff data integrity regardless of storage system
        MAINTAIN: handoff functionality with graceful degradation
  </fallback_strategy>
</redis_mcp_storage>

<memento_integration>
  <pattern_storage>
    <!-- Store cross-project patterns in Memento -->
    STORE_HANDOFF_PATTERNS:
      PARAMETERS: handoff_data (JSON), handoff_type (string)
      
      IMPLEMENTATION:
        EXTRACT: cross-project patterns from handoff_data
        EXTRACT: learning outcomes and best practices
        
        CALL: memento-mcp-create_entities
        PARAMETERS:
          - entities: [{
              "name": "{PROJECT_ENTITY_NAME}-{handoff_type}-patterns",
              "entityType": "handoff_pattern",
              "observations": extracted_patterns
            }]
        
        CREATE: relations between handoff patterns and project entities
        STORE: pattern effectiveness and reuse guidance
  </pattern_storage>
</memento_integration>

<instructions>
  ACTION: Implement dual storage system with Memory-Keeper and Redis MCP
  STORE: Handoff data with appropriate TTL and priority settings
  FALLBACK: Use Memory-Keeper when Redis MCP unavailable
  INTEGRATE: Cross-project patterns with Memento knowledge graph
  ENSURE: Data integrity and accessibility across all storage systems
</instructions>

</step>

---

*This role handoff data template system provides comprehensive structured data exchange for the Agent OS execute-tasks orchestrated workflow, with JSON schema validation, dual storage integration, and cross-project pattern learning capabilities.*