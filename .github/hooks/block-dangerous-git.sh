#!/usr/bin/env bash
#
# PreToolUse hook: Blokkerer destruktive git-kommandoer fra Copilot.
#
# Blokkert:
#   git push (alle varianter, inkludert --force)
#   git reset --hard
#   git clean -f / -fd
#   git branch -D
#   git checkout .
#   git restore .
#

set -euo pipefail

INPUT=$(cat)

if ! command -v jq >/dev/null 2>&1; then
  exit 0
fi
TOOL_NAME=$(echo "$INPUT" | jq -r '.toolName // .tool // ""')

# Kun relevant for terminal-verktøy
if [[ "$TOOL_NAME" != *"terminal"* && "$TOOL_NAME" != *"bash"* && "$TOOL_NAME" != *"execute"* && "$TOOL_NAME" != *"runInTerminal"* ]]; then
  exit 0
fi

COMMAND_INPUT=$(echo "$INPUT" | jq -r '
  .input.command // .input.input // .arguments.command // .arguments.input // ""
')

if [[ -z "$COMMAND_INPUT" ]]; then
  exit 0
fi

deny() {
  echo "{\"permissionDecision\": \"deny\", \"reason\": \"$1\"}"
  exit 0
}

# git push (alle varianter)
if echo "$COMMAND_INPUT" | grep -qE '\bgit\s+(.*\s+)?push\b'; then
  deny "🚫 git push er blokkert. Push manuelt etter review."
fi

# git reset --hard
if echo "$COMMAND_INPUT" | grep -qE '\bgit\s+reset\s+.*--hard\b'; then
  deny "🚫 git reset --hard er blokkert. Kan føre til tap av arbeid."
fi

# git clean -f / -fd
if echo "$COMMAND_INPUT" | grep -qE '\bgit\s+clean\s+.*-[a-zA-Z]*f'; then
  deny "🚫 git clean -f er blokkert. Kan slette utrackede filer permanent."
fi

# git branch -D (force delete)
if echo "$COMMAND_INPUT" | grep -qE '\bgit\s+branch\s+.*-D\b'; then
  deny "🚫 git branch -D er blokkert. Bruk -d for trygg sletting."
fi

# git checkout . (discard all changes)
if echo "$COMMAND_INPUT" | grep -qE '\bgit\s+checkout\s+\.\s*$'; then
  deny "🚫 git checkout . er blokkert. Forkaster alle ucommittede endringer."
fi

# git restore . (discard all changes)
if echo "$COMMAND_INPUT" | grep -qE '\bgit\s+restore\s+\.\s*$'; then
  deny "🚫 git restore . er blokkert. Forkaster alle ucommittede endringer."
fi
