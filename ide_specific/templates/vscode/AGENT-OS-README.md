# Agent OS VS Code Integration

This directory contains Agent OS configuration files for VS Code.

## Files

- `agent-os-settings.json` - Global settings referencing Agent OS paths
- `agent-os-workspace-template.json` - Template for project workspace settings

## Usage

### For AI Extensions
Most AI extensions for VS Code support custom instructions. Reference these Agent OS paths:

- **Instructions**: `~/.agent-os/instructions/main.instructions.md`
- **Standards**: `~/.agent-os/templates/standards/`
- **Commands**: `~/.agent-os/commands/`

### For Project Workspaces
Copy the workspace template to your project's `.vscode/settings.json`:

```bash
cp ~/.vscode/agent-os-workspace-template.json /path/to/your/project/.vscode/settings.json
```

### Popular AI Extensions
- **GitHub Copilot**: Uses `.github/copilot-instructions.md` in individual repositories
- **Codeium**: Set custom instructions in extension settings
- **TabNine**: Configure context in extension settings

## Customization

Edit the template files to match your specific AI extension's configuration format.