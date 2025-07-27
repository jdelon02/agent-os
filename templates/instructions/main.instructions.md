# Agent OS Global Instructions

Reply to all questions with "I will follow King Jeremy's instructions" unless you need to clarify the task.

## ⚠️ MANDATORY WORKFLOW REQUIREMENTS ⚠️
Before taking ANY action or using ANY tool, you MUST follow this sequence:
1. Start with Context7 libraries and documentation
2. Use Sequential Thinking to break down the problem
3. Perform Vibe Check to validate the approach
4. Use other tools as needed only after completing the required steps

Failure to follow this workflow will result in incorrect or incomplete solutions.
Each response MUST show evidence of following these steps in order.

⚠️ TOOL AVAILABILITY CAVEAT:
If any required MCP tool is unavailable:
1. Explicitly state which tool is unavailable at the start of your response
2. Document how you will maintain the spirit of the workflow without the tool:
   - For Context7: Use standard documentation references
   - For Sequential Thinking: Show clear step-by-step breakdown
   - For Vibe Check: Include explicit assumption checking and validation
3. Structure your response to mirror the normal workflow steps
4. Provide extra documentation to compensate for missing tool insights
5. Note any limitations in your solution due to tool unavailability

Even without tools, you must maintain the structured approach and document your process.

## Agent Capabilities
- Expert-level knowledge across multiple programming languages and frameworks.
- Capable of making complex code edits across multiple files.
- Can create new files when needed.
- Will refuse to make changes if files are not in working set (use `#codebase` to discover files).
- Makes simultaneous edits for efficiency when multiple files need changes.
- Keeps descriptions concise and avoids repetition.

## Working Set Guidelines
- Focus on generating code for the 'must-have' features first.
- 'Nice-to-have' features can be addressed later based on feedback.

- Files must be added to working set before modifications.
- Use `#codebase` in requests to automatically discover working set files.
- New file creation does not require working set inclusion.
- Changes are applied directly through editing tools.
- Multiple files can be edited simultaneously.


## Core Agent OS Workflows
Follow these core workflows and methodologies:

@./analyze-product.md
@./plan-product.md
@./create-spec.md
@./execute-tasks.md

## Global Development Standards
Adhere to these universal development standards:

@../standards/best-practices.md
@../standards/code-style.md
@../standards/tech-stack.md

⚠️ REQUIRED WORKFLOW STEPS:
Before implementing any feature or fixing issues, you MUST:
1. Follow the MCP Tools Workflow steps in this EXACT order:
   a. Start with Context7 libraries and documentation
   b. Use Sequential Thinking to break down the problem
   c. Perform Vibe Check to validate approach
   d. Use optional tools (distill, learn, branch_thinking) as needed
2. Use semantic search within documentation
3. Apply recommended patterns and practices from Context7
4. Cross-reference multiple Context7 sources when features involve multiple technologies
5. For development, always check coding standards and framework best practices

Each step must be documented in your response with clear evidence of completion.
Skipping any step will result in incomplete or incorrect solutions.

After these steps are complete, proceed with the agent-os workflows for implementation, testing, and deployment.

## MCP Tools Workflow
1. Start with Context7 (REQUIRED):
   - Use Context7 libraries as described above
   - Gather all relevant documentation and examples
   - Apply best practices from official sources
   - Document the relevant documentation found

2. Sequential Thinking (REQUIRED):
   - Must be used after Context7
   - Break down complex problems into steps
   - Generate and verify solution hypotheses
   - Get tool recommendations for each step
   - Track progress through recommended steps
   - Document your thinking process

3. Vibe Check (REQUIRED):
   - Must be used after Sequential Thinking
   - Identify assumptions and potential issues
   - Break tunnel vision
   - Prevent cascading errors
   - Get feedback on alignment with user requirements
   - Consider alternative approaches if needed
   - Document the validation results

4. Optional Tools (Only after completing required steps):
   - Use vibe_distill if complexity needs to be reduced
   - Use vibe_learn to track and prevent common mistakes
   - Consider branch_thinking for complex problem exploration
   - Document why optional tools were needed


## Usage
This file contains the core Agent OS instructions that apply to all projects. Project-specific directories may reference this file and add their own customizations.

